# 2. Admin Hooks: Đơn Hàng (Orders)

Các hooks đơn hàng được đăng ký trong `bootstrap/order.php`. Đây là tập hooks quan trọng nhất để tích hợp Shipping, Affiliate, Webhook, hay bất kỳ hành động nào liên quan đến vòng đời đơn hàng.

---

## 2.1 Trang Danh Sách Đơn Hàng (Table)

| Hook Type | Hook Name | Tham Số | Mô Tả |
|:---:|:---|:---|:---|
| **Action** | `admin_order_action_bar_heading` | — | Thêm nút vào thanh công cụ đầu trang (VD: nút "In hàng loạt") |
| **Filter** | `admin_order_table_column_action` | `($actions, $item)` | Thêm/sửa nút icon action trong mỗi dòng đơn hàng |
| **Action** | `admin_after_order_table_view` | — | Thêm Modal/Popup ẩn phục vụ in ấn, export... |

```php
// Thêm nút "Xuất Excel" vào thanh công cụ
add_action('admin_order_action_bar_heading', function() {
    echo '<a href="/admin/orders/export" class="btn btn-success">📊 Xuất Excel</a>';
});

// Thêm nút "Đẩy sang GHTK" vào mỗi dòng đơn
add_filter('admin_order_table_column_action', function($actions, $order) {
    if($order->status == 'confirm') {
        $actions['ghtk'] = '<a href="#" data-id="'.$order->id.'" class="btn-ghtk-push">
            <i class="fa fa-truck"></i>
        </a>';
    }
    return $actions;
}, 10, 2);
```

---

## 2.2 Trang Chi Tiết Đơn Hàng (View/Edit)

Layout trang chi tiết chia thành 2 cột: **Primary** (trái/chính) và **Secondary** (phải/sidebar).

### Cột Chính (`order_detail_sections_primary`)

| Hook Name | Priority | Class::Method | Mô Tả |
|:---|:---:|:---|:---|
| `order_detail_sections_primary` | 10 | `OrderDetail::renderContent` | Danh sách sản phẩm trong đơn |
| `order_detail_sections_primary` | 20 | `OrderDetail::renderNote` | Ghi chú đơn hàng |
| `order_detail_sections_primary` | 25 | `OrderDetail::renderPayment` | Thông tin cổng thanh toán |
| `order_detail_sections_primary` | 30 | `OrderDetail::renderShipping` | Thông tin vận chuyển |
| `order_detail_sections_primary` | 40 | `OrderDetail::renderHistory` | Lịch sử thao tác |

```php
// Chèn block thông tin tích hợp GHTK vào giữa Payment và Shipping
add_action('order_detail_sections_primary', function() {
    $orderId = request()->input('id') ?? request()->segment(4);
    $ghtkCode = Order::getMeta($orderId, 'ghtk_tracking_code', true);
    if($ghtkCode) {
        echo '<div class="box-ghtk-info">';
        echo '<b>Mã vận đơn GHTK:</b> '.$ghtkCode;
        echo '</div>';
    }
}, 28); // Giữa Payment(25) và Shipping(30)
```

### Cột Sidebar (`order_detail_sections_secondary`)

| Hook Name | Priority | Class::Method | Mô Tả |
|:---|:---:|:---|:---|
| `order_detail_sections_secondary` | 10 | `OrderDetail::renderAction` | Box thay đổi trạng thái |
| `order_detail_sections_secondary` | 20 | `OrderDetail::renderCustomerInfo` | Thông tin khách / địa chỉ giao |

```php
// Thêm box thông tin điểm tích lũy vào sidebar
add_action('order_detail_sections_secondary', function() {
    $orderId = request()->segment(4);
    $order   = Order::find($orderId);
    $points  = User::getMeta($order->customer_id, 'loyalty_points', true);
    echo '<div class="box-loyalty"><b>Điểm tích lũy:</b> '.$points.'</div>';
}, 30);
```

### Thanh Tiêu Đề Trang Chi Tiết (`order_detail_header_action`)

| Hook Name | Class::Method | Mô Tả |
|:---|:---|:---|
| `order_detail_header_action` | `OrderPrint::addButtonOrderDetail` | Nút In đơn hàng |
| `order_detail_header_action` | `OrderDetail::addButtonAction` | Nút Quay về danh sách |

```php
add_action('order_detail_header_action', function() {
    $orderId = request()->segment(4);
    echo '<a href="/admin/ghtk/push/'.$orderId.'" class="btn btn-warning">🚛 Đẩy GHTK</a>';
});
```

---

## 2.3 Trang Tạo Đơn POS (`OrderAdd`)

Dùng cho Admin tạo đơn trực tiếp từ backend (không qua giỏ hàng Frontend).

| Hook Name | Priority | Class::Method | Mô Tả |
|:---|:---:|:---|:---|
| `admin_order_action_bar_heading` | — | `OrderAdd::addButtonAddOrder` | Nút "Thêm đơn hàng" trong thanh toolbar |
| `form_order_action_button` | — | `OrderAdd::formButton` | Nút Submit form đơn hàng POS |
| `order_save_sections_primary` | 10 | `OrderAdd::renderProductItem` | Box chọn sản phẩm, nhập giá |
| `order_save_sections_primary` | 10 | `OrderAdd::renderShipping` | Form giao hàng |
| `order_save_sections_primary` | 10 | `OrderAdd::renderDiscount` | Form mã giảm giá |
| `order_save_sections_primary` | 10 | `OrderAdd::renderPayments` | Chọn phương thức thanh toán |
| `order_save_sections_primary` | 100 | `OrderAdd::renderReview` | Tổng hóa đơn trước submit |
| `order_save_sections_secondary` | 10 | `OrderAdd::renderCustomerInfo` | Box chọn khách hàng |

```php
// Thêm block ghi chú nội bộ vào form POS
add_action('order_save_sections_primary', function() {
    echo '<div class="box-internal-note">';
    echo '<label>Ghi chú nội bộ (Không gửi cho khách):</label>';
    echo '<textarea name="internal_note"></textarea>';
    echo '</div>';
}, 50);
```

---

## 2.4 Hooks Thay Đổi Trạng Thái Đơn Hàng

Đây là nhóm hooks **quan trọng nhất** khi viết plugin tích hợp bên ngoài.

### Lifecycle Hooks

| Hook Type | Hook Name | Priority | Tham Số | Mô Tả |
|:---:|:---|:---:|:---|:---|
| **Action** | `admin_order_status_before_update` | 1 | `($statusNew, $statusOld)` | Trước khi lưu trạng thái mới. Có thể `response()->error()` để chặn |
| **Action** | `admin_order_status_update` | 1 | `($statusNew, $statusOld)` | Sau khi trạng thái đã được cập nhật |
| **Action** | `admin_order_status_{status}_save` | — | `($orderId)` | Hook riêng cho từng trạng thái cụ thể |

### Pattern Hook Riêng Cho Từng Trạng Thái

```
admin_order_status_wait_save
admin_order_status_confirm_save
admin_order_status_wait-pickup_save
admin_order_status_ship_save
admin_order_status_completed_save
admin_order_status_cancelled_save
```

```php
// Chạy trước khi đổi trạng thái (để validate)
add_action('admin_order_status_before_update', function($statusNew, $statusOld) {
    // Ngăn chuyển từ completed sang wait
    if($statusOld == 'completed' && $statusNew == 'wait') {
        response()->error('Không thể reset đơn đã hoàn thành!');
    }
}, 1, 2);

// Chạy sau khi đổi trạng thái
add_action('admin_order_status_update', function($statusNew, $statusOld) {
    $orderId = request()->input('id');
    $order   = Order::find($orderId);

    // Push webhook cho affiliate khi đơn hoàn thành
    if($statusNew == 'completed') {
        Http::post('https://affiliate.api/webhook', [
            'event'    => 'order_completed',
            'order_id' => $order->id,
            'total'    => $order->total,
        ]);
    }
}, 10, 2);

// Hook chỉ khi đơn bị hủy
add_action('admin_order_status_cancelled_save', function($orderId) {
    $order = Order::find($orderId);
    // Hoàn điểm tích lũy
    if($order->customer_id) {
        User::where('id', $order->customer_id)->decrement('loyalty_points', 10);
    }
}, 10, 1);

// Hook chỉ khi đơn hoàn thành
add_action('admin_order_status_completed_save', function($orderId) {
    $order = Order::find($orderId);
    // Gửi email cảm ơn + mã voucher
}, 10, 1);
```

### Hooks Trạng Thái Thanh Toán

| Hook Type | Hook Name | Priority | Tham Số | Mô Tả |
|:---:|:---|:---:|:---|:---|
| **Action** | `admin_order_status_pay_update` | 10 | `($statusNew, $statusOld)` | Khi trạng thái thanh toán thay đổi |
| **Action** | `admin_order_status_pay_{status}_success` | — | `($orderId)` | Hook riêng theo từng trạng thái thanh toán |

```php
// Hook khi đơn được đánh dấu đã thanh toán
add_action('admin_order_status_pay_paid_success', function($orderId) {
    $order = Order::find($orderId);
    // Kích hoạt license key
    // Gửi email xác nhận thanh toán
}, 10, 1);
```

---

## 2.5 Hook Sau Khi Admin Tạo Đơn POS

```php
// Chạy sau khi Admin tạo đơn thành công từ trang POS
add_action('admin_order_save_after_success', function($order) {
    EmailService::orderCreated($order);
});
```
