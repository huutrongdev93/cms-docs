# Thẻ (Tag)

> **Model:** `packages/skilldo/cms/src/Models/Tag.php` — `SkillDo\Cms\Models\Tag` (alias `SkillDo\Model\Tag`)
> **Service:** `packages/skilldo/cms/src/Support/TagService.php` — `SkillDo\Cms\Support\TagService`
> **Field:** `packages/skilldo/cms/src/Form/Field/Tags.php` — kiểu field `tags`
> **Có từ:** phiên bản **8.1.3**

Thẻ là cách phân loại **phẳng, không phân cấp** cho nội dung — bổ sung cho [Taxonomy](./Taxonomy.md) (danh mục có cấp cha/con).

Điểm khác biệt quan trọng so với danh mục:

| | Danh mục (Taxonomy) | Thẻ (Tag) |
|---|---|---|
| Bảng dữ liệu | `categories` + `relationships` | `tags` + `tag_relationships` |
| Phân cấp | Có (nested set) | Không |
| Ghi vào bảng `routes` | Có (mỗi danh mục 1 route) | **Không** — dùng chung một route `/tag/{slug}` |
| Cách nhập liệu | Chọn từ cây danh mục | Gõ tự do, tự tạo mới nếu chưa có |

> **Vì sao tách bảng riêng?** Dùng chung `categories` sẽ làm phình bảng danh mục và buộc phải rebuild nested set trên toàn bảng mỗi lần lưu một thẻ.

---

## 1. Bật / tắt thẻ cho loại nội dung

Mặc định thẻ **chỉ bật cho bài viết** (`post`). Post type khác muốn dùng thẻ thì gọi `TagService::enable()` trong hook `init`:

```php
use SkillDo\Cms\Support\TagService;

add_action('init', function () {
    TagService::enable('services');   // bật thẻ cho post type "services"
});
```

```php
TagService::enable(string $tagType): void     // bật
TagService::disable(string $tagType): void    // tắt
TagService::enabled(string $tagType): bool    // kiểm tra
TagService::tagTypes(): array                 // danh sách post type đang bật
```

Khi một post type được bật thẻ, CMS tự động thêm menu con **Thẻ** vào menu quản trị của post type đó (yêu cầu quyền `manage_categories`).

Có thể can thiệp bằng filter:

```php
add_filter('tag_enabled_services', fn($enabled, $tagType) => $enabled, 10, 2);
```

---

## 2. Hai khái niệm cần phân biệt

| Tham số | Ý nghĩa | Cột lưu |
|---|---|---|
| `$tagType` | **Bộ từ vựng thẻ** — chính là post type (`post`, `services`…) | `tags.tag_type` |
| `$objectType` | **Loại đối tượng được gắn thẻ** — chính là bảng dữ liệu | `tag_relationships.object_type` |

Mọi post type đều nằm chung bảng `post`, nên `$objectType` của bài viết luôn là `'post'` dù `$tagType` là `post`, `services` hay `news`.

---

## 3. Cấu trúc bảng

**`tags`** — từ điển thẻ

| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | bigint | |
| `name` | varchar(255) | Tên thẻ |
| `slug` | varchar(255) | Tự sinh từ `name`, **duy nhất trong bảng `tags`**, trùng thì thêm hậu tố `-1`, `-2`… |
| `excerpt` | text | Mô tả (wysiwyg) |
| `image` | varchar(255) | Ảnh đại diện |
| `seo_title` / `seo_description` / `seo_keywords` | | Tự lấy từ `name` / `excerpt` khi thêm mới |
| `tag_type` | varchar(100) | Mặc định `post` |
| `count` | int | Số nội dung đang gắn thẻ này (tự cập nhật) |
| `order`, `public`, `user_created`, `user_updated`, `created`, `updated` | | Cột chuẩn của CMS |

**`tag_relationships`** — bảng nối

| Cột | Ghi chú |
|---|---|
| `tag_id` | |
| `object_id` | Id bài viết |
| `object_type` | Mặc định `post` |

Unique key `(tag_id, object_id, object_type)`.

> Bảng được tạo bởi migration `8.1.3-tags.php`. Xem [Phiên bản & Migration CSDL](../05-Database/05-Version-Migration.md).

---

## 4. Field nhập thẻ trong form admin

Kiểu field `tags` là ô select2 nhập tự do có gợi ý (gợi ý lấy động qua ajax `Admin\Ajax\TagAjax::search`).

```php
Form::add('tags', [
    'label'       => 'Thẻ',
    'placeholder' => 'Nhập thẻ, cách nhau bằng Enter',
    'tag_type'    => 'post',   // bộ từ vựng thẻ, mặc định "post"
]);
```

**Quan trọng:** giá trị field gửi lên server là **TÊN thẻ**, không phải id. Thẻ chưa tồn tại sẽ được tạo mới khi lưu. Field chấp nhận cả mảng id (khi nạp từ DB) lẫn mảng tên (khi submit lỗi validate) và tự quy về tên.

Số thẻ tối đa gắn cho một nội dung: **30** (`TagService::LIMIT`).

---

## 5. Lưu thẻ khi lưu nội dung

Bài viết core đã được nối sẵn trong `views/admin/bootstrap/config.php`:

```php
add_action('save_post_object', function ($id, $request) {

    $postType = $request->input('post_type') ?: 'post';

    if(!TagService::enabled($postType)) return;

    $names = $request->input('tags');

    TagService::savePost((int)$id, $postType, is_array($names) ? $names : []);

}, 10, 2);
```

Các API của service:

```php
// Lưu thẻ cho bài viết: tên -> id (tạo mới nếu chưa có) rồi đồng bộ bảng nối
TagService::savePost(int $postId, string $postType, array $names): void

// Chuyển danh sách TÊN thẻ thành danh sách ID (tạo mới thẻ chưa tồn tại)
TagService::resolveNames(array $names, string $tagType = 'post'): array

// Đồng bộ danh sách thẻ của một nội dung (thêm phần thiếu, xóa phần thừa)
TagService::sync(int $objectId, string $objectType, array $tagIds): void

// Gỡ toàn bộ thẻ khỏi một/nhiều nội dung (dùng khi xóa bài viết)
TagService::detachObject(array|int $objectIds, string $objectType): void

// Cập nhật lại cột count của các thẻ
TagService::refreshCount(array $tagIds): void
```

> `TagService` là **nơi duy nhất** được thao tác với bảng `tag_relationships`. Form admin, controller, theme đều phải đi qua service này.
>
> Khi xóa bài viết, `Post` tự gọi `TagService::detachObject($listIdRemove, 'post')` — không cần xử lý thêm.

---

## 6. Đọc thẻ ở giao diện

```php
use SkillDo\Cms\Support\TagService;

// Collection các thẻ của bài viết
$tags = TagService::getsByObject((int)$object->id);          // $objectType mặc định 'post'

// Chỉ lấy mảng TÊN thẻ (dùng cho field nhập thẻ)
$names = TagService::namesByObject((int)$object->id);
```

Trong theme, luôn kiểm tra post type đã bật thẻ chưa trước khi render:

```php
if(!TagService::enabled($object->post_type ?? 'post')) return;

$tags = TagService::getsByObject((int)$object->id);

foreach ($tags as $tag) {
    echo '<a href="'.Url::tag($tag->slug).'">'.$tag->name.'</a>';
}
```

### Scope trên model `Tag`

```php
use SkillDo\Cms\Models\Tag;

// Thẻ đang gắn với một đối tượng
Tag::query()->getsByObject(int $objectId, string $objectType = 'post'): Collection

// Danh sách [id => name] dùng cho select
Tag::query()->options(): Collection
```

### Scope trên model `Post`

```php
use SkillDo\Cms\Models\Post;

// Lọc bài viết theo thẻ (nhận id hoặc object thẻ)
Post::where('public', 1)->whereByTag($tag)->get();

// Bài viết liên quan: cùng ít nhất một thẻ với bài đang xem
Post::query()->relatedByTag($postIdOrObject);   // trả về Collection
```

---

## 7. Đường dẫn trang lưu trữ theo thẻ

Thẻ **không ghi vào bảng `routes`** — toàn bộ dùng chung một route khai trong `routes/web.php`:

```php
Route::get(trim(config('cms.tag.prefix', 'tag'), '/').'/{slug}', 'TagController@index')->name('tag');
```

Tiền tố đổi được qua config `cms.tag.prefix` (mặc định `tag`).

Dựng URL bằng helper:

```php
Url::tag(string $slug): string
```

```php
Url::tag('huong-dan');   // "/tag/huong-dan"
```

> `Url::tag()` trả về **đường dẫn tuyệt đối theo gốc site** (có `/` ở đầu) và tự kèm tiền tố ngôn ngữ khi chạy đa ngữ (`/vi/tag/huong-dan`). Trước 8.1.4 hàm này trả về đường dẫn tương đối nên ở trang có URL nhiều đoạn trình duyệt resolve sai thành 404.

Trang lưu trữ theo thẻ dùng chung template với trang danh mục bài viết (`post_index`), nên mọi giao diện đều hiển thị được mà không cần thêm view riêng.

---

## 8. Cache

Trang lưu trữ thẻ được cache **30 ngày** theo khóa `tag_{md5(slug)}_{lang}`. Model tự xóa cache khi lưu/xóa thẻ, bao gồm cả slug cũ khi đổi tên.

```php
Tag::clearCache(string $slug): void
```

---

## 9. Hook mở rộng

| Hook | Loại | Mô tả |
|---|---|---|
| `tag_enabled_{tagType}` | filter | Bật/tắt thẻ cho một post type. Tham số: `$enabled`, `$tagType` |
| `gets_tags_by_object` | filter | Can thiệp danh sách thẻ trả về của một đối tượng. Tham số: `$tags`, `$query` |
| `tag_synced` | action | Sau khi đồng bộ thẻ của một nội dung. Tham số: `$objectId`, `$objectType`, `$tagIds` |
| `columns_db_tag` | filter | Bổ sung cột cho model `Tag` |
| `tag_controllers_index_tag` | filter | Đối tượng thẻ của trang lưu trữ |
| `tag_controllers_index_args` | filter | Query bài viết của trang lưu trữ. Tham số: `$query`, `$tag` |
| `tag_controllers_index_count` | filter | Tổng số bài viết dùng để phân trang |
| `tag_controllers_index_paging` | filter | Đối tượng phân trang |
| `tag_controllers_index_params` | filter | Query sau khi áp limit/offset/order |
| `tag_controllers_index_objects` | filter | Danh sách bài viết trả về |
| `admin_tag_controllers_edit_args` | filter | Query lấy thẻ ở trang sửa trong admin |
