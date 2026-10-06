# Tools: cho AI đọc dữ liệu của website

Tool là một hàm PHP mà AI **tự quyết định gọi** khi cần. Ví dụ hỏi "Website có những bài viết mới nào?", AI gọi tool đọc bảng `post`, nhận kết quả, rồi mới trả lời. SDK lo cả vòng lặp: AI yêu cầu gọi tool → chạy tool → gửi kết quả lại → AI trả lời.

Luồng này đã chạy thật với Gemini trên SkillDo.

## Viết một tool

```php
namespace MyPlugin\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use SkillDo\Cms\Models\Post;
use Stringable;

class LatestPosts implements Tool
{
    /** AI đọc mô tả này để quyết định khi nào gọi tool. Viết rõ tool làm gì. */
    public function description(): Stringable|string
    {
        return 'Lấy danh sách bài viết mới nhất của website, có thể lọc theo từ khoá trong tiêu đề.';
    }

    /** Tham số AI được phép truyền vào. */
    public function schema(JsonSchema $schema): array
    {
        return [
            'limit'   => $schema->integer()->min(1)->max(20)->description('Số bài, mặc định 5'),
            'keyword' => $schema->string()->description('Từ khoá trong tiêu đề'),
        ];
    }

    /** Chạy tool. Trả về CHUỖI: AI đọc được JSON, văn bản… */
    public function handle(Request $request): Stringable|string
    {
        $limit = max(1, min(20, (int)($request['limit'] ?? 5)));

        $query = Post::where('post_type', 'post')->orderByDesc('created')->limit($limit);

        if (!empty($request['keyword'])) {
            $query->where('title', 'like', '%'.$request['keyword'].'%');
        }

        return json_encode(
            $query->get(['id', 'title', 'created'])->toArray(),
            JSON_UNESCAPED_UNICODE
        );
    }
}
```

> Đọc tham số bằng `$request['ten']`. **Không** dùng `$request->validate(...)`: hàm đó cần bộ validator của Laravel, SkillDo không có. Tự kiểm và ép kiểu như ví dụ trên, vì tham số do AI sinh ra, không đáng tin hơn dữ liệu người dùng gõ.

## Gắn tool vào agent

```php
use function Laravel\Ai\agent;

$response = agent('Bạn là trợ lý quản trị website. Dùng công cụ để lấy dữ liệu thật, không bịa.', tools: [
    new LatestPosts,
])->prompt('Website có những bài viết mới nào? Tóm tắt giúp tôi.');

$response->text;          // câu trả lời
$response->toolCalls;     // các lần gọi tool: ->name, ->arguments
```

Class agent thì implement `HasTools`:

```php
use Laravel\Ai\Contracts\HasTools;

class SiteAgent implements Agent, HasTools
{
    use Promptable;

    public function instructions(): Stringable|string { return '…'; }

    public function tools(): iterable
    {
        return [new LatestPosts];
    }
}
```

## An toàn

Tool chạy mã PHP thật với quyền của request hiện tại, theo quyết định của model. Vì vậy:

- **Ưu tiên tool chỉ đọc.** Tool ghi/xoá dữ liệu phải có lý do rõ ràng và tự kiểm quyền bên trong `handle()` (vd `Auth::hasCap('edit_posts')`). Đừng dựa vào việc nút gọi AI chỉ hiện cho admin.
- **Đừng trả dữ liệu nhạy cảm** (mật khẩu, email khách, API key) trong kết quả tool: mọi thứ tool trả về đều được gửi tới nhà cung cấp AI.
- **Giới hạn kích thước kết quả** (`limit`, chỉ lấy cột cần thiết): kết quả tool tính vào token đầu vào.
- Nội dung trong DB có thể chứa câu "hãy bỏ qua chỉ dẫn trước…" do người khác nhập. Coi kết quả tool là dữ liệu, đừng cho AI quyền làm việc nguy hiểm chỉ vì dữ liệu bảo vậy.

## Chưa kiểm trên SkillDo

SDK còn có tool của nhà cung cấp (`Laravel\Ai\Providers\Tools\WebSearch`, `WebFetch`, `CodeExecution`…) và dùng một agent khác làm tool. Các tính năng này **chưa được kiểm** trên SkillDo; dùng thì phải tự thử kỹ.
