## Tương tác với Session

### Lấy Session

Có hai cách chính để làm việc với dữ liệu `session` trong **Skilldo**: sử dụng helper `session` hoặc thông qua `request`. 
>
Trước tiên, hãy xem xét việc truy cập `session` thông qua `request`

```php
$value = request()->session()->get('key');
 
#[NoReturn]
function demoMethod(SkillDo\Request\HttpRequest $request, $model): void
{
    $request->session()->get('key')
}
```

Khi bạn truy xuất một mục từ session, bạn cũng có thể chuyển giá trị mặc định làm đối số thứ hai cho phương thức get. Giá trị mặc định này sẽ được trả về nếu khóa được chỉ định không tồn tại trong `session`. Nếu bạn chuyển một closure làm giá trị mặc định cho phương thức get và key được yêu cầu không tồn tại, thì closure sẽ được thực thi và kết quả của nó được trả về:
```php
$value = request()->session()->get('key', 'default');
 
$value = request()->session()->get('key', function () {
    return 'default';
});
```

Bạn cũng có thể sử dụng `session` để truy xuất và lưu trữ dữ liệu trong session. Khi `session` helper được gọi với một đối số kiểu **string**, 
nó sẽ trả về giá trị của key session đó. Khi helper được gọi với một array có cặp key/value, các giá trị đó sẽ được lưu trữ trong session:

```php
$value = session('key');
 
// Specifying a default value...
$value = session('key', 'default');
 
// Store a piece of data in the session...
session(['key' => 'value']);
```

### Lấy Toàn Bộ Session

Nếu bạn muốn lấy tất cả dữ liệu trong session, bạn có thể sử dụng phương thức all:

```php
$data = session()->all();
```

### Kiểm Tra Session

Để xác định xem một mục có mặt trong session hay không, bạn có thể sử dụng phương thức `has`. Phương thức `has` trả về **true** nếu mục này có tồn tại và không phải là `null`:
```php
if (session()->has('users')) {
    // ...
}
```

Để xác định xem một mục có hiện diện trong phiên hay không, ngay cả khi giá trị của nó là null, bạn có thể sử dụng phương thức `exists`:
```php
if (session()->exists('users')) {
    // ...
}
```

### Lưu Session
Để lưu trữ dữ liệu trong session, Bạn sẽ sử dụng method `put`:
```php
// Via a request instance...
session()->put('key', 'value');
 
// Via the global "session" helper...
session(['key' => 'value']);
```

### Thay đổi một giá trị session
Phương thức `push` có thể được sử dụng để push một giá trị mới lên giá trị phiên là một mảng

```php
// Example data session
/* 
[
    user =>  [
        teams => 'ceo',
        old => 25
    ]
]
*/
session()->push('user.teams', 'developers');
```

### Lấy và xóa một mục
Phương thức `pull` sẽ lấy data và xóa mục đó khỏi `session` trong một câu lệnh:

```php
$value = session()->pull('key', 'default');
```

### Dữ liệu Flash

Đôi khi bạn có thể muốn lưu trữ các mục trong session cho request tiếp theo. Bạn có thể làm như vậy bằng cách sử dụng phương pháp flash. 
Dữ liệu được lưu trữ trong session sử dụng phương pháp này sẽ có sẵn ngay lập tức và trong yêu cầu HTTP tiếp theo. 
Sau yêu cầu HTTP tiếp theo, dữ liệu được flash sẽ bị xóa. Dữ liệu flash chủ yếu hữu ích cho các thông báo trạng thái có thời gian tồn tại ngắn:

```php
session()->flash('status', 'Task was successful!');
```

### Xóa Data Session
Phương thức `forget` sẽ xóa dữ liệu một mục có key được chỉ định khỏi session

```php
session()->forget('name');
```

Phương thức `flush` xóa tất cả dữ liệu khỏi session

```php
session()->flush();
```