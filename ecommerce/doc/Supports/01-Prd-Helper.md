# Thư viện Hỗ trợ Sản Phẩm (Prd Helper)

**Class**: `\Ecommerce\Supports\Prd`  
**Alias**: `Prd` (đã đăng ký toàn cục)  
**Namespace**: `Ecommerce\Supports`

Class `Prd` là một lớp Facade chứa các hàm tiện ích được thiết kế để dùng chung trong Template (View) hoặc trong các plugin mở rộng.

---

## 1. Định Dạng Tiền Tệ & Giá

### `Prd::price($price, $currency)`
Định dạng số tiền theo tiền tệ hiện tại (lấy từ cookie hoặc cài đặt mặc định).

```php
// Database lưu $product->price = 1500000
echo Prd::price($product->price);
// Output: 1.500.000đ (tuỳ config Admin)

// Truyền object currency tùy chỉnh
$currency = Prd::currency();
echo Prd::price(1500000, $currency);

// Trong đơn hàng (dùng currency tại thời điểm đặt)
echo Prd::price($order->total, $order->currency ?? []);
```

**Cách tính**: `giá_hiển_thị = price * (rate + rateFixed)`, sau đó format với decimals và gắn symbol.

**Tuỳ chỉnh output:**
```php
add_filter('_price_render', function($priceFormatted) {
    return '<strong>' . $priceFormatted . '</strong>';
});
```

### `Prd::priceNone()`
Hiển thị text thay thế khi giá = 0 (mặc định: "Liên hệ").

```php
if($product->price == 0) {
    echo Prd::priceNone();
    // Output: "Liên hệ" hoặc text đã cấu hình trong Admin → Option → product_price_contact
}

// Tuỳ chỉnh
add_filter('_price_none', function($text) {
    return 'Giá liên hệ hotline: 1900xxxx';
});
```

### `Prd::currency()`
Lấy đối tượng tiền tệ đang được chọn (từ cookie `product_currency_current`) hoặc tiền tệ mặc định.

```php
$currency = Prd::currency();
echo $currency->symbol;    // 'đ'
echo $currency->position;  // 'right' | 'left'
echo $currency->rate;      // 1 (hoặc tỉ giá quy đổi)
echo $currency->decimals;  // 0 (số chữ số thập phân)
```

### `Prd::currencyDefault()`
Lấy đối tượng tiền tệ **mặc định** của hệ thống (bản ghi `currencies` có `isDefault = 1`), bỏ qua lựa chọn của khách trong cookie.

Nếu chưa cấu hình bản ghi mặc định nào, hàm trả về đối tượng dự phòng:

```php
$currency = Prd::currencyDefault();
// (object)[
//     'currency'  => 'VND',
//     'position'  => 'right',
//     'rate'      => 1,
//     'rateFixed' => 0,
//     'decimals'  => 0,
//     'symbol'    => 'đ',
// ]
```

> Dùng `currencyDefault()` khi cần **tiền tệ cơ sở** (ví dụ khi ghi giá vào DB); dùng `currency()` khi hiển thị theo lựa chọn của khách.

### `Prd::priceUnit()`
Lấy ký hiệu đơn vị tiền tệ hiện tại.

```php
echo Prd::priceUnit(); // 'đ' hoặc '$'
// Tuỳ chỉnh:
add_filter('_price_currency', function($symbol) { return $symbol; });
```

### `Prd::weightUnit()`
Lấy đơn vị cân nặng đang cấu hình.

```php
echo Prd::weightUnit(); // 'gram', 'kg'...
// Tuỳ chỉnh:
add_filter('_weight_unit', function($unit) { return 'kg'; });
```

---

## 2. Load Template & View

### `Prd::view(string $path, $args = [])`
In trực tiếp (echo) một Blade view từ thư mục `plugins/sicommerce/views/`.

```php
// Render view sicommerce::template/checkout/shipping
Prd::view('template/checkout/shipping', ['cart' => $cart]);

// Render view đơn hàng
Prd::view('detail/order-success', ['order' => $order]);
```

### `Prd::partial(string $path, $args = [])`
Tương tự `view()` nhưng **return** chuỗi HTML thay vì echo. Hữu ích cho Ajax.

```php
// Lấy HTML cart mini
$html = Prd::partial('cart/cart-mini', ['data' => Scart::getItems()]);
return response()->json(['html' => $html]);

// Lấy HTML product item
$itemHtml = Prd::partial('loop/item_product', ['val' => $product]);
```

> **Theme Override**: Bạn có thể ghi đè view tại `views/theme-child/plugins/sicommerce/{path}.blade.php` mà không cần sửa plugin core.

---

## 3. Collections (Bộ Sưu Tập Flag)

### `Prd::collections($key)`
Lấy cấu hình các flag trạng thái sản phẩm (status1/2/3) được đặt tên và cấu hình.

```php
$collections = Prd::collections();
// [
//   'status1' => ['name' => 'Yêu thích', 'searchKey' => 'love', 'icon' => '<i>...', 'searchActive' => false],
//   'status2' => ['name' => 'Bán chạy',  'searchKey' => 'selling', 'icon' => '...', 'searchActive' => true],
//   'status3' => ['name' => 'Hot',        'searchKey' => 'hot',     'icon' => '...', 'searchActive' => true],
// ]

// Lấy một collection cụ thể
$selling = Prd::collections('status2');
echo $selling['name'];      // 'Bán chạy'
echo $selling['searchKey']; // 'selling' (dùng cho ?orderby=selling)
echo $selling['icon'];      // '<i class="fa-thin fa-chart-line-up"></i>'
```

**Dùng trong Template:**
```php
$collections = Prd::collections();
foreach ($collections as $key => $col) {
    echo '<a href="?orderby='.$col['searchKey'].'">';
    echo $col['icon'].' '.$col['name'];
    echo '</a>';
}
```

**Thêm Collection Mới:**
```php
add_filter('products_collections', function($collections) {
    $collections['status_sale'] = [
        'name'          => 'Đang giảm giá',
        'searchKey'     => 'sale',
        'searchActive'  => true,
        'icon'          => '<i class="fa-thin fa-tag"></i>',
    ];
    return $collections;
});

// Tuỳ chỉnh từng thuộc tính riêng
add_filter('products_collections_status1_name', fn($name) => 'Yêu thích nhất');
add_filter('products_collections_status2_icon', fn($icon) => '<i class="fa fa-fire"></i>');
```

---

## 4. Build Style Tự Động

### `Prd::buildStyle()`
Được hệ thống CMS gọi tự động khi Admin lưu cấu hình giao diện sản phẩm. Lấy config style (font, color, box...) và biên dịch thành file CSS tĩnh tại `assets/css/scmc-build.css`.

> **Developer thường không cần gọi hàm này trực tiếp.** Hệ thống tự gọi khi cần thiết.

---

## 5. Tóm Tắt Tất Cả Methods

| Method | Mô Tả | Return |
|:---|:---|:---|
| `Prd::price($price, $currency)` | Format giá theo tiền tệ | `string` |
| `Prd::priceNone()` | Text "Liên hệ" khi giá = 0 | `string` |
| `Prd::currency()` | Object tiền tệ hiện tại | `object` |
| `Prd::priceUnit()` | Ký hiệu tiền tệ (VD: `đ`) | `string` |
| `Prd::weightUnit()` | Đơn vị cân nặng (VD: `gram`) | `string` |
| `Prd::view($path, $args)` | Echo Blade view của Sicommerce | `void` |
| `Prd::partial($path, $args)` | Return HTML string của Blade view | `string` |
| `Prd::collections($key)` | Cấu hình flag bộ sưu tập SP | `array\|mixed` |
| `Prd::buildStyle()` | Build file CSS từ config Admin | `void` |
