# Ví dụ: nút "Tóm tắt bằng AI" cho bài viết

Làm một plugin nhỏ `post-summary`: thêm nút trên form sửa bài viết, bấm vào thì AI đọc nội dung bài và viết đoạn tóm tắt vào ô *Mô tả*.

Ví dụ dựng theo đúng các mẫu mà `ai-content` 3.0.0 đang chạy (nút trên thanh nút form, ajax admin, chèn vào TinyMCE). Đây là khung để chép; hãy chạy thử trên site của bạn trước khi phát hành.

## Cấu trúc

```
plugins/post-summary/
├── plugin.json
├── post-summary.php
├── bootstrap/
│   ├── config.php
│   └── ajax.php
├── app/Ajax/SummaryAjax.php
└── views/script.blade.php
```

Không cần `composer.json`: thư viện AI có sẵn trong lõi.

## plugin.json

```json
{
    "name": "Post Summary",
    "class": "PostSummary",
    "version": "1.0.0",
    "description": "Tóm tắt bài viết bằng AI",
    "autoload": {
        "alias": "PostSummary"
    }
}
```

Khi đưa lên kho plugin, khai `compatibility` tối thiểu bằng bản lõi đầu tiên có AI. Đừng thêm `class_exists(\SkillDo\Ai\Ai::class)` vào mã để "phòng hờ": kho đã chặn cài lên lõi cũ.

## post-summary.php

```php
<?php
class PostSummary
{
    public function active(): void {}

    public function uninstall(): void {}
}
```

## bootstrap/config.php

```php
<?php
use SkillDo\Cms\Ai\AiSettings;
use SkillDo\Cms\Support\Admin;

// 1. Khai là plugin có dùng AI → tab Cấu hình hệ thống → Trí tuệ nhân tạo hiện ra.
add_filter('cms_ai_consumers', function ($consumers) {
    $consumers['post-summary'] = 'Post Summary';
    return $consumers;
});

// 2. Nút trên thanh nút của form bài viết. Chưa cấu hình AI thì không hiện nút.
add_filter('post_form_buttons', function ($buttons) {
    if (!AiSettings::ready()) return $buttons;

    $buttons[] = Admin::button('white', [
        'text'  => 'Tóm tắt bằng AI',
        'icon'  => '<i class="fa-duotone fa-solid fa-sparkles"></i>',
        'class' => 'js_post_summary',
    ]);

    return $buttons;
});

// 3. Script chỉ in ra ở trang thêm/sửa bài viết.
add_action('admin_footer', function () {
    if (in_array(Admin::getPage(), ['post_add', 'post_edit'])) {
        echo view('post-summary::script');
    }
});
```

## bootstrap/ajax.php

```php
<?php
Ajax::admin('PostSummary\Ajax\SummaryAjax::summarize');
```

## app/Ajax/SummaryAjax.php

```php
<?php
namespace PostSummary\Ajax;

use SkillDo\Ai\Ai;
use SkillDo\Http\Request;
use SkillDo\Support\Auth;
use SkillDo\Validate\Rule;

use function Laravel\Ai\agent;

class SummaryAjax
{
    static function summarize(Request $request): void
    {
        if (!Auth::hasCap('edit_posts')) {
            response()->error('Bạn không có quyền thực hiện thao tác này.');
        }

        $validate = $request->validate([
            'content' => Rule::make('Nội dung bài viết')->notEmpty(),
        ]);

        if ($validate->fails()) {
            response()->error($validate->errors());
        }

        // Bỏ thẻ HTML: đỡ tốn token, AI cũng đọc tốt hơn.
        $content = trim(strip_tags((string)$request->input('content')));

        $content = mb_substr($content, 0, 20000);

        try {
            $summary = agent(
                'Bạn tóm tắt bài viết tiếng Việt thành một đoạn 2 đến 3 câu, giọng tự nhiên, '
                .'không mở đầu bằng "Bài viết này". Chỉ trả về đoạn tóm tắt, không markdown.'
            )->prompt($content)->text;
        } catch (\Throwable $e) {
            app('log')->error('[post-summary] '.$e->getMessage());

            response()->error(Ai::errorMessage($e));
        }

        response()->success('Đã tóm tắt', ['summary' => trim($summary)]);
    }
}
```

Điểm cần chú ý:
- **Kiểm quyền ở máy chủ**, không tin vào việc nút chỉ hiện cho người có quyền.
- **Cắt bớt đầu vào**: bài rất dài vừa tốn tiền vừa có thể vượt giới hạn của model.
- **`Ai::errorMessage($e)`** để người quản trị thấy đúng lý do (hết quota, sai key…), xem [Lỗi và kiểm thử](06-Loi-va-Kiem-thu.md).

## views/script.blade.php

```html
<script>
    $(function () {
        // id của TinyMCE = {mã ngôn ngữ}_{tên field}, vd vi_content, vi_excerpt
        const lang = @json(\SkillDo\Cms\Support\Language::default());

        $(document).on('click', '.js_post_summary', function () {
            const content = tinymce.get(lang + '_content') ? tinymce.get(lang + '_content').getContent() : '';

            if (!content) {
                SkilldoMessage.error('Bài viết chưa có nội dung.');
                return;
            }

            const button = SkilldoUtil.buttonLoading($(this));
            button.start();

            request.post(ajax, {
                // Trong <script> của Blade phải viết \\ cho tên class PHP
                action: 'PostSummary\\Ajax\\SummaryAjax::summarize',
                content: content,
            }).then(function (response) {
                button.stop();
                SkilldoMessage.response(response);

                if (response.status === 'success' && tinymce.get(lang + '_excerpt')) {
                    tinymce.get(lang + '_excerpt').setContent(response.data.summary);
                }
            }).catch(function (error) {
                button.stop();
                SkilldoMessage.error(error.message);
            });
        });
    });
</script>
```

## Bước tiếp theo

- Muốn nhận nhiều thứ một lượt (tóm tắt + tiêu đề SEO + từ khoá): đổi sang [structured output](03-Structured-Output.md), trả mảng về JS.
- Muốn cho người dùng bấm "viết lại": lưu lịch sử và gửi kèm, xem mục *Lịch sử hội thoại* ở [Agent](02-Agent.md).
- Plugin thật, đầy đủ hơn: `plugins/ai-content` (modal viết cả bài, nút theo từng field, dịch nội dung, lịch sử hội thoại).
