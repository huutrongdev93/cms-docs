# Global Helpers

SkillDo CMS v8 cung cấp một loạt các hàm trợ giúp (helper functions) được khai báo ở phạm vi toàn cục (global scope). 
Bạn có thể gọi trực tiếp các hàm này ở **bất kỳ đâu** trong dự án của mình (Controllers, Views, Models, Plugins) mà không cần phải `use` hay khởi tạo class phức tạp. Các helper này kết nối thẳng vào những thành phần sâu nhất của Framework.

Tệp nguồn chứa khai báo gốc nằm ở: `packages/skilldo/framework/src/Support/common.php`

Dưới đây là danh sách và hướng dẫn sử dụng chi tiết các hàm Helper cốt lõi nhất.

---

## 1. Hệ Thống (Application & Config)

### `app()`
Lấy đối tượng trọng tâm Application Instance (Trung tâm quản lý toàn bộ vòng đời của Website/CMS), hoặc dùng để tự động phân giải (Resolve) một đối tượng Service/Class đã được đăng ký trong Container.

**Cú pháp:**
```php
app(string $entity = ''): mixed
```

**Ví dụ:**
```php
// Lấy đối tượng App gốc của toàn bộ SkillDo CMS
$app = app(); 

// Phân giải đối tượng hệ thống Router
$router = app('router'); 

// Phân giải tự động một Model hoặc Service Class của bạn
$authService = app(\SkillDo\Support\Auth::class);
```

### `config()`
Lấy giá trị của một biến cấu hình hệ thống từ các file nằm trong thư mục `config/`. Bạn sử dụng dấu phẩy (".") để truy cập vào mảng con sâu hơn bên trong file cấu hình.

**Cú pháp:**
```php
config(?string $key = null, $default = null): mixed
```

**Ví dụ:**
```php
// Ở file config/app.php, lấy mảng "timezone" -> Trả về: 'Asia/Ho_Chi_Minh'
$timezone = config('app.timezone');

// Nếu file config/cors.php chưa thiết lập khóa 'max_age', nó sẽ trả về 0
$corsAge = config('cors.max_age', 0);

// Nếu sử dụng Plugin, bạn gọi config tự động load:
$jwtKey = config('jwt.private_key');
```

### `env()`
Đọc giá trị môi trường tĩnh từ tập tin **`.env`** nằm ở thư mục gốc của dự án. Khác với `config()`, hàm này đọc thẳng trực tiếp text tĩnh mà không bị lưu Cache.

**Cú pháp:**
```php
env(string $key, $default = null): mixed
```

**Ví dụ:**
```php
// Bật hoặc tắt chế độ dò lỗi dựa theo .env
$debugMode = env('APP_DEBUG', false);

// Đọc tên Cơ sở dữ liệu đang kết nối, nếu không có trả về CSDL mặt định 'skilldo_db'
$dbHost = env('DB_HOST', 'skilldo_db');
```

---

## 2. HTTP & Định Tuyến (Routing)

### `route()`
Sinh ra liên kết URL hoàn chỉnh tương ứng với một Tên Route (Named Route) mà bạn đã đăng ký từ trong `routes/web.php` hoặc `routes/admin.php`. Sử dụng hàm này giúp Web của bạn không bao giờ bị "chết link cứng" dù có đổi tên miền.

**Cú pháp:**
```php
route(string $name, array $parameters = [], bool $absolute = false): string
```

**Ví dụ:**
```php
// 1. Tạo biến Route mà bạn đã đăng ký
$url = route('api.auth.login'); 
// Kết quả: "auth/login" (Path tương đối)

// 2. Route có tham số truyền vào
$url = route('api.users.show', ['id' => 5]);
// Kết quả trả về URL đúng yêu cầu: "v1/users/5"

// 3. Render Link có đính kèm chứa Domain tuyệt đối
$url = route('dashboard', [], true);
// Kết quả: "https://domain-cua-ban.com/dashboard"
```

---

## 3. Xử Lý Ngày Tháng (Date & Time)

### `now()`
Trả về một Object thời gian bằng thư viện **Carbon** lấy đúng thời gian hiện tại của máy chủ với Múi giờ (`TIMEZONE`) do SkillDo thiết lập. Bạn dùng nó thay cho hàm `date()` của PHP.

**Cú pháp:**
```php
now(): Illuminate\Support\Carbon
```

**Ví dụ:**
```php
// Truy xuất thời gian hiện hành lập tức
$now = now(); // Khớp múi giờ 'Asia/Ho_Chi_Minh'

// Các phương thức hữu ích của Carbon (Cộng trừ, in ra String)
$tomorrow  = now()->addDay();
$nextWeek  = now()->addWeeks(1);
$lastMonth = now()->subMonth();

// Định dạng thành chữ chuỗi để đưa vào Database
$formatted = now()->format('Y-m-d H:i:s');

now()->second; //giây
now()->minute; //phút
now()->hour; //giờ
now()->day; //ngày
now()->month; //tháng
now()->year; //năm
now()->dayOfWeek; //ngày của tuần
now()->dayOfYear; //ngày của năm
now()->weekOfMonth; //ngày của tháng
now()->weekOfYear; //tuần của năm
now()->daysInMonth; //số ngày trong tháng
```

#### Second
```php
//Cộng thêm 1 giây vào thời gian hiện tại
echo now()->addSecond()->format('d/m/Y H:i:s');
echo now()->addSecond()->getTimestamp();
//Cộng thêm số giây cụ thể vào thời gian hiện tại
echo now()->addSeconds(10)->format('d/m/Y H:i:s');

//Trừ đi 1 giây vào thời gian hiện tại
echo now()->subSecond()->format('d/m/Y H:i:s');
//Trừ đi số giây cụ thể vào thời gian hiện tại
echo now()->subSeconds(10)->format('d/m/Y H:i:s');
```

#### Minute

```php
//Cộng thêm 1 phút vào thời gian hiện tại
echo now()->addMinute()->format('d/m/Y H:i:s');
echo now()->addMinute()->getTimestamp();
//Cộng thêm số phút cụ thể vào thời gian hiện tại
echo now()->addMinutes(10)->format('d/m/Y H:i:s');

//Trừ đi 1 phút vào thời gian hiện tại
echo now()->subMinute()->format('d/m/Y H:i:s');
//Trừ đi số phút cụ thể vào thời gian hiện tại
echo now()->subMinutes(10)->format('d/m/Y H:i:s');
```

#### Hour

```php
//Cộng thêm 1 giờ vào thời gian hiện tại
echo now()->addHour()->format('d/m/Y H:i:s');
echo now()->addHour()->getTimestamp();
//Cộng thêm số giờ cụ thể vào thời gian hiện tại
echo now()->addHours(10)->format('d/m/Y H:i:s');

//Trừ đi 1 giờ vào thời gian hiện tại
echo now()->subHour()->format('d/m/Y H:i:s');
//Trừ đi số giờ cụ thể vào thời gian hiện tại
echo now()->subHours(10)->format('d/m/Y H:i:s');
```

#### Day

```php
//Cộng thêm 1 ngày vào thời gian hiện tại
echo now()->addDay()->format('d/m/Y H:i:s');
echo now()->addDay()->getTimestamp();
//Cộng thêm số ngày cụ thể vào thời gian hiện tại
echo now()->addDays(10)->format('d/m/Y H:i:s');

//Trừ đi 1 ngày vào thời gian hiện tại
echo now()->subDay()->format('d/m/Y H:i:s');
//Trừ đi số ngày cụ thể vào thời gian hiện tại
echo now()->subDays(10)->format('d/m/Y H:i:s');
```

#### Month

```php
//Cộng thêm 1 tháng vào thời gian hiện tại
echo now()->addMonth()->format('d/m/Y H:i:s');
echo now()->addMonth()->getTimestamp();
//Cộng thêm số tháng cụ thể vào thời gian hiện tại
echo now()->addMonths(10)->format('d/m/Y H:i:s');

//Trừ đi 1 tháng vào thời gian hiện tại
echo now()->subMonth()->format('d/m/Y H:i:s');
//Trừ đi số tháng cụ thể vào thời gian hiện tại
echo now()->subMonths(10)->format('d/m/Y H:i:s');
```

#### Year

```php
//Cộng thêm 1 năm vào thời gian hiện tại
echo now()->addYear()->format('d/m/Y H:i:s');
echo now()->addYear()->getTimestamp();
//Cộng thêm số năm cụ thể vào thời gian hiện tại
echo now()->addYears(10)->format('d/m/Y H:i:s');

//Trừ đi 1 năm vào thời gian hiện tại
echo now()->subYear()->format('d/m/Y H:i:s');
//Trừ đi số năm cụ thể vào thời gian hiện tại
echo now()->subYears(10)->format('d/m/Y H:i:s');
```

### `carbon()`
Cũng khởi tạo Object thư viện Carbon giống như `now()`, nhưng cho phép bạn tự truyền các String Text/Timestamp để tạo mốc thời gian Tùy Ý khác với thời điểm hiện tại.

**Cú pháp:**
```php
carbon($time = null): Illuminate\Support\Carbon
```

**Ví dụ:**
```php
// Truyền Timestamp dạng số thẳng vào
$date = carbon(1672531200);

// Khởi tạo dựa trên Văn bản chuỗi (Text Literal Parsing)
$yesterday = carbon('yesterday'); 
$firstDayOfMoth = carbon('first day of this month');

// Tính khoảng cách
echo carbon('2024-01-01')->diffForHumans(); // Ví dụ: "1 năm trước"
```

---

## 4. Dò Tìm Thiết Bị & Tiện Ích Khác

### `agent()`
Tiện ích để phát hiện thiết bị Lõi (Device, Browser, Hệ điều hành, Nền tảng Robot) mà khách truy cập đang sử dụng để xem Website của bạn thông qua User-Agent.

**Cú pháp:**
```php
agent(): SkillDo\Cms\Support\Agent
```

**Ví dụ:**
```php
// 1. Kiểm tra môi trường (Giao diện mobile)
if (agent()->isMobile()) {
    echo 'Bạn đang xem bằng điện thoại, giao diện sẽ được tối ưu';
}

if (agent()->isRobot()) {
    echo 'Bot Google/Facebook đang cào HTML trang web của tôi!';
}

// 2. Trích xuất nền tảng 
$os = agent()->platform(); // Kết quả: "Windows" hoặc "iOS", "Android"
$browser = agent()->browser(); // Kết quả: "Chrome" hoặc "Safari"
```

> **Mẹo hữu ích:** SkillDo thường dùng `agent()` trong phần thống kê (Statictics) hoặc Controller để render Giao Diện Mobile độc lập thay vì giao diện Reponsive của Desktop.
