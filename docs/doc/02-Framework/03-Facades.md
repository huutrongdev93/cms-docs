# Facades

Trong **SkillDo Framework**, ngoài việc sử dụng Dependency Injection qua hàm Constructor (tiêm phụ thuộc tự động) hoặc dùng method `app()`, bạn có thể lấy mọi đối tượng đã được "ràng buộc" trong Service Container ra một cách cực kỳ rảnh tay bằng **Facades**.

## 1. Facades Là Gì?

Phát âm giống từ "Pha-sát" (Fahsahd).
**Facade** là một class có vai trò như mặt nạ (proxy/mặt tiền) đứng trước các class (Service) nằm sâu bên trong Container. 

Nói cách khác: Thay vì bạn phải gọi phức tạp:
```php
$cacheManager = app('cache');
$cacheManager->get('key');
```

Bạn có thể gọi trực tiếp thông qua một phương thức static, tĩnh, gọn nhẹ:
```php
use SkillDo\Facades\Cache;

Cache::get('key');
```

Dù bạn đang "gọi tĩnh" hàm `get()`, thì đằng sau hậu trường, SkillDo đang tìm object `cache` thực sự đã Instantiate trong bộ nhớ và gọi động method `get()` trên chính nó.

**Ưu điểm của Facade:**
- Gọn gàng và cực kỳ dễ hiểu.
- Không phải viết hàm `__construct()` dài thườn thượt.
- Hỗ trợ đầy đủ IDE (Autocomplete).

---

## 2. Cách Facades Hoạt Động (Dưới góc độ lập trình viên)

Dưới đây ta sẽ mổ xẻ vào lõi Framework để xem Facade "làm ma thuật" như thế nào thông qua 1 ví dụ cụ thể của class `View`.

```php
// File: src/Facades/View.php
namespace SkillDo\Facades;

class View extends Facade
{
    /**
     * Tên string của object gốc lưu trong Service Container
     * 
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'view'; // Từ khóa gắn lúc register singleton
    }
}
```

Bởi vì nó kế thừa từ `SkillDo\Support\Facade`, nên khi bạn gọi `View::render()`, class `Facade` sẽ kiểm tra: 
1. `View` có hàm `render` static tĩnh trực tiếp không? -> Không có.
2. Tìm class string do `getFacadeAccessor()` trả lại là chữ `'view'`. 
3. Tìm trong hộp thần kỳ Service Container object có tên `'view'`. Trả về đối tượng *View Environment*.
4. Gửi method thực tế `->render()` gọi vào object đấy. 

---

## 3. Các Facades Sẵn Có Của SkillDo CMS v8

Framework lõi CMS v8 được xây dựng trên một loạt các Service Provider. Dưới đây là danh sách những **Facade phổ biến nhất** kèm Service thực sự chôn dưới Container:

| Facade Class | Tên Đăng Ký Trong Container | Service/Class Thực Tế Nằm Dưới | Chức năng (Ví dụ) |
|---|---|---|---|
| `SkillDo\Facades\App` | `'app'` | `SkillDo\Application` | `App::environment()` |
| `SkillDo\Facades\Cache` | `'cache'` | `SkillDo\Cache\CacheManager` | `Cache::put('key', 'val', 60)` |
| `SkillDo\Facades\Config` | `'config'` | `SkillDo\Config\Repository` | `Config::get('cms.admin_path')` |
| `SkillDo\Facades\Cookie` | `'cookie'` | `SkillDo\Cookie\CookieJar` | `Cookie::make('id', 1)` |
| `SkillDo\Facades\DB` | `'db'` | `SkillDo\Database\DatabaseManager` | `DB::table('users')->get()` |
| `SkillDo\Facades\Event` | `'event'` | `SkillDo\Events\Dispatcher` | `Event::dispatch('order.create')`|
| `SkillDo\Facades\Log` | `'log'` | `SkillDo\Log\Logger` | `Log::error('Có lỗi!')` |
| `SkillDo\Facades\Request` | `'request'` | `SkillDo\Http\Request` | `Request::input('name')` |
| `SkillDo\Facades\Response`| `'response'`| `SkillDo\Http\ResponseFactory`| `Response::json(['msg'=> 'ok'])` |
| `SkillDo\Facades\Route` | `'router'` | `SkillDo\Routing\Router` | `Route::get('/', 'Cb')` |
| `SkillDo\Facades\Session` | `'session'` | `SkillDo\Session\SessionManager`| `Session::set('user_id', 2)` |

---

## 4. Facades Hay Dependency Injection? 

SkillDo v8 không chỉ áp dụng Facade, mà cũng có Global Helpers. 

Bạn dùng `SkillDo\Facades\Cache::get('key')` hay tiêm phụ thuộc `CacheManager $manager` vào Constructor là HOÀN TOÀN GIỐNG NHAU. Object mà bạn lấy ra cuối cùng đều trỏ về một ô nhớ (singleton). 

Tùy theo sở thích:
1. Bạn thích class của mình rõ ràng, dễ viết Test Unit (Mock class) -> **Nên dùng Dependency Injection ở hàm Constructor**.
2. Bạn thích code ngắn gọn, nhanh, trong Controllers -> **Nên dùng Facades**.

*(Lưu ý: Không dùng Facade khi viết class lớn, logic sâu, vì nếu class phình to, nhìn vào Facade ẩn giấu ở giữa thân hàm sẽ làm bạn không biết class này đang load những thư viện gì).*

---

## 5. Tạo Facades Cho Riêng Bạn

Giả sử bạn có class `App\Services\SmsSender` mà bạn đã bind vào container với tên string `'SmsProvider'`.
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
