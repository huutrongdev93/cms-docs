# Loading
Tạo hiệu ứng loading cho trang bạn sử dụng component
```php
Admin::loading($id, $class)
```
method Admin::loading sẽ trả về mã html loading với 2 tham số
- $id: đặt id cho dom loading
- $class: thêm class cho dom loading
Ví dụ: tạo loading trong một file blade

```php
{!! Admin::loading('loading-simple'); !!}
```
Để hiển thị loading bạn dùng jquery:

```javascript
$('#loading-simple').show();
```

Để ẩn loading bạn dùng jquery:

```javascript
$('#loading-simple').hide();
```