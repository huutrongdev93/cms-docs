# Global Helpers

SkillDo CMS v8 cung cấp một loạt các hàm trợ giúp (helper functions) được khai báo ở phạm vi toàn cục (global scope). 
Bạn có thể gọi trực tiếp các hàm này ở **bất kỳ đâu** trong dự án của mình (Controllers, Views, Models, Plugins) mà không cần phải `use` hay khởi tạo class phức tạp. Các helper này kết nối thẳng vào những thành phần sâu nhất của Framework.

Helper được khai báo ở ba tệp nguồn:

| Tệp | Nội dung |
|---|---|
| `packages/skilldo/framework/src/Support/common.php` | Helper của Framework: `app()`, `config()`, `request()`, `response()`, `view()`, `trans()`… |
| `packages/skilldo/cms/src/Support/helpers.php` | Helper của lớp CMS: `form()`, `template()`, `pagination()`, `asset()`… |
| `packages/skilldo/cms/src/Hooks/helpers.php` | Helper hệ thống Hook: `add_action()`, `do_action()`, `add_filter()`, `apply_filters()`… (xem [Hooks](../06-Cms/Hooks.md)) |

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

---

## 5. Request, Response & View

### `request()`
Lấy đối tượng Request hiện tại.

**Cú pháp:**
```php
request(): \SkillDo\Http\Request
```

```php
$keyword = request()->input('keyword');
$page    = (int)request()->query('page');
$id      = request()->segment(2);

if(request()->isMethod('post')) { /* ... */ }
```

### `response()`
Lấy đối tượng Response hiện tại. Trong handler Ajax, `success()` / `error()` sẽ **kết thúc request ngay**.

**Cú pháp:**
```php
response(): \SkillDo\Http\Response
```

```php
response()->success('Lưu thành công', ['id' => $id]);
response()->error('Dữ liệu không hợp lệ');

// Cho phép cache trang ở tầng CDN/proxy
response()->setPublic();
response()->setMaxAge(100);
```

### `view()`
Render một Blade view thành chuỗi HTML.

**Cú pháp:**
```php
view(string $name, array $data = [])
```

```php
echo view('my-plugin::admin.page', ['objects' => $objects]);
```

### `isAjax()`
Kiểm tra request hiện tại có phải là ajax không.

```php
if(isAjax()) { /* ... */ }
```

### `redirect()`
Chuyển hướng trình duyệt rồi kết thúc request.

**Cú pháp:**
```php
redirect($uri = '', $method = 'location', $http_response_code = 302): void
```

```php
redirect('gio-hang');                 // 302
redirect('trang-moi', 'location', 301); // 301 vĩnh viễn
```

---

## 6. Bảo Mật & Xác Thực

### `csrf_token()` / `csrf_field()`
Lấy token CSRF, hoặc sinh sẵn thẻ `<input type="hidden">` chứa token.

```php
$token = csrf_token();

// Trong Blade
echo csrf_field();
```

### `auth()`
Lấy đối tượng người dùng đang đăng nhập.

```php
$user = auth();
```

### `html_escape()`
Escape chuỗi (hoặc mảng chuỗi) trước khi in ra HTML.

```php
echo html_escape($userInput);
```

---

## 7. Kiểm Tra Dữ Liệu

### `hasItems()` / `noItems()` / `have_posts()`
Ba hàm kiểm tra "có dữ liệu hay không", dùng được cho cả mảng, `Collection` và object.

```php
hasItems($value): bool   // có dữ liệu
noItems($value): bool    // rỗng
have_posts($value): bool // alias của hasItems()
```

```php
$products = Product::where('public', 1)->get();

if(noItems($products)) {
    return;
}

foreach ($products as $product) { /* ... */ }
```

### `is_skd_error()`
Kiểm tra kết quả trả về có phải đối tượng lỗi của SkillDo không. **Bắt buộc dùng** sau mỗi lần `Model::create()` / `Model::insert()` — CMS trả về đối tượng lỗi chứ không ném exception.

```php
$id = Post::create($data);

if(is_skd_error($id)) {
    response()->error($id);
}
```

Xem thêm: [Xử lý lỗi](./09-Errors.md).

---

## 8. Đa Ngôn Ngữ

### `trans()` / `__()`
Lấy chuỗi đã dịch. `__()` là alias của `trans()`.

**Cú pháp:**
```php
trans(string $str, mixed $params = null): string
```

```php
echo trans('general.phone');
echo trans('my-plugin::messages.welcome', ['name' => $user->firstname]);
echo __('sicommerce::order.status.wait');
```

Xem thêm: [i18n Localization](../12-i18n%20Localization/01-Core-Language.md).

---

## 9. Helper Của Lớp CMS

Các helper sau khai báo trong `packages/skilldo/cms/src/Support/helpers.php`.

### `form()`
Khởi tạo một đối tượng Form mới.

```php
$form = form();
$form->text('name', ['label' => 'Họ tên']);
echo $form->html();
```

### `template()`
Lấy đối tượng Template đang chạy.

```php
$template = template();
```

### `the_content()`
In nội dung bài viết sau khi chạy qua filter `the_content`.

```php
the_content($object->content);
```

### `is_home()`
Kiểm tra đang ở trang chủ hay không.

```php
if(is_home()) { /* ... */ }
```

### `pagination()`
Sinh đối tượng phân trang. Tự đọc `page` / `paging` từ query string nếu không truyền `$page`.

**Cú pháp:**
```php
pagination($total = 10, $url = '', $limit = 10, $page = null): Pagination
```

```php
$total = $query->getCountForPagination();

$pagination = pagination($total, Url::base('tin-tuc').'?page={page}', 12);

$query->limit(12)->offset($pagination->offset());
```

### `asset()`
Sinh URL cho tài nguyên tĩnh.

```php
echo asset('uploads/source/logo.png');
```

### `lessToCss()` / `minifyCss()` / `minifyJs()`
Biên dịch LESS sang CSS và nén CSS/JS.

```php
$css = lessToCss(file_get_contents($lessFile));
$css = minifyCss($css);
$js  = minifyJs($js);
```

### `cmsClearCache()` / `cmsClearCacheAutoLoad()`
Xóa cache của CMS. Thường gọi sau khi thay đổi cấu hình có ảnh hưởng toàn site.

```php
cmsClearCache();
```

### `mergeConfig()`
Gộp mảng config file với mảng config lưu trong CSDL.

**Cú pháp:**
```php
mergeConfig(array $config, array $database, $insert = false): array
```

`$insert = true` thì key mới trong `$database` được **thêm vào**; `false` thì chỉ ghi đè key đã tồn tại.

---

## 10. Tiện Ích Khác

### `appConfig()`
Đọc config qua container (tương đương `config()` nhưng luôn resolve từ `app('config')`).

```php
$timezone = appConfig('app.timezone');
```

### `schema()`
Lấy Schema Builder để thao tác cấu trúc bảng — dùng trong file migration.

```php
if(!schema()->hasTable('my_table')) {
    schema()->create('my_table', function (Blueprint $table) { /* ... */ });
}
```

Xem thêm: [Schema](../05-Database/02-Schema.md).

### `session()`
Đọc/ghi session.

```php
$cart = session()->get('cart_contents');
session()->put('cart_contents', $cart);
```

### `show_r()`
In biến ra màn hình để debug (bọc `dump()`). Nhận nhiều tham số.

```php
show_r($product, $order);
```

### `path_normalize()`
Chuẩn hóa dấu phân cách đường dẫn theo hệ điều hành.

```php
$path = path_normalize('views/theme-store/assets/css');
```
