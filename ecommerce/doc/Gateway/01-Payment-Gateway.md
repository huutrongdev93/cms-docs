# Thêm cổng thanh toán (Payment)

Sicommerce thiết kế hệ thống thanh toán theo mô hình **Manager + Abstract Gateway** (tương tự Omnipay). Mỗi cổng thanh toán gồm 2 class: **Base** (cấu hình/hiển thị) và **Gateway** (xử lý giao dịch). Bạn tạo cả hai rồi đăng ký vào `PaymentManager`.

---

## Các Class Liên Quan

| Class                    | Namespace                                  | Mô tả                                   |
|:-------------------------|:-------------------------------------------|:----------------------------------------|
| `AbstractPaymentBase`    | `Ecommerce\Gateway\Payment\Common`         | Abstract base class cho Payment Base    |
| `AbstractPaymentGateway` | `Ecommerce\Gateway\Payment\Common`         | Abstract base class cho Payment Gateway |
| `AbstractRequest`        | `Ecommerce\Gateway\Payment\Common\Message` | Base cho Request Object                 |
| `AbstractResponse`       | `Ecommerce\Gateway\Payment\Common\Message` | Base cho Response Object                |
| `PaymentManager`         | `Ecommerce\Gateway\Payment\Common`         | Facade quản lý toàn bộ Payment Gateways |

---

## Bước 1: Tạo Payment Base Class

Class này cung cấp thông tin hiển thị và form cấu hình trong trang Admin.

Tạo file: `plugins/your-plugin/app/Gateway/VNPay/VNPay.php`

```php
<?php
namespace YourPlugin\Gateway\VNPay;

use Ecommerce\Gateway\Payment\Common\AbstractPaymentBase;
use SkillDo\Http\Request;

class VNPay extends AbstractPaymentBase
{
    /**
     * Key định danh (ID) – viết thường, không dấu, không khoảng trắng
     */
    public function getName(): string
    {
        return 'vnpay';
    }

    /**
     * Tên hiển thị trong trang cài đặt Admin
     */
    public function getAdminName(): string
    {
        return 'Cổng thanh toán VNPay';
    }

    /**
     * Mô tả ngắn trong trang cài đặt Admin
     */
    public function getAdminDescription(): string
    {
        return 'Thanh toán qua ví điện tử VNPay';
    }

    /**
     * URL hình icon hiển thị trong Admin và trang Checkout
     */
    public function getAdminIcon(): string
    {
        return asset('your-plugin::images/vnpay-icon.png', true);
    }

    /**
     * (Tuỳ chọn) Ghi đè form() để thêm trường cấu hình riêng (API Key, Secret...)
     * Mặc định AbstractPaymentBase đã có form() với Icon + Checkout Name/Description đa ngôn ngữ
     */
    public function form()
    {
        $form = parent::form(); // Lấy form mặc định

        $key = $this->getName();

        // Thêm trường API Key
        $form->text($key.'[tmn_code]', ['label' => 'TMN Code (vnp_TmnCode)'], 
            PaymentManager::getConfig($key)['tmn_code'] ?? '');
        $form->password($key.'[hash_secret]', ['label' => 'Hash Secret Key'],
            PaymentManager::getConfig($key)['hash_secret'] ?? '');

        return $form;
    }

    /**
     * (Tuỳ chọn) Ghi đè saveConfig() để lưu thêm các trường tuỳ chỉnh
     */
    public function saveConfig(Request $request)
    {
        $payment = parent::saveConfig($request); // Lưu các trường mặc định

        $data = $request->input($this->getName());
        $payment['tmn_code']   = $data['tmn_code'] ?? '';
        $payment['hash_secret'] = $data['hash_secret'] ?? '';

        return $payment;
    }
}
```

> **Các method được kế thừa từ `AbstractPaymentBase`:**
> - `form()` – render form cấu hình mặc định (Icon + Checkout Name + Description đa ngôn ngữ)
> - `saveConfig(Request $request)` – lưu config mặc định
> - `getCheckoutName($locale)` – tên hiển thị trên trang checkout theo ngôn ngữ
> - `getCheckoutDescription($locale)` – mô tả trên trang checkout
> - `getCheckoutIcon()` – icon trên trang checkout
> - `useGateway(): bool` – kiểm tra gateway có được bật không
> - `getPosition(): int` – vị trí ưu tiên hiển thị
> - `validate(Request $request)` – validate trước khi lưu config

---

## Bước 2: Tạo Payment Gateway Class

Class này xử lý luồng giao dịch thực tế (tạo request, nhận response).

Tạo file: `plugins/your-plugin/app/Gateway/VNPay/VNPayGateway.php`

```php
<?php
namespace YourPlugin\Gateway\VNPay;

use Ecommerce\Gateway\Payment\Common\AbstractPaymentGateway;
use Ecommerce\Models\Order;

class VNPayGateway extends AbstractPaymentGateway
{
    /**
     * Khai báo các parameter mặc định của Gateway
     */
    public function getDefaultParameters(): array
    {
        return [
            'testMode'   => false,
            'tmn_code'   => '',
            'hash_secret'=> '',
        ];
    }

    // Getter/Setter cho các parameter tùy chỉnh
    public function getTmnCode(): string { return $this->getParameter('tmn_code'); }
    public function setTmnCode($value): static { return $this->setParameter('tmn_code', $value); }

    public function getHashSecret(): string { return $this->getParameter('hash_secret'); }
    public function setHashSecret($value): static { return $this->setParameter('hash_secret', $value); }

    /**
     * Tạo request thanh toán
     * Được gọi khi khách xác nhận đặt hàng
     *
     * @param Order $order  Đối tượng đơn hàng
     * @return mixed URL redirect hoặc response
     */
    public function purchase(Order $order)
    {
        // Cách 1: Tạo PurchaseRequest riêng (khuyến nghị cho tích hợp phức tạp)
        return $this->createRequest(VNPayPurchaseRequest::class, [
            'amount'      => $order->total,
            'order_id'    => $order->id,
            'order_code'  => $order->code,
            'return_url'  => PaymentManager::getReturnUrl($order->id),
            'cancel_url'  => PaymentManager::getCancelUrl($order->id),
        ]);

        // Cách 2: Xử lý trực tiếp và return URL redirect (đơn giản hơn)
        // $params = [...];
        // $paymentUrl = 'https://sandbox.vnpayment.vn/...' . '?' . http_build_query($params);
        // return redirect($paymentUrl);
    }

    /**
     * Xử lý callback/IPN từ VNPay sau khi thanh toán
     */
    public function completePurchase(array $data)
    {
        return $this->createRequest(VNPayCompletePurchaseRequest::class, $data);
    }
}
```

### Tạo PurchaseRequest (tuỳ chọn, cho cấu trúc sạch hơn)

```php
<?php
namespace YourPlugin\Gateway\VNPay;

use Ecommerce\Gateway\Payment\Common\Message\AbstractRequest;

class VNPayPurchaseRequest extends AbstractRequest
{
    public function getData(): array
    {
        return [
            'vnp_TmnCode'   => $this->getParameter('tmn_code'),
            'vnp_Amount'    => $this->getParameter('amount') * 100,
            'vnp_OrderInfo' => 'Thanh toan don hang #' . $this->getParameter('order_code'),
            'vnp_ReturnUrl' => $this->getParameter('return_url'),
            // ... các params VNPay yêu cầu
        ];
    }

    public function sendData($data): VNPayPurchaseResponse
    {
        // Build URL và return Response
        $paymentUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?'
            . http_build_query($data);
        return new VNPayPurchaseResponse($this, $paymentUrl);
    }

    public function send()
    {
        return $this->sendData($this->getData());
    }
}
```

---

## Bước 3: Đăng ký vào PaymentManager

Trong `ServiceProvider::boot()` của plugin:

```php
<?php
namespace YourPlugin\Providers;

use Ecommerce\Gateway\Payment\Common\PaymentManager;
use SkillDo\ServiceProvider;
use YourPlugin\Gateway\VNPay\VNPay;
use YourPlugin\Gateway\VNPay\VNPayGateway;

class YourPluginServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        PaymentManager::addGateway('vnpay', [
            'payment'  => VNPay::class,        // Base class (Bước 1)
            'gateway'  => VNPayGateway::class, // Gateway class (Bước 2)
            'position' => 3,                   // Thứ tự hiển thị (số nhỏ = đứng trước)
        ]);
    }
}
```

---

## Các Method Hữu Ích của PaymentManager

| Method | Mô tả |
|:---|:---|
| `PaymentManager::addGateway($key, $data)` | Đăng ký cổng thanh toán mới |
| `PaymentManager::allGateway()` | Lấy tất cả cổng đã đăng ký (đã khởi tạo) |
| `PaymentManager::gateway($key)` | Lấy một cổng theo key |
| `PaymentManager::getConfig($key)` | Lấy config đã lưu trong DB của cổng |
| `PaymentManager::saveConfig($key, $config)` | Lưu config vào DB |
| `PaymentManager::getReturnUrl($orderId)` | Lấy URL callback thành công |
| `PaymentManager::getCancelUrl($orderId)` | Lấy URL callback hủy thanh toán |

```php
// Lấy URL trả về sau thanh toán
$returnUrl = PaymentManager::getReturnUrl($order->id);
// → route: sicommerce.success

$cancelUrl = PaymentManager::getCancelUrl($order->id);
// → route: sicommerce.payment.cancel
```

---

## Luồng Hoạt Động

1. **Admin bật cổng**: Vào *Hệ thống → Thanh Toán*, cổng VNPay xuất hiện với tên, icon và form từ `VNPay::form()`.
2. **Admin lưu cấu hình**: `VNPay::saveConfig()` được gọi, lưu API keys vào `options['payments']['vnpay']`.
3. **Khách checkout**: `PaymentManager::allGateway()` tải `VNPay`, nếu `useGateway() === true` thì hiển thị.
4. **Khách đặt hàng**: Controller gọi `$gateway->getGateway()->purchase($order)` → trả về redirect URL.
5. **VNPay callback**: Controller nhận IPN, gọi `completePurchase()` để verify và cập nhật trạng thái đơn.

