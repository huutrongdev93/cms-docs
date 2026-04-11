# Supports: Config (Cấu Hình Sicommerce)

**Class**: `\Ecommerce\Supports\Config`  
**Namespace**: `Ecommerce\Supports`

Class `Config` là lớp truy cập cấu hình cho toàn bộ Sicommerce. Tất cả config được lưu trong database (bảng `options`, key `ecommerce_config`) và được load vào Laravel config container với prefix `sicommerce::`.

---

## Phương Thức

### `Config::get(string $keyword)`
Lấy một giá trị config theo key dạng dot-notation.

```php
use Ecommerce\Supports\Config;

// Lấy layout trang sản phẩm
$layout = Config::get('general.layout');

// Số sản phẩm mỗi trang
$perPage = Config::get('product.index.per_page');

// Có bật tính năng Brands không
$hasBrands = Config::get('general.brands'); // true/false

// Số cột trên desktop
$cols = Config::get('product.index.per_row.desktop'); // 4

// Cấu hình đặt hàng
$layoutDetail = Config::get('general.layout');
$weightUnit   = Config::get('general.weight_unit'); // 'gram', 'kg'...

// Thông tin đơn hàng
$securityKey = Config::get('order.securityKey');
```

Tương đương với:
```php
config('sicommerce::general.layout');
```

### `Config::all()`
Lấy toàn bộ config của Sicommerce dưới dạng mảng phẳng (đã loại bỏ prefix `sicommerce::`).

```php
$allConfig = Config::all();
// ['general' => [...], 'product' => [...], 'order' => [...], 'checkout' => [...]]
```

### `Config::update($key, $value)`
Cập nhật một key trong config (lưu vào DB và làm mới container).

```php
// Cập nhật số sản phẩm mỗi trang
Config::update('product.index.per_page', 20);

// Cập nhật layout
Config::update('general.layout', 'layout-products-2');
```

### `Config::save($config)`
Lưu toàn bộ mảng config (thay thế toàn bộ).

```php
$config = Config::all();
$config['product']['index']['per_page'] = 16;
Config::save($config);
```

---

## Cấu Trúc Config Mặc Định

Config được định nghĩa trong `plugins/sicommerce/config/`. Dưới đây là các nhóm chính:

### `general` – Cấu hình chung

| Key | Mô Tả | Giá Trị Mặc Định |
|:---|:---|:---|
| `general.layout` | Layout trang danh sách SP | `layout-products-1` |
| `general.brands` | Bật/tắt tính năng Thương hiệu | `false` |
| `general.weight_unit` | Đơn vị cân nặng | `gram` |
| `general.currency_symbol` | Ký hiệu tiền tệ | — |

### `product` – Cấu hình sản phẩm

| Key | Mô Tả |
|:---|:---|
| `product.index.per_page` | Số SP mỗi trang |
| `product.index.per_row.desktop` | Số cột trên desktop |
| `product.index.per_row.tablet` | Số cột trên tablet |
| `product.index.per_row.mobile` | Số cột trên mobile |
| `product.object.title.show` | Hiển thị tiêu đề trong product item |
| `product.object.title.position` | Priority hiển thị tiêu đề |
| `product.object.price.show` | Hiển thị giá trong product item |
| `product.object.price.position` | Priority hiển thị giá |
| `product.object.img` | Cấu hình box ảnh product item |

### `order` – Cấu hình đơn hàng

| Key | Mô Tả |
|:---|:---|
| `order.securityKey` | Tên tham số security key trong URL |
| `order.created.send_customer` | Gửi email xác nhận cho khách |
| `order.created.send_admin` | Gửi email thông báo cho admin |

### `checkout` – Cấu hình thanh toán

| Key | Mô Tả |
|:---|:---|
| `checkout.payment.default` | Cổng thanh toán mặc định được chọn sẵn |
| `checkout.shipping.default` | Đơn vị vận chuyển mặc định |

---

## Đọc Config Trong Plugin Của Bạn

```php
// Trong ServiceProvider hoặc bất kỳ file nào của plugin
use Ecommerce\Supports\Config;

// Kiểm tra theme đang dùng layout nào
$layout = Config::get('general.layout');
if($layout == 'layout-products-2') {
    // Plugin custom giao diện cho layout 2
}

// Lấy đơn vị cân nặng cho shipping
$weightUnit = Config::get('general.weight_unit');

// Số sản phẩm mỗi trang (dùng cho query)
$limit = (int)Config::get('product.index.per_page');
if($limit <= 0) $limit = 12; // Fallback
```

---

## Thêm Config Của Plugin Vào Sicommerce Config Group

Bạn có thể mở rộng group config của Sicommerce để Admin có thể cấu hình plugin của bạn từ trang *Hệ thống → Commerce*:

```php
// Đăng ký tab Setting mới
add_filter('admin_system_tabs', function($tabs) {
    $tabs['your_plugin_settings'] = [
        'label'  => 'Your Plugin',
        'group'  => 'commerce',     // Thuộc nhóm Commerce
        'action' => 'admin_your_plugin_setting',
    ];
    return $tabs;
}, 80);

// Render form cấu hình
add_action('admin_your_plugin_setting', function() {
    $apiKey = Config::get('your_plugin.api_key') ?? '';
    $form = form();
    $form->text('your_plugin[api_key]', ['label' => 'API Key'], $apiKey);
    echo $form->html();
});

// Lưu cấu hình
add_action('admin_system_commerce_your_plugin_setting_save', function() {
    $data = request()->input('your_plugin');
    Config::update('your_plugin.api_key', $data['api_key'] ?? '');
    response()->success('Đã lưu cấu hình');
});
```

> **Lưu ý**: Config của Sicommerce được **merge** với file config trong database khi load. Nếu bạn thêm key mới, hãy đảm bảo có giá trị fallback trong file `config/` của plugin Sicommerce hoặc plugin của bạn, tránh trường hợp `Config::get()` trả về `null` khi chưa được cấu hình.

