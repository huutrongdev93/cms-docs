# Supports: OrderHelper & PrdCartHelper

---

## OrderHelper

**Class**: `\Ecommerce\Supports\OrderHelper`  
**Namespace**: `Ecommerce\Supports`

Class tiện ích cho các thao tác liên quan đến đơn hàng (trạng thái, mã đơn).

### `OrderHelper::code($id)`
Tạo mã đơn hàng dựa trên ID. Mặc định: `1000 + $id`.

```php
use Ecommerce\Supports\OrderHelper;

$code = OrderHelper::code(12);  // 1012
$code = OrderHelper::code(100); // 1100
```

**Tuỳ chỉnh mã đơn hàng:**
```php
// Ghi đè cách tạo mã đơn hàng
add_filter('order_generate_code', function($code) {
    // code = 1000 + $id (mặc định)
    $orderId = Order::orderByDesc('id')->value('id');
    return 'DH' . str_pad($orderId, 6, '0', STR_PAD_LEFT);
    // Kết quả: DH000012
});
```

### `OrderHelper::status($key, $type)`
Lấy thông tin trạng thái đơn hàng.

```php
// Lấy tất cả trạng thái
$all = OrderHelper::status();
// ['wait' => ['label' => '...', 'color' => '...', 'colorClass' => '...'], ...]

// Lấy một thuộc tính cụ thể
$label = OrderHelper::status('wait', 'label');        // 'Chờ xác nhận'
$color = OrderHelper::status('confirm', 'color');     // '#186caa'
$badge = OrderHelper::status('completed', 'colorClass'); // 'green'

// Lấy tất cả thuộc tính của một trạng thái
$info  = OrderHelper::status('ship');
// ['label' => 'Đang giao hàng', 'color' => '#36a3f7', 'colorClass' => 'blue']
```

**Tuỳ chỉnh trạng thái qua filter:**
```php
add_filter('order_status', function($statusData) {
    // Thêm trạng thái mới
    $statusData['ready'] = [
        'label'      => 'Sẵn sàng giao',
        'color'      => '#ff6600',
        'colorClass' => 'orange',
    ];
    return $statusData;
});

// Tuỳ chỉnh label/color riêng lẻ
add_filter('order_status_label', function($label, $value) {
    if($value == 'wait') return 'Mới - Chờ xác nhận';
    return $label;
}, 10, 2);

add_filter('order_status_color', function($color, $value) { return $color; }, 10, 2);
add_filter('order_status_badge', function($badge, $value) { return $badge; }, 10, 2);
```

### `OrderHelper::statusPay($key, $type)`
Lấy thông tin trạng thái thanh toán.

```php
$all   = OrderHelper::statusPay();
$label = OrderHelper::statusPay('paid', 'label');   // 'Đã thanh toán'
$color = OrderHelper::statusPay('unpaid', 'color'); // '#36a3f7'
```

---

## PrdCartHelper

**Class**: `\Ecommerce\Supports\PrdCartHelper`  
**Alias**: `PrdCartHelper`  
**Namespace**: `Ecommerce\Supports`

Class tiện ích hiển thị địa chỉ và thông tin thuộc tính biến thể.

### `PrdCartHelper::billingAddress($order)`
Chuyển đổi code tỉnh/phường từ đối tượng Order thành chuỗi địa chỉ đọc được.

```php
use Ecommerce\Supports\PrdCartHelper;

$order = Order::find(10);

// Tự động chọn API Location phù hợp (Location2 hoặc Location cũ)
$address = PrdCartHelper::billingAddress($order);
// Ví dụ: "Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh"
```

> `billingAddress()` tự chọn API địa giới phù hợp: đơn hàng **có** `districts` (dữ liệu cũ 3 cấp) thì gọi `Location::address($city, $districts, $ward)`; đơn **không** có `districts` (dữ liệu mới 2 cấp, từ 01/07/2025) thì gọi `Location2::address($city, $ward)`.

Muốn tự ghép địa chỉ ngoài phạm vi đơn hàng, gọi thẳng hai class địa giới của CMS:

```php
use SkillDo\Cms\Location\Location;   // 3 cấp: tỉnh → quận/huyện → phường/xã
use SkillDo\Cms\Location\Location2;  // 2 cấp: tỉnh → phường/xã

// Đơn vị hành chính mới (2 cấp)
Location2::address($provinceId, $wardId);

// Đơn vị hành chính cũ (3 cấp)
Location::address($provinceId, $districtId, $wardId);
```

### `PrdCartHelper::attributeDisplay($attributeId, $type)`
Lấy kiểu hiển thị tuỳ chỉnh cho một nhóm thuộc tính (Circle, Rectangle...).

```php
// Kiểu hiển thị được cấu hình trong Admin → Thuộc tính
$display = PrdCartHelper::attributeDisplay($attributeId, 'color');
// Trả về: 'circle' | 'rectangle-radius' | ''
// Nếu admin chưa cấu hình, tự suy luận từ $type:
// - 'color' → 'circle'
// - 'image' | 'label' → 'rectangle-radius'
```

**Dùng trong Template:**
```php
foreach ($attributes as $attr) {
    $displayType = PrdCartHelper::attributeDisplay($attr->id, $attr->option_type);
    echo '<div class="attr-group attr-'.$displayType.'">';
    foreach ($attr->items as $item) {
        // render item dựa theo $displayType
    }
    echo '</div>';
}
```

---

## Helper Functions Toàn Cục (Global Functions)

Các hàm sau được đăng ký toàn cục trong `helpers/helpers.php`:

### `productControllerIndex($id)`
Hàm nội bộ xử lý logic trang danh sách sản phẩm. Trả về mảng với các key: `pagination`, `total`, `objects`, `category`, `brand`, `slug`.

```php
$data = productControllerIndex(); // Tự lấy từ request
// hoặc
$data = productControllerIndex($categoryId); // Theo ID danh mục

$products   = $data['objects'];
$pagination = $data['pagination'];
$category   = $data['category'];
```

**Filter hooks trong hàm này:**
```php
// Sửa query builder
add_filter('controllers_product_index_args', function($query) {
    $query->where('price_sale', '>', 0); // Chỉ SP đang KM
    return $query;
});

// Sửa tổng đếm
add_filter('controllers_product_index_count', function($count) { return $count; });

// Sửa pagination
add_filter('controllers_product_index_paging', function($pagination) { return $pagination; });

// Sửa query cuối cùng trước khi get()
add_filter('controllers_product_index_query', function($query, $request) {
    return $query;
}, 10, 2);

// Sửa kết quả objects
add_filter('controllers_product_index_objects', function($objects) {
    return $objects;
});
```

### `get_order_item_totals($order)`
Tạo mảng breakdown tổng tiền đơn hàng (tạm tính, phí ship, giảm giá, thành tiền).

```php
$totals = get_order_item_totals($order);
foreach ($totals as $row) {
    echo $row['label'] . ': ' . $row['value'];
}

// Thêm dòng tùy chỉnh
add_filter('get_order_item_totals', function($totals, $order) {
    $totals[] = [
        'label'    => 'Phí bảo hiểm hàng hóa',
        'value'    => Prd::price(10000),
        'position' => 12, // Giữa ship(10) và discount(20)
    ];
    return $totals;
}, 10, 2);
```

### `order_total($total)`
Tính tổng thực tế của đơn hàng từ giỏ, có cộng phí ship và trừ giảm giá.

```php
// Tính từ Scart::total()
$total = order_total();

// Truyền giá trị tạm tính thủ công
$total = order_total(500000);

// Tuỳ chỉnh
add_filter('order_total', function($total) {
    $total += 5000; // Phí xử lý cố định
    return $total;
});
```

### `getAttributesType($key)`
Lấy danh sách các kiểu thuộc tính biến thể.

```php
$types = getAttributesType();
// ['label' => ['label' => 'Text (Label)'], 'color' => [...], 'image' => [...]]

$colorType = getAttributesType('color');
// ['label' => 'Màu (Color)']

// Thêm kiểu mới
add_filter('attribute_type', function($types) {
    $types['button'] = ['label' => 'Nút bấm'];
    return $types;
});
```

### `makeOrderSecurityCode($id)`
Tạo mã bảo mật cho đơn hàng (dùng cho URL callback Payment).

```php
$code = makeOrderSecurityCode($orderId);
// Trả về chuỗi 20 ký tự uppercase
```

