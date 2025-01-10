# Trạng thái đơn hàng
### Lấy danh sách trạng thái
```php
\Ecommerce\Enum\Order\Status::options()
```
### Kiểm tra trạng thái
Kiểm tra một chuổi string có phải là key của một trạng thái bạn dùng method `has`

```php
use Ecommerce\Enum\Order;
Status::has('status-key'); //false
Status::has('wait'); //true
```
### Lấy Thông tin trạng thái

```php
use Ecommerce\Enum\Order;
Status::tryFrom('wait')->label();
```
### Danh sách trạng thái
#### Đợi duyệt
Lấy key trạng thái
```php
Status::WAIT->value
```
Lấy tên trạng thái
```php
Status::WAIT->label()
```

Lấy mã màu trạng thái
```php
Status::WAIT->color()
```

Lấy mã badge trạng thái
```php
Status::WAIT->badge()
```

#### Đã duyệt
Lấy key trạng thái
```php
Status::CONFIRM->value
```
Lấy tên trạng thái
```php
Status::CONFIRM->label()
```

Lấy mã màu trạng thái
```php
Status::CONFIRM->color()
```

Lấy mã badge trạng thái
```php
Status::CONFIRM->badge()
```

#### Đã đóng gói - đợi lấy hàng
Lấy key trạng thái
```php
Status::WAIT_PICKUP->value
```
Lấy tên trạng thái
```php
Status::WAIT_PICKUP->label()
```

Lấy mã màu trạng thái
```php
Status::WAIT_PICKUP->color()
```

Lấy mã badge trạng thái
```php
Status::WAIT_PICKUP->badge()
```

#### Lấy hàng thất bại
Lấy key trạng thái
```php
Status::PICKUP_FAIL->value
```
Lấy tên trạng thái
```php
Status::PICKUP_FAIL->label()
```

Lấy mã màu trạng thái
```php
Status::PICKUP_FAIL->color()
```

Lấy mã badge trạng thái
```php
Status::PICKUP_FAIL->badge()
```

#### Shipper đã lấy hàng chờ giao hàng
Lấy key trạng thái
```php
Status::PROCESSING->value
```
Lấy tên trạng thái
```php
Status::PROCESSING->label()
```

Lấy mã màu trạng thái
```php
Status::PROCESSING->color()
```

Lấy mã badge trạng thái
```php
Status::PROCESSING->badge()
```

#### Đang giao hàng
Lấy key trạng thái
```php
Status::SHIPPING->value
```
Lấy tên trạng thái
```php
Status::SHIPPING->label()
```

Lấy mã màu trạng thái
```php
Status::SHIPPING->color()
```

Lấy mã badge trạng thái
```php
Status::SHIPPING->badge()
```

#### Giao hàng thất bại
Lấy key trạng thái
```php
Status::SHIPPING_FAIL->value
```
Lấy tên trạng thái
```php
Status::SHIPPING_FAIL->label()
```

Lấy mã màu trạng thái
```php
Status::SHIPPING_FAIL->color()
```

Lấy mã badge trạng thái
```php
Status::SHIPPING_FAIL->badge()
```

#### Giao hàng thành công
Lấy key trạng thái
```php
Status::COMPLETED->value
```
Lấy tên trạng thái
```php
Status::COMPLETED->label()
```

Lấy mã màu trạng thái
```php
Status::COMPLETED->color()
```

Lấy mã badge trạng thái
```php
Status::COMPLETED->badge()
```

#### Đơn hàng bị hủy
Lấy key trạng thái
```php
Status::CANCELLED->value
```
Lấy tên trạng thái
```php
Status::CANCELLED->label()
```

Lấy mã màu trạng thái
```php
Status::CANCELLED->color()
```

Lấy mã badge trạng thái
```php
Status::CANCELLED->badge()
```