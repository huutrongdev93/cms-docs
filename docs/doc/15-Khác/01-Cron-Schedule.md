# Cron & Schedule Jobs

Trong việc quản trị các Website bán hàng hay Tạp chí, bạn thường xuyên có các vấn đề cần phải xử lý theo định kỳ tự động chạy Không Có Tương Tác Mạng (Ví dụ Xóa Ảnh tạm bị lỗi mỗi ngày 2 giờ sáng, Tính Giảm Giá Hàng Loạt Hằng Giờ, Gửi Email Báo Cáo Sinh Nhật User).

SkillDo CMS v8 sử dụng Hệ Thống Tác Vụ Lập Lịch (Schedule Jobs) xây dựng trên thư viện `dragonmantank/cron-expression`. Framework không dựa vào việc cấu hình hàng chục Jobs riêng biệt bằng lệnh `crontab` rối rắm trên máy chủ Linux của bạn. Thay vào đó, bạn chỉ tạo MỘT điểm kích hoạt duy nhất vào Linux và Framework tự giải quyết lịch trong Code.

---

## 1. Cài Đặt Crontab Ở Máy Chủ Nền Tảng Linux/Cpanel (Lần Đầu Tiên Và Duy Nhất)

Vào giao diện Cronjob của Cpanel, hoặc Terminal dòng lệnh gõ `crontab -e`. Bạn dán một lệnh DUY NHẤT để máy chủ của bạn cứ mỗi **5 Phút** gõ nhẹ một URL Endpoint API vào CMS của bạn. Điểm kích hoạt ẩn này là: `GET /api/schedule-run` (Tự động bypass Auth). Dấu `> /dev/null 2>&1` giúp không sinh rác Mail Sever Lỗi.

```bash
# Gõ liên tục Hàm API Schedule Run
*/5 * * * * wget -q -O - https://{domain-cua-ban.com}/api/schedule-run > /dev/null 2>&1

# Hoặc Cấu hình qua Artisan PHP CLI Script ở Console nếu muốn
# */5 * * * * cd /path-to-your-project && php -f artisan schedule:run >> /dev/null 2>&1
```

*(Lưu ý: Route này được đăng ký nội bộ Framework `ApiServiceProvider`, Nếu bạn muốn bảo mật bằng Key, có thể thiết lập `CRON_SECRET` ở env).*

---

## 2. Cách Tạo Và Lập Lịch Một Công Việc Code PHP Chạy Tự Động 

Bạn viết lịch trình của bạn (Sử Dụng Helper `SkillDo\Facades\Schedule`) vào phương thức **Boot** của Service Provider bất kỳ của Cms. Thay vì viết Class Command cồng kềnh, bạn GỌI CÁC CLOSURE CHẠY TRONG KHỐI EVENT.

Ví dụ tạo tự động dọn Rác Lịch Sử Quản Trị Hệ Thống (Mỗi tuần 1 lần Không Làm Treo Máy):

Trong `app/Providers/AppServiceProvider.php` (Hoặc Provider của một Plugin Bất Kỳ):

```php
namespace App\Providers;

use SkillDo\Support\ServiceProvider;
use SkillDo\Facades\Schedule;
use SkillDo\Facades\DB;
use SkillDo\Facades\Log;

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

## 3. Các Từ Khóa (Methods) Cấu Hình Tần Suất Thời Gian Lập Lịch

Bạn có vô vàn tùy chọn ngôn ngữ dễ hiểu thay vì nhớ cấu trúc 5 Dấu Sao (* * * * *) Của Unix.

| Hàm Cấu Hình (Method) | Tần Suất Gọi Công Việc Code |
|---|---|
| `->everyMinute();` | Chạy mỗi phút (Sẽ phụ thuộc vào Setting Bước 1 của Cpanel Nếu Cpanel bạn Set 5 phút thì Mức Base là 5). |
| `->everyFiveMinutes();`| Chạy 5 Phút / Lần |
| `->everyTenMinutes();`| Chạy 10 Phút / Lần |
| `->everyThirtyMinutes();`| Chạy Nửa Tiếng / Lần |
| `->hourly();` | Chạy 1 Tiếng / 1 Lần Hàng Giờ |
| `->hourlyAt(15);` | Chạy Hàng Giờ Giây Thứ 15 (VD: 1:15, 2:15, 3:15) |
| `->daily();` | Chạy Mỗi Ngày (Vào Lúc Kéo Của 00:00 Nửa Đêm) |
| `->dailyAt('13:00');` | Chạy Mỗi Ngày Đúng Vào Một Khung Chiều 1 giờ. |
| `->weekly();` | Chạy hàng Tuần |
| `->monthly();` | Chạy hàng Tháng |
| `->yearly();` | Chạy Một Năm Một Lần (Chớp Nhoáng Giao Thừa Cập Nhật Thuế Dữ Liệu )|

### Tránh Việc Code Chạy Đè Lên Nhau Khi Đang Làm Việc?

SkillDo CMS tự động có cơ chế Lõi xử lý ngăn Lịch trình (Overlapping). 
Nếu Hàm Update Cập nhật Coin Tốn 15 Phút Để Tải (Gây Treo), Mà Lịch Set Chạy 5 Phút Một Lần. Mặc Định Hệ Thống Có Method `->withoutOverlapping()` Dưới Hood Cho Phép Bỏ Qua Việc Sinh Song Song Task. Nhưng Bạn Được Khuyên Thêm Method này nếu có File Khổng Lồ Download Backup DB:

```php
Schedule::call(function () {
   // Việc Nặng: Backup 10GB Data
})->daily()->withoutOverlapping(); // Không đẻ Sinh Task 2 nếu Tác Vụ Cũ (Rắc Ở RAM) Vẫn Chạy Đang 10GB Kéo Cáp
```
