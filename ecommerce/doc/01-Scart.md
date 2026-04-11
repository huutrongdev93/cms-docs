# Cart Engine

Sicommerce sử dụng class tĩnh `Scart` (`\Ecommerce\Cart\Scart`) để lưu trữ dữ liệu giỏ hàng trong Session. Class này bọc quanh `\Ecommerce\Cart\Cart` - engine giỏ hàng nền, và cung cấp một API đơn giản, nhất quán để thao tác giỏ hàng trong suốt phiên làm việc của người dùng.

> **Alias**: `Scart` đã được đăng ký làm alias toàn cục. Bạn có thể gọi trực tiếp mà không cần `use` namespace.

---

## Lấy thông tin Giỏ hàng

### `Scart::getItems()` – Tất cả sản phẩm trong Giỏ
Trả về một mảng các item, mỗi item được đánh dấu bằng `rowID` (chuỗi hash duy nhất).
```php
$items = Scart::getItems();
foreach($items as $rowID => $item) 
{
    echo $item['name'];   // Tên sản phẩm
    echo $item['qty'];    // Số lượng
    echo $item['price'];  // Đơn giá
    echo $item['weight']; // Cân nặng (nếu có)
    // $item['options'] – mảng biến thể (color, size...)
}
```

### `Scart::getItem($rowID)` – Lấy một sản phẩm theo RowID
```php
$item = Scart::getItem('b7f3ba3...');
```

### Các hàm tổng hợp
| Hàm                    | Mô tả                                                | Kiểu trả về  |
|:-----------------------|:-----------------------------------------------------|:-------------|
| `Scart::total()`       | Tổng tiền toàn bộ giỏ (chưa bao gồm ship/discount)   | `float\|int` |
| `Scart::totalQty()`    | Tổng số lượng sản phẩm                               | `int`        |
| `Scart::totalWeight()` | Tổng cân nặng (tính từ field `weight` của từng item) | `int\|float` |

```php
$total      = Scart::total();      // VD: 450000
$totalQty   = Scart::totalQty();   // VD: 3
$totalWeight= Scart::totalWeight(); // VD: 1500 (gram)
```

### `Scart::cart()` – Truy cập Cart Engine Nền
Trả về instance của `\Ecommerce\Cart\Cart` nếu bạn cần gọi trực tiếp các method nâng cao hơn.
```php
$cartEngine = Scart::cart();
$cartEngine->contents(); // tương đương Scart::getItems()
```

---

## Cập nhật dữ liệu Giỏ hàng

### `Scart::insert($data)` – Thêm sản phẩm
Cần truyền một mảng đầy đủ thông tin về sản phẩm.
```php
Scart::insert([
    'id'      => 12,         // ID hệ thống của sản phẩm
    'qty'     => 1,          // Số lượng thêm
    'price'   => 150000,     // Giá nhập giỏ (đơn vị: đồng)
    'name'    => 'Áo phông nam tính',
    'weight'  => 350,        // Cân nặng (gram) – dùng cho tính phí ship
    'options' => [           // Biến thể sản phẩm (tuỳ chọn)
        'color'        => 'Xanh',
        'size'         => 'L',
        'variation_id' => 55, // ID của variation nếu có
    ]
]);
```
> Nếu `insert()` trùng `id` + `options` với sản phẩm đã có trong giỏ, số lượng sẽ tự động cộng thêm.

### `Scart::update($data)` – Cập nhật Số Lượng
```php
Scart::update([
    'rowid' => 'b7f3ba3...', // RowID (hash của item)
    'qty'   => 5             // Số lượng mới
]);
```

### `Scart::delete($rowID)` – Xóa sản phẩm khỏi giỏ
Thực chất là gọi `update(['rowid' => $rowID, 'qty' => 0])`.
```php
Scart::delete('b7f3ba3...');
```

### `Scart::empty()` – Dọn toàn bộ Giỏ hàng
Thường được gọi sau khi đặt hàng thành công (hook `checkout_after_success`).
```php
Scart::empty();
```

---

## Tính Tổng Đơn Hàng Có Bao Gồm Shipping & Discount

Dùng helper `order_total()` (global function) để tính tổng thực tế bao gồm phí ship và giảm giá:
```php
$total = order_total(); // Lấy từ Scart::total() + shipping - discounts
$total = order_total(500000); // Hoặc truyền giá trị tạm tính thủ công
```

---

## Lưu ý khi làm việc với Ajax

Sau khi cập nhật giỏ hàng qua Ajax, cần trả về HTML hoặc dữ liệu mới để Frontend re-render:
```php
// Trong file xử lý Ajax
Scart::insert([...]);
$html = Prd::partial('cart/cart-mini', ['cart' => Scart::getItems()]);
response()->success('Đã thêm vào giỏ', ['html' => $html, 'count' => Scart::totalQty()]);
```
