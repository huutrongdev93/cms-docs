# Lỗi và kiểm thử

## Luôn bọc lời gọi AI trong try/catch

Gọi AI là gọi mạng tới dịch vụ bên ngoài: thiếu key, hết quota, sai model, mạng chập chờn… đều ném exception. Mẫu chuẩn trong ajax handler:

```php
use SkillDo\Ai\Ai;
use SkillDo\Cms\Ai\AiSettings;
use SkillDo\Http\Request;
use function Laravel\Ai\agent;

static function summarize(Request $request): void
{
    if (!Ai::available() || !AiSettings::ready()) {
        response()->error('Chưa cấu hình AI. Vào Cấu hình hệ thống → Trí tuệ nhân tạo (AI) để nhập API key.');
    }

    try {
        $text = agent('Tóm tắt thành 3 câu tiếng Việt.')->prompt((string)$request->input('content'))->text;
    } catch (\Throwable $e) {
        app('log')->error('[my-plugin] '.$e->getMessage());

        response()->error(Ai::errorMessage($e));
    }

    response()->success('Xong', ['text' => $text]);
}
```

`response()->error()` kết thúc request ngay, nên không cần `return` sau nó (quy ước chung của ajax SkillDo).

## `Ai::errorMessage()`: hiện lỗi dễ hiểu

SDK bọc lỗi HTTP của nhà cung cấp thành exception riêng, và thông báo của chúng rất chung chung:

```
Application rate limited by AI provider [gemini].
```

Lời giải thích thật của nhà cung cấp (quota nào, model nào, thử lại sau bao lâu) nằm trong exception bên trong. `Ai::errorMessage($e)` lấy phần đó ra:

```
Application rate limited by AI provider [gemini]. (HTTP 429: You exceeded your current quota…, model: gemini-3.6-flash) Thử lại sau 38 giây.
```

Luôn dùng `Ai::errorMessage($e)` khi đưa lỗi ra giao diện, `$e->getMessage()` không đủ để người quản trị tự xử lý.

### Các lỗi hay gặp

| Exception (`Laravel\Ai\Exceptions\…`) | HTTP | Nguyên nhân thường gặp | Người quản trị cần làm |
|---|---|---|---|
| `RateLimitedException` | 429 | Hết hạn mức (gói miễn phí giới hạn số request/phút, hoặc model không có trong gói) | Đợi rồi thử lại, hoặc chọn model khác (vd model *Rẻ nhất*), hoặc nâng gói |
| `InsufficientCreditsException` | 402 | Tài khoản hết tiền | Nạp thêm |
| `ProviderOverloadedException` | 5xx | Nhà cung cấp quá tải | Thử lại sau |
| `ProviderConnectionException` | | Máy chủ không kết nối được tới nhà cung cấp | Kiểm tra mạng / tường lửa của hosting |
| `Illuminate\Http\Client\RequestException` | 400, 401, 403, 404 | Sai key, model không tồn tại, request không hợp lệ | Xem phần HTTP trong `Ai::errorMessage()` |

Ví dụ thật: key Gemini gói miễn phí gọi model mặc định `gemini-3.6-flash` bị 429, đổi sang `gemini-3.1-flash-lite` thì chạy được.

## Kiểm thử không tốn quota: Fake gateway

`fake()` thay nhà cung cấp thật bằng câu trả lời định sẵn, **không gọi mạng**. Fake theo từng class agent (`agent()` là `Laravel\Ai\AnonymousAgent`, `agent(schema: …)` là `Laravel\Ai\StructuredAnonymousAgent`).

```php
use Laravel\Ai\AnonymousAgent;
use Laravel\Ai\StructuredAnonymousAgent;

// Trả lần lượt từng phần tử cho mỗi lần prompt
AnonymousAgent::fake(['Câu trả lời 1', 'Câu trả lời 2']);

// Structured: mỗi phần tử là một mảng đúng khung
StructuredAnonymousAgent::fake([['seo_title' => 'T', 'keywords' => ['a']]]);

// Class agent của bạn
SummaryAgent::fake(['Tóm tắt giả']);

// Không truyền gì: agent có schema sẽ nhận dữ liệu giả sinh theo schema
ProductDescriptionAgent::fake();

// Closure: nhận prompt (chuỗi), dùng để kiểm prompt plugin đã dựng
$seen = null;
AnonymousAgent::fake(function (string $prompt) use (&$seen) {
    $seen = $prompt;
    return 'ok';
});
```

Fake cũng dùng được với `stream()`: kiểm luồng gửi ra trình duyệt bằng `iterator_to_array(Ai::streamEvents(agent('…')->stream('…')), false)` (mỗi phần tử là một chuỗi `data: …`), không phải gửi header hay `exit` như `Ai::stream()`.

Phía trình duyệt: `composer ai:js` chạy `request.stream()` bằng Node với luồng giả.

Sau khi fake, gọi `Ai::refresh()` để bỏ fake và quay về nhà cung cấp thật trong cùng tiến trình.

### Những gì KHÔNG dùng được

- `assertPrompted()`, `assertPromptedTimes()`, `assertNeverPrompted()`… cần PHPUnit, SkillDo không có. Dùng closure như trên để bắt prompt rồi tự so.

### Viết script kiểm thử

SkillDo không có PHPUnit; kiểm thử là script PHP chạy bằng CLI, boot ứng dụng qua `tests/bootstrap.php`. Mẫu có sẵn:

- `tests/ai.php` (`composer ai`): kiểm lớp nối của lõi. `AI_LIVE=1 composer ai` thêm một lần gọi thật bằng cấu hình đang lưu.
- `plugins/ai-content/tool/test-sdk.php`: kiểm một plugin dùng AI, chạy được cả khi plugin chưa bật (tự map PSR-4).

```bash
TEST_BASE_URL=http://site.local/ composer ai
AI_LIVE=1 TEST_BASE_URL=http://site.local/ php plugins/my-plugin/tool/test-ai.php
```
