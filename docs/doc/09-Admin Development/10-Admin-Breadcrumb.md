# Breadcrumb Trong Admin

Trong giao diện quản trị (Admin Panel) của SkillDo CMS v8, thanh Breadcrumb giúp người quản trị dễ dàng nhận biết vị trí hiện tại của mình trong hệ thống phân cấp. Breadcrumb cho Admin được quản lý tập trung thông qua Service Container là `app('breadcrumb.admin')`.

Hệ thống cung cấp các phương thức vô cùng linh hoạt để đăng ký Breadcrumb tùy thuộc vào độ phức tạp của Module: Tĩnh (Static Route), Động (Xử lý Closure) hoặc thông qua tham số truy vấn (Query Parameter trên URL).

---

## 1. Cơ Chế Đăng Ký Thông Qua Action Hook

Đối với các Plugin hoặc Module rời độc lập, bạn nên thực hiện khai báo Breadcrumb thông qua Action Hook `admin_breadcrumb` để đảm bảo việc load Breadcrumb được hệ thống sắp xếp đúng thứ tự.

**Khởi tạo cấu hình (VD: `bootstrap/config.php` hoặc `bootstrap/admin.php`):**

```php
use MyPlugin\Services\AdminService;

add_action('admin_breadcrumb', [AdminService::class, 'breadcrumb']);
```

---

## 2. Thêm Breadcrumb Tĩnh Cho Từng Tuyến Đường (Static Map)

Phương thức `add()` được sử dụng đặc biệt cho các định tuyến cố định, nơi đường dẫn không có tham số thay đổi liên tục. Hệ thống sẽ đem **Tên Route (Route Name)** sinh ra hiện tại đối chiếu với danh sách đã Add để tự động vẽ Breadcrumb.

**Cú pháp trong Class `AdminService::breadcrumb`:**

```php
namespace MyPlugin\Services;

class AdminService
{
    public static function breadcrumb(): void
    {
        // 1. Định nghĩa Breadcrumb cho danh sách
        app('breadcrumb.admin')->add('admin.my_plugin.index', [
            ['label' => 'Quản lý Plugin']
        ]);

        // 2. Chuyển cấp: Trang "thêm mới" có Parent URL trỏ về danh sách
        app('breadcrumb.admin')->add('admin.my_plugin.add', [
            ['label' => 'Quản lý Plugin', 'url' => route('admin.my_plugin.index')],
            ['label' => 'Thêm mới']
        ]);

        // 3. Tương tự cho trang Cập nhật
        app('breadcrumb.admin')->add('admin.my_plugin.edit', [
            ['label' => 'Quản lý Plugin', 'url' => route('admin.my_plugin.index')],
            ['label' => 'Cập nhật']
        ]);
    }
}
```

Mảng thứ hai trong hàm `add()` là một chuỗi các Level của Breadcrumb. Chúng chứa khóa `label` (Hiển thị văn bản) và có thể mở rộng khóa `url` (Gắn link quay lùi).

---

## 3. Tạo Breadcrumb Gắn Logic Động (Dynamic Registration)

Trường hợp đường dẫn (Route) của bạn nhận tham số động làm Payload dạng biến như `admin.system.detail.{type}`, bạn không thể Hardcode bằng `add()` được mà cần hàm tính toán trả về mảng Breadcrumb. Ta dùng phương thức `registerDynamic()`.

**Cú pháp:**

```php
app('breadcrumb.admin')->registerDynamic('admin.system.detail', function ($params) {
    // Biến $params chứa mảng các tham số route truyền vào
    return [
        ['label' => 'Hệ thống chung', 'url' => route('admin.system.index')],
        ['label' => 'Chi tiết cấu hình'],
    ];
});
```

Hệ thống sẽ so sánh tiền tố đầu tiên trùng nhau (vd `admin.system.detail`) để kích hoạt hàm nặc danh (Closure) nhằm tính toán các mảng.

---

## 4. Xử Lý Breadcrumb Dựa Vào Tham Số Của URL (Query Parameter)

Vấn đề phức tạp hơn khi có chung một **Route Name** nhưng khác biệt về Parameter query trên dòng trình duyệt. Ví dụ như module Taxonomy Posts: URL `?post_type=product` sẽ phải có tiêu đề và Breadcrumb khác với `?post_type=news`. 

V8 cung cấp phương thức `registerQuery()`.

**Cú pháp:**
```php
$postType = 'product';

// Đăng ký cho trang Index
app('breadcrumb.admin')->registerQuery('admin.post.index.'.$postType, 'post_type', function ($params) {
    return [
        ['label' => 'Sản phẩm kinh doanh']
    ];
});

// Đăng ký cho trang Thêm Mới
app('breadcrumb.admin')->registerQuery('admin.post.add.'.$postType, 'post_type', function ($params) use ($postType) {
    return [
        ['label' => 'Sản phẩm kinh doanh', 'url' => route('admin.post.index', ['post_type' => $postType])],
        ['label' => 'Tạo sản phẩm']
    ];
});
```

Giải thích đối số:
- Đối số 1: Tên Khóa Đăng Ký duy nhất. Thường được ghép bằng `Route.Name` + `.` + `Value` để tránh bị ghi đè.
- Đối số 2 (`'post_type'`): Tên Key nằm trong thanh URL Address Bar. Hệ thống sẽ get ra và so sánh nếu có giá trị. Nếu trùng Callback này sẽ được lựa chọn hiển thị.
- Đối số 3 (Closure): Hàm trả về mảng Array tương tự như static rules.

---

**Tổng kết:** Với bộ ba tính năng `add()`, `registerDynamic()` và `registerQuery()`, bạn không bao giờ phải viết cấu trúc cây thẻ HTML (`<ul><li>`) thủ công cho Breadcrumb. Bạn chỉ việc Map đúng dữ liệu và CMS lo phần giao diện UI hiển thị.
