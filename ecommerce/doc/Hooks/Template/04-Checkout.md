# 4. Template Hooks: Trang Checkout & Thanh toán

Luồng thanh toán của Sicommerce được tổ chức xung quanh hook trung tâm `checkout_content`. Mỗi section của form checkout được đăng ký vào hook này với priority khác nhau, qua class `\Ecommerce\Modules\Web\Checkout\Checkout`.

---

## Sơ đồ Hook Checkout

```
checkout_content
  ├── priority 20 → Checkout::billingField()   → Form địa chỉ thanh toán
  ├── priority 30 → Checkout::orderField()     → Form review đơn hàng + nút đặt
  ├── priority 40 → Checkout::payment()        → Danh sách cổng thanh toán
  └── priority 40 → Checkout::shipping()       → Danh sách phương thức vận chuyển
```

---

## Bảng Hook Theo Priority

| Hook Name          | Priority | Class::Method            | Mô tả                                                       | Tham số |
|:-------------------|:--------:|:-------------------------|:------------------------------------------------------------|:--------|
| `checkout_content` |    20    | `Checkout::billingField` | Form địa chỉ thanh toán (Họ tên, SDT, Tỉnh/Phường, Địa chỉ) | `$cart` |
| `checkout_content` |    30    | `Checkout::orderField`   | Review đơn hàng, giảm giá, tổng tiền, nút **Đặt hàng**      | `$cart` |
| `checkout_content` |    40    | `Checkout::payment`      | Danh sách cổng thanh toán (Radio list)                      | `$cart` |
| `checkout_content` |    40    | `Checkout::shipping`     | Danh sách phương thức giao hàng (Radio list)                | `$cart` |

---

## Thêm Nội Dung Vào Trang Checkout

### 💡 Ví dụ: Thêm thông báo tùy chỉnh trước form địa chỉ
```php
add_action('checkout_content', function() {
    echo '<div class="alert alert-info">Miễn phí vận chuyển cho đơn trên 500.000đ!</div>';
}, 15); // Trước billingField (20)
```

### 💡 Ví dụ: Thêm field ghi chú đơn hàng
```php
add_action('checkout_content', function() {
    echo '<div class="checkout-note">';
    echo '<label>Ghi chú đơn hàng:</label>';
    echo '<textarea name="order_note" rows="3" placeholder="Ghi chú thêm cho đơn hàng..."></textarea>';
    echo '</div>';
}, 35); // Giữa orderField và payment
```

### 💡 Ví dụ: Ẩn phần chọn phương thức vận chuyển (website digital/download)
```php
remove_action('checkout_content', [\Ecommerce\Modules\Web\Checkout\Checkout::class, 'shipping'], 40);
```

---

## Hook Sau Khi Đặt Hàng Thành Công

### `checkout_after_success`
Được kích hoạt ngay sau khi đơn hàng được tạo thành công. Đây là hook **cực kỳ quan trọng** cho mọi tích hợp hậu kỳ.

| Tham số  | Mô tả                                                      |
|:---------|:-----------------------------------------------------------|
| `$order` | Đối tượng Order đầy đủ thông tin (bao gồm items, metadata) |

**Các action được đăng ký mặc định:**
```php
// Ghi log lịch sử (priority 1)
add_action('checkout_after_success', [OrderHistoryService::class, 'add'], 1);
// Gửi email thông báo cho khách + admin
add_action('checkout_after_success', [EmailService::class, 'orderCreated']);
```

**Ví dụ mở rộng:**
```php
// Trong plugin của bạn
add_action('checkout_after_success', function($order) {
    // 1. Dọn giỏ hàng (nếu bạn tự xử lý checkout flow)
    Scart::empty();

    // 2. Bắn webhook sang hệ thống kho
    Http::post('https://your-warehouse.com/webhook/new-order', [
        'order_id'    => $order->id,
        'order_code'  => $order->code,
        'total'       => $order->total,
        'items'       => $order->items->toArray(),
    ]);

    // 3. Ghi điểm thưởng cho khách
    User::where('id', $order->user_id)->increment('loyalty_points', 10);
}, 20);
```

---

## Hook Kiểm Tra Trước Khi Đặt Hàng

Quy trình đặt hàng đi qua ba hook theo thứ tự:

| Hook | Loại | Mô tả |
|:---|:---|:---|
| `cart_checkout_input` | filter | Can thiệp dữ liệu người dùng gửi lên trước khi xử lý |
| `cart_checkout_process` | action | Chạy ngay trước bước kiểm tra lỗi |
| `cart_checkout_errors` | filter | Trả về `SKD_Error` để **chặn** đơn hàng |

### `cart_checkout_errors`
Được gọi trước khi lưu đơn hàng. Trả về một `SKD_Error` thì đơn sẽ bị từ chối và khách nhận được thông báo lỗi:

```php
add_filter('cart_checkout_errors', function($errors) {

    // Đã có lỗi từ nơi khác thì giữ nguyên
    if(is_skd_error($errors)) return $errors;

    // Kiểm tra tồn kho
    foreach (Scart::getItems() as $item) {
        $product = Product::find($item['id']);
        if($product && $product->stock < $item['qty']) {
            return new SKD_Error('stock', 'Sản phẩm "'.$item['name'].'" không đủ hàng!');
        }
    }

    return $errors;
});
```

> Hook `checkout_before_success` **không tồn tại** — dùng `cart_checkout_errors` để chặn đơn, và `checkout_after_success` để chạy tác vụ sau khi đơn đã lưu.

---

## Form Fields Checkout – Tuỳ biến

Để thêm/xoá trường trong form thanh toán, dùng filter `checkout_fields`:

```php
add_filter('checkout_fields', function($fields) {
    // Thêm trường mã số thuế
    $fields['tax_code'] = [
        'name'        => 'tax_code',
        'label'       => 'Mã số thuế (nếu cần hoá đơn VAT)',
        'type'        => 'text',
        'id'          => 'billing_tax_code',
        'priority'    => 50,   // thứ tự hiển thị
        'start'       => 12,   // số cột grid chiếm chỗ
        'placeholder' => 'Nhập mã số thuế',
    ];
    return $fields;
});
```

Các key của một field: `name`, `label`, `type`, `id`, `priority` (thứ tự), `start` (số cột grid), `placeholder`.

Ngoài ra còn các hook bao quanh form:

| Hook | Loại | Mô tả |
|:---|:---|:---|
| `checkout_before_billing_form` / `checkout_after_billing_form` | action | Chèn HTML trước/sau khối thông tin giao hàng |
| `checkout_before_invoice_form` / `checkout_after_invoice_form` | action | Chèn HTML trước/sau khối hoá đơn |
| `checkout_after_submit` | action | Chèn HTML sau nút đặt hàng |
| `checkout_discounts` | filter | Can thiệp phần giảm giá |
| `checkout_ajax_order_review` | filter | Can thiệp khối tóm tắt đơn khi cập nhật bằng ajax |

> **Xem thêm**: Để tích hợp cổng thanh toán mới, xem [Gateway/01-Payment-Gateway.md](../../Gateway/01-Payment-Gateway.md).
> Để tích hợp đơn vị vận chuyển mới, xem [Gateway/02-Shipping-Gateway.md](../../Gateway/02-Shipping-Gateway.md).
