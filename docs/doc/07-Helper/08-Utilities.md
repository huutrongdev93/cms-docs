### Deferred Functions
Deferred Functions cho phép bạn trì hoãn việc thực thi closure cho đến sau khi phản hồi HTTP được gửi tới người dùng, 
giúp ứng dụng của bạn luôn có cảm giác nhanh. Để trì hoãn việc thực thi một closure, chỉ cần chuyển closure đó tới hàm `defer`:

```php
defer(fn () => User::where('status', 'public')->update(['status' => 'pending']), 'uploadUser');
```

Theo mặc định, các hàm defer sẽ chỉ được thực thi nếu phản hồi HTTP được gọi hoàn tất thành công. Điều này có nghĩa là các hàm defer sẽ không được thực thi nếu yêu cầu dẫn đến phản hồi HTTP `4xx` hoặc `5xx`. 
Nếu bạn muốn một hàm trì hoãn luôn được thực thi, bạn có thể xâu chuỗi phương thức `Always` vào hàm defer của mình:

```php
defer(fn () => User::where('status', 'public')->update(['status' => 'pending']), 'uploadUser')->always();
```

#### Hủy bỏ Deferred Functions

Nếu bạn cần hủy một hàm bị trì hoãn trước khi nó được thực thi, bạn có thể sử dụng phương thức `forget` để hủy hàm theo tên của nó. 
Để đặt tên cho một hàm bị trì hoãn, hãy cung cấp đối số thứ hai cho hàm `defer`:

```php
defer(fn () => User::where('status', 'public')->update(['status' => 'pending']), 'uploadUser');

defer()->forget('uploadUser');
```