# Macro và Mixin

Trong SkillDo CMS (tương tự như Laravel Framework), **Macro** và **Mixin** là những công cụ vô cùng mạnh mẽ cho phép bạn có thể tự động "nhúng" thêm các phương thức (method) mới vào một Class Core có sẵn của hệ thống mà không hề yêu cầu bạn phải sửa đổi trực tiếp mã nguồn gốc của Class đó. 

Tính năng này được hỗ trợ bởi Trait `Illuminate\Support\Traits\Macroable` và có mặt rải rác trên rất nhiều Class tiện ích toàn cục (Ví dụ: `Arr`, `Str`, `Admin`, `Auth`, `Theme`, `Url`,...).

---

## 1. Macro (Thêm Từng Phương Thức)

Macro là một cách để định nghĩa và chèn thêm **một function riêng lẻ** vào một lớp có sử dụng Macroable. Thông thường bạn sẽ đăng ký Macro ở bên trong hàm `boot()` của một Service Provider.

### Định nghĩa một Macro

Đề khởi tạo phương thức bằng Macro, bạn gọi phương thức tĩnh `macro` truyền vào 2 tham số: Tên phương thức mong muốn và một Closure (hàm ẩn danh) thực thi logic.

**Ví dụ:** Tiêm thêm method `toUpper()` vào mảng helper Core `Arr`:

```php
namespace MyPlugin\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Arr;

class MyPluginServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Khai báo tiêm method toUpper vào Str/Arr
        Arr::macro('toUpper', function ($array) {
            return array_map(function ($value) {
                return is_string($value) ? strtoupper($value) : $value;
            }, $array);
        });
    }
}
```

### Cách Sử Dụng Macro

Sau khi đã đăng ký xong ở Service Provider, hệ thống sẽ tự động liên kết (bind) phương thức này vào Class `Arr`. Trong code toàn dự án, bạn có thể gọi thẳng Macro mới tạo y như thể nó là hàm mặc định của Frameowrk:

```php
use Illuminate\Support\Arr;

$array = ['first', 'second', 'third'];

// Phương thức toUpper() không có trong code gốc, nhưng giờ nó hoạt động!
$upper = Arr::toUpper($array); 

// Kết quả Output: ['FIRST', 'SECOND', 'THIRD']
```

---

## 2. Mixin (Thêm Hàng Loạt Phương Thức)

Nếu Macro chỉ đóng vai trò chèn 1 hàm ẩn danh, thì **Mixin** là một kỹ thuật bao bọc cho phép bạn viết **toàn bộ nhiều phương thức** thành một Class độc lập, sau đó gộp tất cả Method trong nó nhồi nhét chung vào một Class gốc. Điều này giúp mã của bạn sạch sẽ và chia sẻ tài nguyên linh hoạt hơn nhiều.

### Định Nghĩa Class Dành Cho Mixin

Tạo ra một Class độc lập chỉ chứa các function trả về các `Closure` ẩn danh. (Bắt buộc phải return Callback chứa Logic thao tác).

```php
namespace MyPlugin\Supports;

class StringHelpers 
{
    // Phương thức sẽ đẻ ra Str::toSnake()
    public function toSnake() {
        return function ($value) {
            return strtolower(preg_replace('/\s+/', '_', $value));
        };
    }

    // Phương thức sẽ đẻ ra Str::toKebab()
    public function toKebab() {
        return function ($value) {
            return strtolower(preg_replace('/\s+/', '-', $value));
        };
    }
}
```

### Gắn Trộn Class Bằng Mixin

Sau đó, ở trong Service Provider, bạn chỉ cần dùng lệnh `mixin()` để truyền Object khởi tạo của lớp Helper vào.

```php
namespace MyPlugin\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use MyPlugin\Supports\StringHelpers;

class MyPluginServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Áp dụng gộp toàn bộ các Helper bên ngoài vào Class tĩnh Str
        Str::mixin(new StringHelpers());
    }
}
```

### Cách Sử Dụng Mixin

Toàn bộ các methods ở class Mixin giờ đã hòa nhập làm 1 với class Gốc:

```php
use Illuminate\Support\Str;

echo Str::toSnake('Hello World'); // Kết Quả: "hello_world"
echo Str::toKebab('Hello World'); // Kết Quả: "hello-world"
```

---

## Danh Sách Các Class Hỗ Trợ Macroable

SkillDo CMS v8 tích hợp Trait Macroable tự động trên mạng lưới rộng lớn các Facades và Services lõi, nổi bật gồm:

- `\Illuminate\Support\Str` (Xử lý chữ)
- `\Illuminate\Support\Arr` (Xử lý mảng Array)
- `\SkillDo\Cms\Support\Admin` (Hỗ trợ Helper Admin)
- `\SkillDo\Support\Auth` (Xác thực đăng nhập cấp lõi)
- `\SkillDo\Cms\Support\Cms` (Hệ sinh thái Controller Cấp Lõi)
- `\SkillDo\Cms\Support\Device` (Hỗ trợ cấu hình thiết bị)
- `\SkillDo\Cms\Support\Language` (Đa ngôn ngữ)
- `\SkillDo\Support\Path` (Quản lý Đường dẫn Cứng)
- `\SkillDo\Cms\Support\Theme` (Hỗ trợ Frontend Theme)
- `\SkillDo\Cms\Support\Url` (Hệ URL URL Routing Cấp Lõi)
- Các công cụ Core Helper như `FileHandler`, `Utils`...

> *Khuyến nghị:* Hãy gom toàn bộ các file Class độc lập dùng để hỗ trợ Mixin dồn vào một thư mục như `app/Macro/` hoặc `app/Supports/` ở bên trong module/plugin để có tính tổ chức tốt nhất.
