import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Gửi email không cần phải phức tạp. 
SkillDo cung cấp API email đơn giản, rõ ràng được hỗ trợ bởi thành phần `Symfony Mailer` phổ biến.
SkillDo và Symfony Mailer cung cấp trình điều khiển để gửi email qua SMTP, Mailgun và sendmail, 
cho phép bạn nhanh chóng bắt đầu gửi thư qua dịch vụ cục bộ hoặc dựa trên đám mây mà bạn chọn.

### Send Mail
#### Cách gửi email
Bạn có thể sử dụng static method
```php
Mail::to($to)
    ->subject($subject)
    ->replyTo($mail, $name)
    ->body($body, $bodyValue)
    ->send();
```
Hoặc class Mail
```php
$email = new Mail();
$email->to($to)
    ->subject($subject)
    ->replyTo($mail, $name)
    ->body($body, $bodyValue)
    ->send();
```

| Column Name |  Type  |                                  Description |
|-------------|:------:|---------------------------------------------:|
| $to         | string |                      Email sẽ nhận được mail |
| $subject    | string |                                Tiêu đề email |
| $mail       | string | Email sẽ nhận được khi $to trả lời lại email |
| $name       | string |                  Tên hiển thị cho mail reply |
| $body       | string | Đường dẫn đến file layout email hoặc mã html |
| $bodyValue  | array  |     Danh sách các giá trị thay đổi cho $body |

#### Sử dụng email layout ($body)
Các kiểu layout bạn có thể sử dụng

| Column Name |  Type  |                                                       Description |                    Parameters                     |
|-------------|:------:|------------------------------------------------------------------:|:-------------------------------------------------:|
| file        | string |                 Đường dẫn đến file layout (Ex: 'path/layout.php') |    Các biến được viết bằng cấu trúc `{{name}}`    |
| file blade  | string | Đường dẫn đến file layout sử dụng blade (Ex: 'path/layout.blade') | Các biến được viết bằng cấu trúc params của blade | 

#### Ví dụ thực tế
##### Tạo file layout

<Tabs groupId="mail-layout" queryString>
    <TabItem value="blade" label="Blade">
        ```php
        <div>
            <h2>ĐẶT HÀNG THÀNH CÔNG</h2>
            <p><b>{{$fullName}}</b>, Cám ơn bạn đã đặt hàng!</p>
            <p>{{$code}}</p>
            <p><strong>Ngày: {{$code}}</strong></p>
        </div>
        ```
    </TabItem>
    <TabItem value="file" label="File">
        ```php
        <div>
            <h2>ĐẶT HÀNG THÀNH CÔNG</h2>
            <p><b>{{fullName}}</b>, Cám ơn bạn đã đặt hàng!</p>
            <p>{{code}}</p>
            <p><strong>Ngày: {{date}}</strong></p>
        </div>
        ```
    </TabItem>
</Tabs>

##### Gửi mail
```php
$order = Order::get(1);

Email::to('kythuat@sikido.vn')
    ->subject('Email thông báo gia hạn dịch vụ')
    ->replyTo('hotro@sikido.vn', 'Hỗ trợ gia hạn')
    ->body('email/layout-extend.blade', [
        'fullName' => $order->billing_fullname,
        'code' => $order->code,
        'date' => date('d/m/Y')
    ])
    ->send();
```

### EmailHandler
:::warning
Phiên bản EmailHandler là phiên bản củ và dừng hỗ trợ từ cms version 6.4.2 và có thể bị xóa trong tương lai
:::
```php
EmailHandler::send(string $template, string $subject, [
    'name' => string $name,
    'from' => string $email,
    'address'   => string $reciever_email,
    'templateValue' => array $templateValue,
]);
```
