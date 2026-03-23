# Plugin.json

Trong kiến trúc của SkillDo CMS v8, tệp `plugin.json` đóng vai trò là "Trái tim" của mọi Plugin. Hệ thống Không sử dụng `composer.json` cho từng Plugin nội bộ để tránh nặng nề, mà thay vào đó Plugin Loader của CMS sẽ quét tệp `plugin.json` để lấy Meta Data (thông tin hiển thị), nạp các thư viện, Class, Route và Middleware mà không cần lập trình viên phải Include thủ công.

Bài viết này liệt kê các Key tham số hoàn chỉnh có thể cấu hình bên trong `plugin.json`.

---

## 1. Thông Tin Cơ Bản (Meta Data)

Đây là những thông tin bắt buộc phải có để Plugin hiển thị trong danh sách giao diện "Quản lý Plugin" ở trang Admin.

```json
{
    "name": "Sicommerce",
    "class": "sicommerce",
    "url": "https://sikido.vn",
    "description": "Tạo và quản lý sản phẩm thương mại của bạn.",
    "author": "SKDSoftware Dev Team",
    "version": "4.5.3",
    "thumb": "assets/thumb.png"
}
```

- **`name`** (Bắt buộc): Tên hiển thị của Plugin (Chuỗi dễ đọc).
- **`class`** (Bắt buộc): Định danh duy nhất của Plugin (Tên biến System), viết liền không dấu. Khuyến khích xài luôn tên thư mục Plugin.
- **`version`**: Phiên bản hiện tại, hữu ích khi bạn viết hệ thống cập nhật Database.
- **`thumb`**: Đường dẫn tới ảnh đại diện của Plugin (Tương đối so với Root thư mục Plugin).
- **`description`, `url`, `author`**: Các trường thông tin bổ sung.

---

## 2. Nạp Tự Động (Autoloading PSR-4)

Giống hệt cấu trúc Composer. Chỉ định cho hệ thống hiểu cách dẫn đường tự động từ **Namespace** đến **Thư Mục Chứa Code**.

```json
{
    "autoload": {
        "alias": "Ecommerce"
    }
}
```
Mặc định nếu bạn chỉ khai báo `"alias"`, CMS sẽ tự động map Namespace gốc `Ecommerce` vào các thư mục con như sau:

|       Namespace       |     Thư mục     |  
|:---------------------:|:---------------:|
|    Ecommerce\Ajax     |    app/Ajax     |
| Ecommerce\Controllers | app/Controllers |
|     Ecommerce\Cms     |     app/Cms     |
| Ecommerce\Middlewares | app/Middlewares |
|   Ecommerce\Models    |   app/Models    |
|   Ecommerce\Modules   |   app/Modules   |
|  Ecommerce\Providers  |  app/Providers  |
|  Ecommerce\Supports   |  app/Supports   |
|  Ecommerce\Services   |  app/Services   |

hoăc bạn có thể tùy chỉnh sâu hơn nếu muốn:

```json
{
    "autoload": {
        "psr-4": {
            "Ecommerce\\Template" : "app\\Template",
            "Ecommerce\\Cart"     : "app\\Cart",
            "Affiliate\\Status"   : "app\\Status"
        }
    }
}
```

- Nhờ có khối `"autoload"`, khi code bạn dùng `new Ecommerce\Cart\CartManager()`, hệ thống sẽ tự tìm chính xác đến tệp `app/Cart/CartManager.php` ở bên trong lõi Plugin của bạn. Bạn không bao giờ phải viết lệnh `require_once()`.

---

## 3. Khai Báo Service Providers (`providers`)

Nơi nạp danh sách các Service Providers của Plugin. Hệ thống sẽ tự động gọi Hàm `boot()` và `register()` của các Provider này ngay lúc CMS khởi động. (Bạn dùng nó để gọi View, gọi Hook, khởi tạo Macro, V.v...).

```json
{
    "providers": [
        "Ecommerce\\Providers\\SicommerceServiceProvider",
        "Ecommerce\\Providers\\PaymentServiceProvider"
    ]
}
```
**Lưu ý:** Namespace của các Provider phải được mapping đúng với đường dẫn ở mục `autoload` phía trên.

---

## 4. Định Nghĩa Phân Tên Các Controller và Routing (`aliases`)

Đây là một Key cấu hình cực kỳ mạnh mẽ của V8. Nó giúp Plugin Map cứng Controller vào một Cấu trúc Route cố định thay vì phải tự viết rườm rà. Mục này chứa nhiều nhóm nhỏ:

### A. Alias Controller To Routing
Cho phép CMS ánh xạ (map) một class Controller tới một **Page Key** (tên định danh trang). Page Key này được dùng làm căn cứ để hệ thống xác định trang hiện tại đang được xử lý bởi Controller nào.

Ví dụ, với cấu hình dưới đây, khi Controller `Ecommerce\Controllers\Admin\ProductController` xử lý method `index`, hệ thống sẽ nhận diện Page Key tương ứng là `products_index`.

```json
{
    "aliases": {
        "controller" : {
            "Ecommerce\\Controllers\\Admin\\ProductController" : "products",
            "Ecommerce\\Controllers\\Web\\ProductController" : "products",
            "Affiliate\\Controllers\\Admin\\AffiliateController" : "affiliate"
        }
    }
}
```

Sau khi khai báo, bạn có thể kiểm tra trang hiện tại trong code theo ngữ cảnh:

- **`Admin::isPage('products_index')`** → `true` khi đang ở method `index` của `Ecommerce\Controllers\Admin\ProductController`.
- **`Theme::isPage('products_index')`** → `true` khi đang ở method `index` của `Ecommerce\Controllers\Web\ProductController`.

> Quy tắc tạo Page Key: `{alias}_{method}` — ví dụ alias `products` + method `add` = Page Key `products_add`.

### B. Alias Hooks Cứng (Event Dispatcher)
Cho phép định nghĩa **tên gọi tắt (alias)** cho một Hook thực thi cụ thể (`Class::method`). Khi đã khai báo, bạn có thể dùng tên alias ngắn gọn thay cho chuỗi Namespace đầy đủ khi gọi `add_action` / `add_filter`.

```json
{
    "aliases": {
        "hooks" : {
            "page_products_index" : "Ecommerce\\Template\\ProductsIndex::index",
            "product_detail_layout" : "Ecommerce\\Template\\ProductsDetail::layout",
            "cart_checkout_payment" : "Ecommerce\\Modules\\Web\\Checkout\\Checkout::payment"
        }
    }
}
```

- **Phía Trái**: Tên alias ngắn gọn cho Hook (thường trùng với Page Key).
- **Phía Phải**: Namespace đầy đủ của class và Static Method sẽ được thực thi `Class::method`.

Nhờ vậy, hai cách gọi dưới đây là **hoàn toàn tương đương**:

```php
// Dùng alias ngắn gọn
add_action('page_products_index', 'abc');

// Tương đương với dùng Namespace đầy đủ
add_action('Ecommerce\\Template\\ProductsIndex::index', 'abc');
```

### C. Alias Middleware (Route Alias)
Cho phép đặt **tên alias ngắn gọn** cho một Middleware class. Sau khi khai báo, bạn có thể dùng tên alias này trực tiếp khi gắn vào Route thay vì phải viết Namespace đầy đủ.

```json
{
    "aliases": {
        "middlewares": {
            "ecommerce.auth"  : "Ecommerce\\Middlewares\\EcommerceAuth",
            "ecommerce.buyer" : "Ecommerce\\Middlewares\\RequireBuyer"
        }
    }
}
```

Sau khi khai báo, bạn có thể dùng alias ngắn gọn ở bất kỳ đâu trong routes:

```php
Route::get('/checkout', function () {})->middleware('ecommerce.auth');
Route::get('/orders',   function () {})->middleware(['ecommerce.auth', 'ecommerce.buyer']);
```

---

## 5. Khai Báo Form Fields & Popovers Cho Admin Builder (`cms`)

Khi Plugin cần đăng ký Custom Input Field hoặc Popover cho Form Builder của Admin, dùng khối `"cms"` (không phải `"aliases"`). Đây là vị trí đúng mà CMS Loader đọc để nạp các kiểu Input tuỳ chỉnh.

```json
{
    "cms": {
        "form": {
            "popover": {
                "products"          : "Ecommerce\\Cms\\Form\\Popovers\\ProductsPopover",
                "products-variable" : "Ecommerce\\Cms\\Form\\Popovers\\ProductsVariablePopover",
                "brands"            : "Ecommerce\\Cms\\Form\\Popovers\\BrandsPopover"
            },
            "fields": {
                "productsCategories" : {
                    "class" : "Ecommerce\\Cms\\Form\\Field\\ProductsCategories"
                },
                "productsCategoriesTree" : {
                    "class" : "Ecommerce\\Cms\\Form\\Field\\ProductsCategoriesTree"
                }
            }
        }
    }
}
```

- **`cms.form.popover`** — Đăng ký Popover Handle. Key là định danh dùng ở `'search' => 'products'` khi gọi `$form->popoverAdvance(...)`.
- **`cms.form.fields`** — Đăng ký Custom Field. Key là tên gọi tắt, value là object chứa `"class"` là Namespace đầy đủ của Field class.

Sau khi đăng ký, cách sử dụng trong code:

```php
// Sử dụng Popover đã đăng ký
$form->popoverAdvance('product_id', ['label' => 'Sản phẩm', 'search' => 'products']);

// Sử dụng Custom Field đã đăng ký
$form->productsCategories('category_id', ['label' => 'Danh mục sản phẩm']);
```

---

## 6. Khai báo Middleware can thiệp Chu kỳ Request

Nếu Plugin của bạn phải ép mọi người dùng check IP độc quyền, hay chuyển hướng (Redirect) một Request trước khi nó chạm vào Controllers, bạn thêm khối này:

```json
{
    "middlewares": {
        "groups": {
            "web" : [
                "SkdSeo\\Middlewares\\RedirectIfMatched",
                "Affiliate\\Middlewares\\CheckAffiliateCookie"
            ]
        }
    }
}
```
V8 hỗ trợ gán cứng Middleware qua các nhóm Route lớn như `web` (Tất cả ngoài fontend view), hoặc `api` (Tất cả ajax request).

---

### MỘT TỆP HOÀN CHỈNH ĐỂ COPY (Quickstart)

```json
{
    "name": "Blank Plugin",
    "class": "blank_uuid",
    "url": "https://sikido.vn",
    "description": "Bắt đầu code nhanh",
    "author": "Skilldo",
    "version": "1.0.0",
    "thumb": "assets/thumb.png",
    "providers": [
        "Blank\\Providers\\BlankServiceProvider"
    ],
    "autoload": {
        "alias": "Blank",
        "psr-4": {
            "Blank\\Providers" : "app\\Providers",
            "Blank\\Controllers" : "app\\Controllers"
        }
    },
    "aliases": {
        "controller" : {
            "Blank\\Controllers\\Admin\\BlankController" : "blank",
            "Blank\\Controllers\\Web\\BlankController" : "blank"
        },
        "hooks": {},
        "middlewares": {
            "blank.auth" : "Blank\\Middlewares\\BlankAuth"
        }
    },
    "middlewares": {
        "groups": {
            "web": []
        }
    },
    "cms": {
        "form": {
            "popover": {},
            "fields": {}
        }
    }
}
```
