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

Class `Theme\Supports\ThemeAuthForm` có hai method:

| Method | Mô tả |
|---|---|
| `register()` | Form đăng ký — chạy qua filter `theme_auth_register_form` |
| `reset(Request $request)` | Form đặt lại mật khẩu |

Ở file Blade `user-register.blade.php`, render form bằng bộ ba `open()` / `html()` / `close()` của đối tượng `Form`:

```blade
<div class="register-form">
    {!! $registerForm->open('post', ['class' => 'auth-register-form']) !!}
        {!! $registerForm->html() !!}
        <div class="form-group col-md-12">
            <button type="submit" class="btn btn-theme">Đăng ký</button>
        </div>
    {!! $registerForm->close() !!}
</div>
```

> Không có helper `form_render()` — đây là cách render form duy nhất.

---

## 2. Hệ Sinh Thái Account Dashboard

Theme v8 thiết kế một Trang Account riêng cho User với cấu trúc 2 cột: **Bên Trái là Sidebar Menu**, **Bên Phải là Nội dung Page Controller** (Hoặc màn hình Home Dashboard tổng chứa các Widget thông tin).

### A. Thêm Menu Vào Account Sidebar

Bạn dùng Class `AccountSidebar` để khai báo các nút bấm vào thanh Menu Account:

```php
use Theme\Supports\AccountSidebar;

add_action('theme_account_sidebar', function() {
    
    // addMenu(string $slug, string $name, string $icon, int $priority = 10, $action = null)
    AccountSidebar::getInstance()->addMenu(
        'orders',
        'Lịch sử Đơn Hàng',
        '<i class="fa fa-shopping-cart"></i>',
        15
    );

    // addSubMenu(string $parent, string $slug, string $name, int $priority = 10, $action = null)
    AccountSidebar::getInstance()->addSubMenu(
        'orders',
        'orders/completed',
        'Đã Giao Thành Công',
        20
    );

});
```

Tham số `$action` (tuỳ chọn, cuối cùng) cho phép gán luôn handler ngay khi khai menu — khỏi phải gọi `AccountRouter::addRoute()` riêng.

Hệ thống sẽ tự động vẽ thanh cài đặt khi ở màn hình `/account`.

### B. Map Router Cho Từng Khớp Menu Sidebar (AccountRouter)

Khi bấm vào Menu `orders` ở phía trên, User sẽ được đưa đến URL dạng `/account?page=orders`. Hàm nào sẽ trả View HTML cho trang này? Đó là quyền của **`AccountRouter`**.

```php
use Theme\Supports\AccountRouter;
use SkillDo\Http\Request;

add_action('theme_account_sidebar', function() {

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

add_action('theme_account_init', function() {

    /**
     * add(
     *   string $id,               // Mã widget
     *   string $name,             // Tên
     *   int    $priority = 10,
     *   mixed  $action   = null,  // Callback / [Class::class, 'method'] / 'Class@method'
     *   string $size     = 'normal',
     *   bool   $enabled  = true
     * )
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
        'wide'
    );

});
```

**Giá trị `$size`** được ghép thành class CSS `widget-{$size}` trên thẻ bọc. Theme-store định nghĩa sẵn ba mức trong `user-index.blade.php`:

| `$size` | Class sinh ra | Ý nghĩa |
|---|---|---|
| `normal` *(mặc định)* | `.widget-normal` | Ô tiêu chuẩn |
| `wide` | `.widget-wide` | Ô rộng |
| `full` | `.widget-full` | Chiếm trọn hàng |

> Giá trị khác vẫn được chấp nhận nhưng sẽ sinh ra class không có CSS tương ứng.

Hệ thống tự rải lưới Widget `wallet_stats` (cùng các widget theme đăng ký sẵn như *Thông tin của bạn*) ra màn hình Dashboard, sắp xếp theo `$priority`. Dữ liệu nằm chung kho `AccountStore` (kế thừa `CmsStore`, container key `theme_account_store`) với ba nhánh `sidebar`, `routes`, `dashboard`.

---

## 3. Hai Hook Đăng Ký

Theme-store phát hai action bên trong `Theme::config()->booted('accountSidebar', …)` tại `bootstrap/account.php`:

| Hook | Dùng để |
|---|---|
| `theme_account_sidebar` | Đăng ký menu (`AccountSidebar`) và route (`AccountRouter`) |
| `theme_account_init` | Đăng ký widget dashboard (`AccountDashboard`) |

```php
// plugins/<id>/bootstrap/web.php
add_action('theme_account_sidebar', [AccountService::class, 'sidebar'], 30);
add_action('theme_account_init',   [DashboardWidget::class, 'register']);
```

> [!NOTE]
> Đây là API của **theme**, không phải của lõi. Plugin phụ thuộc vào nó là phụ thuộc mềm — nên kiểm tra `class_exists(\Theme\Supports\AccountSidebar::class)` trước khi gọi, phòng khi site dùng theme khác.

**Định dạng `$action`** được `executeAction()` chấp nhận (cả `AccountSidebar` lẫn `AccountDashboard`):

| Dạng | Ví dụ |
|---|---|
| Closure / callable | `function (Request $request) { … }` |
| Chuỗi `Class@method` | `'App\Controllers\Web\UserOrderController@completed'` |
| Mảng `[Class, method]` | `[App\Controllers\Web\AccountController::class, 'profile']` |

Với hai dạng controller, đối tượng được khởi tạo qua IoC container (`app()->make()`) chứ không `new` trực tiếp, để không chạy lại các `do_action('init')`, `theme_init`… lần thứ hai trong cùng request.
