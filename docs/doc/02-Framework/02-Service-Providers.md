# Service Providers

Service Providers là trung tâm khởi động (bootstrapping) của toàn bộ hệ thống SkillDo CMS. Tất cả các dịch vụ cốt lõi, plugin, module giao diện (Theme) hay routing đều thông qua các Provider này để được nạp vào hệ thống.

Nếu bạn coi ứng dụng của mình như một chiếc xe, thì **Service Provider chính là nơi bạn lắp ráp động cơ, vô lăng, hộp số (dịch vụ, class)** vào khung xe (Service Container).

---

## 1. Vòng Đời Của Một Provider 

Bất kỳ **Service Provider** nào trong SkillDo CMS (dù nằm trong `app/`, trong plugin hay theme) cũng đều kế thừa từ class abstract `SkillDo\ServiceProvider`. Trong đó `register()` là phương thức **abstract bắt buộc** phải định nghĩa, còn `boot()` là tùy chọn (mặc định rỗng). Constructor của base class không nhận tham số — nó tự lấy `Container::getInstance()` gán vào `$this->app`.

Quá trình "boot" (khởi động) ứng dụng luôn đi qua 2 phương thức của Provider theo thứ tự sau:

1. `register()`
2. `boot()`

### Phương thức `register()`

**Nhiệm vụ:** Đây là nơi DUY NHẤT để bạn "dạy" Service Container (cái hộp thần kỳ) cách khởi tạo các đối tượng.

**Quy tắc:** BẠN CHỈ NÊN đăng ký biến (`bind`, `singleton`) ở `register()`. **TUYỆT ĐỐI KHÔNG** đăng ký Event, định tuyến Route, gọi Database hay bất kỳ logic xử lý thực thi nào ở đây, vì ở bước này, có thể các Dịch vụ khác mà bạn đang muốn dùng chưa được gắn (bind) xong.

```php
namespace App\Providers;

use SkillDo\ServiceProvider;
use App\Services\PaymentService;

class CustomServiceProvider extends ServiceProvider {

    // 1. Chạy bước Đăng Ký trước
    public function register() {
         // Hướng dẫn Container: Ai mà gọi `PaymentManager`, hãy trả cho họ hàm này
         $this->app->singleton('PaymentManager', function ($app) {
             return new PaymentService($app->make('config'));
         });
    }

}
```

### Phương thức `boot()`

**Nhiệm vụ:** Đây là nơi khởi chạy hệ thống, khi mà TẤT CẢ các Service Provider khác đã `register()` xong. LÚC NÀY, bạn được quyền lấy bất kỳ class/Service nào đã đăng ký trong Container ra dùng!

Tại đây bạn có thể cấu hình View, Event Listener, Hook, Middleware, Route, Publishes (Assets)...

```php
namespace App\Providers;

use SkillDo\ServiceProvider;

class CustomServiceProvider extends ServiceProvider {

    // 2. Chạy bước Khởi Động sau khi MỌI người đã Register xong
    public function boot() {
         
         // An toàn để lấy bất kỳ cái gì ra khỏi Container
         $timezone = \SkillDo\Support\Facades\Config::get('app.timezone');
         // hoặc dùng helper: config('app.timezone')

         // Đăng ký thư mục Views với namespace riêng → view('custom::ten-view')
         $this->loadViewsFrom(__DIR__.'/../views', 'custom');

         // Đăng ký file ngôn ngữ với namespace riêng → trans('custom::messages.x')
         $this->loadTranslationsFrom(__DIR__.'/../language', 'custom');

         // Register Hook CMS (WordPress style)
         add_action('admin_menu', [$this, 'addCustomMenu']);
    }
}
```

Ngoài 2 phương thức trên, base class `SkillDo\ServiceProvider` còn cung cấp sẵn các helper `protected`:

| Method | Công dụng |
|---|---|
| `loadViewsFrom($path, $namespace)` | Đăng ký namespace view (`view('namespace::ten-view')`) |
| `loadTranslationsFrom($path, $namespace)` | Đăng ký namespace ngôn ngữ (`trans('namespace::file.key')`) |
| `mergeConfig($path, $key, $insert = false)` | Merge một thư mục/file config vào key config đang có |
| `callAfterResolving($name, $callback)` | Chạy callback khi service `$name` được resolve (hoặc ngay lập tức nếu đã resolve) |

---

## 2. Khi Nào Nên Viết Service Provider?

Ví dụ bạn viết một package, hoặc đơn giản cấu trúc ứng dụng Admin của bạn có các thành phần sau cần "nạp" lên bộ nhớ lúc khởi động ứng dụng:

- Bạn có Custom Helper/Library mới.
- Khai báo file cài đặt Route bổ sung (chỉ 3 tên file được nạp tự động: `routes/admin.php`, `routes/web.php`, `routes/api.php` — file khác phải tự `require` trong Provider).
- Móc nối (Hook) vào hệ thống Plugin/CMS bằng `add_action`, `add_filter`.
- Đăng ký hệ thống tệp Đa Ngôn Ngữ (Language files).
- Gắn View Namespace (Ví dụ `view('plugin-name::template')`).

Lúc này, một Provider là vị trí chuẩn xác nhất để làm.

---

## 3. Cách Đăng Ký Provider Vào Hệ Thống CMS

Một Service Provider được viết ra sẽ không có tác dụng nếu bạn chưa bảo Framework gọi nó chạy. Trong SkillDo v8 có **4 con đường** để một Provider được nạp:

**1. Danh sách mặc định của Framework** (bootstrapper `SkillDo\Bootstrap\RegisterProviders`) — 6 provider nền luôn được merge vào **đầu** danh sách `app.providers`:

```php
\SkillDo\Session\SessionServiceProvider::class,
\SkillDo\Filesystem\FileSystemServiceProvider::class,
\SkillDo\Log\LogServiceProvider::class,
\SkillDo\Database\DatabaseServiceProvider::class,
\SkillDo\View\ViewServiceProvider::class,
\SkillDo\Translation\TranslationServiceProvider::class,
```

**2. Config `app.providers`** — mặc định khai báo trong `packages/skilldo/framework/src/config/app.php`, chỉ gồm 2 provider:

```php
// packages/skilldo/framework/src/config/app.php
'providers' => [
    \SkillDo\Api\ApiServiceProvider::class,
    \SkillDo\Cms\Providers\CmsServiceProvider::class,
],
```

Muốn thêm Provider của riêng bạn ở tầng ứng dụng: tạo file `config/app.php` ở root với key `providers` — cơ chế deep-merge config sẽ **nối thêm** (append) các provider của bạn vào danh sách mặc định (xem bài Config).

**3. Đăng ký lồng trong một Provider khác** — gọi `$this->app->register(XServiceProvider::class)` ngay trong `register()`. Đây chính là cách `CmsServiceProvider` nạp loạt provider con của CMS (Hook, System, Plugin, Language, Taxonomy, Template, Ajax, Agent, Role, CmsRoute).

**4. Manifest của Plugin/Theme** — khai báo trong key `providers` của `plugin.json` / `theme.json`. `SkillDo\Cms\Loader` (chạy ở callback `booted()` của Application) sẽ gọi `app()->register($provider)` cho từng provider. Vì lúc này ứng dụng **đã boot xong**, `register()` và `boot()` của các provider này được chạy ngay lập tức nối tiếp nhau.

Với danh sách `app.providers`, hệ thống sẽ chạy qua 2 vòng lặp (Loop):
1. **Loop 1** (bootstrapper `RegisterProviders`): Chạy `register()` qua toàn bộ danh sách `providers`.
2. **Loop 2** (bootstrapper `BootProviders` → `Application::boot()`): Chạy `boot()` qua toàn bộ danh sách `providers` để dựng lên hệ thống Web.

> Lưu ý: `Application::register()` chống đăng ký trùng — nếu provider đã được register trước đó thì trả về instance cũ (trừ khi truyền `$force = true`).

---

## 4. Khai Báo Nhanh Bằng Thuộc Tính `$bindings` / `$singletons`

SkillDo **không hỗ trợ Deferred Provider** (cờ `$defer` / hàm `provides()` kiểu Laravel) — mọi provider trong danh sách đều được `register()` ngay trong mỗi request.

Thay vào đó, `Application::register()` hỗ trợ một tiện ích: nếu Provider khai báo thuộc tính `public $bindings` hoặc `public $singletons`, các cặp key → class trong đó sẽ được tự động `bind()` / `singleton()` vào Container mà không cần viết code trong `register()`:

```php
namespace App\Providers;

use SkillDo\ServiceProvider;

class PdfReportServiceProvider extends ServiceProvider {

    // Mỗi cặp interface => implementation sẽ được bind() tự động
    public $bindings = [
        \App\Contracts\PdfGeneratorInterface::class => \App\Services\PdfGenerator::class,
    ];

    // Mỗi entry sẽ được singleton() tự động
    // (nếu không có key, chính tên class được dùng làm key)
    public $singletons = [
        'PdfGenerator' => \App\Services\PdfGenerator::class,
        \App\Services\ReportBuilder::class,
    ];

    public function register() {
        // vẫn bắt buộc định nghĩa (có thể để rỗng)
    }
}
```

## TỔNG KẾT
- Muốn đăng ký hay nạp cái gì đó vào CMS lúc khởi chạy, thì luôn nhét vào một `ServiceProvider`.
- Bước `register()` chỉ dùng để `bind/singleton` vào Container. Không dùng class ở đây.
- Bước `boot()` là nơi lắp ráp mã logic (Event, Hook, View, Route) vì cấu hình Container của mọi Provider khác đã hoàn thiện.
