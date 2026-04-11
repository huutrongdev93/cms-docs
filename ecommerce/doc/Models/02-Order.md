# Order (Đơn Hàng)

**Class**: `\Ecommerce\Models\Order`  
**Alias**: `Order` (đã đăng ký toàn cục)  
**Table**: `order`  
**Namespace**: `Ecommerce\Models`

---

## Cấu trúc Cột (Columns)

### Bảng `order` (cột chính)

| Tên Cột | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `code` | string | — | Mã đơn hàng (tự sinh, VD: `1012`) |
| `total` | int | `0` | Tổng tiền thực tế thanh toán (VND) |
| `status` | string | `wait` | Trạng thái đơn hàng (xem OrderStatus) |
| `status_pay` | string | `unpaid` | Trạng thái thanh toán (xem OrderPay) |

### Metadata (bảng `order_metadata` / `order_history`)
Các trường mở rộng được tải tự động khi truy vấn Order thông qua `Order::data()`:

| Tên Field | Mô tả |
|:---|:---|
| `name` | Họ tên khách hàng |
| `phone` | Số điện thoại |
| `email` | Email |
| `address` | Địa chỉ giao hàng |
| `city` | Tỉnh/Thành phố (code) |
| `ward` | Phường/Xã (code) |
| `note` | Ghi chú đơn hàng |
| `payment_type` | Key cổng thanh toán đã chọn (VD: `vnpay`, `cod`) |
| `shipping_type` | Key đơn vị vận chuyển đã chọn |
| `shipping` | Phí vận chuyển (int) |
| `shipping_name` | Tên đơn vị vận chuyển |
| `discounts` | Mảng các khoản giảm giá được áp dụng |
| `currency` | Đối tượng tiền tệ tại thời điểm đặt hàng |
| `user_id` | ID khách hàng (nếu đã đăng nhập) |
| `security_code` | Mã bảo mật để xác thực callback |

> **Lưu ý**: Các trường metadata được gắn tự động vào object Order thông qua event `retrieved` → `Order::data()`.

---

## Truy Vấn Cơ Bản

```php
// Lấy đơn hàng theo ID (kèm theo metadata và items)
$order = Order::find(100);
echo $order->name;        // Họ tên khách (từ metadata)
echo $order->total;       // Tổng tiền
echo $order->status;      // 'wait', 'confirm', 'completed'...
echo $order->status_pay;  // 'unpaid', 'paid', 'refunded'

// Items của đơn hàng (tự động load)
foreach ($order->items as $item) {
    echo $item->title;    // Tên sản phẩm
    echo $item->quantity; // Số lượng
    echo $item->price;    // Đơn giá
    echo $item->subtotal; // Thành tiền
}

// Tìm theo mã đơn hàng
$order = Order::where('code', '1025')->first();

// Đơn hàng đang chờ xác nhận
$orders = Order::where('status', 'wait')->get();

// Đơn hàng của khách hàng cụ thể (qua metadata user_id)
// Cần join với order_metadata
$orders = Order::whereHasMeta('user_id', $userId)->get();
```

---

## Model OrderItem

**Class**: `\Ecommerce\Models\OrderItem`  
**Alias**: `OrderItem`  
**Table**: `order_detail`

```php
// Lấy tất cả items của đơn hàng
$items = OrderItem::where('order_id', $orderId)->get();

foreach ($items as $item) {
    echo $item->title;      // Tên sản phẩm
    echo $item->product_id; // ID sản phẩm
    echo $item->price;      // Đơn giá
    echo $item->quantity;   // Số lượng
    echo $item->subtotal;   // = price * quantity
    // $item->option  – mảng biến thể (color, size, variation_id...)
    // $item->image   – ảnh sản phẩm tại thời điểm đặt
}
```

### Hook `pre_insert_order_item_data`
Được gọi trước khi insert OrderItem, dùng để chỉnh sửa dữ liệu:
```php
add_filter('pre_insert_order_item_data', function($data) {
    // Lưu thêm thông tin vào option
    $data['option']['barcode'] = '...';
    return $data;
});
```

---

## Model OrderHistory

**Class**: `\Ecommerce\Models\OrderHistory`  
**Table**: `order_history`

Dùng để ghi log lịch sử hành động trên đơn hàng:

```php
use Ecommerce\Models\OrderHistory;

OrderHistory::insert([
    'order_id' => $orderId,
    'action'   => 'your-plugin-action',
    'message'  => 'Đơn hàng đã được đẩy lên GHTK. Mã vận đơn: GHT123456',
]);

// Lấy lịch sử
$history = OrderHistory::where('order_id', $orderId)
    ->orderByDesc('created')
    ->get();
```

Dùng `OrderHistoryService` để ghi log theo chuẩn hệ thống:
```php
use Ecommerce\Services\OrderHistoryService;

// Ghi log sau khi tạo đơn (frontend)
OrderHistoryService::add($order);

// Ghi log thay đổi trạng thái
OrderHistoryService::status($order, 'confirm');
OrderHistoryService::statusPay($order, 'paid');

// Ghi log huỷ đơn
OrderHistoryService::cancelled($order, 'Khách yêu cầu hủy');
```

---

## Trạng Thái Đơn Hàng

### OrderStatus (Enum `\Ecommerce\Status\OrderStatus`)

| Giá trị | Tên | Màu Badge | Mô tả |
|:---|:---|:---|:---|
| `wait` | Chờ xác nhận | gray | Đơn mới tạo |
| `confirm` | Đã xác nhận | cyan | Admin đã xác nhận |
| `wait-pickup` | Chờ lấy hàng | yellow | Đang chuẩn bị |
| `pickup-fail` | Lấy hàng thất bại | warning | Courier không lấy được |
| `pickup` | Đã lấy hàng | purple | Hàng đã được lấy |
| `processing` | Đang xử lý | lime | Đóng gói/xử lý |
| `ship` | Đang giao | blue | Đang trên đường đi |
| `ship-fail` | Giao thất bại | pink | Giao không thành công |
| `completed` | Hoàn thành | green | Giao thành công |
| `cancelled` | Đã hủy | red | Đơn bị hủy |

### OrderPay (Enum `\Ecommerce\Status\OrderPay`)

| Giá trị | Tên | Mô tả |
|:---|:---|:---|
| `unpaid` | Chưa thanh toán | Mặc định khi tạo đơn |
| `paid` | Đã thanh toán | Đã nhận tiền |
| `refunded` | Đã hoàn tiền | Đã trả lại tiền khách |

```php
use Ecommerce\Supports\OrderHelper;

// Lấy tất cả trạng thái để dùng cho Select/Radio
$statuses = OrderHelper::status();
// [['wait' => ['label' => 'Chờ xác nhận', 'color' => '#6e7173', 'colorClass' => 'gray']], ...]

// Lấy label của một trạng thái
$label = OrderHelper::status('wait', 'label');    // 'Chờ xác nhận'
$color = OrderHelper::status('confirm', 'color'); // '#186caa'
$badge = OrderHelper::status('completed', 'colorClass'); // 'green'

// Trạng thái thanh toán
$payStatuses = OrderHelper::statusPay();
$payLabel    = OrderHelper::statusPay('paid', 'label'); // 'Đã thanh toán'
```

---

## Hooks Đơn Hàng – Trạng Thái

### `admin_order_status_update`
Được gọi sau mỗi lần Admin thay đổi trạng thái đơn.

```php
add_action('admin_order_status_update', function($statusNew, $statusOld) {
    $order = Order::find(request()->input('id'));

    if($statusNew == 'completed') {
        // Bắn API đánh dấu hoàn thành bên kho
        Http::post('https://warehouse.api/complete', ['order_id' => $order->id]);
    }
}, 10, 2);
```

### `admin_order_status_{status}_save`
Hook chính xác cho từng trạng thái cụ thể. Pattern: `admin_order_status_{status_value}_save`

```php
// Chỉ khi đơn bị HỦY
add_action('admin_order_status_cancelled_save', function($orderId) {
    // Hoàn điểm tích lũy
    $order = Order::find($orderId);
    User::where('id', $order->user_id)->decrement('loyalty_points', 10);
}, 20, 1);

// Chỉ khi đơn hoàn thành
add_action('admin_order_status_completed_save', function($orderId) {
    $order = Order::find($orderId);
    // Gửi email cảm ơn
}, 10, 1);
```

### `admin_order_status_pay_update`
Khi trạng thái thanh toán thay đổi:
```php
add_action('admin_order_status_pay_update', function($statusNew, $statusOld) {
    if($statusNew == 'paid') {
        // Kích hoạt dịch vụ / tài khoản
    }
}, 10, 2);
```

### `admin_order_status_pay_{status}_success`
Hook chính xác cho từng trạng thái thanh toán:
```php
add_action('admin_order_status_pay_paid_success', function($orderId) {
    // Kích hoạt license key
}, 10, 2);
```

---

## Helper Tổng Tiền Đơn Hàng

```php
// Lấy mảng breakdown chi tiết tổng tiền đơn hàng (cho view)
$totals = get_order_item_totals($order);
// [
//   ['label' => 'Tạm tính', 'value' => '450.000đ', 'position' => 0],
//   ['label' => 'Giao Hàng Nhanh', 'value' => '35.000đ', 'position' => 10],
//   ['label' => 'Giảm giá', 'value' => '- 50.000đ', 'position' => 20],
//   ['label' => 'Thành tiền', 'value' => '435.000đ', 'position' => 50],
// ]

// Dùng filter để thêm dòng tùy chỉnh vào breakdown
add_filter('get_order_item_totals', function($totals, $order) {
    $totals[] = [
        'label'    => 'Phí xử lý',
        'value'    => Prd::price(5000),
        'position' => 15, // Hiển thị giữa phí ship (10) và discount (20)
    ];
    return $totals;
}, 10, 2);
```

---

## Tạo Mã Đơn Hàng Tùy Chỉnh

```php
// Mặc định mã đơn = 1000 + $id → "1012"
// Để tuỳ chỉnh, dùng filter:
add_filter('order_generate_code', function($code) {
    $orderId = Order::orderByDesc('id')->value('id');
    return 'DH' . str_pad($orderId, 6, '0', STR_PAD_LEFT); // DH000012
});
```

