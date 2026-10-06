# Agent: gọi AI

Mọi lần gọi AI đều đi qua một **agent**: một đối tượng có *chỉ dẫn* (instructions, tức lời dặn hệ thống) và nhận *câu lệnh* (prompt) của người dùng.

## Cách nhanh nhất: `agent()`

```php
use function Laravel\Ai\agent;

$response = agent('Bạn là trợ lý viết nội dung cho website doanh nghiệp. Trả lời bằng tiếng Việt.')
    ->prompt('Viết đoạn giới thiệu 3 câu cho công ty thiết kế website ở Đà Nẵng.');

echo $response->text;
```

Nhà cung cấp, API key và model lấy từ tab cấu hình AI. Không truyền gì thêm.

> `use function Laravel\Ai\agent;` là import **hàm**, không phải class. Quên dòng này PHP sẽ báo `Call to undefined function agent()`.

## Kết quả trả về

`prompt()` trả về `Laravel\Ai\Responses\AgentResponse`:

| Thuộc tính | Ý nghĩa |
|---|---|
| `$response->text` | Nội dung AI trả lời (chuỗi) |
| `$response->usage->inputTokens` / `->outputTokens` | Số token vào / ra (để tính chi phí) |
| `$response->meta->provider` / `->model` | Nhà cung cấp và model thật sự đã trả lời |
| `$response->toolCalls` | Các tool AI đã gọi (Collection, xem [Tools](04-Tools.md)) |

`(string) $response` cũng cho ra `text`.

## Tuỳ chọn khi gọi

```php
$response = agent('…')->prompt(
    'Câu lệnh',
    provider: 'openai',          // bỏ qua nhà cung cấp đang chọn ở admin
    model: 'gpt-5.6-luna',       // bỏ qua model đang chọn ở admin
    timeout: 120,                // giây, mặc định 60
);
```

**Trong plugin phát hành cho khách, đừng truyền `provider`/`model`.** Người quản trị có thể không có key của nhà cung cấp đó, và model AI bị khai tử rất nhanh (vd `gemini-2.0-flash` tắt 2026-06-01). Chỉ dùng khi cố ý, vd công cụ nội bộ.

Tác vụ dài (viết cả bài) nên tăng `timeout` và nới giới hạn thời gian của PHP:

```php
@set_time_limit(180);
$text = agent('…')->prompt($prompt, timeout: 150)->text;
```

## Class agent

Agent dùng ở nhiều nơi thì viết thành class: chỉ dẫn nằm một chỗ, dễ đọc, dễ kiểm thử.

```php
namespace MyPlugin\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;
use Stringable;

class SummaryAgent implements Agent
{
    use Promptable;

    public function __construct(protected int $sentences = 3) {}

    public function instructions(): Stringable|string
    {
        return 'Tóm tắt nội dung người dùng gửi thành đúng '.$this->sentences.' câu tiếng Việt.';
    }
}
```

```php
$summary = SummaryAgent::make(sentences: 2)->prompt($post->content)->text;
// hoặc: (new SummaryAgent(2))->prompt(...)
```

### Attribute cấu hình agent

Đặt trên class, áp cho mọi lần gọi của agent đó:

```php
use Laravel\Ai\Attributes\MaxTokens;
use Laravel\Ai\Attributes\Temperature;
use Laravel\Ai\Attributes\Timeout;

#[Timeout(90)]          // giây
#[Temperature(0.7)]     // 0 = bám sát, cao hơn = sáng tạo hơn
#[MaxTokens(800)]       // giới hạn độ dài câu trả lời
class SummaryAgent implements Agent { … }
```

| Attribute | Việc |
|---|---|
| `#[Timeout(giây)]` | Thời gian chờ tối đa |
| `#[Temperature(số)]` | Độ "sáng tạo" |
| `#[MaxTokens(số)]` | Giới hạn token đầu ra |
| `#[MaxSteps(số)]` | Giới hạn số vòng gọi tool |
| `#[Provider('gemini')]` | Ép nhà cung cấp. Truyền mảng `['gemini', 'openai']` để tự chuyển sang nhà cung cấp sau khi nhà cung cấp trước lỗi |
| `#[Model('…')]` | Ép model |
| `#[UseCheapestModel]` / `#[UseSmartestModel]` | Dùng model rẻ nhất / mạnh nhất **của SDK** |

> `#[Provider]`, `#[Model]`, `#[UseCheapestModel]`, `#[UseSmartestModel]` đều **bỏ qua lựa chọn của người quản trị**. `#[UseCheapestModel]` lấy model rẻ nhất do SDK khai, không phải model admin đã chọn. Tránh dùng trong plugin phát hành cho khách.

## Lịch sử hội thoại

AI không nhớ gì giữa hai lần gọi. Muốn "sinh lại", "viết tiếp", "thêm 10 tiêu đề nữa"… phải gửi kèm các lượt trước.

### Với `agent()`

```php
use Laravel\Ai\Messages\AssistantMessage;
use Laravel\Ai\Messages\UserMessage;

$response = agent('Bạn là chuyên gia SEO.', messages: [
    new UserMessage('Cho tôi 1 tiêu đề về thiết kế website.'),
    new AssistantMessage('Thiết kế website chuyên nghiệp cho doanh nghiệp'),
])->prompt('Cho tôi thêm 5 tiêu đề khác cùng chủ đề.');
```

> Truyền lịch sử bằng tham số `messages:` của `agent()`. **Không** dùng `agent()->withMessages(...)`: `agent()` đã là agent hội thoại nên SDK sẽ báo *"Ad-hoc message history may not be combined with a conversational agent"*.

### Với class agent: `Conversational`

```php
use Laravel\Ai\Contracts\Conversational;

class ChatAgent implements Agent, Conversational
{
    use Promptable;

    public function __construct(protected array $history = []) {}

    public function instructions(): Stringable|string { return '…'; }

    public function messages(): iterable
    {
        return array_map(fn ($m) => $m['role'] === 'user'
            ? new UserMessage($m['content'])
            : new AssistantMessage($m['content']), $this->history);
    }
}
```

### Lưu lịch sử ở đâu

SkillDo **chưa hỗ trợ** tính năng hội thoại tự lưu của SDK (`RemembersConversations`, cần bảng riêng). Plugin tự lưu lịch sử theo cách của mình. `ai-content` làm như sau, dùng lại được:

1. Lần gọi đầu: tạo `historyId`, ghi `[{role: 'user'|'bot', content}]` ra file JSON (`Storage::disk('plugins')`), trả `historyId` về trình duyệt.
2. Lần "sinh lại": đọc file theo `historyId`, đổi thành `UserMessage`/`AssistantMessage`, gọi AI, ghi thêm lượt mới.
3. Dọn file cũ hơn vài ngày ở mỗi lần ghi.

Xem `plugins/ai-content/app/ModelAi/ModelAi.php` (hàm `messages()`) và `AiContentPostAjax::historySave()`.
