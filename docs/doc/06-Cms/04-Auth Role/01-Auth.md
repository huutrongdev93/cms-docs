# Authentication

> **File:** `packages/skilldo/framework/src/Support/Auth.php`
> 
> **Namespace:** `SkillDo\Support\Auth`

## 1. Auth là gì?
Authentication (Xác thực) là quá trình hệ thống nhận diện việc người dùng tiến hành đăng nhập, kiểm tra thông tin tài khoản hợp lệ, ghi nhớ session, cookies và trả về các thông tin đối tượng User đang thao tác.

Class `SkillDo\Support\Auth` của nền tảng cung cấp một tập hợp các phương thức tĩnh (Facade-like) vô cùng thân thiện giúp bạn thao tác với thông tin của người dùng hiện hành nhanh chóng mà không cần phải gọi qua DB liên tục, vì dữ liệu có cơ chế Cache & Session tối ưu.

## 2. Cách Gọi Thường Dùng
Vì các method của Auth được khai báo là tĩnh (`static`), bạn có thể gọi trực tiếp ở bất kỳ tệp Model, Controller, View hay Helper nào.

Ví dụ:
```php
use SkillDo\Support\Auth;

if (Auth::check()) 
{
    $userName = Auth::user()->username;
    $userId = Auth::id();
}
```

## 3. Danh Sách Phương Thức
### 3.1 Xác thực người dùng
#### <code>Auth::check</code>
Method <code>Auth::check</code> Kiểm tra user đã đăng nhập hệ thống hay chưa nếu đã đăng nhập kết quả sẽ là true ngược lại là false
```php
$isLogin = Auth::check()
```
#### <code>Auth::user</code>
Method <code>Auth::user</code> trả thông tin user đang đăng nhập nếu không có user đăng nhập method trả về một mãng rỗng
```php
$user = Auth::user()
```

#### <code>Auth::id</code>
Method <code>Auth::id</code> trả id user đang đăng nhập nếu không có user đăng nhập method trả về 0
```php
$userId = Auth::id();
```

#### <code>Auth::login</code>
Method <code>Auth::login</code> đăng nhập user được chỉ định vào hệ thống. Thành công trả về object User, thất bại trả về `SKD_Error`.
| Credentials Key   |      Type      |  Description |
|----------|:-------------:|------:|
| username |  string | <ul style={{textAlign:"left"}}><li>sử dụng username (mặc định)</li><li>sử dụng email (mặc định được bật — config `cms.user_login`)</li><li>sử dụng phone (mặc định tắt — thêm `'phone'` vào config `cms.user_login`)</li></ul> |
| password |    string   |   mật khẩu |
```php
$credentials = [
    'username' => 'my_username',
    'password' => 'my_password',
]

$loginResult = Auth::login($credentials);

if(!is_skd_error($loginResult)) 
{
    echo "login successful"
}
else 
{
    echo $loginResult->first();
}
```

> Nếu gọi `Auth::login()` không truyền `$credentials`, hệ thống tự lấy `username`/`password` từ request hiện tại. Trong quá trình login các hook sau được phát: filter `authenticate` ($user, $username, $password — trả về SKD_Error để chặn), action `skd_login` (thành công) và `skd_login_failed` (thất bại). User có `status` khác `public` (`pending`/`block`) sẽ bị từ chối đăng nhập.

#### <code>Auth::logout</code>
Method <code>Auth::logout</code> tiền hành đăng xuất user hiện đang đăng nhập trong hệ thống (xóa session `user`, xóa cookie `user_login`, phát action `user_logout`)
```php
Auth::logout();
```

#### <code>Auth::setCookie</code>
Method <code>Auth::setCookie</code> thiết lập phiên đăng nhập cho user được truyền vào: ghi cookie `user_login` (chứa `username` + `remember_token`, được ký HMAC-SHA256), ghi session và bind user vào container (`app('user')`). Dùng để đăng nhập user bằng code, hoặc làm mới thông tin user đang đăng nhập sau khi thay đổi dữ liệu
```php
$user = Auth::user();
$user->firstname = 'Elon';
$user->lastname = 'Mệt';
$user->save();
Auth::setCookie($user); // app('user') từ giờ trả về thông tin mới
```

#### <code>Auth::setCurrent</code>
Method <code>Auth::setCurrent</code> đăng nhập trực tiếp một user object vào hệ thống **không cần mật khẩu** (kiểm tra `status` phải là `public`, sau đó gọi `setCookie` và phát action `skd_login`). Thành công trả về user, thất bại trả về `SKD_Error`
```php
$user = \User::find(1);

$result = Auth::setCurrent($user);

if(!is_skd_error($result)) {
    echo "login successful";
}
```

#### <code>Auth::generatePassword</code>
Method <code>Auth::generatePassword</code> tạo chuỗi hash mật khẩu bằng `password_hash()` — ưu tiên **Argon2ID**, fallback **Bcrypt**. Tham số `$salt` thứ 2 chỉ giữ lại để tương thích code cũ và **không còn được sử dụng**
```php
$user = Auth::user();
$user->password = Auth::generatePassword('new_password');
$user->save();
```

#### <code>Auth::passwordConfirm</code>
Method <code>Auth::passwordConfirm</code> kiểm tra mật khẩu nhập vào có khớp với mật khẩu của user hay không. Tham số `$user` có thể bỏ trống — mặc định là user đang đăng nhập. Mật khẩu legacy (MD5 + salt) vẫn xác thực được và sẽ tự động migrate lên Argon2ID/Bcrypt sau lần xác thực thành công
```php
$passwordConfirm = Auth::passwordConfirm('my_password', $user);

if($passwordConfirm) 
{
    echo "Password is correct";
}
else 
{
    echo "Password is incorrect";
}
```

#### <code>Auth::loginByRemember</code>
Method <code>Auth::loginByRemember</code> tự động đăng nhập lại user từ cookie `user_login` (remember token) nếu session đã hết hạn. Không áp dụng cho user `root`
```php
Auth::loginByRemember();
```

### 3.2 Phân quyền người dùng
#### <code>Auth::hasCap</code>
Method <code>Auth::hasCap</code> kiểm tra user đang đăng nhập có quyền sử dụng chức năng không, nếu có quyền trả về true ngược lại là false
```php
if(Auth::hasCap('edit_post')) {
    //permission successfully
}
```
#### <code>Auth::getCap</code>
Method <code>Auth::getCap</code> trả về các quyền user đang đăng nhập có thể sử dụng
```php
dd(Auth::getCap())
/**
    "loggin_admin" => true
    "switch_themes" => true
    "edit_themes" => true
   ...
 */
```

#### <code>Auth::getRole</code>
Method <code>Auth::getRole</code> trả về key nhóm (chức vụ) của user đang đăng nhập
```php
dd(Auth::getRole())
//["customer"]
```

#### <code>Auth::getRoleName</code>
Method <code>Auth::getRoleName</code> trả về tên nhóm (chức vụ) của user đang đăng nhập
```php
dd(Auth::getRoleName())
//Khách hàng
```

#### <code>Auth::setRole</code>
Method <code>Auth::setRole</code> set user đang đăng nhập vào nhóm (chức vụ) mới (thay thế toàn bộ role hiện có, phát action `set_user_role`)
```php
dd(Auth::setRole('administrator'))
```

#### <code>Auth::addRole</code>
Method <code>Auth::addRole</code> gán **thêm** một nhóm (chức vụ) cho user đang đăng nhập (giữ lại các role cũ)
```php
Auth::addRole('seller');
```

#### <code>Auth::isSupper</code>
Method <code>Auth::isSupper</code> kiểm tra user đang đăng nhập có phải super admin hay không (dựa trên capability `delete_users`)
```php
if(Auth::isSupper()) {
    // User có quyền cao nhất
}
```
