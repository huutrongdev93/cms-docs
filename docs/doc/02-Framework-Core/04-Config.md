# Config & Environment

SkillDo v8 sử dụng phương pháp quản lý Cấu Hình mạnh mẽ kế thừa từ kiến trúc của Laravel. Mọi thông tin nhạy cảm được quản lý bởi biến môi trường `.env`, trong khi cấu hình mảng sẽ nằm trong thư mục `/config/`.

---

## 1. Cấu hình Môi Trường (.env)

Hệ thống cung cấp file `.env` mặc định nằm ở thư mục root của dự án. 
Đây là nơi bạn khai báo các thông tin kết nối Cơ Sở Dữ Liệu, Cổng, Host, URL API, Secret Key API, và Debug Mode.

*Lưu ý: Không bao giờ được commit file `.env` lên Git vì lý do bảo mật.* 

### Các cấu hình `.env` mặc định quan trọng:

```env
APP_NAME="SkillDo CMS.v8"
APP_ENV=local           # Có 2 trạng thái: local (Nhà phát triển) và production (Môi trường thực)
APP_DEBUG=true          # Bật trang hiển thị lỗi màu đỏ. Tắt (false) trên production.
APP_URL=http://localhost:8000
S_PATH="/"              # Đường dẫn Sub-folder, mặc định luôn là / kể cả không dùng.

CACHE_DRIVER=file       # (file, array, database, memcached, redis)
SESSION_DRIVER=file     # (file, database, array)
QUEUE_CONNECTION=sync   # (sync, database, redis)

# Database MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=skilldocms_db
DB_USERNAME=root
DB_PASSWORD=

# Cache Driver Redis
REDIS_CLIENT=phpredis 
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# JSON Web Token (JWT API)
JWT_PUBLIC_KEY=
JWT_PRIVATE_KEY=
JWT_TTL=480            # Thời gian sống token bằng phút
```

### Cách lấy giá trị .env trong mã PHP

Sử dụng hàm toàn cục `env()` để rút trích cấu hình. Chú ý, bạn luôn CẦN có giá trị mặc định cho trường hợp file `.env` bị thiếu dòng đó.

```php
$appEnv = env('APP_ENV', 'production');
// Nó sẽ đọc dòng APP_ENV=local. Nếu không có dòng đó, trả về biến thứ 2 'production'
```

---

## 2. Quản Lý File Cấu Hình (/config/)

Nếu `.env` là nơi chứa những cái **String (Chuỗi)** không đổi, thì thư mục `config/` là nơi chứa các giá trị **Mảng (Array)** động cho CMS.

### Cấu trúc mảng cấu hình
Các file cấu hình trả về 1 array gốc nhiều cấp bậc.
Ví dụ file `config/cms.php`
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
use SkillDo\Facades\Config;

$themeName = Config::get('cms.theme.default');
```

### Đặt lại giá trị Cấu hình tạm thời lúc chạy (Runtime)

Bạn có thể chỉnh sửa đè (override) một cấu hình đang chạy ở giữa một Request (ví dụ bạn làm một Plugin đổi theme tự động vào ban đêm). Config update sẽ tồn tại tạm thời và DỪNG ngay khu Request kết thúc.

```php
// Khi gọi hàm config truyền vào một MẢNG thì sẽ biến thành set (đặt đè) giá trị
config(['cms.theme.default' => 'dark-theme-mode']);

// Khi lấy ra, bây giờ sẽ là dark-theme-mode
$currentTheme = config('cms.theme.default'); 
```

---

## 3. Caching File Cấu Hình (Tăng Tốc Sản Phẩm)

Thông thường, tại môi trường `APP_ENV=local`, cứ mỗi một request người dùng gõ enter, Framework sẽ duyệt lại mảng và file `.env` một lần để lấy toàn bộ Cấu hình (Rất chậm, tốn nhiều chu kỳ đọc đĩa FileSystem).

Tuy nhiên, SkillDo Framework sở hữu tính năng **Cache Cấu Hình Động**.
Khi bật `APP_DEBUG=false`, CMS sẽ gộp (merge) TOÀN BỘ file trong mục `/config/` và file `.env` lại thành MỘT file duy nhất dưới dạng mảng native PHP để nằm ở ổ ứng: 
`bootstrap/cache/config.php`

Khi có `bootstrap/cache/config.php`, hệ thống không còn mất thời gian IO đọc lẻ tẻ từng file một nữa. 🚀

Sau khi file này sinh ra, mọi thay đổi của bạn trong `.env` hay `config/cms.php` SẼ KHÔNG CÓ TÁC DỤNG nữa vì CMS đang đọc bản cache.
-> **Bạn phải xóa thủ công bằng giao diện Admin (Clear Cache) hoặc xóa file đó đi thì hệ thống thay đổi tự động tạo ra mảng Cache mới.**
