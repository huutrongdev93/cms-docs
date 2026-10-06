# Structured output

Khi cần AI trả **dữ liệu** (tiêu đề + mô tả + từ khoá…) chứ không phải một đoạn văn, hãy khai **khung JSON** (schema). Nhà cung cấp buộc model trả đúng khung đó, kết quả đọc như một mảng PHP.

Cách cũ là dặn trong prompt "trả về JSON `{title, content}`" rồi tự bóc chuỗi: model hay thêm ```` ```json ````, lời dẫn, dấu nháy sai… Structured output bỏ được toàn bộ bước bóc chuỗi đó.

## Với `agent()`

```php
use Illuminate\Contracts\JsonSchema\JsonSchema;
use function Laravel\Ai\agent;

$response = agent('Bạn là chuyên gia SEO tiếng Việt.', schema: fn (JsonSchema $s) => [
    'seo_title'       => $s->string()->max(60)->required(),
    'seo_description' => $s->string()->max(160)->required(),
    'slug'            => $s->string()->required(),
    'keywords'        => $s->array()->items($s->string())->min(3)->max(5)->required(),
])->prompt('Dịch vụ thiết kế website bán hàng');

$response['seo_title'];         // đọc như mảng
$response->structured;          // cả mảng
$response->toArray();           // như trên
```

## Với class agent: `HasStructuredOutput`

```php
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;
use Stringable;

class ProductDescriptionAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function __construct(protected string $tone = 'thân thiện') {}

    public function instructions(): Stringable|string
    {
        return 'Bạn viết mô tả sản phẩm tiếng Việt, giọng '.$this->tone.'.';
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'title'       => $schema->string()->required(),
            'description' => $schema->string()->required(),
            'highlights'  => $schema->array()->items($schema->string())->min(3)->max(5)->required(),
        ];
    }
}
```

```php
$r = ProductDescriptionAgent::make(tone: 'sang trọng')->prompt('Áo sơ mi linen nam');

$r['title'];        // "Áo Sơ Mi Linen Cao Cấp…"
$r['highlights'];   // ['…', '…', '…', '…']
```

Ví dụ trên đã chạy thật với Gemini `gemini-3.1-flash-lite` và trả đúng khung.

## Các kiểu trong schema

| Kiểu | Ví dụ |
|---|---|
| Chuỗi | `$s->string()->min(10)->max(160)->pattern('^[a-z0-9-]+$')` |
| Số nguyên | `$s->integer()->min(1)->max(10)` |
| Số thực | `$s->number()->min(0)` |
| Đúng/sai | `$s->boolean()` |
| Mảng | `$s->array()->items($s->string())->min(1)->max(5)->unique()` |
| Đối tượng lồng | `$s->object(fn ($s) => ['name' => $s->string()->required(), 'price' => $s->integer()])` |
| Danh sách giá trị cho phép | `$s->string()->enum(['positive', 'neutral', 'negative'])` |

Mọi kiểu đều có thêm `->required()`, `->nullable()`, `->description('…')`, `->default(…)`.

## Mẹo

- **`->description()` giúp model hiểu ý.** Tên field là tiếng Anh ngắn gọn, mô tả bằng tiếng Việt rõ ràng: `$s->string()->description('Tiêu đề SEO, tối đa 60 ký tự, có từ khoá chính')`.
- **Đánh `->required()` cho mọi field bắt buộc.** Field không required có thể vắng mặt, đọc thì dùng `$r['x'] ?? ''`.
- **`max()` của chuỗi là gợi ý, không phải cam kết tuyệt đối** với mọi nhà cung cấp. Cắt lại bằng PHP nếu độ dài là điều kiện cứng (vd cột DB).
- Nội dung HTML dài (cả bài viết) vẫn để trong một field `string` được, nhưng model dễ trả markdown. Dặn rõ trong instructions: "field content là HTML, không dùng markdown".
