# Màn Hình Bảng Điều Khiển (Admin Dashboard)

Trang tổng quan (Dashboard) của Admin Panel trong SkillDo CMS V8 được cấu thành từ tập hợp nhiều **Dashboard Widget**. Bạn hoàn toàn có thể nhúng thêm các khối biểu đồ, dữ liệu thống kê, hoặc thanh truy cập nhanh do hệ thống Plugin/Theme của bạn phát triển trực tiếp vào giao diện này.

Để tương tác với giao diện này, hệ thống cung cấp Class hỗ trợ **`Admin\Supports\Dashboard`** và loạt các Action Hooks riêng biệt.

---

## 1. Đăng Ký Widget Mới (Add Dashboard)

Để thêm một Widget, bạn cần móc hàm xử lý vào Action hệ thống có tên là **`cle_dashboard_setup`**.

### Bước 1: Gọi Action Đăng ký
```php
use Admin\Supports\Dashboard;

class MyDashboardWidget 
{
    static function register()
    {
        Dashboard::add('my_plugin_stats', 'Thống Kê My Plugin', [
            'callback' => [self::class, 'renderWidgetHtml'],
            'icon'     => '<i class="fad fa-chart-line" style="background-color: #0d6efd"></i>',
            'size'     => 'large', 
            'position' => 20 
        ]);
    }
}

// Lắng nghe lúc hệ thống bắt đầu vẽ Dashboard để chèn ID 
add_action('cle_dashboard_setup', [MyDashboardWidget::class, 'register']);
```

### Bước 2: Hiển Thị Giao Diện View (Callback Render)

Hàm `callback` có trách nhiệm là in ra (echo / include view) mã HTML của thân nội dung Widget đó.

```php
use SkillDo\Cms\Support\Admin;

class MyDashboardWidget 
{
    // ... code register() ...

    static function renderWidgetHtml($widget): void
    {
        // Xử lý lấy Data
        $totalUsers = 1500;
        
        // Gọi File View Blade hệ thống thông qua Admin::view
        Admin::view('my-plugin::admin.dashboard-stats', [
            'total'  => $totalUsers,
            'widget' => $widget // Option: bạn truyền ngược info widget vào view nếu cần
        ]);
        
        // Hoặc Echo trực tiếp nếu HTML ngắn gọn:
        // echo '<div style="padding:15px">Có tổng cộng '.$totalUsers.' người.</div>';
    }
}
```

### Giải Thích Các Tham Số Đăng Ký (Args)

Khi khởi tạo `Dashboard::add($id, $title, $args)`, ta có các Arguments sau:
- `callback` (Bắt buộc): Chuỗi function, Mảng khởi tạo tĩnh class, hay Interface đóng gói sẽ thực thi in HTML của Widget.
- `icon` (Chuỗi): Một icon nằm nhỏ lẻ làm background biểu tượng, hệ thống hay dùng thẻ `<i class="fa..." style="background..."></i>`.
- `size` (Kích cỡ): Khung lưới chứa Widget rớt vào mức độ nào.
  - `small`: Kích cỡ hẹp (Phù hợp khối đếm).
  - `large`: Cỡ lớn bự (Bằng cỡ Bảng Biểu Đồ Bài Viết).
  - `full`: Chiếm bung toàn màn hình ngang.
- `position` (Số Sort): Vị trí sắp xếp (Ví dụ `10`, `20`). Càng nhỏ Widget nằm càng lên đỉnh cao nhất.

---

## 2. Gỡ Bỏ Widget Tồn Tại (Remove)

Đôi khi Plugin khác hoặc Hệ thống Lõi Core chèn các Widget mặc định bạn không ưng ý (Ví dụ: Cột Thông tin Support SiKiDo), bạn có thể dùng lệnh Xóa tự động.

Hệ thống cung cấp một Hooks tên là **`cle_dashboard_remove`** (luôn chạy sau Hook setup). Bạn cần móc vào đây để tắt chúng đi dựa vào ID khai báo.

```php
add_action('cle_dashboard_remove', function() {
    // Xóa khối hỗ trợ kỹ thuật góc trái
    \Admin\Supports\Dashboard::remove('support');
    
    // Xóa khối Truy cập nhanh
    \Admin\Supports\Dashboard::remove('quick_access');
});
```

---

> **Mẹo nâng cao**: Quản trị viên (Khách Hàng) có thể chủ động cấu hình Tắt / Bật hoặc tự Lôi Kéo (Kéo Thả) thay đổi thứ tự ưu tiên (Position) của tất cả Widget ngay từ ngoài Form Cài Đặt trên UI. Code V8 đã giải quyết tự động cơ chế này (`Option::get('dashboard_sort')`), lập trình viên dev chúng ta không cần quan tâm đến luồng Cập nhật vị trí của Admin!
