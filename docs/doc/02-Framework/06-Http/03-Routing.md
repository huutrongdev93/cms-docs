# Routing System

> **File:** `packages/skilldo/framework/src/Support/Facades/Route.php`
> **Namespace Cấu Trúc:** `SkillDo\Routing`
> **Facade:** `\Route`

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

// Chấp nhận mọi loại requests (GET, POST, PUT, DELETE, PATCH, OPTIONS)
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

```php
// Ở mã PHP hoặc Template File
$url = route('sicommerce.cart'); // Output: https://domain.com/gio-hang
```

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
