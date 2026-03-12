# Log

> **File:** `packages/skilldo/framework/src/Log/Log.php`  
> **Namespace:** `SkillDo\Log\Log`  
> **Alias ngắn:** `\Log`

Class `Log` cung cấp hệ thống ghi nhật ký (logging) cho SkillDo CMS v8. Log hỗ trợ 2 channel (cách lưu file) và 8 cấp độ log theo chuẩn PSR-3.

---

## 1. Các Channel (Chế Độ Lưu)

### `daily` (Mặc định)
Ghi log vào file theo từng ngày, tự động tạo file mới mỗi ngày và xóa file cũ hơn **360 ngày**.

- **Vị trí file log:** `storage/logs/app-DD-MM-YYYY.log`
- Ví dụ: `storage/logs/app-10-03-2026.log`

### `single`
Ghi log vào một file cố định tại đường dẫn bạn chỉ định. Thường dùng để ghi log riêng cho từng Plugin.

- **Vị trí file log:** Đường dẫn tương đối từ thư mục `storage/logs/`
- Ví dụ: `plugins/my-plugin/error.log` → `storage/logs/plugins/my-plugin/error.log`

---

## 2. Các Cấp Độ Log

Theo thứ tự từ nghiêm trọng nhất đến ít nghiêm trọng nhất:

| Level | Mô tả |
|---|---|
| `emergency` | Hệ thống không thể hoạt động |
| `alert` | Cần xử lý ngay lập tức |
| `critical` | Lỗi nghiêm trọng, tính năng không hoạt động |
| `error` | Lỗi thực thi, exception |
| `warning` | Cảnh báo, không phải lỗi nhưng cần chú ý |
| `notice` | Thông báo thông thường nhưng đáng ghi nhớ |
| `info` | Thông tin hữu ích (luồng xử lý bình thường) |
| `debug` | Thông tin chi tiết để debug khi phát triển |

---

## 3. Cách Sử Dụng

### 3.1 Dùng Channel `daily` (Mặc định)

Gọi trực tiếp các static method — hệ thống tự dùng channel `daily`:

```php
use SkillDo\Log\Log;

// Ghi thông tin
Log::info('Người dùng đăng nhập thành công', ['user_id' => 5]);

// Ghi cảnh báo
Log::warning('Số lượng tồn kho thấp', ['product_id' => 10, 'quantity' => 2]);

// Ghi lỗi
Log::error('Thanh toán thất bại', ['order_id' => 123, 'reason' => 'Insufficient funds']);

// Ghi debug (dùng khi phát triển)
Log::debug('Giá trị biến $cart', ['cart' => $cart]);

// Ghi không có context
Log::info('Cron job chạy xong');
```

**Định dạng một dòng trong file log:**
```
[2026-03-10 23:30:00] local.INFO: Người dùng đăng nhập thành công {"user_id":5}
[2026-03-10 23:31:05] local.ERROR: Thanh toán thất bại {"order_id":123,"reason":"Insufficient funds"}
```

---

### 3.2 Dùng Channel `single` — File Log Riêng Cho Plugin

Dùng `Log::single($path)` để ghi vào một file riêng, tránh lẫn lộn với log hệ thống. Đường dẫn `$path` là tương đối so với `storage/logs/`.

```php
use SkillDo\Log\Log;

// Ghi log vào storage/logs/plugins/my-plugin/error.log
Log::single('plugins/my-plugin/error.log')->error('Gọi API thất bại', [
    'url'    => 'https://api.example.com/pay',
    'status' => 500,
]);

// Ghi log thông tin vào file riêng
Log::single('plugins/my-plugin/activity.log')->info('Đơn hàng được tạo', [
    'order_id' => 456,
    'total'    => 250000,
]);
```

---

### 3.3 Dùng Channel `daily` Tường Minh

```php
use SkillDo\Log\Log;

Log::daily()->info('Cron job đồng bộ sản phẩm hoàn tất', ['count' => 150]);
```

---

## 4. Danh Sách Method

Tất cả method đều nhận 2 tham số: `$message` (bắt buộc) và `$context` (mảng dữ liệu bổ sung, tùy chọn).

```php
Log::emergency(string $message, array $context = []): void
Log::alert(string $message, array $context = []): void
Log::critical(string $message, array $context = []): void
Log::error(string $message, array $context = []): void
Log::warning(string $message, array $context = []): void
Log::notice(string $message, array $context = []): void
Log::info(string $message, array $context = []): void
Log::debug(string $message, array $context = []): void
```

---

## 5. Ví Dụ Thực Tế Trong Plugin

### Ghi log trong try/catch

```php
use SkillDo\Log\Log;

try {
    $response = \Http::post('https://api.payment.com/charge', [
        'amount' => 250000,
        'token'  => $token,
    ]);

    if (!$response->successful()) {
        Log::error('Thanh toán thất bại', [
            'status' => $response->status(),
            'body'   => $response->body(),
        ]);
        return false;
    }

    Log::info('Thanh toán thành công', [
        'order_id'       => $orderId,
        'transaction_id' => $response->json('transaction_id'),
    ]);

    return true;

} catch (\Exception $e) {
    Log::critical('Ngoại lệ khi thanh toán: ' . $e->getMessage(), [
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString(),
    ]);
    return false;
}
```

### Dùng file log riêng trong Plugin

```php
use SkillDo\Log\Log;

class MyPluginApiService
{
    // Tạo logger riêng cho plugin này
    private function logger(): \SkillDo\Log\Log
    {
        return Log::single('plugins/my-plugin/api.log');
    }

    public function syncProducts(): void
    {
        $this->logger()->info('Bắt đầu đồng bộ sản phẩm');

        try {
            $products = $this->fetchFromApi();

            $this->logger()->info('Đồng bộ hoàn tất', [
                'count' => count($products),
            ]);

        } catch (\Exception $e) {
            $this->logger()->error('Lỗi đồng bộ: ' . $e->getMessage());
        }
    }
}
```

### Ghi log trong Model Event

```php
protected static function boot(): void
{
    parent::boot();

    static::deleted(function (Order $order, $listIdRemove) {
        Log::warning('Đơn hàng bị xóa', [
            'ids'         => $listIdRemove,
            'deleted_by'  => \Auth::id(),
        ]);
    });
}
```

---

## 6. Vị Trí File Log

| Channel | Đường dẫn file trên server |
|---|---|
| `daily` (mặc định) | `storage/logs/app-DD-MM-YYYY.log` |
| `single('plugins/my-plugin/api.log')` | `storage/logs/plugins/my-plugin/api.log` |

> **Lưu ý:** Thư mục `storage/logs/` được đặt bên ngoài webroot, không thể truy cập trực tiếp từ trình duyệt.  
> Log channel `daily` tự động xóa file cũ hơn **360 ngày** để tránh chiếm dung lượng.
