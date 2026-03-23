# Container & Dependency Injection

SkillDo Framework được xây dựng xoay quanh khái niệm **Service Container** (còn gọi là IoC Container - Inversion of Control Container). Nếu bạn đã quen với Laravel, thì khái niệm này hoàn toàn tương tự. 

Bài viết này sẽ giúp bạn hiểu sâu về cách hệ thống quản lý các object (đối tượng) và tiêm phụ thuộc (Dependency Injection - DI).

---

## 1. Service Container là gì?

Bạn có thể tưởng tượng Service Container giống như một **cái hộp thần kỳ** (IoC Box). Cái hộp này thay vì chứa đồ đạc, thì nó **chứa thông tin về cách tạo ra một đối tượng (object/class) nào đó**.

Mục tiêu chính của Service Container:
- **Khởi tạo và lưu trữ Object**: Giúp phần mềm tự động khởi tạo đối tượng khi có request gọi tới.
- **Tiêm phụ thuộc (Dependency Injection)**: Tự động "bơm" (inject) những object cần thiết vào bên trong Constructor hoặc method của một class.

**Tại sao ta cần nó?**
Tránh việc ở bất kì đâu ta cũng phải viết `new ClassName()`. Nếu `ClassName` mà có hàng tá tham số bên trong thì việc truyền tay là cực hình. Container sẽ lo hết.

---

## 2. Dependency Injection (Tiêm phụ thuộc)

**Tiêm phụ thuộc** là một quá trình tự động. Khi Framework khởi tạo một class (ví dụ một Controller), Container sẽ tự động quét hàm `__construct()` (Constructor) của class đó xem nó cần những class nào khác. 
Nếu có, nó sẽ tự lôi từ "cái hộp thần kỳ" ra đưa vào.

### Ví dụ về Dependency Injection tự động:

Giả sử bạn có class `ReportService` lo việc xử lý báo cáo, và nó có một phụ thuộc là `CacheManager`.

```php
namespace App\Services;

class CacheManager {
    public function get($key) {
        return "Cache data";
    }
}

class ReportService {
    protected $cache;

    // SkillDo Container sẽ tự động khởi tạo CacheManager và truyền ("tiêm") vào đây
    public function __construct(CacheManager $cacheManager) {
        $this->cache = $cacheManager;
    }

    public function generateReport() {
        return "Báo cáo với dữ liệu: " . $this->cache->get('data');
    }
}
```

Bây giờ bạn dùng nó ở một Controller:

```php
namespace App\Controllers\Admin;

use App\Services\ReportService;

class DashboardController {
    
    // SkillDo Container tự động nhìn thấy phụ thuộc `ReportService`.
    // Nếu chưa có, nó khởi tạo `ReportService` và tiêm vào.
    // Việc này "kích hoạt" tiêm `CacheManager` vào trong `ReportService` luôn. (Tiêm đệ quy)
    public function index(ReportService $reportManager) {
        $report = $reportManager->generateReport();
        return view('admin.dashboard', compact('report'));
    }
}
```

---

## 3. Cách tương tác với Container thủ công

Sẽ có lúc bạn không thể để hệ thống tự động tiêm, mà đôi khi bạn cần gọi class trực tiếp từ "cái hộp thần kỳ" (Container).

### Lấy ra một class (Resolution / Make)

Bạn có thể lấy ra class thông qua một helper tên là `app()` hoặc gọi từ chính instance Container.

```php
// Cách 1: Sử dụng helper
$reportService = app(ReportService::class);
// Hoặc
$reportService = app('App\Services\ReportService');

// Cách 2: Lấy thẳng từ container instance toàn cục
$reportService = SkillDo\Application::getInstance()->make(ReportService::class);
```

### Ràng buộc class vào Container (Binding)

Làm sao Container biết được cách khởi tạo một class phức tạp? Đôi khi chúng ta cần định nghĩa và đưa (bind) nó vào trong hộp thần kỳ bằng chứng. Việc này thường thực hiện trong các file **Service Providers**.

#### `bind()` (Khởi tạo lại mỗi lần gọi)

Sử dụng lúc nào đưa vào cái tên, hoặc interface, Container sẽ chạy callback và trả về một instance MỚI HOÀN TOÀN mỗi lần gọi.

```php
// Nằm ở phương thức register() của ServiceProvider
$this->app->bind('PaymentGateway', function ($app) {
    // Trả về class Payment xử lý
    return new StripePaymentGateway(config('stripe.secret'));
});

// Cách lấy ra
$payment1 = app('PaymentGateway'); // Trả về object StripePaymentGateway thứ 1
$payment2 = app('PaymentGateway'); // Trả về object StripePaymentGateway thứ 2
// $payment1 và $payment2 là 2 đối tượng KHÁC NHAU.
```

#### `singleton()` (Chỉ khởi tạo 1 lần duy nhất)

Singleton ràng buộc một class (hoặc closure) vào cái hộp thần kỳ. Lần đầu tiên gọi tới, nó sinh ra Class. Kể từ lần thứ 2 trở đi, **nó sẽ lấy đúng object cũ đã sinh ra ở lần 1** để trả về. Việc này giúp tiết kiệm bộ nhớ (rất cần cho kết nối Database, Cache...).

```php
$this->app->singleton('DatabaseConnection', function ($app) {
    return new MySQLConnection();
});

$db1 = app('DatabaseConnection');
$db2 = app('DatabaseConnection');
// $db1 và $db2 trỏ về CÙNG MỘT ĐỐI TƯỢNG trong bộ nhớ.
```

#### `instance()` (Đưa một đối tượng có sẵn vào)

Nếu ta đã dùng `new` trực tiếp để tạo đối tượng ở đâu đó, và muốn Container hiểu đối tượng này, ta dùng `instance()`.

```php
$mySetting = new Settings($data);

// Dạy Container ghi nhớ object $mySetting vào khóa "AppSetting"
$this->app->instance('AppSetting', $mySetting);
```

#### Ràng buộc Interface vào Implementation

Đây là một điểm sức mạnh cực lớn trong DI. Khi code ta gọi interface (`FileStorageInterface`), Container sẽ nhét một class thật (`LocalFileStorage`) vào vị trí Interface đó.

```php
// Ràng buộc 
$this->app->bind(
    App\Contracts\FileStorageInterface::class,
    App\Services\LocalFileStorage::class
);

class FileController {
    // Bất cứ lúc nào gõ Interface, skillDo sẽ đưa `LocalFileStorage` đến
    public function upload(FileStorageInterface $storage) {
        $storage->save();
    }
}
```

---

## TỔNG KẾT
- **Container** (hay Hộp thần kỳ) giúp quản lý mọi đối tượng trong ứng dụng.
- **Dependency Injection**: Tiêm phụ thuộc tự động vào hàm constructor. Cứ khai báo type-hint, Container sẽ cấp hàng.
- Nơi để viết các hàm khóa học (`bind`, `singleton`) cho Container là ở **Service Provider**. (Sẽ nói ngay bài sau).
