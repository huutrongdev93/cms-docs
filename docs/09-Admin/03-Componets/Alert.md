# Alert
Hiển thị thông báo cảnh báo cần chú ý, Để sử dụng component alert bạn sử dụng

```php
Admin::alert($template, $message, $attributes)
```

Các loại template button
- error
- warning
- info
- success

Danh sách attributes:

| Key     |  Type  |        Description |
|---------|:------:|-------------------:|
| icon    | string | icon của thông báo |
| heading | string |  tiêu đề thông báo |

```php
echo Admin::alert('warning', 'Đây là nội dung thông báo');
```