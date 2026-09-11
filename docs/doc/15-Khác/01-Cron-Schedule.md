# Cron & Schedule Jobs

Trong việc quản trị các Website bán hàng hay Tạp chí, bạn thường xuyên có các vấn đề cần phải xử lý theo định kỳ tự động chạy Không Có Tương Tác Mạng (Ví dụ Xóa Ảnh tạm bị lỗi mỗi ngày 2 giờ sáng, Tính Giảm Giá Hàng Loạt Hằng Giờ, Gửi Email Báo Cáo Sinh Nhật User).

SkillDo CMS v8 sử dụng Hệ Thống Tác Vụ Lập Lịch (Schedule Jobs) xây dựng trên thư viện `dragonmantank/cron-expression`. Framework không dựa vào việc cấu hình hàng chục Jobs riêng biệt bằng lệnh `crontab` rối rắm trên máy chủ Linux của bạn. Thay vào đó, bạn chỉ tạo MỘT điểm kích hoạt duy nhất vào Linux và Framework tự giải quyết lịch trong Code.

---

## 1. Cài Đặt Crontab Ở Máy Chủ Nền Tảng Linux/Cpanel (Lần Đầu Tiên Và Duy Nhất)

Vào giao diện Cronjob của Cpanel, hoặc Terminal dòng lệnh gõ `crontab -e`. Bạn dán một lệnh DUY NHẤT để máy chủ của bạn cứ mỗi **5 Phút** gõ nhẹ một URL Endpoint vào CMS của bạn. Điểm kích hoạt này là: `GET /schedule-run` (chấp nhận mọi HTTP method). Dấu `> /dev/null 2>&1` giúp không sinh rác Mail Sever Lỗi.

```bash
# Cron chạy trên CÙNG server với CMS (gọi localhost — không cần token)
# Header Host để máy chủ web chọn đúng site khi trên máy có nhiều website.
*/5 * * * * wget -q -O - --header="Host: {domain-cua-ban.com}" http://127.0.0.1/schedule-run > /dev/null 2>&1

# Cron gọi từ máy khác / qua domain — BẮT BUỘC kèm token
*/5 * * * * wget -q -O - "https://{domain-cua-ban.com}/schedule-run?token={SCHEDULE_RUN_TOKEN}" > /dev/null 2>&1
```

> **Bàn giao cho khách thì chỉ đường sang admin.** Vào **Cấu hình hệ thống → Cronjob**: trang đó in sẵn câu lệnh gọi qua tên miền với đúng địa chỉ site và điền luôn token thật nếu `.env` đã có (chưa có thì cảnh báo ngay tại chỗ). Trang admin **cố ý chỉ hiện một câu lệnh** để khách khỏi phải chọn — bản gọi thẳng `127.0.0.1` ở trên dành cho dev cài trực tiếp trên máy chủ và chỉ có trong tài liệu này.
>
> **Bẫy hay gặp:** gọi `wget https://ten-mien-cua-ban.com/schedule-run` từ chính máy chủ **không** được coi là localhost — tên miền phân giải ra IP công cộng nên `REMOTE_ADDR` là IP đó, và cron nhận `403` âm thầm mỗi lần chạy. Muốn dùng tên miền thì phải kèm token; muốn khỏi token thì phải gọi thẳng `127.0.0.1` như câu lệnh đầu.

> **Lưu ý (xác thực — từ v8.0.2):** Route được đăng ký trong `routes/api.php`, handler là `App\Controllers\Admin\ScheduleController@run`. Endpoint **không còn mở công khai**: chỉ chấp nhận request từ **localhost** (`127.0.0.1` / `::1`), hoặc request kèm token khớp với biến môi trường **`SCHEDULE_RUN_TOKEN`** trong `.env` — truyền qua header `X-Schedule-Token` hoặc query `?token=...`. Nếu chưa cấu hình token thì chỉ localhost được phép; request không hợp lệ nhận `403 Forbidden`.
>
> CMS **không có** console runner `artisan` — cách kích hoạt duy nhất là gọi HTTP endpoint trên.

---

## 2. Cách Tạo Và Lập Lịch Một Công Việc Code PHP Chạy Tự Động 

Bạn viết lịch trình của bạn (Sử Dụng Facade `SkillDo\Support\Facades\Schedule`) vào phương thức **Boot** của Service Provider bất kỳ của Cms. Bên dưới, instance `Illuminate\Console\Scheduling\Schedule` được đăng ký singleton trong Application. Thay vì viết Class Command cồng kềnh, bạn GỌI CÁC CLOSURE CHẠY TRONG KHỐI EVENT.

Ví dụ tạo tự động dọn Rác Lịch Sử Quản Trị Hệ Thống (Mỗi tuần 1 lần Không Làm Treo Máy):

Trong `app/Providers/AppServiceProvider.php` (Hoặc Provider của một Plugin Bất Kỳ):

```php
namespace App\Providers;

use SkillDo\ServiceProvider;
use SkillDo\Support\Facades\Schedule;
use SkillDo\Database\DB;
use SkillDo\Log\Log;

class ScheduledTasksProvider extends ServiceProvider {

    public function boot() {

        // 1. Tạo Lịch Dọn Lịch Sử Login Thất Bại Mỗi Tuần 1 Lần, vào 3h Sáng Chủ Nhật.
        // Callback Closure Thực thi:
        Schedule::call(function () {

            // Xoá Log hơn 30 ngày ở Table
            DB::table('login_logs')->where('created_at', '<', date('Y-m-d', strtotime('-30 days')))->delete();
            
            // Log lại file text Hệ Thống
            Log::info("Cleaned Old Login Logs By Cronjob.");
            
        // Cú Pháp Lập Cron Tương Tự Laravel
        })->weekly()->sundays()->at('3:00'); 
        

        // 2. Tạo Lịch Kiểm Tra Sinh Nhật User Gửi Mail Khuyến Mãi (Chạy Hằng Ngày Lúc 8H Sáng)
        Schedule::call('App\Services\MailMarketing@sendBirthdayWishes')
        ->dailyAt('8:00');

        // 3. Tác Vụ Cập Nhật Xu Hướng Tỷ Giá Theo Biểu Chạy Môỗi Phút
        Schedule::call(function () {
             // ... Cấu Lệnh API Get Lên Ngân Hàng Cập Nhật Coin/Gold
        })->everyFiveMinutes();

    }
}
```

---

## 2b. Khai Báo Tác Vụ Để Người Bàn Giao Website Biết Site Cần Cronjob

`Schedule::call()` chỉ giữ một closure. Nhìn vào bộ lập lịch không ai biết tác vụ đó của plugin nào, làm gì, và hỏng ra sao nếu máy chủ quên cài cron. Vì vậy **mọi plugin có đăng ký lịch chạy đều phải khai báo qua filter `cms_cronjob_tasks`**. Danh sách khai báo hiện thành bảng ở **Cấu hình hệ thống → Cronjob**, kèm cảnh báo "website này cần cronjob".

Đặt `add_filter` ngay cạnh chỗ `Schedule::call()` trong `boot()` của Service Provider — sửa lịch là thấy luôn dòng phải sửa theo:

```php
public function boot(): void
{
    Schedule::call([ReleaseExpiredHold::class, 'handle'])->everyFiveMinutes();

    Schedule::call([ReminderCheckin::class, 'handle'])->dailyAt('09:00');

    add_filter('cms_cronjob_tasks', [static::class, 'cronjobTasks']);
}

public static function cronjobTasks($tasks): array
{
    $tasks['hotel-booking:release-expired-hold'] = [
        'label'       => 'Trả phòng của đơn giữ chỗ quá hạn',
        'description' => 'Thiếu cron thì phòng bị khoá vĩnh viễn, website báo hết phòng trong khi thực tế còn trống.',
        'source'      => 'Plugin Đặt phòng khách sạn',
        'interval'    => 'Mỗi 5 phút',
    ];

    return $tasks;
}
```

| Khóa | Bắt buộc | Nội dung |
|---|---|---|
| `label` | Có | Tên tác vụ. Mục thiếu `label` bị bỏ qua, không vẽ ra dòng trống |
| `description` | Không | **Điều gì hỏng nếu không có cron** — đây mới là thứ người bàn giao cần đọc, đừng chỉ chép lại tên hàm |
| `source` | Không | Plugin/giao diện nào sinh ra tác vụ |
| `interval` | Không | Tần suất viết cho người đọc ("Mỗi 5 phút", "Hằng ngày 09:00") |

Khóa của mảng nên đặt dạng `{id-plugin}:{ten-tac-vu}` để hai lần đăng ký không nhân đôi dòng. Một plugin có nhiều tác vụ thì khai mỗi tác vụ một dòng, đừng gộp — bảng này là chỗ duy nhất người vận hành nhìn thấy chúng. Truyền thẳng một chuỗi thay cho mảng cũng được, khi đó chuỗi là `label`.

Trang cronjob còn đối chiếu số dòng khai báo với số event thật trong bộ lập lịch. Nhiều event hơn số dòng thì trang báo "có plugin quên khai báo" — dùng dấu hiệu này để soát lại sau khi thêm lịch mới.

**Nhãn báo ở trang Cấu hình hệ thống.** Khi có ít nhất một tác vụ được khai báo, mục *Cronjob* mang thêm một nhãn nhỏ: đỏ **Cần cài cronjob** nếu chưa thấy cron gọi tới, xanh kèm số tác vụ nếu cron đang chạy. Trạng thái này dựa trên nhịp tim mà `ScheduleController@run` ghi vào cache mỗi lần được gọi; quá 15 phút không thấy nhịp thì coi như chưa chạy. Nhờ vậy người bàn giao website nhìn trang Cấu hình hệ thống là biết còn thiếu gì, không phải mở từng mục.

Nhãn này là khoá `badge` của mảng tab — mọi mục trong `admin_system_tabs` đều dùng được, trả về HTML (thường là `Admin::badge`) khi có việc cần làm và chuỗi rỗng khi không.

Điểm gọi filter nằm ở `Admin\Modules\System\Cronjob::tasks()`.

---

## 3. Các Từ Khóa (Methods) Cấu Hình Tần Suất Thời Gian Lập Lịch

Bạn có vô vàn tùy chọn ngôn ngữ dễ hiểu thay vì nhớ cấu trúc 5 Dấu Sao (* * * * *) Của Unix.

| Hàm Cấu Hình (Method) | Tần Suất Gọi Công Việc Code |
|---|---|
| `->cron('* * * * *');` | Tự viết biểu thức cron Unix nếu cần lịch phức tạp |
| `->everyMinute();` | Chạy mỗi phút (Sẽ phụ thuộc vào Setting Bước 1 của Cpanel Nếu Cpanel bạn Set 5 phút thì Mức Base là 5). |
| `->everyFiveMinutes();`| Chạy 5 Phút / Lần |
| `->everyTenMinutes();`| Chạy 10 Phút / Lần |
| `->everyThirtyMinutes();`| Chạy Nửa Tiếng / Lần |
| `->hourly();` | Chạy 1 Tiếng / 1 Lần Hàng Giờ |
| `->hourlyAt(15);` | Chạy Hàng Giờ Vào Phút Thứ 15 (VD: 1:15, 2:15, 3:15) |
| `->daily();` | Chạy Mỗi Ngày (Vào Lúc Kéo Của 00:00 Nửa Đêm) |
| `->dailyAt('13:00');` | Chạy Mỗi Ngày Đúng Vào Một Khung Chiều 1 giờ. |
| `->twiceDaily(1, 13);` | Chạy 2 Lần Mỗi Ngày (1h và 13h) |
| `->weekly();` | Chạy hàng Tuần |
| `->weeklyOn(1, '8:00');` | Chạy Thứ Hai hàng tuần lúc 8h |
| `->monthly();` | Chạy hàng Tháng |
| `->monthlyOn(4, '15:00');` | Chạy Ngày 4 hàng tháng lúc 15h |
| `->quarterly();` | Chạy Mỗi Quý |
| `->yearly();` | Chạy Một Năm Một Lần (Chớp Nhoáng Giao Thừa Cập Nhật Thuế Dữ Liệu )|

Ngoài ra còn các ràng buộc bổ sung: `->weekdays()`, `->weekends()`, `->sundays()`...(theo thứ), `->between('8:00', '17:00')`, `->when(fn() => ...)`, `->skip(fn() => ...)`, `->timezone('Asia/Ho_Chi_Minh')` — đầy đủ theo chuẩn Scheduling của Illuminate (xem docblock `SkillDo\Support\Facades\Schedule`).

### Tránh Việc Code Chạy Đè Lên Nhau Khi Đang Làm Việc?

Hệ thống **không tự động** ngăn chạy chồng (Overlapping): endpoint `/schedule-run` chỉ duyệt từng event, event nào tới hạn (`isDue`) là chạy. Nếu Hàm Update Cập nhật Coin Tốn 15 Phút Để Tải (Gây Treo), Mà Lịch Set Chạy 5 Phút Một Lần — hai lần chạy có thể đè lên nhau. Hãy chủ động thêm `->withoutOverlapping()` (cơ chế mutex của Illuminate, cần cache hoạt động). Với Closure, phải đặt tên cho event bằng `->name()` TRƯỚC khi gọi `withoutOverlapping()`:

```php
Schedule::call(function () {
   // Việc Nặng: Backup 10GB Data
})->daily()->name('backup-database')->withoutOverlapping(); // Không Sinh Task 2 nếu Tác Vụ Cũ Vẫn Đang Chạy
```

### Lỗi Trong Một Tác Vụ Có Làm Gãy Các Tác Vụ Khác?

Không. `ScheduleController@run` bọc từng event trong `try/catch` — exception của một event được ghi log (`Log::error` kèm stack trace) và vòng lặp tiếp tục chạy các event còn lại.
