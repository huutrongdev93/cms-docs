# Routing System

> **Namespace:** `SkillDo\Support\Facades\Route`
>
> **Facade:** `\Route`
>
> **File:** `packages/skilldo/framework/src/Support/Facades/Route.php`

Hệ thống Routing trong SkillDo CMS v8 được thiết kế dựa trên các mô hình framework hiện đại (như Laravel). Nó dùng để định tuyến các URL HTTP tới các xử lý tương ứng trong **Controller** hoặc **Closure**.

---

## 1. Vị Trí Các File Route Trong Plugin

SkillDo CMS thực hiện cơ chế **tự động quét và nạp (autoload)** tất cả các file Route của Plugin đang được Active. 

Để tạo mới Route trong Plugin của bạn, bạn chỉ cần tạo thư mục `routes` ở thư mục gốc của Plugin và tạo 3 file tương ứng (bạn chỉ tạo file bạn cần dùng):

```
plugins/my-plugin/
└── routes/
    ├── web.php    # Route cho frontend (người dùng)
    ├── admin.php  # Route cho hệ thống quản trị admin
    └── api.php    # Route cho API
```

| File | Chức năng chính | Middleware tự động | Prefix tự động |
|---|---|---|---|
| `routes/web.php` | Khai báo các route hiển thị ngoài Frontend cho Client/User. | web | — |
| `routes/admin.php` | Khai báo các route quản trị trong Admin Dashboard. | web | — (Bạn nên tự thêm prefix `admin`) |
| `routes/api.php` | Khai báo các route trả về JSON cho RESTful API. | api | — |

Khi Plugin được kích hoạt (Active), CMS sẽ tự động load file này vào hệ thống Router mà **không cần cấu hình hay include thủ công** trong `ServiceProvider`.

> **Theme cũng có cơ chế tương tự:** `SkillDo\Cms\Providers\CmsRouteServiceProvider` quét thêm `routes/web.php`, `routes/admin.php`, `routes/api.php` trong cả thư mục theme đang dùng (`views/theme-store/routes/`) và theme-child (`views/theme-child/routes/`), gắn middleware nhóm tương ứng giống Plugin. Thứ tự load: route gốc của app → route Plugin (theo danh sách active) → route Theme → route Theme-child.

---

## 2. Các Method Định Tuyến Cơ Bản

SkillDo hỗ trợ đầy đủ các Verb (động từ) HTTP:

```php
Route::get('sitemap.xml', 'Plugin\Controllers\Web\SeoController@sitemap');
Route::post('user/store', 'Plugin\Controllers\Web\UserController@store');
Route::put('user/update', 'Plugin\Controllers\Web\UserController@update');
Route::delete('user/delete', 'Plugin\Controllers\Web\UserController@delete');
Route::patch('user/status', 'Plugin\Controllers\Web\UserController@status');
Route::options('ping', 'Plugin\Controllers\Web\PingController@ping');

// Sử dụng chung cho nhiều verbs
Route::match(['get', 'post'], 'payment/notification', 'PaymentController@webhook');

// Chấp nhận mọi loại requests (GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS)
Route::any('custom-url', 'CustomController@handle');
```

---

## 3. Router Action (Trỏ Tới Controller)

Thay vì viết Logic trực tiếp trong file Route (dù có hỗ trợ cho Closure nhưng không khuyến khích), chuẩn chung của SkillDo CMS là trỏ Action vào **Controller Class @ Method**.

```php
// Cách 1: Ghi chú thẳng String class (chuẩn Laravel kiểu cũ)
Route::get('/inventories', 'Stock\Controllers\Admin\InventoriesController@index');

// Cách 2: Gọi thông qua class constant giúp IDE dễ gợi ý Class
Route::get('/gio-hang', \Ecommerce\Controllers\Web\EcommerceController::class.'@cart');
```

---

## 4. Route Parameters (Tham Số URL)

Truyền tham số linh động từ URL vào Controller qua dấu `{}`.

### Tham số bắt buộc
```php
Route::get('collections/{slug}', \Ecommerce\Controllers\Web\ProductController::class.'@collection');
```

### Tham số không bắt buộc (Optional - Thêm `?`)
```php
Route::get('don-hang/{id?}', \Ecommerce\Controllers\Web\EcommerceController::class.'@success');

Route::get('category/{param1?}/{param2?}/{param3?}', \Ecommerce\Controllers\Admin\ProductCategoryController::class.'@index');
```

---

## 5. Constraint (Ràng Buộc Điều Kiện Regex)

Bạn có thể giới hạn điều kiện cho tham số dùng method `where()`.

```php
// Route này chỉ được khớp nếu "id" là các con số [0-9]
Route::match(['get','post'], '/edit/{id}', $controller.'@edit')
     ->where('id', '[0-9]+');

// Giới hạn chữ cái alphabet
Route::get('/user/{name}', 'UserController@show')
     ->where('name', '[A-Za-z]+');
```

---

## 6. Route Name (Đặt Tên Route)

Nên đặt tên cho mọi Route. Đặt tên giúp file view độc lập với URL. Khi bạn đổi URL, form và template không bị lỗi do gọi đến tên (Name) chứ không gọi URL cứng.

```php
Route::get('/gio-hang', \Ecommerce\Controllers\Web\EcommerceController::class.'@cart')
    ->name('sicommerce.cart');
```

**Gọi ra URI bằng tên Route Helper trong template hoặc Controller:**

Signature thực tế của helper (khai báo tại `packages/skilldo/framework/src/Support/common.php`):

```php
function route($name, mixed $parameters = [], bool $absolute = false): string
```

> **Khác Laravel:** mặc định `route()` trả về **URI tương đối** (không có domain, không có `/` đầu). Muốn URL tuyệt đối phải truyền `$absolute = true`. Nếu tên route không tồn tại, hàm trả về chuỗi rỗng `''` (không ném exception).

```php
// Ở mã PHP hoặc Template File
$url = route('sicommerce.cart');             // Output: gio-hang
$url = route('sicommerce.cart', [], true);   // Output: https://domain.com/gio-hang

// Truyền tham số: ưu tiên khớp theo key trùng tên placeholder, còn lại khớp theo thứ tự
$url = route('admin.products.brands.edit', ['id' => 5]); // admin/products/brands/edit/5

// Tham số thừa (không khớp placeholder) tự thành query string
$url = route('sicommerce.cart', ['utm' => 'zalo'], true); // https://domain.com/gio-hang?utm=zalo
```

- Placeholder optional (`{id?}`) không có giá trị sẽ bị loại bỏ khỏi URI.
- Thiếu giá trị cho placeholder **bắt buộc** sẽ ném `InvalidArgumentException`.

---

## 7. Grouping (Nhóm Các Route)

Giúp áp dụng thuộc tính giống nhau cho một loạt các Routes (như Prefix, Middleware) thay vì lặp lại trên từng dòng khai báo, tối giản code.

### 7.1 Gộp Prefix (Tiền Tố Trực Tiếp Của URL)

```php
Route::prefix('admin/products')->group(function() {

    $controller = \Ecommerce\Controllers\Admin\ProductController::class;

    // Lúc này URL sẽ là "/admin/products"
    Route::match(['get','post'], '/', $controller.'@index');

    // Lúc này URL sẽ là "/admin/products/add"
    Route::match(['get','post'], '/add', $controller.'@add');
});
```

### 7.2 Gộp Middleware (Các Lớp Lọc Truy Cập)

Khu vực quản trị thường yêu cầu đảm bảo là Administrator. Bạn áp dụng middleware `auth:admin`.

```php
Route::middleware('auth:admin')->prefix('admin/products')->group(function() {

    $controller = \Ecommerce\Controllers\Admin\ProductBrandsController::class;

    Route::match(['get','post'], 'brands/', $controller.'@index')
         ->name('admin.products.brands.index');

    Route::match(['get','post'], 'brands/edit/{id}', $controller.'@edit')
         ->where('id', '[0-9]+')
         ->name('admin.products.brands.edit');

});
```

---

## 8. Ví dụ Điển Hình Mở Rộng Plugin (routes/admin.php)

File dưới đây đăng ký CRUD của Component `Product Elements` trong Plugin `product-element`.

```php
<?php
// middleware để chặn truy cập chưa đăng nhập admin hệ thống.
Route::middleware('auth:admin')->group(function () {

    // Prefix vào admin và gọi Controller phụ trách xử lý
    Route::prefix('admin/products/elements')->group(function () {
        
        $controller = \ProductElement\Controllers\Admin\ProductElementController::class;
        
        // {section} nhận mọi chữ cái a-z và tham số này sẽ bắn thẳng vào Action index($request, $section)
        Route::get('/{section}', $controller.'@index')
            ->where('section', '[a-zA-Z-]+')
            ->name('admin.products.elements');
            
    });
});
```

## 9. Fallback Route

Bạn có thể cung cấp đoạn xử lý thay thế khi hệ thống URL không khớp với bất kỳ khai báo nào.

```php
Route::fallback(function () {
    return 'URL này không tồn tại!';
});
```

> **Lưu ý:** CMS đã tự đăng ký 2 route "bắt tất cả" ở cuối: `/{any}` trong khu vực admin (trả trang 404 admin) và `/{slug}` ngoài web (đặt tên `index`, do `App\Controllers\Web\SlugController` phân giải slug từ bảng `routes`). Vì vậy fallback thường chỉ cần thiết khi bạn tự dựng nhóm route đặc thù.

---

## 10. Route Đa Ngôn Ngữ — `Route::localized()`

Macro `localized` (đăng ký trong `CmsServiceProvider`) giúp khai báo một nhóm route **vừa có bản gốc không prefix, vừa tự sinh thêm biến thể có prefix theo từng ngôn ngữ** đang kích hoạt trong hệ thống (lấy từ `Language::listKey()`, vd `vi`, `en`). Biến thể theo ngôn ngữ được tự động thêm tiền tố tên route `{locale}.`:

```php
Route::localized(function () {
    Route::get('gio-hang', \Ecommerce\Controllers\Web\EcommerceController::class.'@cart')
        ->name('sicommerce.cart');
});

// Kết quả đăng ký:
// /gio-hang        → name: sicommerce.cart      (ngôn ngữ mặc định)
// /vi/gio-hang     → name: vi.sicommerce.cart
// /en/gio-hang     → name: en.sicommerce.cart
```

Kết hợp với middleware `SetLanguage` (nhóm `web`), segment ngôn ngữ đầu URL sẽ được nhận diện và lưu vào session để kích hoạt locale tương ứng.

---

## 11. Group Namespace & Controller

Ngoài `prefix` / `middleware`, group còn hỗ trợ thuộc tính `namespace` (tự prepend namespace cho action string) và `controller` (gom các action về cùng một Controller):

```php
Route::namespace('App\Controllers\Web')->group(function () {
    // 'SlugController@index' → 'App\Controllers\Web\SlugController@index'
    Route::get('/{slug}', 'SlugController@index')->name('index');
});

Route::controller(\Ecommerce\Controllers\Web\EcommerceController::class)->group(function () {
    Route::get('gio-hang', 'cart');      // → EcommerceController@cart
    Route::get('thanh-toan', 'checkout');
});
```
