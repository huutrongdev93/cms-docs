|                             |                                       |                               |
|-----------------------------|:-------------------------------------:|------------------------------:|
| [Url::is](#urlis)           |        [Url::admin](#urladmin)        |   [Url::account](#urlaccount) |
| [Url::base](#urlbase)       |    [Url::permalink](#urlpermalink)    | [Url::register](#urlregister) |
| [Url::current](#urlcurrent) |      [Url::segment](#urlsegment)      |       [Url::login](#urllogin) |
| [Url::ssl](#urlssl)         | [Url::getYoutubeID](#urlgetYoutubeID) |     [Url::logout](#urllogout) |



### `Url::is()`
Hàm `Url::is` kiểm tra chuổi có phải là url không.

```php
Url::is('https:://sikido.vn')
// True
Url::is('T is men')
// False
```

### `Url::base`
Hàm `Url::base` trả về domain cơ bản website của bạn.

```php
Url::base()
// http:://domain.com/
Url::base('skd-slug')
// http:://domain.com/skd-slug
```

### `Url::current()`
Hàm `Url::current` trả về domain hiện tại bạn đang mở. bao gồm cả các params, query string


### `Url::ssl()`
Hàm `Url::ssl` kiểm tra domain hiện tại có ssl hay không.

```php
// http:://domain.com/en/slug
Url::ssl()
// False
```

### `Url::admin`
Hàm `Url::admin` trả về domain admin website của bạn.

```php
Url::admin()
// http:://domain.com/admin/
Url::admin('skd-slug')
// http:://domain.com/admin/skd-slug
```

### `Url::permalink`
Hàm `Url::permalink` trả về domain sau khi custom. dùng trong các trường hợp như đa ngôn ngữ

```php
Url::permalink('slug')
// Ngôn ngữ mặc định: domain/slug
// Ngôn ngữ en: domain/en/slug
```

### `Url::segment`
Hàm `Url::segment` trả về phân đoạn của domain đang mở.

```php
// http:://domain.com/en/slug
Url::segment(1)
// en
Url::segment(2)
// slug
```

### `Url::getYoutubeID`
Hàm `Url::getYoutubeID` trả về Id video từ url video youtube.

```php
Url::getYoutubeID('https://www.youtube.com/watch?v=Lq5GO4M1-Gk')
// Lq5GO4M1-Gk
```

### `Url::account`
Hàm `Url::account` trả về url trang thông tin tài khoản (frontend) .

```php
Url::account()
// domain/tai-khoan/
Url::account('order')
// domain/tai-khoan/order
```

### `Url::register`
Hàm` Url::register` trả về url trang đăng ký tài khoản (frontend) .

```php
$redirect (string) url sẽ được chuyển hướng về sau khi đăng ký thành công

Url::register()
// domain/register/
```

### `Url::login`
Hàm `Url::login` trả về url trang đăng nhập tài khoản (frontend) .

Hàm nhận vào một tham số là $redirect (string) url sẽ được chuyển hướng về sau khi đăng nhập thành công

```php
Url::login()
// domain/login/
```

### `Url::logout()`
Hàm `Url::logout` trả về url trang đăng xuất tài khoản (frontend) .