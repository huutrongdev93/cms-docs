# Metabox & metadata

SkillDo CMS sở hữu tính năng **Metabox** mạnh mẽ giúp bạn thêm "Bảng Phụ" để lưu thêm nhiều thông tin dưới dạng Metadata mà KHÔNG CẦN đụng đến Cột (Column) trong Bảng Chính!

---

## 1. Hoạt Động (Hook)

SkillDo quy định 2 Action chính để bạn thao tác với giao diện tạo/sửa Bài Viết (hoặc Chủ Đề, Category):
1. **`add_meta_box`**: Action yêu cầu in một vùng HTML Form nằm lọt thỏm trong giao diện chung.
2. **`save_{module}_object`**: Action gọi khi người quản trị Lưu Cập Nhật (cả thêm mới lẫn cập nhật), nhận tham số `($id, $request, $insertData, $dataOutside)`. Ngoài ra còn có:
    - `save_{module}_object_add` – chỉ khi thêm mới
    - `save_{module}_object_edit` – chỉ khi cập nhật
    - `save_object` – bắt tất cả module, nhận thêm `$module` ở tham số thứ 2

Bộ thư viện Form Builder (Mảng Array giống Plugin Element) được sử dụng để sinh ra giao diện `TextBox / Select / Radio` cho Metadata một cách đồng bộ nhất với Admin thay vì bạn phải tự cặm cụi code tay HTML Bootstrap.

---

## 2. Nơi Đăng Ký Metabox Trong Theme

Cách tổ chức chuẩn trong theme là:
- **Tạo một class riêng** ở `theme-child/app/Custom/` để đóng gói toàn bộ logic đăng ký + render + lưu.
- **Đăng ký class vào hệ thống** tại `theme-child/bootstrap/theme-child.php` bằng `add_action`.

---

## 3. Bước 1 – Tạo Class Metabox trong `theme-child/app/Custom/`

Tạo file `theme-child/app/Custom/PostSourceMetabox.php`:

```php
<?php
namespace Theme\Custom;

use SkillDo\Cms\Support\Metabox;   // Cms\Support — KHÔNG phải Cms\Metabox\Metabox (class đó không tồn tại)
use SkillDo\Cms\Form\Form;
use SkillDo\Http\Request;
use SkillDo\Cms\Support\Metadata;  // KHÔNG có alias gốc `Metadata` — phải khai đủ namespace
                                   // (`Metabox` thì CÓ alias gốc, nhưng `Metadata` thì không)

class PostSourceMetabox
{
    /**
     * Đăng ký metabox vào hệ thống.
     * Được gọi qua add_action('add_meta_box', ...) từ bootstrap.
     */
    public static function register(): void
    {
        // Metabox::add($id, $title, $callback, $args = [])
        Metabox::add(
            'source_post_metabox',            // ID Bảng Phụ
            'Nguồn Gốc Của Bài Viết Này',     // Tiêu đề của Box
            [static::class, 'render'],        // Hàm callback render form
            [
                'module'   => 'post',         // Áp dụng cho module (post, page, products...)
                'position' => 10,             // Thứ tự sắp xếp hiển thị
                'content'  => 'leftBottom'    // Vị trí: leftBottom | leftTop | right | tabs
            ]
        );
    }

    /**
     * Render nội dung Form trong Box.
     * Hệ thống tự truyền $object là Post Data (khi Sửa) hoặc null (khi Thêm mới).
     */
    public static function render($object): void
    {
        // Trang THÊM MỚI truyền vào rỗng -> phải chặn trước, không gọi thẳng $object->id
        $id = (hasItems($object)) ? $object->id : 0;

        // Tham số thứ 4 là $single, KHÔNG phải giá trị mặc định.
        // Bỏ trống (mặc định false) sẽ trả về OBJECT gom mọi key -> gán vào ô text là hỏng.
        $source_name = ($id) ? Metadata::get('post', $id, '_source_name', true) : '';
        $source_url  = ($id) ? Metadata::get('post', $id, '_source_url',  true) : '';

        // Sử dụng SkillDo Form Builder để in HTML chuẩn
        $form = new Form();

        // KHÔNG `echo $form->text(...)`: hàm này trả về đối tượng InputBuilder, không có
        // __toString -> lỗi "Object could not be converted to string".
        // Khai các field trước, in một lần ở cuối bằng html().
        $form->text('source_name', [
            'label'       => 'Tên Tạp chí/Báo gốc',
            'value'       => $source_name,
            'placeholder' => 'VD: VNExpress'
        ]);

        // Không có field kiểu `url` trong Form Builder — dùng `text`
        $form->text('source_url', [
            'label'       => 'Đường dẫn link báo gốc',
            'value'       => $source_url,
            'placeholder' => 'https://…'
        ]);

        $form->html(false);   // false = ECHO ra. Mặc định true là TRẢ VỀ chuỗi -> box hiện trắng trơn
    }

    /**
     * Lưu dữ liệu khi người dùng nhấn Lưu bài viết.
     * Được gọi qua add_action('save_post_object', ...) từ bootstrap.
     *
     * Hook save thực tế (xem FormAdminHelper):
     *   - save_{module}_object      : cả thêm mới lẫn cập nhật  → ($id, $request, $insertData, $dataOutside)
     *   - save_{module}_object_add  : chỉ khi thêm mới
     *   - save_{module}_object_edit : chỉ khi cập nhật
     *   - save_object               : tất cả module             → ($id, $module, $request, $insertData, $dataOutside)
     *
     * @param int     $post_id      ID bài viết vừa lưu
     * @param Request $request      HTTP Request chứa dữ liệu form
     * @param array   $insertData   Dữ liệu đã được insert vào DB
     * @param array   $dataOutside  Dữ liệu nằm ngoài model (meta, file...)
     */
    public static function save(int $post_id, Request $request, array $insertData, array $dataOutside): void
    {
        if ($request->has('source_name')) {
            Metadata::update('post', $post_id, '_source_name', $request->input('source_name'));
            Metadata::update('post', $post_id, '_source_url',  $request->input('source_url'));
        }
    }
}
```

---

## 4. Bước 2 – Đăng Ký vào Hệ Thống tại `theme-child/bootstrap/theme-child.php`

```php
<?php
use Theme\Custom\PostSourceMetabox;

// Đăng ký metabox (hiển thị form phụ trong trang tạo/sửa bài viết)
add_action('add_meta_box', [PostSourceMetabox::class, 'register']);

// Lắng nghe sự kiện lưu bài viết để lưu metadata (cả thêm mới lẫn cập nhật)
// Hook nhận 4 tham số: $id, $request, $insertData, $dataOutside
add_action('save_post_object', [PostSourceMetabox::class, 'save'], 10, 4);
```

---

## 5. Truy Xuất Metadata Ra Màn Hình Frontend

Trong file View Theme `theme-store/views/post-detail.blade.php`:

```php
@php
    use SkillDo\Cms\Support\Metadata;   // Blade biên dịch ra namespace gốc, mà `Metadata`
                                        // không có alias gốc -> thiếu dòng này là "Class not found"

    // SkillDo Blade đã bơm tự động Object bài viết là biến $post
    // Tham số thứ 4 = $single. Phải truyền `true` để lấy MỘT giá trị; bỏ trống sẽ trả về
    // object gom mọi key và {{ }} báo "Object of class stdClass could not be converted to string".
    $name = Metadata::get('post', $post->id, '_source_name', true);
    $url  = Metadata::get('post', $post->id, '_source_url',  true);
@endphp

@if($name && $url)
    <div class="source-credit" style="padding:10px; background:#f0f0f0;">
        <p><strong>Bản quyền thuộc về:</strong> <a href="{{ $url }}" target="_blank">{{ $name }}</a></p>
    </div>
@endif
```

---

## TỔNG KẾT

| Bước | File | Việc cần làm |
|------|------|--------------|
| 1 | `theme-child/app/Custom/PostSourceMetabox.php` | Tạo class chứa `register()`, `render()`, `save()` |
| 2 | `theme-child/bootstrap/theme-child.php` | Đăng ký 2 action: `add_meta_box` và `save_post_object` |
| 3 | View blade frontend | Dùng `Metadata::get()` để hiển thị ra giao diện người dùng |

**Bốn chỗ dễ sai nhất khi gõ theo trí nhớ** (đã đối chiếu source v8):

| Sai | Đúng | Hậu quả nếu sai |
|---|---|---|
| `use SkillDo\Cms\Support\Metabox;` | `use SkillDo\Cms\Support\Metabox;` | class không tồn tại → fatal ngay lúc autoload |
| `use Metadata;` | `use SkillDo\Cms\Support\Metadata;` | `Metabox` có alias gốc, `Metadata` **không** → *Class "Metadata" not found* |
| `echo $form->text(...)` | khai field rồi `$form->html(false)` | `text()` trả về InputBuilder, không có `__toString` → *Object could not be converted to string* |
| `Metadata::get($t, $id, $key, '')` | `Metadata::get($t, $id, $key, true)` | tham số 4 là `$single`, không phải giá trị mặc định → trả về **object stdClass** |
| `$form->url(...)` | `$form->text(...)` | Form Builder không có kiểu `url` |

Ngoài ra `$object` là **rỗng ở trang Thêm mới** — luôn `hasItems($object)` trước khi đọc `$object->id`.

**Lưu ý quan trọng:**
1. Lợi dụng khả năng mở rộng không giới hạn của bảng `Metadata` CMS (Gồm `Module Type`, `Target ID`, `Key`, và `Value`).
2. Dùng Metabox Hook để mượn chỗ đặt form thu thập liệu mà không phải phá hư form Mặc Định CMS.
3. Không làm bốc hơi/phình to Hệ Quản Trị Hệ Cơ Sở Dữ Liệu SQL cốt lõi của bảng chính bằng việc hạn chế dùng chức năng Thêm Cột (Col).
4. Phân chia rõ ràng (Tên trường bắt đầu bằng gạch dưới `_` là Metabox Ẩn ở UI, không gạch là Custom Field mặc định cho Admin).