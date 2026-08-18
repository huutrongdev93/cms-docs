# Config & Environment

SkillDo v8 sử dụng phương pháp quản lý Cấu Hình mạnh mẽ kế thừa từ kiến trúc của Laravel. Mọi thông tin nhạy cảm được quản lý bởi biến môi trường `.env`, trong khi cấu hình mảng sẽ nằm trong thư mục `/config/`.

---

## 1. Cấu hình Môi Trường (.env)

Hệ thống cung cấp file `.env` mặc định nằm ở thư mục root của dự án. 
Đây là nơi bạn khai báo các thông tin kết nối Cơ Sở Dữ Liệu, Cổng, Host, URL API, Secret Key API, và Debug Mode.

*Lưu ý: Không bao giờ được commit file `.env` lên Git vì lý do bảo mật.* 

### Các cấu hình `.env` mặc định quan trọng:

```env
APP_ENV=local           # local (Nhà phát triển) hoặc production (Môi trường thực)
APP_DEBUG=true          # Bật trang lỗi Ignition. Tắt (false) trên production.
S_PATH="/"              # Đường dẫn Sub-folder, mặc định luôn là / kể cả không dùng.

CACHE_DRIVER=file       # (file, redis, memcached) — xem config cache.php

# Database MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=skilldocms_db
DB_USERNAME=root
DB_PASSWORD=
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
DB_PREFIX=cle_          # Tiền tố tên bảng

# Cache Driver Redis (chỉ cần khi CACHE_DRIVER=redis)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Bảo mật
CSRF_SECRET_KEY=        # Khóa ký CSRF token
CSRF_STATELESS_TOKEN=   # Bật/tắt CSRF token dạng stateless
COOKIE_SIGNING_KEY=     # Khóa ký cookie
SESSION_COOKIE_SAMESITE=Lax

# JSON Web Token (JWT API)
JWT_PUBLIC_KEY=
JWT_PRIVATE_KEY=
JWT_TTL=480             # Thời gian sống access token (phút), mặc định 8 giờ
JWT_REFRESH_TTL=20160   # Thời gian sống refresh token (phút), mặc định 2 tuần
```

> Lưu ý: SkillDo v8 **không có** hệ thống Queue (`QUEUE_CONNECTION`) và session không cấu hình qua `SESSION_DRIVER` (session dùng Symfony NativeSessionStorage, lưu file PHP native).

### Cách lấy giá trị .env trong mã PHP

Sử dụng hàm toàn cục `env()` để rút trích cấu hình. Chú ý, bạn luôn CẦN có giá trị mặc định cho trường hợp file `.env` bị thiếu dòng đó.

```php
$appEnv = env('APP_ENV', 'production');
// Nó sẽ đọc dòng APP_ENV=local. Nếu không có dòng đó, trả về biến thứ 2 'production'
```

> Mẹo: nếu tồn tại file `.env.{APP_ENV}` (ví dụ `.env.production`), bootstrapper `LoadEnvironmentVariables` sẽ tự động nạp file đó thay cho `.env`.

---

## 2. Quản Lý File Cấu Hình (/config/)

Nếu `.env` là nơi chứa những cái **String (Chuỗi)** không đổi, thì các file config là nơi chứa các giá trị **Mảng (Array)** động cho CMS.

### Mô hình merge 3 tầng

Khác với Laravel, SkillDo v8 nạp config từ **3 thư mục** và deep-merge lại với nhau (logic trong `SkillDo\Bootstrap\LoadConfiguration`), theo thứ tự ưu tiên **tăng dần**:

1. `packages/skilldo/framework/src/config/` — defaults của framework (`app`, `cache`, `cors`, `csrf`, `database`, `filesystems`, `request-sanitizer`, `security-headers`)
2. `packages/skilldo/cms/src/config/` — defaults của cms (`cms`, `csrf`, `language`, `media`, `security-headers`)
3. `config/` ở root dự án — tầng **OVERRIDE** của ứng dụng (hiện đang rỗng)

Khi key trùng nhau: app thắng cms, cms thắng framework. Với mảng associative thì merge đệ quy từng key; với mảng indexed (list) thì phần tử mới được **nối thêm** nếu chưa tồn tại — vì vậy thêm `config/app.php` với key `providers` sẽ append provider của bạn vào danh sách mặc định chứ không thay thế.

> Muốn đổi một giá trị mặc định: tìm file gốc trong 2 package để biết cấu trúc, rồi tạo file **cùng tên** trong `config/` ở root chỉ chứa các key cần đè.

### Cấu trúc mảng cấu hình
Các file cấu hình trả về 1 array gốc nhiều cấp bậc.
Ví dụ file `packages/skilldo/cms/src/config/cms.php` (trích):
```php
return [
    'admin' => [
        'prefix' => 'admin',     // Tiền tố URL vào quản trị (ví dụ /admin/)
    ],
    'plugins' => [
        'folder' => 'plugins'    // Thư mục mã nguồn chứa bộ Plugin
    ],
    'theme' => [
        'default' => 'theme-store',   // Khai báo theme core
        'child'   => 'theme-child'    // Khai báo theme ghi đè
    ],
];
```

### Lấy thông tin từ file Config

Để gọi bất kì thông tin cấu hình nào, ta sử dụng Facade `Config` hoặc helper `config()` được tiêm toàn cục.
*Cú pháp là: `TÊN FOLDER` CHẤM (`.`) `TÊN KEY`*

```php
// Gọi thông qua Helper
$adminPath = config('cms.admin.prefix'); 
// Kết quả: string "admin"

// Truyền vào 1 tham số phụ làm mặc định (fallback array) nếu 'not_exist_key' chưa được khai báo
$cache = config('cms.not_exist_key', 'mặc-định-ở-đây');

// Gọi thông qua Facade
use SkillDo\Support\Facades\Config;

$themeName = Config::get('cms.theme.default');
```

### Đặt lại giá trị Cấu hình tạm thời lúc chạy (Runtime)

Bạn có thể chỉnh sửa đè (override) một cấu hình đang chạy ở giữa một Request (ví dụ bạn làm một Plugin đổi theme tự động vào ban đêm). Config update sẽ tồn tại tạm thời và DỪNG ngay khi Request kết thúc.

Lưu ý: khác Laravel, helper `config()` của SkillDo **không** nhận mảng để set. Gọi `config()` không tham số sẽ trả về repository, từ đó gọi `->set()`:

```php
// Cách 1: qua helper (config() không tham số = Illuminate\Config\Repository)
config()->set('cms.theme.default', 'dark-theme-mode');

// Cách 2: qua Facade
\SkillDo\Support\Facades\Config::set('cms.theme.default', 'dark-theme-mode');

// Khi lấy ra, bây giờ sẽ là dark-theme-mode
$currentTheme = config('cms.theme.default');
```

---

## 3. Caching File Cấu Hình (Tăng Tốc Sản Phẩm)

Thông thường (khi chưa có cache), cứ mỗi một request, Framework sẽ duyệt lại file `.env` và toàn bộ file config của cả 3 tầng một lần để merge ra Cấu hình (tốn nhiều chu kỳ đọc đĩa FileSystem).

Tuy nhiên, SkillDo Framework sở hữu tính năng **Cache Cấu Hình Động**.
Khi `APP_DEBUG=false`, ở cuối quá trình boot (`Application::boot()`), CMS sẽ ghi TOÀN BỘ config đã merge (bao gồm cả giá trị đã đọc từ `.env`) thành MỘT file duy nhất dưới dạng mảng native PHP:
`bootstrap/cache/config.php`

Khi có `bootstrap/cache/config.php`:
- `LoadConfiguration` nạp thẳng file cache, bỏ qua việc merge 3 tầng. 🚀
- `LoadEnvironmentVariables` cũng **bỏ qua luôn việc đọc `.env`**.

Vì vậy, mọi thay đổi của bạn trong `.env` hay các file config SẼ KHÔNG CÓ TÁC DỤNG nữa khi cache còn tồn tại.
-> **Bạn phải xóa cache bằng giao diện Admin (Clear Cache) hoặc xóa file `bootstrap/cache/config.php` đi — request kế tiếp hệ thống sẽ merge lại và tự sinh file cache mới.**
