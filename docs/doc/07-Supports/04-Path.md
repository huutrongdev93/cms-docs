# Path

> **File:** `packages/skilldo/framework/src/Support/Path.php`  
> **Namespace:** `SkillDo\Support\Path`  
> **Alias ngắn:** `\Path`

Class `Path` cung cấp các helper tĩnh để lấy **đường dẫn hệ thống tuyệt đối** trên server. Khác với `Url::` (dùng cho URL web), `Path::` dùng để truy cập file trên filesystem.

> **Lưu ý:** Class `Path` dùng trait `Macroable`. Các phương thức gốc: `base()`, `storage()`, `cache()`, `config()`, `view()`, `log()`. Các phương thức `theme()`, `themeChild()`, `admin()`, `plugin()` được đăng ký qua Macro trong `CmsServiceProvider`. Mọi kết quả đều được chuẩn hóa qua `path_normalize()` (dấu phân cách theo hệ điều hành).

---

### `Path::base()`
Trả về đường dẫn tuyệt đối đến thư mục gốc của project.

```php
Path::base()
// /var/www/html/myproject

Path::base('bootstrap/config.php')
// /var/www/html/myproject/bootstrap/config.php
```

### `Path::storage()`
Trả về đường dẫn tuyệt đối đến thư mục `storage` (lưu logs, cache file, session...).

```php
Path::storage()
// /var/www/html/myproject/storage

Path::storage('logs/error.log')
// /var/www/html/myproject/storage/logs/error.log
```

### `Path::cache()`
Trả về đường dẫn tuyệt đối đến thư mục cache (`storage/framework/cache`).

```php
Path::cache()
// /var/www/html/myproject/storage/framework/cache

Path::cache('my_cache.php')
// /var/www/html/myproject/storage/framework/cache/my_cache.php
```

### `Path::config()`
Trả về đường dẫn tuyệt đối đến thư mục cấu hình (thư mục `config/` ở gốc project — nơi chứa các file override).

```php
Path::config()
// /var/www/html/myproject/config

Path::config('cms.php')
// /var/www/html/myproject/config/cms.php
```

### `Path::view()`
Trả về đường dẫn tuyệt đối đến thư mục views (nơi chứa theme và template).

```php
Path::view()
// /var/www/html/myproject/views

Path::view('theme-store/index.blade.php')
// /var/www/html/myproject/views/theme-store/index.blade.php
```

### `Path::log()`
Trả về đường dẫn tuyệt đối đến thư mục log.

```php
Path::log()
// /var/www/html/myproject/storage/logs

Path::log('app.log')
// /var/www/html/myproject/storage/logs/app.log
```

### `Path::theme()` *(Macro — đăng ký ở CMS)*
Trả về đường dẫn tuyệt đối đến thư mục của theme đang kích hoạt.

```php
Path::theme()
// /var/www/html/myproject/views/theme-store

Path::theme('assets/images/logo.png')
// /var/www/html/myproject/views/theme-store/assets/images/logo.png
```

### `Path::themeChild()` *(Macro — đăng ký ở CMS)*
Trả về đường dẫn tuyệt đối đến thư mục theme-child (cấu hình `cms.theme.child`).

```php
Path::themeChild()
// /var/www/html/myproject/views/theme-child

Path::themeChild('assets/images/logo.png')
// /var/www/html/myproject/views/theme-child/assets/images/logo.png
```

### `Path::admin()` *(Macro — đăng ký ở CMS)*
Trả về đường dẫn tuyệt đối đến thư mục admin backend.

```php
Path::admin()
// /var/www/html/myproject/views/admin

Path::admin('assets/js/app.js')
// /var/www/html/myproject/views/admin/assets/js/app.js
```

### `Path::plugin()` *(Macro — đăng ký ở CMS)*
Trả về đường dẫn tuyệt đối đến thư mục plugins.

```php
Path::plugin()
// /var/www/html/myproject/plugins

Path::plugin('sicommerce/assets/js/main.js')
// /var/www/html/myproject/plugins/sicommerce/assets/js/main.js
```