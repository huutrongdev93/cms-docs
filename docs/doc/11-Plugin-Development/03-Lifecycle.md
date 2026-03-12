# Vòng Đời Khởi Tạo Lớp Plugin

Không giống như một Package thông thường chỉ có dạng Require và Return (Code xong quên). Framework SkillDo phải "theo dõi" toàn bộ Hệ Sinh Thái Plugin trong kho dữ liệu của mình (Bật, Tắt, Xóa, Gỡ Bỏ).
Nếu một Quản Trị Viên nhấn "Gỡ Bỏ Plugin Bán Hàng", SkillDo sẽ cho Plugin cơ hội Cuối Cùng để tự giác "Dọn Dẹp Rác Của Mình Nơi Hệ Thống (Xóa Data Product, Xóa File DB)". Do đó Plugin được gán Vòng Đời rất sát sao.

---

## 1. File Khai Báo Bootstrap (Hook Sự Cố Ngầm)

Ngoài các Service Provider dùng để nạp Lớp (Class) và Định Tuyến (Route) như đã nói tại `[02-Creating-Plugin.md]`.
Tại môi trường Quản lí Admin, Người dùng sẽ bấm Nút BẬT Hoặc TẮT.

Bạn cần chuẩn bị một cấu trúc Logic cho các Nút này (Thường là tạo một số Bảng Database hoặc chạy Query Update thông tin Server cài đặt lúc mới Bấm Bật Lên Lần Đầu).

Việc này làm bằng một Class có chữ Đuôi là Mặc Định (ID Plugin viết Hoa Chữ Cái Đầu) -> Hay file Bootstrap.

Giả sử Plugin của bạn tên là: `skd-hello-world`.
Bạn hãy tạo Cấu trúc tệp này: `plugins/skd-hello-world/skd-hello-world.php`.

*(Lưu ý: Tên File Bootstrap (Định dạng `.php`) phải trùng lặp hoàn toàn với Tên Thư Mục chứa Plugin (Ví vụ Folder là `ecommerce` thì file tên là `ecommerce.php`). Đặt nằm ở vị trí ngang hàng ngoài cùng - Thư Mục Root của Plugin)*

```php
<?php
// plugins/skd-hello-world/skd-hello-world.php

class SkdHelloWorld 
{
    // Hàm active(): Được gọi DUY NHẤT 1 LẦN khi Admin bấm Bật ở Menu Quản Trị.
    public function active() 
    {
        // Thường dùng để khởi tạo Database Schema, Import Seed Data...
        SkillDo\Facades\DB::schema()->create('my_hello_table', function($table) {
            $table->increments('id');
            $table->string('message');
        });
    }

    // Hàm uninstall(): Kích hoạt khi Admin bấm Gỡ Cài Đặt.
    public function uninstall() 
    {
        // Chức năng "Dọn dẹp": Gỡ bỏ bảng đã tạo, file cấu hình, file log, để không bỏ rơi rác.
        SkillDo\Facades\DB::schema()->dropIfExists('my_hello_table');
    }
}
```

Từ đây, Bộ nạp của CMS sẽ tự động liên kết Nút Bấm "Kích Hoạt / Gỡ Bỏ" với file `.php` có chức năng tương ứng của Bạn!

---

## 2. Đi Sâu Vào Vòng Đời Tải Nháp Của Plugin Ở Frontend Lẫn Admin Trang Web  (Pipeline Chạy Web Bình Thường)

Bên Lệnh Ở Trên (Activate, Uninstall) là Tín Hiệu Hành Vi Của **Admin Quản Trị**.
Vậy Ở Mặt Mạng Lưới (Khách hàng mở Website (Route `/`)), SkillDo Framework nới gì để làm "Load" cái Code Plugin của bạn nếu Nó [ĐANG BẬT] ở CSDL?

**SkillDo Cms Module Engine (`packages/skilldo/cms/src/Loader.php`) Thực Hiện Nhiệm vụ: `bootPlugins()`:**

1. Bắt Đầu Nhận Yêu cầu từ Web (`Request`). Khởi động Core Nền Tảng.
2. `Loader` Của CMS chạy một truy vấn: Lôi Hết DB Bảng Option, Chế Độ Các List Plugin Đang Bật Tên Gì (Mảng active).
3. Lặp lại tất cả các Thư Mục Plugin Bật:
    - Bơm Tự Động Định Danh (Class Autoloader Composer Load). Từ Thư Mục JSON PSR-4.
    - Cõng Tải Thư mục **`config/`** của Plugin Nếu Có Gọi Là (Tên ID Plugin VD: `config('skd-hello-world.key')`)
    - Tải Thư mục Ngôn ngữ đa chữ Hệ Thống i18n (`language/`) Namespace Namespace (VD: `__('skd-hello-world::file.title')`).
    - Gọi Tất Cả Các File Code Mở Tự Điền Nằm Ở Mục `autoload->files` Nhắc Ở `plugin.json` Mới Viết Xong.
4. Chạy Gọi Nhất Khởi (Register Và Boot) Cho Tất Cả Các Providers có mặt Trong File JSON đó (Gắn Web Controller Web Route / Khai Báo Các Helper Container Khác).
5. **Đặc Biệt Bắn Hook Đỉnh Điểm Nhất ("plugins_loaded")**: 
    - Đánh Trống (Dispatch Event Hook WordPress) Bảo CMS Chạy Xong Mọi Plugins. Tất cả Tính Năng Framework Nạp Thành Công Vào RAM (Chưa Xuất HTML Về). Hãy Gắn Hàm Hook Này Để Override Nhau Giữa Các Code Của Nhau!

```php
// Một Hàm Ở Theme Store (Hoặc Một Giỏ Hàng Plugin Khác Bật Nhìn Nhau) Gắn Sự Kiện này
add_action('plugins_loaded', function() {
     // Lúc Này Mới Chạy Xong Code Của 33+ Plugin
     // Của Toàn Bộ Nền Tảng (An Tâm Có Giỏ Hàng/Có Thể Load File User Interface) Đều Ok
});
```

6. Cuối cùng, Hệ thống Chạy CMS Tiếp Bước Khúc Xử Lý Theme, Render Views... Sinh Ra Data Vào Trang.
