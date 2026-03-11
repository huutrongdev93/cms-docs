# Gửi Email (Mail System)

SkillDo CMS v8 tích hợp sẵn hệ thống gửi thư điện tử mạnh mẽ dựa trên thư viện `Symfony Mailer` (hỗ trợ SMTP, Mailgun, Sendgrid, Brevo).

Trong SkillDo v8, chúng ta có 2 Class đảm nhận việc gửi Mail độc lập:
1. **`SkillDo\Cms\Support\Mail` (Dành cho CMS)**: Tự động lấy cấu hình SMTP/Driver đã thiết lập trong Bảng điều khiển Quản Trị (Admin Panel). Khuyên dùng.
2. **`SkillDo\Support\Mail` (Dành cho Framework Lõi)**: Yêu cầu truyền cấu hình Server truyền thư thủ công bằng dòng lệnh. Thích hợp cho API hoặc các kịch bản chạy nền riêng biệt không phụ thuộc vào cấu hình CMS.

---

## 1. Gửi Email Bằng Cấu Hình CMS (`SkillDo\Cms\Support\Mail`)

Nếu Website của bạn đã điền thông tin SMTP trong Quản trị viên (Phần Cài Đặt Mail), bạn NHẤT ĐỊNH NÊN sử dụng class này. Hệ thống sẽ **tự động** load Host, Port, Mật khẩu từ Database mà bạn không cần phải truyền thêm gì cả.

### Cách gửi siêu tốc thông qua Static Method

Mẫu chuẩn để gửi 1 thư đi bằng một cú gọi duy nhất:

```php
use SkillDo\Cms\Support\Mail;

Mail::to('khachhang@gmail.com')
    ->subject('Đơn hàng của bạn đã được xác nhận')
    ->replyTo('cskh@domain.com', 'Chăm Sóc Khách Hàng')
    ->body('nội dung email ở đây, hoặc đường dẫn file view...', [
        'customer_name' => 'Anh Nguyễn'
    ])
    ->send();
```

> **Lưu ý**: Hàm `send()` của CMS bắt buộc kết thúc chuỗi. Nếu gặp lỗi kết nối (Sai Port, Lỗi mạng), hàm này sẽ trả về object lỗi mảng `SKD_Error`. Nếu thư đi trót lọt, sẽ trả về `true`.

### Các Phương thức Cấu hình Thư
| Phương Thức | Tham số | Diễn giải |
|-------------|:------:|---------------------------------------------|
| `to($email)` | `string` | Địa chỉ thẻ Email của người Nhận chính. |
| `subject($str)` | `string` | Tiêu đề của thư. |
| `replyTo($mail, $name)` | `string` | Email mà khách hàng sẽ Reply-To (Tránh dùng email Gửi để reply). Tên hiển thị người gửi |
| `body($path, $data)` | `string, array` | Đường dẫn Tới File View Giao diện (ví dụ `theme::email.order`), và Biến truyền vào File View đó. |
| `cc($email)` | `string` | Bản sao chép CC cho người khác. |

---

## 2. Gửi Email Trực Tiếp Bằng Framwork (`SkillDo\Support\Mail`)

Trong trường hợp bạn không muốn dùng Cấu hình SMTP của Hệ thống Admin cài đặt, hoặc bạn đang thiết kế Một đoạn Script Chạy Console, gọi `SkillDo\Support\Mail` cho phép bạn chủ động điều khiển và Set cứng mọi cấu hình.

Bạn bắt buộc phải gọi bằng lệnh `new` và Mảng Cấu Hình `$opts`:

```php
use SkillDo\Support\Mail as CoreMail;

// Bước 1: Khai báo cấu hình Server Gửi
$mailer = new CoreMail([
    'driver' => 'smtp', // Các lựa chọn: smtp, mailgun, sendgrid, brevo
    'options' => [
        'server'     => 'smtp.gmail.com',
        'port'       => 587,
        'user'       => 'youremail@gmail.com',
        'pass'       => 'app_password_hiden',
        'encryption' => 'tls'
    ]
]);

// Bước 2: Build Nội Dung và Gửi
try {
    $mailer->from('no-reply@domain.com', 'Hệ Thống Tự Động')
           ->to('khachhang@gmail.com')
           ->subject('Tiêu Đề Thử Nghiệm Từ Code Lõi')
           ->body('test-email-view', ['name' => 'Tester'])
           ->send();

    echo "Gửi thành công!";
} catch (\Exception $e) {
    echo "Lỗi Gửi Mail: " . $e->getMessage();
}
```

> Khác với CMS (Bọc qua `SKD_Error`), Bản Lõi của Framework này sẽ ném ra (Throw) trực tiếp `\Exception` (ví dụ `TransportExceptionInterface`) nếu cấu hình Mail Server sai lệch. Bạn nên bao cẩn thận bằng Try/Catch.

---

## 3. Hệ Thống Giao Diện Gửi Thư (Mail Layout & Body)

Tất cả các phiên bản của SkillDo đều hỗ trợ hệ thống Đọc Template (Giao Diện) tinh xảo. Để Mail gửi cho khách hàng nhìn chuyên nghiệp, bạn không nên gõ cứng Text HTML dài ngoằng trong tham số `body()`. Hãy bẻ nó thành File View. 

Hệ thống Template của Email có thể nhận cả biến Namespace Giao diện của Theme và Plugin thông qua cơ chế Auto-Loader View.

### Cách 1: Sử dụng Hệ Trực Tiếp Blade View
Bạn có thể trỏ thẳng vào thư mục `views()` hiện tại (Ví dụ: `views/email/layout-extend.blade.php`).

```php
Mail::to($email)
    ->subject('Thông báo')
    ->body('email.layout-extend', [
        'fullName' => 'Châu Thạch',
        'code'     => 'SKD-9999'
    ])
    ->send();
```

Trong View Email, bạn bóc tách như Cấu trúc Blade thông thường:
```html
<div>
    <h2>ĐẶT HÀNG THÀNH CÔNG</h2>
    <p><b>{{ $fullName }}</b>, Cám ơn bạn đã đặt hàng!</p>
    <p>Mã Hóa Đơn: {{ $code }}</p>
</div>
```

### Cách 2: Gọi Giao Diện Bằng Tên Namespace Prefix.
Giả sử bạn đang code Plugin, bạn muốn gửi Mail bằng chính giao diện lưu trong folder của bạn chứ không phải của Hệ thống chung Web. Đơn giản, dùng Namespace:

```php
// Trỏ vào thư mục: plugins/my-plugin/views/mail/verify.blade.php
Mail::to($email)
    ->body('my-plugin::mail.verify', ['otp' => '123456'])
    ->send();
```
> Tương tự, nếu bạn trỏ vào file Core Admin, dùng prefix: `'admin::email.template'`.

### Cách 3: Nạp Nội Dung Bằng Path Tuyệt Đối
Hệ thống tự nhận diện nếu String bạn quăng vào `body()` là một file thật sự chứa HTML/PHP tĩnh siêu bình thường, có chứa các biến gõ tay `{{ biến }}` để Find & Replace.

```php
Mail::to($email)
    ->body(FCPATH . 'public/template-mail.html', [
        'customer' => 'My Customer'
    ])
    ->send();
```
String Mẫu: `<div>Xin chào {{ customer }}!</div>`
