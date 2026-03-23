# Account Dashboard & Theme Auth

Thư viện Component `Theme` của V8 cung cấp cho bạn một tập hợp các Class để quản lý Toàn bộ Luồng đăng nhập, đăng ký và Trang quản lý hồ sơ cá nhân của Người dùng (User Account Dashboard) mà Backend Developer không cần phải code lại hệ thống User Profiling.

Bộ khung hoạt động trên nguyên tắc **Registry Store** gồm có:
1. `ThemeAuthForm`: Quản lý Sinh Form Đăng ký/Quên mật khẩu.
2. `AccountStore`: Kho chứa Memory chứa Sidebar, Route và Widgets.
3. `AccountSidebar`: Đăng ký thanh Menu cho trang Account.
4. `AccountRouter`: Đăng ký Action / Sub-page cho mỗi link ở Sidebar.
5. `AccountDashboard`: Đăng ký các Block HTML hiển thị trên trang Dashboard tổng.

---

## 1. ThemeAuthForm (Giao diện Xác thực)

Nếu bạn cần gọi một Form đăng ký Chuẩn V8 gồm có (Username, Pass, RePass, Fullname, Email, Phone, Address... và Rule Validations đầy đủ), bạn không cần tự Build. Hãy gọi API:

```php
use Theme\Supports\ThemeAuthForm;
use SkillDo\Cms\Support\Cms;

// Ở Controller Trang Đăng ký
public function register()
{
    // Lấy object Form Đăng Ký đã được Build sẵn
    $registerForm = ThemeAuthForm::register();

    // Bạn có thể sửa trực tiếp Form này qua Filter Hook `theme_auth_register_form`
    
    Cms::setData('registerForm', $registerForm);
    return Cms::view('user-register');
}
```

Ở file Blade `user-register.blade.php`:
```blade
<div class="register-form">
    {!! form_render($registerForm) !!}
</div>
```

---

## 2. Hệ Sinh Thái Account Dashboard

Theme v8 thiết kế một Trang Account riêng cho User với cấu trúc 2 cột: **Bên Trái là Sidebar Menu**, **Bên Phải là Nội dung Page Controller** (Hoặc màn hình Home Dashboard tổng chứa các Widget thông tin).

### A. Thêm Menu Vào Account Sidebar

Bạn dùng Class `AccountSidebar` để khai báo các nút bấm vào thanh Menu Account:

```php
use Theme\Supports\AccountSidebar;

add_action('theme_init', function() {
    
    // Thêm Menu Cha: Lịch sử đơn hàng
    // Params: (slug, name, iconHtml, priority)
    AccountSidebar::getInstance()->addMenu(
        'orders', 
        'Lịch sử Đơn Hàng', 
        '<i class="fa fa-shopping-cart"></i>', 
        15
    );

    // Thêm Menu Con
    // Params: (parentSlug, childSlug, name, priority)
    AccountSidebar::getInstance()->addSubMenu(
        'orders', 
        'orders/completed', 
        'Đã Giao Thành Công', 
        20
    );

});
```

Hệ thống sẽ tự động vẽ thanh cài đặt khi ở màn hình `/account`.

### B. Map Router Cho Từng Khớp Menu Sidebar (AccountRouter)

Khi bấm vào Menu `orders` ở phía trên, User sẽ được đưa đến URL dạng `/account?page=orders`. Hàm nào sẽ trả View HTML cho trang này? Đó là quyền của **`AccountRouter`**.

```php
use Theme\Supports\AccountRouter;
use SkillDo\Http\Request;

add_action('theme_init', function() {

    // Trả màn hình cho Slug 'orders'
    AccountRouter::getInstance()->addRoute('orders', function(Request $request) {
        
        $myOrders = Order::where('user_id', Auth::id())->get();
        
        // Return Partial để đổ giao diện vào Khung Cột Bên Phải
        return Theme::partial('account/orders-layout', [
            'orders' => $myOrders
        ]);

    });

    // Gọi vào class Controller cụ thể thay vì Callback
    AccountRouter::getInstance()->addRoute('orders/completed', 'App\Controllers\Web\UserOrderController@completed');

});
```

### C. Đăng ký Widget vào Trang Chủ Account (AccountDashboard)

Trang mặc định ban đầu hiển thị khi vừa đăng nhập vào `/account` (không có tham số `?page=`) chính là Khu vực Dashboard. Nó được CMS ghép từ các khối `Widget` Box chữ nhật.

Để nhúng một khối (Ví dụ: Thống kê số dư Ví, Thống kê Đơn hàng), bạn dùng `AccountDashboard`:

```php
use Theme\Supports\AccountDashboard;

add_action('theme_init', function() {

    /**
     * @param string $id (Mã Widget)
     * @param string $name (Tên)
     * @param int $priority
     * @param mixed $action (Callback trả về HTML Component)
     * @param string $size (normal, haft, full)
     */
    AccountDashboard::getInstance()->add(
        'wallet_stats', 
        'Thống Kê Ví Tiền', 
        5, 
        function() {
            // Tính số dư Ví
            $balance = UserWallet::getBalance(Auth::id());
            return '<div class="wallet-box"><h3>Số dư: '. number_format($balance) .'đ</h3></div>';
        },
        'haft' // Widget chiếm nửa bề ngang
    );

});
```

Hệ thống sẽ tự rải lưới Widget `wallet_stats` (cùng các Widget gốc do Core đăng ký như Thông tin Tài Khoản) ra màn hình Dashboard một cách rất ngăn nắp và khoa học! Mọi dữ liệu nằm chung kho `AccountStore::get('dashboard')` sắp xếp theo Priority.
