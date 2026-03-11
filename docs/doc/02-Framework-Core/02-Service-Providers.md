# Service Providers

Service Providers là trung tâm khởi động (bootstrapping) của toàn bộ hệ thống SkillDo CMS. Tất cả các dịch vụ cốt lõi, plugin, module giao diện (Theme) hay routing đều thông qua các Provider này để được nạp vào hệ thống.

Nếu bạn coi ứng dụng của mình như một chiếc xe, thì **Service Provider chính là nơi bạn lắp ráp động cơ, vô lăng, hộp số (dịch vụ, class)** vào khung xe (Service Container).

---

## 1. Vòng Đời Của Một Provider 

Bất kỳ **Service Provider** nào trong SkillDo CMS (thường đặt ở thư mục `app/Providers/` hoặc `packages/*/src/Providers/`) cũng đều kế thừa từ class abstract `SkillDo\Support\ServiceProvider`.

Quá trình "boot" (khởi động) ứng dụng luôn đi qua 2 phương thức của Provider theo thứ tự sau:

1. `register()`
2. `boot()`

### Phương thức `register()`

**Nhiệm vụ:** Đây là nơi DUY NHẤT để bạn "dạy" Service Container (cái hộp thần kỳ) cách khởi tạo các đối tượng.

**Quy tắc:** BẠN CHỈ NÊN đăng ký biến (`bind`, `singleton`) ở `register()`. **TUYỆT ĐỐI KHÔNG** đăng ký Event, định tuyến Route, gọi Database hay bất kỳ logic xử lý thực thi nào ở đây, vì ở bước này, có thể các Dịch vụ khác mà bạn đang muốn dùng chưa được gắn (bind) xong.

```php
namespace App\Providers;

use SkillDo\Support\ServiceProvider;
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

use SkillDo\Support\ServiceProvider;

class CustomServiceProvider extends ServiceProvider {

    // 2. Chạy bước Khởi Động sau khi MỌI người đã Register xong
    public function boot() {
         
         // An toàn để lấy bất kỳ cái gì ra khỏi Container
         $config = \SkillDo\Facades\Config::get('app.timezone');

         // Đăng ký Event
         \SkillDo\Facades\Event::listen('user.registered', function($user) {
              // ...
         });

         // Đăng ký thư mục Views
         $this->loadViewsFrom(__DIR__.'/../views', 'custom');

         // Register Hook CMS (WordPress style)
         add_action('admin_menu', [$this, 'addCustomMenu']);
    }
}
```

---

## 2. Khi Nào Nên Viết Service Provider?

Ví dụ bạn viết một package, hoặc đơn giản cấu trúc ứng dụng Admin của bạn có các thành phần sau cần "nạp" lên bộ nhớ lúc khởi động ứng dụng:

- Bạn có Custom Helper/Library mới.
- Khai báo file cài đặt Route bổ sung (vd `routes/ajax.php`).
- Móc nối (Hook) vào hệ thống Plugin/CMS bằng `add_action`, `add_filter`.
- Đăng ký hệ thống tệp Đa Ngôn Ngữ (Language files).
- Gắn View Namespace (Ví dụ `view('plugin-name::template')`).

Lúc này, một Provider là vị trí chuẩn xác nhất để làm.

---

## 3. Cách Đăng Ký Provider Vào Hệ Thống CMS

Một Service Provider được viết ra sẽ không có tác dụng nếu bạn chưa bảo Framework gọi nó chạy.
Trong SkillDo v8, danh sách các Provider cốt lõi nằm trong file cấu hình `config/app.php`.

```php
// config/app.php

return [
    /*
    |--------------------------------------------------------------------------
    | Autoloaded Service Providers
    |--------------------------------------------------------------------------
    */
    'providers' => [
        // Các Provider của Framework Core
        \SkillDo\Api\ApiServiceProvider::class,
        \SkillDo\Database\DatabaseServiceProvider::class,
        \SkillDo\Cache\CacheServiceProvider::class,

        // Các Provider của CMS
        \SkillDo\Cms\Providers\CmsServiceProvider::class,
        \SkillDo\Cms\Providers\PluginServiceProvider::class,
        \SkillDo\Cms\Providers\ThemeServiceProvider::class,

        // Application Providers Của Chính Bạn
        \App\Providers\AppServiceProvider::class,
        \App\Providers\EventServiceProvider::class,
        \App\Providers\RouteServiceProvider::class,
    ],
];
```

Hệ thống sẽ chạy qua 2 vòng lặp (Loop):
1. **Loop 1**: Chạy `register()` qua toàn bộ danh sách `providers`.
2. **Loop 2**: Chạy `boot()` qua toàn bộ danh sách `providers` để dựng lên hệ thống Web.

---

## 4. Deferred Providers (Tải Chậm)

Đôi khi, bạn tạo ra một Service mất rất nhiều thời gian xử lý, nhưng không phải mọi HTTP request đều xài nó (ví dụ thư viện xuất PDF). Nếu nạp trong `app.php` thì trang nào cũng mất thời gian load class này.

SkillDo hỗ trợ **Deferred Provider**. Thay vì nạp trong mọi request, hệ thống CHỈ NẠP Provider này KHI CÓ MỘT CLASS NÀO ĐÓ GỌI ĐẾN dịch vụ mà Provider này cung cấp.

Để thực hiện:
- Thêm cờ `protected $defer = true;`
- Cung cấp hàm `provides()` trả về mảng danh sách tên dịch vụ.

```php
namespace App\Providers;

use SkillDo\Support\ServiceProvider;

class PdfReportServiceProvider extends ServiceProvider {

    // 1. Chỉ định đây là Deferred Provider
    protected $defer = true;

    // 2. Đăng ký như bình thường
    public function register() {
         $this->app->singleton('PdfGenerator', function ($app) {
             return new HeavyPdfLibrary();
         });
    }

    // 3. Cho Framework biết "Khi nào ai đó đòi biến 'PdfGenerator', hãy nạp tôi!"
    public function provides() {
         return ['PdfGenerator'];
    }
}
```

## TỔNG KẾT
- Muốn đăng ký hay nạp cái gì đó vào CMS lúc khởi chạy, thì luôn nhét vào một `ServiceProvider`.
- Bước `register()` chỉ dùng để `bind/singleton` vào Container. Không dùng class ở đây.
- Bước `boot()` là nơi lắp ráp mã logic (Event, Hook, View, Route) vì cấu hình Container của mọi Provider khác đã hoàn thiện.
