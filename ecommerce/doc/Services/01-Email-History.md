# Email & Lịch Sử Đơn Hàng

---

## EmailService

**Class**: `\Ecommerce\Services\EmailService`  
**Namespace**: `Ecommerce\Services`

Class này xử lý việc gửi email tự động liên quan đến đơn hàng. Các method được đăng ký vào hook trong `bootstrap/order.php`.

### `EmailService::orderCreated($order)`
Gửi email xác nhận đơn hàng mới khi checkout thành công.

**Triggers**: Hook `checkout_after_success`

**Cấu hình** (Admin → Hệ thống → Email):
- `order.created.send_customer` → Gửi email xác nhận cho khách hàng
- `order.created.send_admin` → Gửi email thông báo cho admin (email lấy từ option `contact_mail`)

```php
// Hook mặc định đã đăng ký:
// add_action('checkout_after_success', [EmailService::class, 'orderCreated']);

// Gọi thủ công trong plugin của bạn:
use Ecommerce\Services\EmailService;
use Ecommerce\Models\Order;

$order = Order::find($orderId);
EmailService::orderCreated($order);
```

### `EmailService::orderCancelled($order)`
Gửi email thông báo hủy đơn cho khách.

**Triggers**: Hook `admin_order_status_cancelled_save`

**Điều kiện**: Chỉ gửi khi request có tham số `SendNotificationEmail = 1` (từ form Admin).

```php
// Gọi thủ công:
EmailService::orderCancelled($order);
```

### Template Email

Email được render từ class `\Ecommerce\Supports\EmailTemplate`:
```php
use Ecommerce\Supports\EmailTemplate;

// Lấy HTML template email đơn hàng mới
$html = EmailTemplate::orderCreated($order, 'new_order');

// Lấy HTML template email hủy đơn
$html = EmailTemplate::orderCancelled($order, 'admin_cancelled');
```

### Tuỳ Chỉnh Gửi Email

Bạn có thể gửi email tùy chỉnh sử dụng class `Mail` của SkillDo CMS:

```php
use SkillDo\Cms\Support\Mail;

// Gửi email đơn giản
Mail::to('customer@example.com')
    ->subject('Đơn hàng của bạn đã được xác nhận')
    ->replyTo('noreply@yoursite.com')
    ->body('<h1>Cảm ơn bạn đã đặt hàng!</h1><p>Mã đơn: '.$order->code.'</p>')
    ->send();

// Gửi bằng Blade view
Mail::to($order->email)
    ->subject('Xác nhận đơn hàng #'.$order->code)
    ->body(Prd::partial('emails/order-confirmation', ['order' => $order]))
    ->send();
```

---

## OrderHistoryService

**Class**: `\Ecommerce\Services\OrderHistoryService`  
**Namespace**: `Ecommerce\Services`

Class này ghi log lịch sử hành động vào bảng `order_history`. Được đăng ký trong `bootstrap/history.php`.

### Danh Sách Method

| Method | Hook Đăng Ký | Mô Tả |
|:---|:---|:---|
| `add($order)` | `checkout_after_success` (priority 1) | Ghi log khi tạo đơn từ Frontend |
| `adminAdd($order)` | `admin_order_save_after_success` | Ghi log khi Admin tạo đơn POS |
| `status($order, $status)` | `admin_order_status_update` (priority 1) | Ghi log thay đổi trạng thái |
| `statusPay($order, $status)` | `admin_order_status_pay_paid_success` | Ghi log thay đổi trạng thái thanh toán |
| `cancelled($order, $reason)` | `admin_order_status_cancelled_save` | Ghi log hủy đơn kèm lý do |

> **Lưu ý**: `status()` chỉ ghi log cho các trạng thái: `confirm`, `ship`, `ship-fail`, `completed`.

### Sử Dụng Trong Plugin

```php
use Ecommerce\Services\OrderHistoryService;
use Ecommerce\Models\Order;

// Ghi log thủ công
$order = Order::find($orderId);

// Ghi log khi push đơn lên GHTK
add_action('admin_order_status_update', function($statusNew, $statusOld) {
    if($statusNew == 'ship') {
        $orderId = request()->input('id');
        $order   = Order::find($orderId);

        // Gọi API GHTK để tạo đơn
        $ghtkCode = GhtkService::createOrder($order);

        // Ghi log kết quả
        \Ecommerce\Models\OrderHistory::insert([
            'order_id' => $orderId,
            'action'   => 'ghtk-push',
            'message'  => 'Đơn đã được đẩy lên GHTK. Mã vận đơn: ' . $ghtkCode,
        ]);
    }
}, 20, 2);
```

### Ghi Log Tùy Chỉnh

```php
use Ecommerce\Models\OrderHistory;

// Ghi log tùy chỉnh vào lịch sử đơn hàng
OrderHistory::insert([
    'order_id' => $order->id,
    'action'   => 'your-plugin-action',   // Key hành động
    'message'  => 'Mô tả hành động...',  // Nội dung hiển thị trong Admin
]);

// Lấy lịch sử đơn hàng
$history = OrderHistory::where('order_id', $order->id)
    ->orderByDesc('created')
    ->get();

foreach ($history as $log) {
    echo $log->action;   // Key hành động
    echo $log->message;  // Nội dung
    echo $log->created;  // Thời gian
}
```

---

## Hooks Liên Quan Đến Checkout (Toàn bộ)

Đây là danh sách đầy đủ các Filter/Action được kích hoạt trong luồng Checkout (`EcommerceAjax::saveCheckout`):

### Filter Hooks

| Hook Name | Tham Số | Mô Tả |
|:---|:---|:---|
| `cart_checkout_input` | `$inputs` | Danh sách fields checkout. Thêm/bỏ trường cần validate/lưu |
| `cart_checkout_errors` | `$errors` | Thêm lỗi validate tùy chỉnh trước khi xử lý |
| `cart_add` | `$cart, $requestData, $product, $variation` | Sửa dữ liệu item trước khi insert giỏ |
| `cart_add_variations` | `$cart, $requestData, $product, $variation` | Sửa dữ liệu item có biến thể |
| `cart_add_no_variations` | `$cart, $requestData, $product` | Sửa dữ liệu item đơn giản |
| `cart_add_success_response` | `$result, $cart, $product` | Sửa response trả về JS sau add-to-cart |
| `cart_update_quantity_errors` | `$errors, $item, $rowId, $qty` | Thêm lỗi khi update số lượng |
| `checkout_add_to_cart_errors` | `$errors, $cart, $product, $variation` | Lỗi khi add to cart (validate tồn kho...) |
| `checkout_discounts` | `$discounts, $cart, $request` | Thêm khoản giảm giá (coupon, loyalty points...) |
| `checkout_item_before_save` | `$orderItem, $cartItem` | Sửa từng sản phẩm trước khi lưu vào đơn |
| `checkout_order_before_save` | `$order, $metadata, $data, $cart` | Sửa toàn bộ đơn hàng trước khi INSERT |
| `checkout_order_metadata_before_save` | `$metadata, $order, $data, $cart` | Sửa metadata trước khi lưu |
| `checkout_order_after_save` | `$order, $data, $userId` | Xử lý sau khi đơn đã được INSERT |
| `checkout_order_before_save_new_user` | `$customer, $order` | Sửa data trước khi tạo user mới từ checkout |
| `checkout_result_success` | `$response, $orderId` | Sửa response JSON trả về sau checkout thành công |
| `get_order_item_totals` | `$totals, $order` | Thêm dòng vào breakdown tổng tiền đơn hàng |
| `shipping_price_{shipping_key}` | `$price` | Override phí ship cho từng phương thức (VD: `shipping_price_ghtk`) |
| `product_detail_load_price_variation` | `$variation, $productId` | Sửa variation khi Ajax load giá |
| `product_detail_price_template` | `$html` | Sửa HTML block giá trên detail page |

### Action Hooks

| Hook Name | Tham Số | Mô Tả |
|:---|:---|:---|
| `cart_checkout_process` | — | Trước khi bắt đầu xử lý checkout |
| `checkout_add_to_cart` | `$cart, $product, $variation` | Khi item được thêm vào giỏ |
| `cart_update_quantity` | `$rowId, $qty` | Trước khi cập nhật số lượng |
| `cart_update_quantity_success` | `$item, $qty` | Sau khi cập nhật số lượng thành công |
| `checkout_after_success` | `$order, $orderId` | Sau khi đơn được tạo thành công |

### 💡 Ví dụ: Plugin Mã Giảm Giá (Coupon)

```php
// Áp dụng coupon vào checkout
add_filter('checkout_discounts', function($discounts, $cart, $request) {
    $couponCode = $request->input('coupon_code');
    if(empty($couponCode)) return $discounts;

    $coupon = DB::table('coupons')->where('code', $couponCode)->first();
    if(!$coupon) return $discounts;

    $discounts[] = [
        'label' => 'Mã giảm giá: ' . $couponCode,
        'value' => $coupon->discount_amount, // Số tiền giảm
    ];

    return $discounts;
}, 10, 3);
```

### 💡 Ví dụ: Plugin Kiểm Tra Tồn Kho

```php
// Validate tồn kho trước khi đặt hàng
add_filter('checkout_add_to_cart_errors', function($errors, $cart, $product, $variation) {
    $checkId = !empty($variation) ? $variation->id : $product->id;
    $stock   = DB::table('stocks')->where('product_id', $checkId)->value('quantity');

    if($stock !== null && $stock < $cart['qty']) {
        $errors = skd_error('Sản phẩm "'.$product->title.'" chỉ còn '.$stock.' sản phẩm!');
    }

    return $errors;
}, 10, 4);
```

