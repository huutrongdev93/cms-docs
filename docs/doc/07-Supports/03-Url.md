# Url

> **File:** `packages/skilldo/cms/src/Support/Url.php`
> **Namespace:** `SkillDo\Cms\Support\Url`
> **Alias ngắn:** `\Url`

Class `Url` cung cấp các helper tĩnh để tạo và xử lý URL trong SkillDo CMS v8.

|                             |                                     |                               |
|-----------------------------|:-----------------------------------:|------------------------------:|
| [Url::is](#urlis)           |      [Url::admin](#urladmin)        | [Url::account](#urlaccount)   |
| [Url::base](#urlbase)       |  [Url::permalink](#urlpermalink)    | [Url::register](#urlregister) |
| [Url::current](#urlcurrent) |    [Url::segment](#urlsegment)      | [Url::login](#urllogin)       |
| [Url::ssl](#urlssl)         | [Url::getYoutubeID](#urlgetyoutubeid) | [Url::logout](#urllogout)   |
| [Url::theme](#urltheme)     | [Url::isYoutube](#urlisyoutube)     | [Url::forgot](#urlforgot)     |
| [Url::slug](#urlslug)       | [Url::language](#urllanguage)       | [Url::download](#urldownload) |


### `Url::is()`
Hàm `Url::is` kiểm tra chuỗi có phải là một URL hợp lệ không.

```php
Url::is('https://skilldo.vn')
// true

Url::is('T is men')
// false
```

### `Url::base()`
Hàm `Url::base` trả về domain gốc của website. Nhận thêm một chuỗi path để nối vào sau domain.

```php
Url::base()
// https://domain.com/

Url::base('skd-slug')
// https://domain.com/skd-slug
```

### `Url::current()`
Hàm `Url::current` trả về URL đầy đủ của trang hiện tại (bao gồm query string).

```php
Url::current()
// https://domain.com/san-pham?page=2

// Lấy URL dạng base64 (dùng để truyền redirect)
Url::current(true)
// aHR0cHM6Ly9kb21haW4uY29tL3Nhbi1waGFtP3BhZ2U9Mg==
```

### `Url::ssl()`
Hàm `Url::ssl` kiểm tra domain hiện tại có dùng HTTPS (SSL) hay không.

```php
// Đang ở http://domain.com/
Url::ssl()
// false

// Đang ở https://domain.com/
Url::ssl()
// true
```

### `Url::admin()`
Hàm `Url::admin` trả về URL khu vực admin của website.

```php
Url::admin()
// https://domain.com/admin/

Url::admin('users')
// https://domain.com/admin/users
```

### `Url::theme()`
Hàm `Url::theme` trả về URL trỏ vào thư mục của theme đang được kích hoạt.

```php
Url::theme()
// https://domain.com/views/theme-name/

Url::theme('assets/images/logo.png')
// https://domain.com/views/theme-name/assets/images/logo.png
```

### `Url::permalink()`
Hàm `Url::permalink` trả về URL sau khi áp dụng bộ lọc đa ngôn ngữ. Dùng trong các trường hợp trang hỗ trợ đa ngôn ngữ.

```php
Url::permalink('san-pham-a')
// Ngôn ngữ mặc định: https://domain.com/san-pham-a
// Ngôn ngữ en:       https://domain.com/en/san-pham-a
```

### `Url::segment()`
Hàm `Url::segment` trả về phân đoạn (segment) của URL hiện tại theo vị trí (bắt đầu từ 1).

```php
// Đang ở https://domain.com/en/san-pham
Url::segment(1)
// en
Url::segment(2)
// san-pham
```

### `Url::getYoutubeID()`
Hàm `Url::getYoutubeID` trích xuất ID video từ URL YouTube.

```php
Url::getYoutubeID('https://www.youtube.com/watch?v=Lq5GO4M1-Gk')
// Lq5GO4M1-Gk
```

### `Url::isYoutube()`
Hàm `Url::isYoutube` kiểm tra URL có phải là URL video YouTube không.

```php
Url::isYoutube('https://www.youtube.com/watch?v=abc123')
// true

Url::isYoutube('https://domain.com/video')
// false
```

### `Url::account()`
Hàm `Url::account` trả về URL trang thông tin tài khoản (Frontend).

```php
Url::account()
// https://domain.com/account

Url::account('order')
// https://domain.com/account (Url::account không nhận tham số path - dùng Url::base để build thêm)
```

### `Url::register()`
Hàm `Url::register` trả về URL trang đăng ký tài khoản (Frontend).

```php
Url::register()
// https://domain.com/register
```

### `Url::login()`
Hàm `Url::login` trả về URL trang đăng nhập tài khoản (Frontend).

```php
Url::login()
// https://domain.com/login
```

### `Url::forgot()`
Hàm `Url::forgot` trả về URL trang quên mật khẩu (Frontend).

```php
Url::forgot()
// https://domain.com/forgot
```

### `Url::logout()`
Hàm `Url::logout` trả về URL để đăng xuất tài khoản (Frontend).

```php
Url::logout()
// https://domain.com/logout
```

### `Url::slug()`
Hàm `Url::slug` trả về slug của trang hiện tại từ URL, tự động bỏ qua prefix ngôn ngữ nếu có.

```php
// URL: https://domain.com/en/san-pham-a
Url::slug()
// san-pham-a
```

### `Url::language()`
Hàm `Url::language` trả về URL của trang hiện tại nhưng chuyển sang ngôn ngữ khác.

```php
// Đang ở: https://domain.com/san-pham-a
Url::language('en')
// https://domain.com/en/san-pham-a
```

### `Url::download()`
Hàm `Url::download` tải một file từ URL về server và lưu vào đường dẫn chỉ định. Trả về `true` nếu thành công.

```php
$success = Url::download(
    'https://example.com/file.zip',
    storage_path('app/downloads/file.zip')
);
```