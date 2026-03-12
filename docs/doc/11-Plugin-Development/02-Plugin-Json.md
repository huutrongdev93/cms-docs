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

Nơi nạp danh sách các Service Providers của Plugin. Hệ thống sẽ tự động gọi Hàm `boot()` và `register()` của các Provider này ngay lúc CMS khởi động. (Bạn dùng nó để gọi View, gọi Hook, khởi tạo Widget, V.v...).

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
Cho phép CMS nhận diện Tên class Controller gắn vào quy tắc tự động định tuyến.
Ví dụ nếu gán thành `"products"`, CMS có thể tự sinh URL dạng `/admin/products/index` hoặc `/admin/products/add`.

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

### B. Alias Hooks Cứng (Event Dispatcher)
Biến file `json` thành trạm điều phối Hook thay vì nhúng lệnh `add_action` và `add_filter` thủ công ở file php. Hệ thống sẽ tự Parse.

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
- Phía Trái: Tên CMS Event/Hook.
- Phía Phải: Namespace class và Lệnh Static Method sẽ chạy `Class::method`.

### C. Alias Form Fields & Popovers (Admin Builder)
Khai báo Custom Input mới cho Form Builder Của Admin (Nếu Plugin của bạn tạo ra 1 kiểu Input chuyên biệt).

```json
{
    "aliases": {
        "popover": {
            "products" : "Ecommerce\\Cms\\Form\\Popovers\\ProductsPopover"
        },
        "form-field" : {
            "productsCategories" : {
                "class" : "Ecommerce\\Cms\\Form\\Field\\ProductsCategories"
            }
        }
    }
}
```
Sau đó ở code bạn cấu hình FormAdmin chỉ cần gọi đến Key là tự có Box HTML: `$form->popover('products_id', ['popover' => 'products'])`.

---

## 5. Khai báo Middleware can thiệp Chu kỳ Request

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
        "psr-4": {
            "Blank\\Providers" : "app\\Providers",
            "Blank\\Controllers" : "app\\Controllers"
        }
    },
    "aliases": {
        "controller" : {
            "Blank\\Controllers\\Admin\\BlankController" : "blank",
            "Blank\\Controllers\\Web\\BlankController" : "blank"
        }
    }
}
```
