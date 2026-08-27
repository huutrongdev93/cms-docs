# Đường Dẫn Riêng Cho Từng Ngôn Ngữ

Từ **8.2.0**, mỗi ngôn ngữ có thể mang một đường dẫn (slug) riêng:

```
/gioi-thieu        →  trang Giới thiệu, tiếng Việt
/en/about-us       →  cùng trang đó, tiếng Anh
```

Trước 8.2.0 một đối tượng chỉ có **một** slug dùng chung, nên bản tiếng Anh buộc phải nằm ở
`/en/gioi-thieu`.

Tính năng này **tắt sẵn** trên site nâng cấp: cập nhật lên 8.2.0 không đổi một đường dẫn nào.
Bật ở **Cấu hình hệ thống → Đường dẫn** (tab chỉ hiện khi site có từ hai ngôn ngữ trở lên).

---

## 1. Dữ liệu nằm ở đâu

| Bảng | Cột | Vai trò |
|---|---|---|
| `routes` | `language` | Nguồn sự thật để phân giải URL. `NULL` = slug dùng chung mọi ngôn ngữ (toàn bộ dữ liệu trước 8.2.0); `'en'` = slug chỉ dành cho tiếng Anh |
| `language` | `slug` | Bản sao để dựng link. `joinLanguage()` trả cột này ra thành `slug` cho theme |
| `system` | option `language_slug_per_language` | Công tắc tính năng |

Một đối tượng có thể có đồng thời dòng `NULL` (dữ liệu cũ) và dòng theo ngôn ngữ. Lần lưu đầu
tiên sau khi bật cờ, dòng `NULL` được **đổi** thành ngôn ngữ mặc định — giữ nguyên id và slug
nên URL cũ không đổi.

---

## 2. Bốn quy tắc phân giải

`SkillDo\Cms\Routing\SlugResolver` nhận slug **S** và ngôn ngữ đang xem **L**:

| # | Tình huống | Kết quả |
|---|---|---|
| 1 | Có dòng `language = L` | Phục vụ |
| 2a | Có dòng `NULL`, và đối tượng đó **đã có** dòng L với slug khác | **301** sang slug của L |
| 2b | Có dòng `NULL`, chưa có bản dịch | Phục vụ — URL cũ sống mãi |
| 3a | Chỉ có dòng của ngôn ngữ khác, nhưng đối tượng **đã có** dòng L | **301** sang slug của L |
| 3b | Chỉ có dòng của ngôn ngữ khác, chưa dịch | Theo `config('language.slug.foreign')`: `render` (mặc định) hoặc `404` |
| 4 | Không có dòng nào | 404 |

Quy tắc 2a/3a là thứ giữ SEO: URL cũ không bao giờ chết, chỉ chuyển hướng khi đã thật sự có
URL mới để trỏ tới.

:::tip
Bộ phân giải **không** hỏi công tắc. Dòng theo ngôn ngữ đã nằm trong DB thì luôn được phục vụ,
kể cả khi cờ đã tắt lại — tắt chỉ ngừng **tạo thêm**.
:::

---

## 3. Nhập đường dẫn trong quản trị

Cờ tắt: một ô "Đường dẫn" trong nhóm SEO, y như trước.

Cờ bật: mỗi tab ngôn ngữ có ô "Đường dẫn" riêng, field tên `{locale}[slug]`. Bỏ trống ô nào thì
ngôn ngữ đó **không có** slug riêng và URL của nó dùng slug mặc định. Bỏ trống ô slug nhưng có
tiêu đề thì hệ thống **tự sinh** slug từ tiêu đề của chính ngôn ngữ đó.

Module tự viết không được tự khai `->text('slug', ...)` nữa mà gọi:

```php
// Đặt ô slug vào đúng chỗ theo cấu hình hiện tại
$form->slugField();

$form->right()
    ->addGroup('seo', trans('form.group.seo'))
    ->text('seo_title', ['label' => 'Meta title']);
```

Gọi `slugField()` **trước** chuỗi `seo_title` để khi tính năng tắt, ô slug vẫn đứng đầu nhóm SEO
đúng như bố cục cũ. Nhóm SEO nằm trong một `FormAdminLocation` riêng thì truyền vào:

```php
$form->slugField(['label' => 'Slug'], ['location' => $formSeo, 'groupName' => trans('form.group.seo')]);
```

`slugField()` tự bỏ qua việc tách ô nếu model **không** dùng cả `ModelRoute` lẫn `ModelLanguage`
— thiếu một trong hai thì slug người dùng gõ vào sẽ bị nuốt mất.

---

## 4. Dựng URL

Chỉ có **một câu hỏi** cần trả lời trước khi chọn hàm:

> Link này dành cho ngôn ngữ **đang xem**, hay cho một ngôn ngữ **khác**?

| Bạn đang làm gì | Dùng |
|---|---|
| Link bài viết / sản phẩm / danh mục ngay trong trang | `Url::permalink($object->slug)` — **giữ nguyên như cũ** |
| Bộ chuyển ngôn ngữ | `Url::language($lang)` |
| Thẻ `hreflang`, sitemap, canonical đa ngữ | `Url::localized($object)` |
| Cần slug thô theo từng ngôn ngữ để tự ghép URL | `Url::localizedSlugs($object)` |

### 4.1 `Url::permalink()` vẫn đúng — và không phải sửa gì

Đây là điều quan trọng nhất của cả trang tài liệu này: **hơn 120 chỗ trong theme và plugin đang
gọi `Url::permalink($object->slug)` đều tiếp tục chạy đúng, không cần đụng tới.**

```php
// đang xem tiếng Việt
Url::permalink($page->slug);   // vi/gioi-thieu

// đang xem tiếng Anh — CÙNG dòng code đó
Url::permalink($page->slug);   // en/about-us
```

Hai mắt xích làm việc đó:

1. `joinLanguage()` khiến `$object->slug` **đã là slug của ngôn ngữ đang xem** (xem mục 1).
2. Filter `get_url` (plugin đa ngôn ngữ) thêm tiền tố ngôn ngữ, y như trước 8.2.0.

### 4.2 Nhưng `permalink()` KHÔNG dựng được URL cho ngôn ngữ khác

`permalink()` luôn dùng `Language::current()`. Đưa nó vào vòng lặp qua các ngôn ngữ là sai:

```php
// ❌ SAI — đang ở trang tiếng Việt
foreach (Language::listKey() as $lang) {
    $url = Url::permalink($page->slug);   // vi/gioi-thieu  cho MỌI ngôn ngữ
}
```

Bộ chuyển ngôn ngữ viết như trên sẽ trỏ mọi ngôn ngữ về **cùng một trang**.

Tự ghép tiền tố cũng không đúng, vì slug của ngôn ngữ kia có thể khác:

```php
// ⚠️ KHÔNG 404, nhưng sai URL chuẩn
$url = Url::base($lang . '/' . $page->slug);   // en/gioi-thieu → bị 301 sang en/about-us
```

URL đó vẫn tới đúng trang (nhờ quy tắc 2a/3a ở mục 2), nhưng nó **không phải URL chuẩn**. Ba
chỗ dưới đây vì thế bị sai thật sự:

- **`hreflang`** — khai báo `/en/gioi-thieu` trong khi URL chuẩn là `/en/about-us`, đúng thứ
  hreflang sinh ra để tránh.
- **sitemap** — nộp cho Google một URL bị chuyển hướng thay vì URL chuẩn.
- **bộ chuyển ngôn ngữ** — người dùng ăn thêm một lần chuyển hướng mỗi lần đổi ngôn ngữ.

### 4.3 Cách đúng

```php
Url::localizedSlugs($page);
// ['vi' => 'gioi-thieu', 'en' => 'about-us']        — slug thô, chưa có tiền tố

Url::localized($page);
// ['vi' => 'http://site/vi/gioi-thieu',
//  'en' => 'http://site/en/about-us']               — URL tuyệt đối, đã đủ tiền tố
```

Cả hai đều **tự lùi về slug dùng chung** cho ngôn ngữ chưa dịch, nên luôn trả về URL dùng được.

Bộ chuyển ngôn ngữ dùng `Url::language($lang)` — nó tra theo đối tượng đang hiển thị
(`Cms::getData('object')` / `'category'`, hoặc filter `url_language_object`), và chỉ những trang
không gắn với đối tượng nào (trang chủ, tìm kiếm, tài khoản) mới lùi về cách đổi tiền tố cũ.

Menu không phải làm gì: `ThemeMenu::setSlugLanguage()` tự đổi slug cho item trỏ tới đối tượng;
liên kết tự nhập (`type = link`, `#neo`, `tel:`, `mailto:`) giữ nguyên.

:::tip Tóm lại
`localized()` / `localizedSlugs()` **không thay thế** `permalink()`. Chúng chỉ giải quyết đúng
một việc mà `permalink()` về bản chất không làm được: dựng URL cho **một ngôn ngữ khác ngôn ngữ
đang xem**. Trong toàn bộ mã nguồn chỉ có ba chỗ cần chúng — switcher, hreflang, sitemap.
:::

---

## 5. Slug URL và slug ĐỊNH DANH — đừng nhầm

Theme chọn file template theo slug: `page-{slug}.blade.php`, `post-{slug}`,
`template-post-{slug}`, `products-{slug}`. Slug ở đó là **định danh**, không phải URL.

Nếu tra theo `$object->slug` (đã dịch), trang tiếng Anh sẽ tìm `page-about-us.blade.php` và
lặng lẽ rơi về template mặc định trong khi trang tiếng Việt vẫn đúng — một lỗi rất khó truy ra.

`joinLanguage()` vì thế kèm thêm cột **`slug_default`** — slug của bảng gốc, không đổi theo
ngôn ngữ. Luôn dùng nó để tra template:

```php
$slug = $object->slug_default ?? $object->slug;
```

Quy ước cho theme: **tên file template luôn đặt theo slug ngôn ngữ mặc định.**

---

## 6. Sinh đường dẫn cho nội dung đã dịch từ trước

Bật cờ chỉ có tác dụng từ **lần lưu sau**. Nội dung đã dịch từ trước vẫn dùng chung slug cho tới
khi được mở ra lưu lại.

**Cấu hình hệ thống → Đường dẫn → Sinh đường dẫn** quét bảng `language`, tìm bản dịch có tiêu đề
nhưng chưa có dòng `routes`, rồi sinh slug bằng đúng luồng ghi thật.

- **Xem trước** liệt kê đầy đủ những gì sẽ tạo mà không ghi gì.
- Chạy lại vô hại: chỉ đụng vào ngôn ngữ chưa có dòng route.
- Việc này **đổi URL công khai** của các trang ngôn ngữ phụ (URL cũ được 301 sang URL mới).

Plugin khai loại đối tượng của mình để công cụ quét tới:

```php
add_filter('slug_backfill_modules', function (array $modules) {

    $modules['products'] = \Ecommerce\Models\Product::class;

    return $modules;
});
```

Chỉ khai model dùng **cả** `ModelRoute` lẫn `ModelLanguage`.

---

## 7. Xoá một ngôn ngữ

Xoá ngôn ngữ khỏi site **không** xoá dòng `routes` của nó. URL kiểu `/fr/about-us` đã được
Google index sẽ được **301** về đường dẫn đúng thay vì chết hẳn. URL hai đoạn bất kỳ
(`/linh-tinh/abc`) vẫn 404 như trước — hệ thống phân biệt hai loại bằng cách kiểm tra bảng
`routes` có dòng nào mang ngôn ngữ đó không.

---

## 8. Cache

| Khoá | Nội dung | Ai dọn |
|---|---|---|
| `routes-{slug}` | Mọi dòng của một slug | Luồng ghi route, và 7 chỗ gọi sẵn trong core/plugin |
| `routes-object-{type}-{id}` | Mọi dòng của một đối tượng | Luồng ghi route |
| `routes-languages` | Tập ngôn ngữ có mặt trong bảng | Luồng ghi route |
| `menu_items_{id}_{lang}` | Menu đã dựng link | Luồng ghi route (menu lấy link từ `routes`) |

:::warning
Mọi lối ghi mới vào bảng `routes` phải dọn **cả bốn**. Dùng `Router::forgetCache()` hoặc
`RouteRepository::forgetSlug()` + `forgetObject()`; thiếu một khoá là URL cũ được phục vụ tiếp
suốt 30 ngày mà không có dấu hiệu gì.
:::

---

## 9. Kiểm thử

| Lệnh | Phạm vi |
|---|---|
| `composer slug` | 4 quy tắc phân giải, dùng repository trong bộ nhớ (không chạm DB) |
| `composer slug:write` | Luồng ghi: tạo/sửa/xoá thật rồi rollback. **Không** nằm trong `composer test` |
