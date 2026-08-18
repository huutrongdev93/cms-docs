# Trạng Thái Đơn Hàng

Sicommerce sử dụng PHP `enum` (backed by string) để quản lý trạng thái đơn hàng. Có hai enum riêng biệt: **OrderStatus** cho trạng thái vận chuyển/xử lý và **OrderPay** cho trạng thái thanh toán.

---

## OrderStatus – Trạng Thái Xử Lý Đơn

**Class**: `\Ecommerce\Status\OrderStatus`  
**Backed type**: `string`

### Danh Sách Trạng Thái

| Case | Giá Trị (`value`) | Nhãn | Màu Hex | Badge Class |
|:---|:---|:---|:---|:---|
| `WAIT` | `wait` | Chờ xác nhận | `#6e7173` | `gray` |
| `CONFIRM` | `confirm` | Đã xác nhận | `#186caa` | `cyan` |
| `WAIT_PICKUP` | `wait-pickup` | Chờ lấy hàng | `#fdbd41` | `yellow` |
| `PICKUP_FAIL` | `pickup-fail` | Lấy hàng thất bại | `#fdbd41` | `warning` |
| `PICKUP` | `pickup` | Đang lấy hàng | `#fdbd41` | `purple` |
| `PROCESSING` | `processing` | Đang xử lý | `#57d616` | `lime` |
| `SHIPPING` | `ship` | Đang giao hàng | `#36a3f7` | `blue` |
| `SHIPPING_FAIL` | `ship-fail` | Giao thất bại | `#db7878` | `pink` |
| `COMPLETED` | `completed` | Hoàn thành | `#22c993` | `green` |
| `CANCELLED` | `cancelled` | Đã hủy | `#db7878` | `red` |

### Sử Dụng Enum Trực Tiếp

```php
use Ecommerce\Status\OrderStatus;

// Lấy giá trị (value)
$value = OrderStatus::WAIT->value;         // 'wait'
$value = OrderStatus::COMPLETED->value;    // 'completed'

// Lấy label (có hỗ trợ đa ngôn ngữ)
$label = OrderStatus::CONFIRM->label();    // 'Đã xác nhận'

// Lấy màu hex
$color = OrderStatus::SHIPPING->color();   // '#36a3f7'

// Lấy badge class
$badge = OrderStatus::CANCELLED->badge();  // 'red'

// Kiểm tra giá trị có tồn tại không
$exists = OrderStatus::has('confirm');     // true
$exists = OrderStatus::has('invalid');     // false

// Tạo từ string
$status = OrderStatus::tryFrom('ship');    // OrderStatus::SHIPPING
$status = OrderStatus::from('completed'); // OrderStatus::COMPLETED

// Lấy tất cả options cho select
$options = OrderStatus::options()->toArray();
// [['value' => 'wait', 'label' => 'Chờ xác nhận'], ...]

// Mã trạng thái kiểu cũ (v7) - dùng khi cần tương thích ngược
$old = OrderStatus::SHIPPING->old();       // 'wc-ship'
```

> `label()` lấy nhãn từ file dịch (`sicommerce::order.status.*`) nên thay đổi theo ngôn ngữ đang chọn — các nhãn trong bảng trên là bản tiếng Việt.

### Sử Dụng qua OrderHelper

```php
use Ecommerce\Supports\OrderHelper;

// Lấy tất cả trạng thái (array đầy đủ)
$statuses = OrderHelper::status();
// ['wait' => ['label' => '...', 'color' => '...', 'colorClass' => '...'], ...]

// Lấy một thuộc tính cụ thể
$label = OrderHelper::status('wait', 'label');       // 'Chờ xác nhận'
$color = OrderHelper::status('confirm', 'color');    // '#186caa'
$badge = OrderHelper::status('completed', 'colorClass'); // 'green'
```

### Tuỳ Chỉnh Trạng Thái Qua Filter

```php
// Tuỳ chỉnh tên hiển thị
add_filter('order_status_label', function($label, $value) {
    if($value == 'wait') return 'Đơn mới - Chờ xác nhận';
    return $label;
}, 10, 2);

// Tuỳ chỉnh màu
add_filter('order_status_color', function($color, $value) {
    if($value == 'completed') return '#00aa55'; // Màu xanh đậm hơn
    return $color;
}, 10, 2);

// Tuỳ chỉnh badge class
add_filter('order_status_badge', function($badge, $value) {
    return $badge;
}, 10, 2);

// Tuỳ chỉnh mã trạng thái kiểu cũ
add_filter('order_status_old', function($old, $value) {
    return $old;
}, 10, 2);

// Thêm trạng thái vào danh sách (qua OrderHelper::status)
add_filter('order_status', function($statusData) {
    $statusData['packaging'] = [
        'label'      => 'Đang đóng gói',
        'color'      => '#ff9900',
        'colorClass' => 'orange',
    ];
    return $statusData;
});
```

---

## OrderPay – Trạng Thái Thanh Toán

**Class**: `\Ecommerce\Status\OrderPay`  
**Backed type**: `string`

### Danh Sách Trạng Thái

| Case | Giá Trị (`value`) | Nhãn | Màu | Badge |
|:---|:---|:---|:---|:---|
| `WAIT` | `unpaid` | Chưa thanh toán | `#36a3f7` | `gray` |
| `COMPLETED` | `paid` | Đã thanh toán | `#22c993` | `green` |
| `RETURN` | `refunded` | Đã hoàn tiền | `#ffc1c1` | `red` |

### Sử Dụng

```php
use Ecommerce\Status\OrderPay;

$value = OrderPay::COMPLETED->value;   // 'paid'
$label = OrderPay::WAIT->label();      // 'Chưa thanh toán'

// Kiểm tra
$exists = OrderPay::has('paid');       // true

// Từ string
$pay = OrderPay::tryFrom('refunded'); // OrderPay::RETURN

// Lấy tất cả options
$options = OrderPay::options()->toArray();
```

### Sử Dụng qua OrderHelper

```php
use Ecommerce\Supports\OrderHelper;

$payStatuses = OrderHelper::statusPay();
$label = OrderHelper::statusPay('paid', 'label');   // 'Đã thanh toán'
$color = OrderHelper::statusPay('unpaid', 'color'); // '#36a3f7'
```

---

## Hook Liên Quan Đến Trạng Thái

### Hooks Thay Đổi Trạng Thái Đơn
```php
// Trước khi lưu trạng thái mới (để validate)
add_action('admin_order_status_before_update', function($statusNew, $statusOld) {
    // Ngăn chuyển từ completed về wait
    if($statusOld == 'completed' && $statusNew == 'wait') {
        response()->error('Không thể chuyển đơn đã hoàn thành về chờ xác nhận!');
    }
}, 1, 2);

// Sau khi lưu trạng thái mới
add_action('admin_order_status_update', function($statusNew, $statusOld) {
    $orderId = request()->input('id');
    // Xử lý logic
}, 10, 2);

// Hook riêng cho từng trạng thái (pattern: admin_order_status_{value}_save)
add_action('admin_order_status_completed_save', function($orderId) {
    // Chỉ chạy khi đơn hoàn thành
}, 10, 1);

add_action('admin_order_status_cancelled_save', function($orderId) {
    // Chỉ chạy khi đơn bị hủy
}, 10, 1);
```

### Hooks Thay Đổi Trạng Thái Thanh Toán
```php
add_action('admin_order_status_pay_update', function($statusNew, $statusOld) {
    // Khi trạng thái thanh toán thay đổi
}, 10, 2);

// Pattern: admin_order_status_pay_{value}_success
add_action('admin_order_status_pay_paid_success', function($orderId) {
    // Chỉ chạy khi đơn được đánh dấu đã thanh toán
}, 10, 1);
```

---

## Tích Hợp Với Plugin Ghi Log

```php
use Ecommerce\Status\OrderStatus;
use Ecommerce\Services\OrderHistoryService;
use Ecommerce\Models\Order;

// Trong plugin của bạn - ghi log khi trạng thái thay đổi
add_action('admin_order_status_update', function($statusNew, $statusOld) {
    $orderId = request()->input('id');
    $order   = Order::find($orderId);

    if($statusNew == OrderStatus::SHIPPING->value) {
        OrderHistoryService::status($order, $statusNew);
        // Thêm thông báo Push Notification cho khách hàng
    }
}, 5, 2);
```

