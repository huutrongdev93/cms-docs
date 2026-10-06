# Streaming

`stream()` nhận câu trả lời **từng đoạn** trong lúc AI đang viết, thay vì đợi viết xong. Với nội dung dài (cả bài viết), người dùng thấy chữ hiện dần sau 1 đến 2 giây thay vì nhìn vòng quay 20 giây.

Từ bản 8.4.0 lõi đẩy được stream thẳng ra trình duyệt qua endpoint ajax thông thường:

```
Trình duyệt                          Máy chủ (handler ajax)
───────────────────                  ──────────────────────────────────────
request.stream(ajax, {...}, {        Ai::stream(agent('…')->stream($prompt));
    onDelta(delta, text) {…}            │  gửi header text/event-stream
})                                      │  mỗi đoạn AI viết → 1 sự kiện SSE, flush ngay
      ▲                                 │  lỗi giữa chừng → sự kiện error
      └──── data: {...} ◄───────────────┘  kết thúc: data: [DONE]
```

Đã kiểm thật qua Apache (mod_fcgid) với Gemini: các đoạn chữ tới client rải rác đúng nhịp AI viết, không bị gom lại tới cuối.

## Phía máy chủ: `Ai::stream()`

```php
namespace MyPlugin\Ajax;

use SkillDo\Ai\Ai;
use SkillDo\Cms\Ai\AiSettings;
use SkillDo\Http\Request;
use SkillDo\Support\Auth;

use function Laravel\Ai\agent;

class WriterAjax
{
    static function write(Request $request): void
    {
        if (!Auth::hasCap('edit_posts')) {
            response()->error('Bạn không có quyền thực hiện thao tác này.');
        }

        if (!AiSettings::ready()) {
            response()->error('Chưa cấu hình AI. Vào Cấu hình hệ thống → Trí tuệ nhân tạo (AI).');
        }

        $prompt = trim((string)$request->input('prompt'));

        if ($prompt === '') {
            response()->error('Chưa nhập nội dung.');
        }

        Ai::stream(
            agent('Bạn viết bài tiếng Việt, định dạng HTML đơn giản (p, h2, ul).')->stream($prompt, timeout: 150)
        );
    }
}
```

Đăng ký như mọi ajax khác: `Ajax::admin('MyPlugin\Ajax\WriterAjax::write');`.

- `Ai::stream()` **kết thúc request** như `response()->success()`: code phía sau không chạy.
- Kiểm tra quyền, dữ liệu, cấu hình **trước** khi gọi, và báo lỗi bằng `response()->error()` như bình thường. Phía trình duyệt nhận JSON lỗi đó và coi là lỗi.
- Lỗi xảy ra **trong lúc** stream (hết quota, mất kết nối tới nhà cung cấp…) được đổi thành sự kiện `{"type": "error", "message": …}`, nội dung đã qua `Ai::errorMessage()`, rồi luồng vẫn kết thúc bằng `[DONE]`.
- Người dùng đóng tab hoặc bấm dừng: máy chủ ngừng đọc tiếp để không tốn thêm token.
- `Ai::stream()` tự tắt các lớp đệm (output buffer, `zlib.output_compression`, `no-gzip` của Apache) và gửi `X-Accel-Buffering: no` cho nginx. Proxy phía trước (Cloudflare…) vẫn có thể gom luồng; nếu chữ chỉ hiện một lượt ở cuối thì kiểm tra cấu hình proxy.

### Xử lý sau khi AI viết xong: tham số `$complete`

Nhiều việc chỉ làm được khi đã có đủ chữ: đổi markdown sang HTML, bóc JSON, lưu lịch sử, trả `historyId` cho trình duyệt. Truyền một callback làm tham số thứ hai:

```php
Ai::stream($agent->stream($prompt), function (string $text) use ($historyId) {

    if (trim($text) === '') {
        throw new \Exception('AI không trả về nội dung, vui lòng thử lại');
    }

    HistoryStore::save($historyId, $text);

    return [
        'html'      => (new \Parsedown())->text($text),
        'historyId' => $historyId,
    ];
});
```

- Callback nhận toàn bộ chữ đã stream (và `$stream` ở tham số thứ 2 nếu cần `usage`).
- Mảng trả về được gửi thành sự kiện `{"type": "complete", "data": …}` ngay trước `[DONE]`. Trình duyệt nhận ở tham số thứ 3 của `onDone(text, usage, data)`.
- Ném `Exception` trong callback thì trình duyệt nhận sự kiện `error` với **đúng câu đó**, không có `complete`.
- AI lỗi giữa chừng thì callback **không chạy** (không lưu lịch sử rỗng).

Cách này thay cho mẫu "trả JSON `{html, historyId}` bằng `response()->success()`" khi chuyển một ajax cũ sang stream: dữ liệu giữ nguyên khung, chỉ chuyển sang sự kiện `complete`. Plugin `ai-content` 3.1.0 làm đúng như vậy.

`agent()->stream()->then(fn ($response) => …)` của SDK cũng chạy khi luồng đọc xong, nhưng không gửi được gì thêm cho trình duyệt; dùng `$complete` khi cần trả dữ liệu.

## Phía trình duyệt: `request.stream()`

Có sẵn trong admin (file `node_modules/core/http.js`, cùng chỗ với `request.post`).

```js
const controller = new AbortController();

request.stream(ajax, {
    action: 'MyPlugin\\Ajax\\WriterAjax::write',
    prompt: $('#prompt').val(),
}, {
    onDelta(delta, text) {
        // delta: đoạn vừa tới; text: toàn bộ chữ tới lúc này
        tinymce.get('vi_content').setContent(text);
    },
    onDone(text, usage, data) {
        // data = mảng callback $complete trả về (null nếu không truyền)
        SkilldoMessage.success('Xong');
    },
    onError(message) {
        SkilldoMessage.error(message);
    },
    signal: controller.signal,
});

// Nút "Dừng"
$('#stop').on('click', () => controller.abort());
```

| Tuỳ chọn | Khi nào gọi |
|---|---|
| `onDelta(delta, text)` | Mỗi đoạn chữ mới |
| `onEvent(event)` | Mọi sự kiện (`stream_start`, `text_delta`, `tool_call`, `tool_result`, `stream_end`…) |
| `onDone(text, usage, data)` | Kết thúc không lỗi; `data` = kết quả callback `$complete` |
| `onError(message)` | Lỗi (JSON lỗi trước khi stream, sự kiện `error`, mất kết nối). Bỏ trống thì tự hiện `SkilldoMessage.error` |
| `signal` | `AbortController.signal` để dừng giữa chừng |

`request.stream()` trả về `Promise` với toàn bộ chữ, `reject` khi lỗi. Dừng bằng `abort()` thì trả chuỗi rỗng, không lỗi. Header CSRF được gắn tự động như `request.post`.

> Trong `<script>` của Blade, tên class PHP phải viết `\\` (`'MyPlugin\\Ajax\\WriterAjax::write'`).

## Định dạng luồng

Giống giao thức mặc định của Laravel AI SDK, nên JS khác (hoặc `EventSource` ở trang GET) cũng đọc được:

```
: stream

data: {"type":"stream_start","provider":"gemini","model":"gemini-3.1-flash-lite",…}

data: {"type":"text_delta","delta":"Táo là loại ",…}

data: {"type":"text_delta","delta":"trái cây…",…}

data: {"type":"stream_end","reason":"stop","usage":{"input_tokens":12,"output_tokens":80,…},…}

data: [DONE]
```

Mỗi sự kiện là `StreamEvent::toArray()` của SDK. Ngoài `text_delta` còn `reasoning_delta`, `tool_call`, `tool_result`, `citation`…

## Stream một câu trả lời JSON

Khi prompt bắt AI trả JSON (vd `{"title": …, "content": …}`), chữ tới trình duyệt là **JSON viết dở**, không `JSON.parse` được cho tới cuối. Hai cách:

- Hiện thông báo "AI đang viết…", đợi sự kiện `complete` (máy chủ bóc JSON trong `$complete`) rồi mới hiện. Đơn giản, nhưng người dùng không thấy chữ chạy.
- Bóc từng field khỏi JSON dở để hiện dần, rồi thay bằng bản chốt ở `complete`. `ai-content` làm theo cách này: hàm `aiContentPartialField(raw, field)` trong `plugins/ai-content/views/modal.blade.php` chịu được escape bị cắt ngang và dấu `"` chưa escape trong HTML. Chép dùng lại được; đã kiểm với luồng Gemini thật, bản xem trước khớp từng ký tự với bản chốt.

## Đọc stream trong PHP (không gửi ra trình duyệt)

```php
use Laravel\Ai\Streaming\Events\TextDelta;

foreach (agent('…')->stream($prompt) as $event) {
    if ($event instanceof TextDelta) {
        echo $event->delta;
    }
}
```

## Không dùng

- `return agent(...)->stream(...)` hoặc `$stream->toResponse()`: cần `response()->stream()` của Laravel, SkillDo không có. Dùng `Ai::stream()`.
- `->broadcast()`, `->broadcastNow()`: SkillDo không có broadcasting.
- `usingVercelDataProtocol()` / `usingAgentUserInteractionProtocol()` chạy được (lõi đã có `symfony/uid`), nhưng chỉ qua `toResponse()`. Muốn dùng thì phải tự gửi response; `request.stream()` chỉ đọc định dạng mặc định ở trên.
