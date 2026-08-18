# Ajax System

> **File:** `packages/skilldo/cms/src/Support/Ajax.php`  
> **Namespace:** `SkillDo\Cms\Support\Ajax`  
> **Alias ngắn:** `\Ajax`

## Tổng Quan

CMS cung cấp một hệ thống Ajax thống nhất. Backend đăng ký handlers, frontend gọi qua URL `/ajax` với param `action`.

Endpoint `/ajax` được đăng ký trong `routes/admin.php` (`Route::match(['get','post','put','patch','delete'], 'ajax', 'AjaxController@index')`) và dispatch bởi `App\Controllers\Admin\AjaxController`. Request **bắt buộc phải là XHR** (có header `X-Requested-With: XMLHttpRequest`) — nếu không sẽ bị redirect về trang admin.

## Luồng Hoạt Động

```
Frontend (JS) → POST /ajax { action: 'MyAjax::method' }
                    │
                    ▼
Backend (PHP) → Ajax dispatcher → MyAjax::method(Request $request)
                    │
                    ▼
response()->success(...) / response()->error(...)
```

---

## Backend — Đăng Ký Ajax

### 3 loại Ajax theo phân quyền

| Method | Yêu cầu | Mô tả |
|---|---|---|
| `Ajax::client()` | Không cần đăng nhập | Ajax công khai (alias: `Ajax::public()`) |
| `Ajax::login()` | User đã đăng nhập (`Auth::check()`) | Ajax cho thành viên |
| `Ajax::admin()` | User đã đăng nhập **và** có capability `loggin_admin` | Ajax chỉ dành cho admin |

### Cú pháp

```php
Ajax::client('ClassName::methodName', 'post');
Ajax::client('ClassName::methodName', ['get', 'post']);

Ajax::login('ClassName::methodName', 'post');
Ajax::admin('ClassName::methodName', 'post');
```

> Tham số method mặc định là `'post'` nếu không truyền. Một action chỉ được đăng ký một lần cho mỗi tier (trùng sẽ bị bỏ qua).

### Kiểm tra / hủy đăng ký

```php
// Kiểm tra một action đã đăng ký chưa (theo tier)
Ajax::isRegisterClient('ClassName::methodName');
Ajax::isRegisterLogin('ClassName::methodName');
Ajax::isRegisterAdmin('ClassName::methodName');

// Hủy đăng ký một action (gỡ khỏi mọi tier) — gọi qua instance trong container
app('ajax')->remove('ClassName::methodName');
```

### Đăng ký trong Plugin

```php title="plugins/my-plugin/bootstrap/ajax.php"
// plugins/my-plugin/bootstrap/ajax.php
Ajax::admin('MyPlugin\Ajax\ProductAjax::create', 'post');
Ajax::admin('MyPlugin\Ajax\ProductAjax::update', 'post');
Ajax::admin('MyPlugin\Ajax\ProductAjax::delete', 'post');

Ajax::client('MyPlugin\Ajax\PublicAjax::load', 'post');
Ajax::login('MyPlugin\Ajax\MemberAjax::profile', 'post');
```

### Đăng ký trong Theme

```php title="views/theme-child/bootstrap/ajax.php"
// views/theme-child/bootstrap/ajax.php
Ajax::client('Theme\Ajax\ThemeAuthAjax::login', 'post');
Ajax::client('Theme\Ajax\ThemeAuthAjax::register', 'post');
Ajax::login('Theme\Ajax\ThemeAccountAjax::profile', 'post');
Ajax::admin('Theme\Ajax\Admin\LayoutAjax::save', 'post');
```

---

## Backend — Viết Ajax Handler

```php
<?php
namespace MyPlugin\Ajax\Admin;

use SkillDo\Http\Request;
use SkillDo\Validate\Rule;
use SkillDo\Validate\Validate;

class ProductAjax
{
    /**
     * Tạo sản phẩm mới
     */
    static function create(Request $request): void
    {
        // 1. Validate input
        $validate = Validate::make($request->all(), [
            'title' => Rule::make('Tiêu đề')->notEmpty(),
            'price' => Rule::make('Giá')->notEmpty()->numeric()->greaterThan(0),
        ])->validate();

        if ($validate->fails()) 
        {
            response()->error($validate->errors());
        }

        // 2. Xử lý logic
        $id = \MyPlugin\Models\Product::create([
            'title' => $request->input('title'),
            'price' => $request->input('price'),
        ]);

        if (is_skd_error($id)) 
        {
            response()->error($id);
        }

        // 3. Trả về kết quả
        response()->success('Tạo sản phẩm thành công!', [
            'id' => $id,
        ]);
    }

    /**
     * Cập nhật trạng thái
     */
    static function updateStatus(Request $request): void
    {
        $validate = $request->validate([
            'id'     => Rule::make('ID')->notEmpty()->integer(),
            'status' => Rule::make('Trạng thái')->notEmpty()->in(['public', 'draft']),
        ]);

        if ($validate->fails()) {
            response()->error($validate->errors());
        }

        \MyPlugin\Models\Product::whereKey($request->input('id'))
            ->update(['status' => $request->input('status')]);

        response()->success('Cập nhật thành công!');
    }
}
```

---

## Frontend — Gọi Ajax

### Biến JS toàn cục

CMS tự động inject 2 biến JavaScript:

| Biến | Giá trị | Mô tả |
|---|---|---|
| `ajax` | `/ajax` | URL endpoint ajax |
| `request` | Axios instance | Axios đã cấu hình sẵn CSRF token |

### Gọi bằng Axios (request)

```javascript
$(document).on('click', '.btn-create', function(e) {
    e.preventDefault();

    let data = {
        action: 'MyPlugin\\Ajax\\Admin\\ProductAjax::create',
        title:  $('#title').val(),
        price:  $('#price').val(),
    };

    request.post(ajax, data).then(function(response) {
        SkilldoMessage.response(response);
        if (response.data.status === 'success') {
            window.location.reload();
        }
    });
});
```

> `request` là Axios instance đã được cấu hình tự động gửi **CSRF token** và **language headers**.

### Xử lý ngôn ngữ

Khi admin và client dùng ngôn ngữ khác nhau, thêm `_is_lang`:

```javascript
let data = {
    action:   'MyPlugin\\Ajax\\PublicAjax::load',
    _is_lang: 'theme',  // 'theme' = chạy với ngôn ngữ client (lấy từ session/`language.theme.default`)
};
```

> Chỉ giá trị `'theme'` có ý nghĩa với handler `Ajax::login()`/`Ajax::admin()`: nó ép request chạy theo ngôn ngữ của client. Không truyền (hoặc giá trị khác) thì request từ admin chạy theo ngôn ngữ admin như bình thường. Handler `Ajax::client()` luôn chạy theo ngôn ngữ client.

### `SkilldoMessage.response(response)`

Helper hiển thị thông báo từ response:

```javascript
// Tự động hiển thị:
// - Toast success (khi status = 'success')
// - Toast error (khi status = 'error')
// - Field validation errors (khi có errors trong data)
SkilldoMessage.response(response);
```

---

## Ajax trong Theme

### Theme bootstrap/ajax.php

```php
// views/theme-store/bootstrap/ajax.php
<?php

// Public ajax (không cần đăng nhập)
Ajax::client('Theme\Ajax\ThemeAuthAjax::login', 'post');
Ajax::client('Theme\Ajax\ThemeAuthAjax::register', 'post');
Ajax::client('Theme\Ajax\ThemeAuthAjax::forgot', 'post');

// Login-required ajax
Ajax::login('Theme\Ajax\ThemeAccountAjax::profile', 'post');
Ajax::login('Theme\Ajax\ThemeAccountAjax::password', 'post');
Ajax::login('Theme\Ajax\ThemeTableAjax::load', 'post');

// Admin-only ajax
Ajax::admin('Theme\Ajax\Admin\LayoutAjax::save', 'post');
Ajax::admin('Theme\Ajax\Admin\LayoutAjax::active', 'post');
```

### Ajax Handler trong Theme

```php
<?php
// views/theme-store/app/Ajax/ThemeAuthAjax.php
namespace Theme\Ajax;

use SkillDo\Http\Request;
use SkillDo\Support\Auth;
use SkillDo\Validate\Rule;
use SkillDo\Validate\Validate;

class ThemeAuthAjax
{
    static function login(Request $request): void
    {
        $validate = Validate::make($request->all(), [
            'username' => Rule::make('Tên đăng nhập')->notEmpty(),
            'password' => Rule::make('Mật khẩu')->notEmpty(),
        ])->validate();

        if ($validate->fails()) {
            response()->error($validate->errors());
        }

        $user = Auth::login([
            'username' => $request->input('username'),
            'password' => $request->input('password'),
        ]);

        if (is_skd_error($user)) {
            response()->error($user);
        }

        $redirect = apply_filters('login_redirect', url_account());

        response()->success('Đăng nhập thành công!', [
            'redirect' => $redirect
        ]);
    }
}
```

### Gọi Ajax login trong frontend

```javascript
// Trong file JS của theme
$(document).on('submit', '#form-login', function(e) {
    e.preventDefault();

    let data = {
        action:   'Theme\\Ajax\\ThemeAuthAjax::login',
        username: $(this).find('[name=username]').val(),
        password: $(this).find('[name=password]').val(),
        _is_lang: 'theme',
    };

    request.post(ajax, data).then(function(response) {
        SkilldoMessage.response(response);
        if (response.data.status === 'success') {
            window.location.href = response.data.data.redirect;
        }
    });
});
```

---

## Ajax trong Plugin

### Plugin bootstrap/ajax.php

```php
// plugins/my-plugin/bootstrap/ajax.php
<?php

Ajax::admin('MyPlugin\Ajax\Admin\ProductAjax::create', 'post');
Ajax::admin('MyPlugin\Ajax\Admin\ProductAjax::update', 'post');
Ajax::admin('MyPlugin\Ajax\Admin\ProductAjax::delete', 'post');
Ajax::admin('MyPlugin\Ajax\Admin\ProductAjax::updateStatus', 'post');

Ajax::client('MyPlugin\Ajax\Web\ProductAjax::list', 'get');
Ajax::login('MyPlugin\Ajax\Web\WishlistAjax::toggle', 'post');
```

### Tổ chức file Ajax trong Plugin

```
plugins/my-plugin/
└── app/
    └── Ajax/
        ├── Admin/                     # Ajax admin-only
        │   ├── ProductAjax.php        # Ajax::admin(...)
        │   ├── CategoryAjax.php
        │   └── ReportAjax.php
        └── Web/                       # Ajax frontend
            ├── ProductAjax.php        # Ajax::client(...)
            └── WishlistAjax.php       # Ajax::login(...)
```

---

## Response Format

`response()->success($message, $data)` trả HTTP code mặc định `200`, `response()->error($message, $data)` trả `400` (đổi bằng `response()->setApiStatus($code)` trước khi gọi). Nếu `$message` là `SKD_Error` (VD: `$validate->errors()`), message trong JSON là **chuỗi lỗi đầu tiên** (`->first()`).

```json
// Success
{
    "data": {
        "id": 1,
        "title": "Sản phẩm mới"
    },
    "status": "success",
    "code": 200,
    "message": "Thao tác thành công!"
}

// Error — ví dụ response()->error($validate->errors())
{
    "data": [],
    "status": "error",
    "code": 400,
    "message": "Tiêu đề không được rỗng"
}
```

> Sau khi gửi JSON, response kết thúc request ngay (`die`) — code phía sau `response()->success()`/`error()` không chạy.

### Xử lý lỗi trong handler

Exception ném ra trong handler được `AjaxController` bắt lại, ghi `Log::error(...)` và trả về `response()->error(...)`. Khi `APP_DEBUG=true` message lỗi thật + vị trí file được trả về; khi tắt debug chỉ trả thông báo chung "Đã có lỗi xảy ra. Vui lòng thử lại.".

### Ajax của Element (Page Builder)

Element có thể khai báo key `ajax` trong `widget.json` (map `tier => 'Class::method'`). Khi action khớp, `AjaxController` tự `include` file element và đăng ký action với tier tương ứng trước khi dispatch — element không cần file `bootstrap/ajax.php` riêng.

