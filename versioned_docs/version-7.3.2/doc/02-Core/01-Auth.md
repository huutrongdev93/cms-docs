import TOCInline from "@theme/TOCInline"

Class <b>Auth</b> cung cấp cho bạn các method thao tác với việc xác thực người dùng
### Thao tác với user
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

#### <code>Auth::userID</code>
Method <code>Auth::user</code> trả id user đang đăng nhập nếu không có user đăng nhập method trả về 0
```php
$userId = Auth::userID();
//hoặc
$userId = Auth::id();
```

#### <code>Auth::login</code>
Method <code>Auth::login</code> tiền hành đăng nhập user được chỉ định vào hệ thống
| Credentials Key   |      Type      |  Description |
|----------|:-------------:|------:|
| username |  string | <ul style={{textAlign:"left"}}><li>sử dụng username (mặc định)</li><li>sử dụng email (mặc định được bật)</li><li>sử dụng phone (mặc định tắt - chỉ hỗ trợ từ phiên bản 7)</li></ul> |
| password |    string   |   $12 |
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

#### <code>Auth::logout</code>
Method <code>Auth::logout</code> tiền hành đăng xuất user hiện đang đăng nhập trong hệ thống
```php
Auth::logout();
```

#### <code>Auth::setCookie</code>
Method <code>Auth::setCookie</code> tiền hành ghi đè thông tin user của bạn lên thông tin user đang đăng nhập hệ thống, thường được dùng để cập nhật lại thông tin của user đang đăng nhập sau khi thay đổi thông tin
```php
$user = Auth::user();
$user->firstname = 'Elon';
$user->lastname = 'Mệt';
Auth::setCookie($user);
```

#### <code>Auth::generatePassword</code>
Method <code>Auth::generatePassword</code> tiền hành tạo ra chuổi mật khẩu, trường hợp bạn quên mật khẩu user và cần reset lại mật khẩu có thể sử dụng method này tạo ra mật khẩu mới và ghi đè mật khẩu củ
```php
$user = Auth::user();
$password = Auth::generatePassword('new_password', $user->salt);
$user->password = $password;
$user->save();
```

### Phân quyền
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
Method <code>Auth::setRole</code> set user đang đăng nhập vào nhóm (chức vụ) mới
```php
dd(Auth::setRole('administrator'))
```