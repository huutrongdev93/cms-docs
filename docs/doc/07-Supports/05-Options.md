# Option

> **File:** `packages/skilldo/cms/src/Support/Option.php`
> **Namespace:** `SkillDo\Cms\Support\Option`
> **Alias ngắn:** `\Option`

`Option` là hệ thống lưu trữ **cấu hình toàn cục** của CMS, được lưu trong bảng `system` của database. Ngoài các cấu hình mặc định của CMS, bạn có thể thêm các tùy chọn riêng cho Plugin hoặc Theme.

> **Lưu ý kỹ thuật:** Dữ liệu Option được cache vào bộ nhớ `app('system')` sau lần đọc đầu tiên, nên không ảnh hưởng đến hiệu suất khi gọi nhiều lần.

---

### `Option::add()`
Thêm một option mới vào database. Nếu `$optionValue` là array hoặc object, sẽ được tự động serialize.

```php
Option::add(string $name, mixed $value): false|int
```

| Param   | Type   | Mô tả                                      | Bắt buộc |
|---------|--------|--------------------------------------------|----------|
| `$name` | string | Tên của option (phải là duy nhất trong DB) | ✅ |
| `$value` | mixed  | Giá trị của option                        | ✅ |

**Trả về:** `int` (ID bản ghi vừa thêm) hoặc `false` nếu thất bại.

```php
Option::add('my_plugin_api_key', 'sk-abc123xyz');
Option::add('my_plugin_settings', ['timeout' => 30, 'retries' => 3]);
```

---

### `Option::get()`
Truy xuất giá trị của option dựa trên tên. Nếu option không tồn tại, trả về `$default`.

```php
Option::get(string $name, mixed $default = null): mixed
```

| Param      | Type   | Mô tả                                | Bắt buộc |
|------------|--------|--------------------------------------|----------|
| `$name`    | string | Tên của option                       | ✅ |
| `$default` | mixed  | Giá trị mặc định nếu không tìm thấy | ❌ |

```php
$apiKey = Option::get('my_plugin_api_key');
// 'sk-abc123xyz'

$settings = Option::get('my_plugin_settings');
// ['timeout' => 30, 'retries' => 3]  (tự động unserialize)

// Với giá trị mặc định
$timeout = Option::get('my_plugin_timeout', 60);
// 60 (nếu option chưa được tạo)
```

---

### `Option::update()`
Cập nhật giá trị của một option. Nếu option **chưa tồn tại**, hàm sẽ tự động gọi `Option::add()` để thêm mới.

```php
Option::update(string $name, mixed $value): bool|int
```

| Param    | Type   | Mô tả                    | Bắt buộc |
|----------|--------|--------------------------|----------|
| `$name`  | string | Tên của option           | ✅ |
| `$value` | mixed  | Giá trị mới của option   | ✅ |

**Trả về:** `true` nếu cập nhật thành công, `int` (ID) nếu được thêm mới, `false` nếu thất bại.

```php
Option::update('my_plugin_api_key', 'sk-newkey456');

// Vừa update vừa add: an toàn gọi mọi lúc
Option::update('my_plugin_settings', ['timeout' => 60, 'retries' => 5]);
```

---

### `Option::delete()`
Xóa một option khỏi database và làm mới cache.

```php
Option::delete(string $name): bool
```

| Param   | Type   | Mô tả          | Bắt buộc |
|---------|--------|----------------|----------|
| `$name` | string | Tên của option | ✅ |

**Trả về:** `true` nếu xóa thành công, `false` nếu thất bại.

```php
Option::delete('my_plugin_api_key');
```

---

### `Option::all()`
Lấy toàn bộ cấu hình hệ thống dưới dạng object. Bao gồm cả cấu hình theme.

```php
Option::all(): object
```

```php
$config = Option::all();
echo $config->general_label;        // Tên website
echo $config->my_plugin_api_key;    // Option của plugin
```

---

### Ví Dụ Thực Tế Trong Plugin

```php
// Trong ActivatorService::up() của Plugin — khi kích hoạt
Option::add('my_plugin_smtp_host', 'smtp.gmail.com');
Option::add('my_plugin_smtp_port', 587);

// Trong trang cài đặt Plugin — khi admin lưu form
$smtpHost = request()->input('smtp_host');
Option::update('my_plugin_smtp_host', $smtpHost);

// Khi cần đọc cấu hình để dùng
$host = Option::get('my_plugin_smtp_host', 'smtp.gmail.com');
$port = Option::get('my_plugin_smtp_port', 587);

// Trong ActivatorService::down() — khi gỡ Plugin
Option::delete('my_plugin_smtp_host');
Option::delete('my_plugin_smtp_port');
```