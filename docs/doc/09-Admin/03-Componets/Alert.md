# Alert
Hiển thị thông báo cảnh báo cần chú ý, Để sử dụng component alert bạn sử dụng

```php
Admin::alert($template, $message, $attributes)
```

Các loại template button
- success
![img_1.png](img_1.png)
```php
echo Admin::alert('success', 'Đây là nội dung thông báo');
```

- info
![img_2.png](img_2.png)
```php
echo Admin::alert('info', 'Đây là nội dung thông báo');
```

- warning
![img_3.png](img_3.png)
```php
echo Admin::alert('warning', 'Đây là nội dung thông báo');
```

- error
![img_4.png](img_4.png)
```php
echo Admin::alert('error', 'Đây là nội dung thông báo');
```
Danh sách attributes:

| Key     |  Type  |        Description |
|---------|:------:|-------------------:|
| icon    | string | icon của thông báo |
| heading | string |  tiêu đề thông báo |

```php
echo Admin::alert('warning', 'Đây là nội dung thông báo', [
    'heading' => 'Header'
]);
```