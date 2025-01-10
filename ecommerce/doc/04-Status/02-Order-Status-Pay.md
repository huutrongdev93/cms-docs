# Trạng thái thanh toán
### Lấy danh sách trạng thái
```php
\Ecommerce\Enum\Order\StatusPay::options()
```
### Kiểm tra trạng thái
Kiểm tra một chuổi string có phải là key của một trạng thái bạn dùng method `has`

```php
use Ecommerce\Enum\Order;
StatusPay::has('status-key'); //false
StatusPay::has('paid'); //true
```
### Lấy Thông tin trạng thái

```php
use Ecommerce\Enum\Order;
StatusPay::tryFrom('paid')->label();
```
### Danh sách trạng thái
#### Chưa thanh toán
Lấy key trạng thái
```php
StatusPay::WAIT->value
```
Lấy tên trạng thái
```php
StatusPay::WAIT->label()
```

Lấy mã màu trạng thái
```php
StatusPay::WAIT->color()
```

Lấy mã badge trạng thái
```php
StatusPay::WAIT->badge()
```

#### Đã thanh toán
Lấy key trạng thái
```php
StatusPay::COMPLETED->value
```
Lấy tên trạng thái
```php
StatusPay::COMPLETED->label()
```

Lấy mã màu trạng thái
```php
StatusPay::COMPLETED->color()
```

Lấy mã badge trạng thái
```php
StatusPay::COMPLETED->badge()
```

#### Đơn hàng đã hoàn tiền
Lấy key trạng thái
```php
StatusPay::RETURN->value
```
Lấy tên trạng thái
```php
StatusPay::RETURN->label()
```

Lấy mã màu trạng thái
```php
StatusPay::RETURN->color()
```

Lấy mã badge trạng thái
```php
StatusPay::RETURN->badge()
```