# Facades

Trong **SkillDo Framework**, ngoài việc sử dụng Dependency Injection qua hàm Constructor (tiêm phụ thuộc tự động) hoặc dùng method `app()`, bạn có thể lấy mọi đối tượng đã được "ràng buộc" trong Service Container ra một cách cực kỳ rảnh tay bằng **Facades**.

## 1. Facades Là Gì?

Phát âm giống từ "Pha-sát" (Fahsahd).
**Facade** là một class có vai trò như mặt nạ (proxy/mặt tiền) đứng trước các class (Service) nằm sâu bên trong Container. 

Nói cách khác: Thay vì bạn phải gọi phức tạp:
```php
$config = app('config');
$config->get('cms.admin.prefix');
```

Bạn có thể gọi trực tiếp thông qua một phương thức static, tĩnh, gọn nhẹ:
```php
use SkillDo\Support\Facades\Config;

Config::get('cms.admin.prefix');
```

Dù bạn đang "gọi tĩnh" hàm `get()`, thì đằng sau hậu trường, SkillDo đang tìm object `config` thực sự đã Instantiate trong bộ nhớ và gọi động method `get()` trên chính nó.

**Ưu điểm của Facade:**
- Gọn gàng và cực kỳ dễ hiểu.
- Không phải viết hàm `__construct()` dài thườn thượt.
- Hỗ trợ đầy đủ IDE (Autocomplete).

---

## 2. Cách Facades Hoạt Động (Dưới góc độ lập trình viên)

Dưới đây ta sẽ mổ xẻ vào lõi Framework để xem Facade "làm ma thuật" như thế nào thông qua 1 ví dụ cụ thể của class `Route`.

```php
// File: packages/skilldo/framework/src/Support/Facades/Route.php
namespace SkillDo\Support\Facades;

use SkillDo\Support\Facade;

class Route extends Facade
{
    /**
     * Tên string của object gốc lưu trong Service Container
     *
     * @return string
     */
    protected static function getFacadeAccessor(): string
    {
        return 'router'; // Từ khóa gắn lúc register singleton
    }
}
```

Bởi vì nó kế thừa từ `SkillDo\Support\Facade`, nên khi bạn gọi `Route::get(...)`, PHP không tìm thấy method static `get()` nên rơi vào magic method `__callStatic` của class `Facade`:

```php
// SkillDo\Support\Facade
public static function __callStatic($method, $parameters)
{
    return app()->make(static::getFacadeAccessor())->$method(...$parameters);
}
```

Tức là:
1. Gọi `getFacadeAccessor()` lấy về chữ `'router'`.
2. Tìm trong hộp thần kỳ Service Container object có tên `'router'` → đối tượng `SkillDo\Routing\Router`.
3. Gửi method thực tế `->get(...)` gọi vào object đấy.

*(Base class còn có cả `__call` nên dù bạn lỡ gọi trên instance thay vì static, kết quả vẫn vậy. Lưu ý: `getFacadeAccessor()` mặc định ném Exception — facade con BẮT BUỘC override nó.)*

---

## 3. Các Facades Sẵn Có Của SkillDo CMS v8

Framework chỉ có **4 facade container thực thụ**, đều nằm trong namespace `SkillDo\Support\Facades`:

| Facade Class | Accessor Trong Container | Service/Class Thực Tế Nằm Dưới | Chức năng (Ví dụ) |
|---|---|---|---|
| `SkillDo\Support\Facades\Config` | `'config'` | `Illuminate\Config\Repository` | `Config::get('cms.admin.prefix')` |
| `SkillDo\Support\Facades\Route` | `'router'` | `SkillDo\Routing\Router` | `Route::get('/', Cb::class)` |
| `SkillDo\Support\Facades\File` | `'file'` | `SkillDo\Support\File` (extends `Illuminate\Filesystem\Filesystem`) | `File::exists($path)` |
| `SkillDo\Support\Facades\Schedule` | `Illuminate\Console\Scheduling\Schedule::class` | `Illuminate\Console\Scheduling\Schedule` | `Schedule::call(fn() => ...)` |

### Global aliases (AliasLoader)

Phần lớn các "facade" còn lại mà bạn thấy trong code (`\Cache`, `\DB`, `\Log`, `\Str`...) thực chất là **class alias toàn cục** do bootstrapper `RegisterFacades` đăng ký qua `SkillDo\AliasLoader` (một autoloader `class_alias`), danh sách lấy từ `config('app.aliases')` = `Facade::defaultAliases()`:

| Alias | Class thực tế | Ghi chú |
|---|---|---|
| `Arr`, `Str` | `Illuminate\Support\Arr` / `Str` | Helper Illuminate (Macroable) |
| `Auth` | `SkillDo\Support\Auth` | Class static |
| `Cache` | `SkillDo\Cache\Cache` | Class static + Macroable |
| `Config` | `SkillDo\Support\Facades\Config` | Facade container |
| `DB` | `SkillDo\Database\DB` | Class static (transaction, statement...) |
| `Eloquent` | `SkillDo\Database\Eloquent\Model` | Base model |
| `File` | `SkillDo\Support\File` | extends Illuminate Filesystem |
| `Http` | `SkillDo\Http\Http` | HTTP client |
| `Log` | `SkillDo\Log\Log` | Class static (`Log::error(...)`) |
| `Mail` | `SkillDo\Support\Mail` | Gửi mail |
| `Route` | `SkillDo\Support\Facades\Route` | Facade container |
| `Request` / `Response` | `SkillDo\Http\Request` / `Response` | extends Illuminate Http |
| `Schedule` | `SkillDo\Support\Facades\Schedule` | Facade container |
| `Storage` | `Illuminate\Support\Facades\Storage` | Facade Illuminate (Flysystem) |
| `Path` | `SkillDo\Support\Path` | Đường dẫn hệ thống (Macroable) |
| `View` | `SkillDo\View\View` | Wrapper render view |
| `SKD_Error` | `SkillDo\Support\SKD_Error` | Đối tượng lỗi SkillDo |

`RegisterFacades` cũng gọi `Illuminate\Support\Facades\Facade::setFacadeApplication($app)` để các facade gốc của Illuminate (như `Storage`) hoạt động được trên Container của SkillDo, đồng thời đăng ký singleton `'cache'`.

Lớp CMS bổ sung thêm hàng loạt alias riêng trong `CmsServiceProvider::aliases()`: `Cms`, `Admin`, `AdminMenu`, `Theme`, `ThemeOption`, `Ajax`, `Url`, `Option`, `Template`, `Plugin`, `Language`, `Role`, `UserRole`, `ThemeMenu`, `Sidebar`, `Device`, `Taxonomy`, `Metabox`, `Image`, `SKDService`, `AssetPosition`, cùng các alias model (`Gallery`, `GalleryItem`, `SkillDo\Model\Post`, `SkillDo\Model\Tag`, `SkillDo\Model\User`...).

> **Cẩn thận với 2 alias gốc dễ nhầm:** `\Language` trỏ vào `SkillDo\Cms\Support\Language` và `\ThemeMenu` trỏ vào `SkillDo\Cms\Menu\ThemeMenu` — đó là **class hỗ trợ**, không phải Model cùng tên. Model phải gọi bằng `SkillDo\Model\*` hoặc `SkillDo\Cms\Models\*`. Xem [Model Mặc Định](../05-Database/04-DefaultModels.md).

---

## 4. Facades Hay Dependency Injection? 

SkillDo v8 không chỉ áp dụng Facade, mà cũng có Global Helpers. 

Bạn dùng `SkillDo\Support\Facades\Config::get('key')` hay tiêm phụ thuộc `Illuminate\Config\Repository $config` vào Constructor là HOÀN TOÀN GIỐNG NHAU. Object mà bạn lấy ra cuối cùng đều trỏ về một ô nhớ (singleton). 

Tùy theo sở thích:
1. Bạn thích class của mình rõ ràng, dễ viết Test Unit (Mock class) -> **Nên dùng Dependency Injection ở hàm Constructor**.
2. Bạn thích code ngắn gọn, nhanh, trong Controllers -> **Nên dùng Facades**.

*(Lưu ý: Không dùng Facade khi viết class lớn, logic sâu, vì nếu class phình to, nhìn vào Facade ẩn giấu ở giữa thân hàm sẽ làm bạn không biết class này đang load những thư viện gì).*

---

## 5. Tạo Facades Cho Riêng Bạn

Giả sử bạn có class `App\Services\SmsSender` mà bạn sẽ bind vào container với tên string `'sms_provider'`.
Bây giờ làm sao gọi nhanh dạng `SmsGateway::send()`?

**Bước 1**: Đăng ký biến vào Container trong một Provider
```php
// File AppServiceProvider.php
public function register() {
    $this->app->singleton('sms_provider', function($app) {
        return new \App\Services\SmsSender();
    });
}
```

**Bước 2**: Tạo class Facade. Thay vì đặt bên Core, bạn tạo ở src của App:

```php
// File App/Facades/SmsGateway.php
namespace App\Facades;

use SkillDo\Support\Facade;

class SmsGateway extends Facade
{
    protected static function getFacadeAccessor()
    {
         // Gọi đúng cái chữ bạn đăng ký trong ServiceProvider
         return 'sms_provider'; 
    }
}
```

**Bước 3**: Thế là xong. Thay vì khởi tạo rườm rà, bạn có thể gọi thẳng tưng khắp mọi nơi:
```php
use App\Facades\SmsGateway;

SmsGateway::send('0912345678', 'Tin nhắn test');
```
