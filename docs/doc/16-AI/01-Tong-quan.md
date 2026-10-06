# Tổng quan AI

Từ bản 8.4.0, SkillDo có sẵn **[Laravel AI SDK](https://github.com/laravel/ai)** (`laravel/ai` v1): một API chung để gọi các mô hình AI, dùng được với nhiều nhà cung cấp mà không phải đổi mã.

| Nhà cung cấp | Tên trong SDK | Ghi chú |
|---|---|---|
| Google Gemini | `gemini` | Có hạn mức miễn phí. **Đã kiểm với key thật.** |
| OpenAI (ChatGPT) | `openai` | |
| Anthropic (Claude) | `anthropic` | |
| DeepSeek | `deepseek` | |
| xAI (Grok) | `xai` | |
| Mistral | `mistral` | |
| Groq | `groq` | |
| OpenRouter | `openrouter` | Một key dùng được nhiều hãng |
| Ollama | `ollama` | Chạy trên máy chủ riêng, không cần key |

> Hiện mới gọi thật được với **Gemini**. Các nhà cung cấp khác dùng cùng một đường mã của SDK nhưng chưa có key để kiểm.

## Plugin dùng AI như thế nào

Plugin **không** cài thư viện AI riêng và **không** tự làm màn hình nhập API key. Mọi thứ đi qua lõi:

```
Người quản trị                          Plugin
────────────────                        ──────────────────────────────
Cấu hình hệ thống → Trí tuệ nhân tạo    add_filter('cms_ai_consumers', …)   ← khai là có dùng AI
  chọn nhà cung cấp                     agent('…')->prompt($prompt)         ← gọi AI
  nhập API key                                │
  chọn model                                  ▼
        │                               Laravel AI SDK (vendor/laravel/ai)
        └──── option `cms_ai` ────────► tự đọc nhà cung cấp / key / model
```

Hệ quả:
- Người quản trị nhập key **một lần**, mọi plugin dùng chung.
- Đổi nhà cung cấp (vd Gemini sang ChatGPT) không phải sửa plugin nào.
- Plugin **không bao giờ truyền API key hay tên model** khi gọi AI (trừ khi cố ý, xem [Agent](02-Agent.md)).

## Tab cấu hình AI

*Cấu hình hệ thống → Trí tuệ nhân tạo (AI)* gồm:

- thẻ chọn nhà cung cấp, thẻ nào đã có key thì hiện "Đã có API key";
- ô API key: key đã lưu **không bao giờ** in ra HTML, để trống là giữ key cũ, có ô tích để xoá key;
- ô model: bấm một gợi ý (lấy từ SDK: *Mặc định*, *Rẻ nhất*, *Mạnh nhất*) hoặc gõ tên bất kỳ, để trống là dùng mặc định của SDK;
- nút **Kiểm tra kết nối**: gửi một câu ngắn bằng giá trị đang gõ, chưa lưu cũng thử được;
- dòng "Đang được dùng bởi" liệt kê các plugin đã khai dùng AI.

**Tab ẩn mặc định.** Site không cài plugin nào dùng AI thì không thấy màn hình này. Nó chỉ hiện khi có ít nhất một plugin khai báo:

```php
// bootstrap của plugin (vd bootstrap/config.php)
add_filter('cms_ai_consumers', function ($consumers) {
    $consumers['my-plugin'] = 'Tên plugin của tôi';   // [id => tên hiển thị]
    return $consumers;
});
```

Khi nhà cung cấp đang chọn chưa có key, mục AI ở danh sách Cấu hình hệ thống hiện nhãn đỏ **Chưa có API key**.

## Kiểm tra AI có sẵn chưa

```php
use SkillDo\Ai\Ai;
use SkillDo\Cms\Ai\AiSettings;

Ai::available();      // thư viện đã nạp được chưa (false nếu máy chủ thiếu vendor/laravel/ai)
AiSettings::ready();  // nhà cung cấp đang chọn đã đủ thông tin để gọi chưa (có key, hoặc là Ollama)
```

Dùng hai hàm này để **ẩn nút AI** khi chưa cấu hình, thay vì để người dùng bấm rồi mới nhận lỗi.

## Đọc tiếp

| Trang | Nội dung |
|---|---|
| [Agent](02-Agent.md) | Gọi AI, đọc kết quả, class agent, lịch sử hội thoại |
| [Structured output](03-Structured-Output.md) | Bắt AI trả JSON đúng khung |
| [Tools](04-Tools.md) | Cho AI tự đọc dữ liệu của website |
| [Streaming](05-Streaming.md) | Đẩy chữ ra trình duyệt trong lúc AI đang viết (`Ai::stream()` + `request.stream()`) |
| [Lỗi và kiểm thử](06-Loi-va-Kiem-thu.md) | Bắt lỗi, Fake gateway |
| [Ví dụ plugin](07-Vi-du-Plugin.md) | Làm một nút AI hoàn chỉnh từ đầu tới cuối |
| [Giới hạn và nội bộ](08-Gioi-han-va-Noi-bo.md) | Những gì chưa dùng được, cách lõi nối SDK vào SkillDo |
