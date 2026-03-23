# Đa Ngôn Ngữ Trong Plugins

Trong khi hệ thống CMS Core và Theme có quyền truy cập trực tiếp bằng các từ khóa dạng `trans('tên-file.từ-khóa')` hoặc `trans('theme::')`, thì các Plugin của SkillDo buộc phải sử dụng một phương pháp tách bạch hoàn toàn để tránh những sự xung đột ngoài ý muốn. 

**Giải pháp của Framework:** SkillDo đăng ký cho Plugin một **Namespace dịch thuật riêng**.

---

## 1. Cấu trúc thư mục Plugin Language

Hãy lấy một ví dụ là Plugin "SKD SEO" (`skd-seo`). 

```text
sourcev8/plugins/
└── skd-seo/
    ├── app/
    ├── config/
    ├── views/
    ├── language/              <-- Nơi chứa ngôn ngữ cho plugin này
    │   ├── vi/
    │   │   ├── admin.php      // Mảng dịch riêng cho giao diện quản trị Plugin
    │   │   ├── messages.php   // Mảng dịch Alert thông báo
    │   └── en/
    │       ├── admin.php
    │       └── messages.php
    └── plugin.json
```

---

## 2. Cách Khai Báo (Register Namespace) Cho Plugin

Điều quan trọng nhất là bạn PHẢI cho Framework biết Plugins của bạn có gói Ngôn Ngữ riêng, và bảo Framework hãy "nạp" gói này vào Service Container dưới dạng một tiền tố (Prefix).

Quá trình này tự động hóa bởi CMS Plugin Loader (thông qua `Loader::autoload()`), nếu bạn tạo đúng thư mục `language/` thì SkillDo sẽ lập tức tải (register) tất cả thư mục nằm trong đó và gắn Prefix là **Chính ID Của Plugin Bạn (Tên thư mục Plugin)**.

Ví dụ: Bạn có Plugin `skd-seo` -> Prefix dịch thuật được gán tự động là `skd-seo::`.

---

## 3. Cách Sử Dụng Hàm `trans()` Với Plugin Namespace

Thay vì gọi bình thường, bạn sử dụng cú pháp **PREFIX 2 DẤU HAI CHẤM (`::`)** nối vào tên tệp ngôn ngữ lúc xuất văn bản ra.

File `plugins/skd-seo/language/vi/admin.php`:
```php
<?php
return [
    'title'  => 'Cấu hình SEO Tổng Thể',
    'save'   => 'Lưu thiết lập SEO'
];
```

Sử dụng trong Code (Controller Plugin, View Plugin, Helper Plugin):
```php
// Ở bất cứ đâu của ứng dụng:

// TÌM TẠI PLUGIN: skd-seo > file admin.php > key title
echo trans('skd-seo::admin.title'); 
// Trả về: Cấu hình SEO Tổng Thể

echo trans('skd-seo::admin.save');
// Trả về: Lưu thiết lập SEO
```

### Tại sao Cú Pháp Này Hiệu Quả?

1. **Tuyệt đối không đụng hàng:** Giả sử CMS Core cũng có `admin.php->title` là *Thiết lập chung*, và bạn dùng `trans('admin.title')`. Nhờ thêm namespace của Plugin (`trans('skd-seo::admin.title')`), hệ thống nhận diện việc tìm kiếm nằm ở Thư mục Plugin bạn chứ không lộn xộn vào Admin CMS Core.
2. **Cho phép Theme tự ghi đè Plugin:** Tính năng vượt trội của Framework là khi Theme của dự án gọi lệnh `trans('skd-seo::admin.title')` nhưng Frontend muốn chữ này biến thành "Thiết lập SEO Khách hàng" chứ không dùng chữ do tác giả Plugin viết ra, Theme CÓ QUYỀN ghi đè! 
- *SkillDo Framework cho phép tìm tệp `vi/skd-seo/admin.php` ngay bên trong thư mục `language/` của Theme của bạn trước khi đi tới thư mục Plugin.*

---

## 4. Tùy chỉnh đăng ký nâng cao với `loadTranslationsFrom()`

Nếu bạn làm một gói Package nằm ngoài cấu trúc chuẩn của Plugin CMS (Ví dụ một class module nằm trong `packages/`), bạn hoàn toàn có thể tự ĐĂNG KÝ MỘT BỘ NGÔN NGỮ THỦ CÔNG trong file **Service Provider** của Module bạn.

```php
namespace SkillDo\MyCustomPackage\Providers;

use SkillDo\Support\ServiceProvider;

class CustomPackageServiceProvider extends ServiceProvider {

    public function boot() {
        
        // Cú pháp: loadTranslationsFrom( ĐƯỜNG DẪN THỰC TẾ, PREFIX/NAMESPACE )
        $this->loadTranslationsFrom(__DIR__.'/../language', 'custom-pkg');

    }
}
```

Và giờ bạn dùng thoải mái: `trans('custom-pkg::file.key')`
