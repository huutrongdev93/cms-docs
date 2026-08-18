# Thêm phương thức Vận chuyển (Shipping)

Tương tự Payment, hệ thống Vận chuyển của Sicommerce sử dụng mô hình **Manager + Abstract Gateway**. Mỗi đơn vị vận chuyển gồm 2 class: **Base** (cấu hình/hiển thị) và **Gateway** (xử lý logic). Config được lưu vào DB với key `cart_shipping`.

---

## Các Class Liên Quan

| Class | Namespace | Mô tả |
|:---|:---|:---|
| `AbstractShippingBase` | `Ecommerce\Gateway\Shipping\Common` | Abstract base class cho Shipping Base |
| `AbstractShippingGateway` | `Ecommerce\Gateway\Shipping\Common` | Abstract base class cho Shipping Gateway |
| `AbstractRequest` | `Ecommerce\Gateway\Shipping\Common\Message` | Base cho Request |
| `AbstractResponse` | `Ecommerce\Gateway\Shipping\Common\Message` | Base cho Response |
| `ShippingManager` | `Ecommerce\Gateway\Shipping\Common` | Facade quản lý toàn bộ Shipping Gateways |
| `AddressContact` | `Ecommerce\Gateway\Shipping\Common` | Helper địa chỉ giao hàng |

---

## Bước 1: Tạo Shipping Base Class

Tạo file: `plugins/your-plugin/app/Gateway/Ghtk/Ghtk.php`

```php
<?php
namespace YourPlugin\Gateway\Ghtk;

use Ecommerce\Gateway\Shipping\Common\AbstractShippingBase;
use Ecommerce\Gateway\Shipping\Common\ShippingManager;
use SkillDo\Http\Request;

class Ghtk extends AbstractShippingBase
{
    /**
     * Key định danh – viết thường, không dấu
     */
    public function getName(): string
    {
        return 'ghtk';
    }

    public function getAdminName(): string
    {
        return 'Giao Hàng Tiết Kiệm (GHTK)';
    }

    public function getAdminDescription(): string
    {
        return 'Tích hợp tự động đẩy đơn và tính phí ship GHTK';
    }

    /**
     * Mặc định AbstractShippingBase đã có icon fallback: sicommerce::images/shipping.png
     */
    public function getAdminIcon(): string
    {
        return asset('your-plugin::images/ghtk_logo.png', true);
    }

    /**
     * Ghi đè form() để thêm trường API Token
     * Mặc định form() đã có Icon + Checkout Name/Description
     */
    public function form()
    {
        $form = parent::form();
        $key  = $this->getName();

        $form->text($key.'[token]', ['label' => 'API Token'], 
            ShippingManager::getConfig($key)['token'] ?? '');
        $form->text($key.'[shop_address]', ['label' => 'Địa chỉ lấy hàng'], 
            ShippingManager::getConfig($key)['shop_address'] ?? '');

        return $form;
    }

    /**
     * Lưu thêm các trường tùy chỉnh
     */
    public function saveConfig(Request $request)
    {
        $shipping = parent::saveConfig($request);
        $data = $request->input($this->getName());

        $shipping['token']        = $data['token'] ?? '';
        $shipping['shop_address'] = $data['shop_address'] ?? '';

        return $shipping;
    }
}
```

> **Methods kế thừa từ `AbstractShippingBase`:**
> - `form()` – form mặc định (Icon + Checkout Name/Description đa ngôn ngữ)
> - `saveConfig(Request $request)` – lưu config
> - `getCheckoutName($locale)` – tên hiển thị checkout
> - `getCheckoutDescription($locale)` – mô tả checkout
> - `getCheckoutIcon()` – icon checkout
> - `useGateway(): bool` – gateway có được bật không
> - `validate(array $data)` – validate trước khi dùng
> - `isFormDefault(): bool` – dùng form mặc định của hệ thống

---

## Bước 2: Tạo Shipping Gateway Class

Hệ thống phát hiện tính năng qua `method_exists()`. Bạn chỉ cần khai báo method nào bạn hỗ trợ.

Tạo file: `plugins/your-plugin/app/Gateway/Ghtk/GhtkGateway.php`

```php
<?php
namespace YourPlugin\Gateway\Ghtk;

use Ecommerce\Gateway\Shipping\Common\AbstractShippingGateway;

class GhtkGateway extends AbstractShippingGateway
{
    public function getDefaultParameters(): array
    {
        return [
            'testMode'    => false,
            'token'       => '',
            'shop_address'=> '',
        ];
    }

    public function getToken(): string { return $this->getParameter('token'); }
    public function setToken($value): static { return $this->setParameter('token', $value); }

    /**
     * ✅ Tính phí vận chuyển (isSupportGetFee() = true nếu khai báo method này)
     *
     * @param $orderData  Dữ liệu đơn hàng (weight, items...)
     * @param $addressData Dữ liệu địa chỉ (city, ward...)
     * @return mixed Request object hoặc trực tiếp giá trị phí
     */
    public function getFee($orderData, $addressData)
    {
        return $this->createRequest(GhtkGetFeeRequest::class, [
            'token'    => $this->getToken(),
            'weight'   => $orderData['weight'] ?? 0,
            'city'     => $addressData['city'] ?? '',
            'ward'     => $addressData['ward'] ?? '',
        ]);

        // Hoặc trả về int phí ship trực tiếp:
        // return 35000;
    }

    /**
     * ✅ Tạo đơn vận chuyển (isSupportCreateOrder() = true)
     */
    public function createOrder($orderData)
    {
        return $this->createRequest(GhtkCreateOrderRequest::class, [
            'token' => $this->getToken(),
            'order' => $orderData,
        ]);
    }

    /**
     * ✅ Hủy đơn vận chuyển (isSupportCancelOrder() = true)
     */
    public function cancelOrder($orderId)
    {
        return $this->createRequest(GhtkCancelOrderRequest::class, [
            'token'    => $this->getToken(),
            'order_id' => $orderId,
        ]);
    }

    /**
     * ✅ Theo dõi trạng thái vận đơn (isSupportTracking() = true)
     */
    public function tracking($orderId)
    {
        return $this->createRequest(GhtkTrackingRequest::class, [
            'token'    => $this->getToken(),
            'order_id' => $orderId,
        ]);
    }
}
```

### Tính Năng Được Phát Hiện Tự Động

`AbstractShippingGateway` có 4 method kiểm tra tính năng (dựa trên `method_exists()`):

| Method kiểm tra | Khai báo method nào | Ý nghĩa |
|:---|:---|:---|
| `isSupportGetFee()` | `getFee()` | Tính phí ship động theo địa chỉ |
| `isSupportCreateOrder()` | `createOrder()` | Đẩy đơn lên hệ thống carrier |
| `isSupportCancelOrder()` | `cancelOrder()` | Hủy đơn với carrier |
| `isSupportTracking()` | `tracking()` | Theo dõi hành trình |

---

## Bước 3: Đăng ký vào ShippingManager

```php
<?php
namespace YourPlugin\Providers;

use Ecommerce\Gateway\Shipping\Common\ShippingManager;
use SkillDo\ServiceProvider;
use YourPlugin\Gateway\Ghtk\Ghtk;
use YourPlugin\Gateway\Ghtk\GhtkGateway;

class YourPluginServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        ShippingManager::addGateway('ghtk', [
            'shipping'  => Ghtk::class,        // Base class (Bước 1)
            'gateway'   => GhtkGateway::class, // Gateway class (Bước 2)
            'position'  => 3,                  // Thứ tự hiển thị (số nhỏ = đứng trước)
        ]);
    }
}
```

---

## Các Method Hữu Ích của ShippingManager

| Method | Mô tả |
|:---|:---|
| `ShippingManager::addGateway($key, $data)` | Đăng ký phương thức vận chuyển mới |
| `ShippingManager::allGateway()` | Lấy tất cả gateway đã đăng ký (đã khởi tạo) |
| `ShippingManager::gateway($key)` | Lấy một gateway theo key |
| `ShippingManager::getConfig($key)` | Lấy config đã lưu trong DB |
| `ShippingManager::saveConfig($key, $config)` | Lưu config vào option `cart_shipping` (bảng `system`) |
| `ShippingManager::create($key)` | Tạo instance của Gateway class |

---

## Override Phí Ship

Để tuỳ chỉnh phí ship của một phương thức cụ thể, dùng filter `shipping_price_{key}`:

```php
// Override phí ship của GHTK (thay thế kết quả từ getFee())
add_filter('shipping_price_ghtk', function($price) {
    // Miễn phí ship cho đơn trên 500k
    if(Scart::total() >= 500000) {
        return 0;
    }
    return $price;
});
```

---

## Luồng Hoạt Động

1. **Admin bật cổng**: Vào *Hệ thống → Vận Chuyển*, cổng GHTK xuất hiện với form từ `Ghtk::form()`.
2. **Admin lưu**: `Ghtk::saveConfig()` lưu Token, địa chỉ vào option `cart_shipping` (bảng `system`), nhánh `cart_shipping['ghtk']`.
3. **Khách checkout**: `ShippingManager::allGateway()` tải `Ghtk`, nếu `useGateway() === true` hiển thị lên.
4. **Khách chọn phương thức + nhập địa chỉ**: Ajax gọi `GhtkGateway::getFee()` → trả về phí ship.
5. **Khách đặt hàng**: Phí ship được lưu vào metadata đơn.
6. **Admin click "Giao Hàng"**: Hệ thống gọi `GhtkGateway::createOrder()` đẩy đơn lên GHTK.

```
