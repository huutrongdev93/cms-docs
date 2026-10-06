# Giới hạn và nội bộ

## Dùng được / không dùng được trên SkillDo

Laravel AI SDK viết cho Laravel đầy đủ; SkillDo chỉ dùng một phần Illuminate. Bảng dưới là kết quả **đã kiểm** trên SkillDo, không phải suy từ tài liệu Laravel.

| Tính năng | Trạng thái |
|---|---|
| `agent()->prompt()`, class agent, attribute | Dùng được, đã gọi thật (Gemini) |
| Structured output | Dùng được, đã gọi thật |
| Tools (tool tự viết) | Dùng được, đã gọi thật |
| Lịch sử hội thoại truyền tay (`messages:` / `Conversational`) | Dùng được, đã gọi thật |
| `stream()` đọc trong PHP | Dùng được, đã gọi thật |
| Fake gateway cho `prompt()` | Dùng được |
| Đẩy stream ra trình duyệt bằng `Ai::stream()` + `request.stream()` | Dùng được, đã đo thật qua Apache (xem [Streaming](05-Streaming.md)) |
| `stream()` trên agent đã fake | Dùng được |
| `$stream->toResponse()` / `return $stream` trong controller | **Không** (Response của SkillDo không có `stream()`), dùng `Ai::stream()` |
| `assertPrompted()` và các `assert*` khác | **Không** (cần PHPUnit) |
| `agent()->withMessages()` | **Không** (dùng tham số `messages:`) |
| `Tools\Request::validate()` | **Không** (không có validator của Laravel) |
| `->queue()`, `->broadcast()`, `->broadcastNow()` | **Không** (SkillDo không có queue / broadcast) |
| Hội thoại tự lưu (`RemembersConversations`) | **Không** (cần bảng + migration của Laravel), báo lỗi rõ ràng nếu gọi |
| Cache embeddings | **Không** (`cache` của SkillDo khác Illuminate) |
| Lệnh `php artisan make:agent`, `ai:chat` | **Không** (không có artisan) |
| Tạo ảnh, âm thanh, chuyển giọng nói, embeddings, reranking, tool của nhà cung cấp (WebSearch…) | **Chưa kiểm** |

## Cấu hình

Thứ tự dựng `config('ai')` (hàm `SkillDo\Ai\Ai::configure()`):

1. `vendor/laravel/ai/config/ai.php`: mặc định của SDK, đọc biến `.env` như Laravel (`GEMINI_API_KEY`, `OPENAI_API_KEY`…).
2. `config/ai.php` ở gốc site, nếu có: chỉ cần khai các key muốn đổi.
3. Các hàm đăng ký qua `Ai::configureUsing()`. Lõi CMS đăng ký `SkillDo\Cms\Ai\AiSettings::applyTo`, chép option `cms_ai` (tab cấu hình) đè lên.

Nghĩa là **cấu hình trong admin luôn thắng `.env`**. Model người quản trị chọn được ghi vào `ai.providers.{tên}.models.text.default`, key mà mọi provider văn bản của SDK đọc làm model mặc định.

Option `cms_ai`:

```php
[
    'default'   => 'gemini',
    'providers' => [
        'gemini' => ['key' => '…', 'model' => 'gemini-3.1-flash-lite', 'url' => ''],
    ],
]
```

Đọc/ghi qua `SkillDo\Cms\Ai\AiSettings` (`all()`, `provider($name)`, `defaultProvider()`, `ready()`, `save()`), không sửa option trực tiếp. API key lưu dạng rõ trong option, chỉ in ra giao diện ở dạng đã che (`AiSettings::mask()`).

Đã đổi cấu hình trong cùng request (vd vừa lưu key) thì gọi `Ai::refresh()` để lần gọi sau đọc lại.

## Thêm nhà cung cấp vào tab cấu hình

```php
add_filter('cms_ai_providers', function ($providers) {
    $providers['azure'] = [
        'name'        => 'Azure OpenAI',
        'vendor'      => 'Microsoft',
        'description' => 'OpenAI chạy trên hạ tầng Azure.',
        'apiKeyUrl'   => 'https://portal.azure.com',
        'requiresKey' => true,
        'url'         => true,                  // hiện ô địa chỉ máy chủ
        'urlPlaceholder' => 'https://….openai.azure.com',
    ];
    return $providers;
});
```

Tên key (`azure`) phải trùng một provider có trong `config('ai.providers')` của SDK. Nhà cung cấp cần cấu hình phức tạp hơn key + url + model (vd `deployment` của Azure) thì khai thêm qua `config/ai.php` ở gốc site.

## SDK được nối vào SkillDo thế nào

Dành cho người sửa lõi.

| Tầng | Vị trí | Việc |
|---|---|---|
| Framework | `packages/skilldo/framework/src/Ai/` (`SkillDo\Ai\*`) | Làm SDK chạy được ngoài Laravel |
| CMS | `packages/skilldo/cms/src/Ai/` (`SkillDo\Cms\Ai\*`) | Option `cms_ai`, danh sách nhà cung cấp, ẩn/hiện tab |
| Admin | `views/admin/app/Modules/System/Ai.php`, `Ajax/AiAjax.php`, `resources/system/ai.blade.php` | Tab cấu hình + nút kiểm tra kết nối |

Lõi **không** đăng ký `Laravel\Ai\AiServiceProvider` gốc (nó cần `runningInConsole`, Event facade, macro, bảng hội thoại). `SkillDo\Ai\AiServiceProvider` tự bù đúng những thứ SDK cần mà SkillDo không có:

- hàm `event()`, `resolve()`, `rescue()` (vốn thuộc `laravel/framework`), chỉ khai khi chưa có;
- trait `Illuminate\Queue\SerializesModels` bản rỗng: trait `Promptable` dùng nó, thiếu là mọi class agent lỗi ngay khi nạp;
- binding `events` + contract `Illuminate\Contracts\Events\Dispatcher`;
- `AiManager` dựng lười, cấu hình nạp ngay trước khi dựng.

`CmsServiceProvider::ai()` đăng ký provider này **trước** `PluginServiceProvider` để plugin nào nạp sớm cũng thấy SDK.

Bẫy thứ tự: `Promptable::prompt()`/`stream()` đọc `config('ai.default')` **trước** khi dựng `AiManager`. Vì vậy `AiServiceProvider` dựng `config('ai')` ngay khi app boot xong (`booted`), không đợi lần gọi đầu. Để lười thì lời gọi đầu tiên của mỗi request nhận `null` và chết với `TypeError` trong `formatProviderAndModelList()` (đã gặp thật khi đo stream qua Apache). `configureUsing()` đăng ký muộn và `refresh()` đều dựng lại ngay.

`Ai::stream()` / `Ai::streamEvents()` gửi SSE (xem [Streaming](05-Streaming.md)). Phía trình duyệt là `request.stream()` trong `packages/scripts/core/http.js`, admin nạp bằng `node_modules/core/http.js?v={phiên bản CMS}`.

## Phát hành bản cập nhật

Site khách không chạy composer, và gói cập nhật không mang theo `vendor/composer/*`. Vì vậy:

- Gói cập nhật lõi phải mang theo **toàn bộ** `vendor/laravel/ai/`, `vendor/illuminate/json-schema/`, `vendor/symfony/uid/` và `vendor/symfony/polyfill-uuid/`. `vendor/` không nằm trong git, nên `git diff` không liệt kê chúng.
- `packages/scripts/core/http.js` (có `request.stream()`) giao theo đường dẫn `node_modules/core/http.js`.
- `AiServiceProvider::autoload()` tự đăng ký PSR-4 cho `Laravel\Ai\`, `Illuminate\JsonSchema\`, `Symfony\Component\Uid\`, và nạp `functions.php` của laravel/ai cùng `bootstrap.php` của polyfill-uuid, khi composer của site chưa biết các gói này (cùng cách với trình quản lý tệp ở 8.3.0).
- **Bẫy:** muốn biết composer đã biết một gói chưa thì hỏi loader (`getPrefixesPsr4()`), **không** thử `class_exists()` trước khi `addPsr4()`. `ClassLoader` của composer nhớ các class đã tìm không thấy, nên `class_exists()` sau khi thêm PSR-4 vẫn trả `false` và AI chết trên mọi site khách. Lỗi này bắt được bằng cách giả lập site khách: gỡ các tiền tố khỏi loader rồi boot.
- Thiếu thư mục vendor thì site vẫn chạy, `Ai::available()` trả `false`, tab AI báo cần cập nhật lại CMS.
- `illuminate/json-schema` ghim ở `^12.62`: để trống composer lấy bản 13.x, bản đó đòi `illuminate/contracts` 13.

Kiểm lớp nối: `composer ai` (thêm `AI_LIVE=1` để gọi thật), và `composer ai:js` cho `request.stream()`. Kế hoạch và lịch sử quyết định: `AI-SDK-PLAN.md` ở gốc repo.
