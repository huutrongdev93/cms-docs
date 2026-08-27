# Url

> **File:** `packages/skilldo/cms/src/Support/Url.php`  
> **Namespace:** `SkillDo\Cms\Support\Url`  
> **Alias ngắn:** `\Url`

Class `Url` cung cấp các helper tĩnh để tạo và xử lý URL trong SkillDo CMS v8.

|                             |                                       |                               |
|-----------------------------|:-------------------------------------:|------------------------------:|
| [Url::is](#urlis)           |       [Url::admin](#urladmin)         | [Url::account](#urlaccount)   |
| [Url::base](#urlbase)       |   [Url::permalink](#urlpermalink)     | [Url::register](#urlregister) |
| [Url::current](#urlcurrent) |       [Url::route](#urlroute)         | [Url::login](#urllogin)       |
| [Url::theme](#urltheme)     | [Url::getYoutubeID](#urlgetyoutubeid) | [Url::logout](#urllogout)     |
| [Url::slug](#urlslug)       |   [Url::isYoutube](#urlisyoutube)     | [Url::forgot](#urlforgot)     |
| [Url::fileManager](#urlfilemanager) | [Url::language](#urllanguage) | [Url::download](#urldownload) |
| [Url::path](#urlpath)       |       [Url::asset](#urlasset)         | [Url::tag](#urltag)           |
| [Url::pathHash](#urlpathhash) |     [Url::search](#urlsearch)       | [Url::localized](#urllocalized) |
|                             |                                       | [Url::localizedSlugs](#urllocalizedslugs) |


### `Url::is()`
Hàm `Url::is` kiểm tra chuỗi có phải là một URL hợp lệ không.

```php
Url::is('https://skilldo.vn')
// true

Url::is('T is men')
// false
```

### `Url::base()`
Hàm `Url::base` trả về domain gốc của website. Nhận thêm một chuỗi path để nối vào sau domain.

```php
Url::base()
// https://domain.com/

Url::base('skd-slug')
// https://domain.com/skd-slug
```

### `Url::current()`
Hàm `Url::current` trả về URL đầy đủ của trang hiện tại (bao gồm query string).

```php
Url::current()
// https://domain.com/san-pham?page=2

// Lấy URL dạng base64 (dùng để truyền redirect)
Url::current(true)
// aHR0cHM6Ly9kb21haW4uY29tL3Nhbi1waGFtP3BhZ2U9Mg==
```

### `Url::route()`
Hàm `Url::route` trả về URL của một named route (gọi qua helper `route()` toàn cục).

```php
Url::route('account.order')
// account/order
```

### `Url::admin()`
Hàm `Url::admin` trả về URL khu vực admin của website.

```php
Url::admin()
// https://domain.com/admin/

Url::admin('users')
// https://domain.com/admin/users
```

### `Url::theme()`
Hàm `Url::theme` trả về URL trỏ vào thư mục của theme đang được kích hoạt.

```php
Url::theme()
// https://domain.com/views/theme-name/

Url::theme('assets/images/logo.png')
// https://domain.com/views/theme-name/assets/images/logo.png
```

### `Url::permalink()`
Hàm `Url::permalink` trả về URL sau khi áp dụng bộ lọc đa ngôn ngữ. Dùng trong các trường hợp trang hỗ trợ đa ngôn ngữ.

```php
Url::permalink('san-pham-a')
// Ngôn ngữ mặc định: https://domain.com/san-pham-a
// Ngôn ngữ en:       https://domain.com/en/san-pham-a
```

**Đây là hàm dùng cho hầu hết mọi trường hợp** — link bài viết, sản phẩm, danh mục ngay trong
trang. Từ 8.2.0 mỗi ngôn ngữ có thể có slug riêng, nhưng cách viết **không đổi**: cột `slug` của
đối tượng đã được thay theo ngôn ngữ đang xem, nên cùng một dòng code cho ra URL đúng:

```php
// đang xem tiếng Việt
Url::permalink($post->slug);   // https://domain.com/vi/gioi-thieu

// đang xem tiếng Anh — CÙNG dòng code đó
Url::permalink($post->slug);   // https://domain.com/en/about-us
```

:::warning Không dùng được để dựng URL cho ngôn ngữ KHÁC
`permalink()` luôn dựng theo `Language::current()`. Đưa nó vào vòng lặp qua các ngôn ngữ sẽ ra
**cùng một URL** cho tất cả:

```php
// ❌ Bộ chuyển ngôn ngữ viết thế này sẽ trỏ mọi ngôn ngữ về cùng một trang
foreach (Language::listKey() as $lang) {
    $url = Url::permalink($post->slug);
}
```

Cần URL của ngôn ngữ khác thì dùng [`Url::language()`](#urllanguage),
[`Url::localized()`](#urllocalized) hoặc [`Url::localizedSlugs()`](#urllocalizedslugs).
:::

### `Url::path()`
Hàm `Url::path` trả về đường dẫn tính từ **gốc site, KHÔNG kèm tên miền**.

Dùng cho nội dung được cache ra file (CSS bundle): không nhúng tên miền nên file vẫn đúng khi đổi domain hoặc chuyển `http` ↔ `https`.

```php
Url::path('uploads/source/a.jpg')
// /uploads/source/a.jpg

// Khi CMS cài trong thư mục con
// /thu-muc-con/uploads/source/a.jpg
```

### `Url::pathHash()`
Hàm `Url::pathHash` trả về **dấu vân tay 8 ký tự** của base path, dùng nhúng vào tên file cache (CSS/JS bundle).

File bundle có chứa đường dẫn tính từ gốc site, nên bundle dựng ở `https://sandbox.com/projectname` không dùng lại được ở `https://product.com`. Vân tay này khiến bundle cũ tự bị bỏ qua thay vì dùng nhầm.

```php
Url::pathHash()
// "3f2a9c1b"
```

### `Url::asset()`
Hàm `Url::asset` trả về **URL tuyệt đối** cho tài nguyên (ảnh, css…). Nếu đầu vào đã là URL tuyệt đối, protocol-relative (`//…`) hoặc data URI thì giữ nguyên; ngược lại nối tên miền + base path.

Dùng cho CSS nền của element, vì CSS có thể được nạp từ file bundle nằm trong thư mục con khiến URL tương đối bị trình duyệt resolve sai.

```php
Url::asset('uploads/source/bg.jpg')
// https://domain.com/uploads/source/bg.jpg

Url::asset('https://cdn.com/bg.jpg')
// https://cdn.com/bg.jpg  (giữ nguyên)

Url::asset('data:image/png;base64,...')
// giữ nguyên
```

### `Url::tag()`
Hàm `Url::tag` trả về URL trang lưu trữ theo [thẻ](../06-Cms/Tags.md). Tiền tố đổi được qua config `cms.tag.prefix` (mặc định `tag`).

```php
Url::tag('huong-dan')
// /tag/huong-dan
// Đa ngữ: /en/tag/huong-dan
```

> Trả về **đường dẫn tuyệt đối theo gốc site** (có `/` ở đầu) và tự kèm tiền tố ngôn ngữ. Trước 8.1.4 hàm này trả về đường dẫn tương đối nên ở trang có URL nhiều đoạn trình duyệt resolve sai thành 404.

### `Url::search()`
Hàm `Url::search` trả về URL trang kết quả tìm kiếm. Tiền tố đổi được qua config `cms.search.prefix` (mặc định `search`). Tham số rỗng sẽ bị bỏ khỏi query string.

```php
Url::search()
// /search

Url::search('áo thun')
// /search?keyword=%C3%A1o+thun

Url::search('áo thun', 'product')
// /search?keyword=%C3%A1o+thun&type=product
```

> Cùng quy ước với `Url::tag()`: đường dẫn tuyệt đối theo gốc site + tự kèm tiền tố ngôn ngữ, để form tìm kiếm đặt ở header luôn trỏ đúng dù đang đứng ở trang có URL sâu bao nhiêu đoạn.

### `Url::fileManager()`
Hàm `Url::fileManager` trả về URL của trình quản lý file (Responsive File Manager) dùng trong admin. Nhận thêm chuỗi query params; tự động thêm `callback=responsive_filemanager_callback` nếu chưa có.

```php
Url::fileManager()
// https://domain.com/vendor/rpsfmng/dialog.php?editor=mce_0

Url::fileManager('type=1&field_id=image')
// ...dialog.php?editor=mce_0&callback=responsive_filemanager_callback&type=1&field_id=image
```

> **Lưu ý:** Để lấy segment URL hiện tại, dùng `request()->segments()` hoặc `request()->segment($n)` thay vì `Url::` (class `Url` không có method `segment`).

### `Url::getYoutubeID()`
Hàm `Url::getYoutubeID` trích xuất ID video từ URL YouTube.

```php
Url::getYoutubeID('https://www.youtube.com/watch?v=Lq5GO4M1-Gk')
// Lq5GO4M1-Gk
```

### `Url::isYoutube()`
Hàm `Url::isYoutube` kiểm tra URL có phải là URL video YouTube không.

```php
Url::isYoutube('https://www.youtube.com/watch?v=abc123')
// true

Url::isYoutube('https://domain.com/video')
// false
```

### `Url::account()`
Hàm `Url::account` trả về URL trang thông tin tài khoản (Frontend).

```php
Url::account()
// https://domain.com/account
```

> **Lưu ý:** `Url::account()` không nhận tham số path. Cần URL con (ví dụ `account/order`), dùng `Url::base('account/order')`.

### `Url::register()`
Hàm `Url::register` trả về URL trang đăng ký tài khoản (Frontend).

```php
Url::register()
// https://domain.com/register
```

### `Url::login()`
Hàm `Url::login` trả về URL trang đăng nhập tài khoản (Frontend).

```php
Url::login()
// https://domain.com/login
```

### `Url::forgot()`
Hàm `Url::forgot` trả về URL trang quên mật khẩu (Frontend).

```php
Url::forgot()
// https://domain.com/forgot
```

### `Url::logout()`
Hàm `Url::logout` trả về URL để đăng xuất tài khoản (Frontend).

```php
Url::logout()
// https://domain.com/logout
```

### `Url::slug()`
Hàm `Url::slug` trả về slug của trang hiện tại từ URL, tự động bỏ qua prefix ngôn ngữ nếu có.

```php
// URL: https://domain.com/en/san-pham-a
Url::slug()
// san-pham-a
```

### `Url::language()`
Hàm `Url::language` trả về URL của **chính trang hiện tại** nhưng ở một ngôn ngữ khác. Đây là hàm
dành cho bộ chuyển ngôn ngữ.

```php
// Đang ở: https://domain.com/san-pham-a
Url::language('en')
// https://domain.com/en/san-pham-a
```

Từ **8.2.0**, khi mỗi ngôn ngữ có slug riêng, hàm này tra theo **đối tượng đang hiển thị** chứ
không đổi tiền tố trên URL hiện tại nữa:

```php
// Đang ở: https://domain.com/vi/gioi-thieu
Url::language('en')
// https://domain.com/en/about-us      (slug tiếng Anh của chính trang đó)
```

Đối tượng được lấy từ `Cms::getData('object')` rồi `Cms::getData('category')`; plugin có thể chỉ
định qua filter `url_language_object`. Trang không gắn với đối tượng nào (trang chủ, tìm kiếm,
tài khoản) vẫn dùng cách đổi tiền tố như cũ.

### `Url::localized()`
Hàm `Url::localized` trả về URL tuyệt đối của **một đối tượng** ở **tất cả** các ngôn ngữ. Dùng cho
thẻ `hreflang`, sitemap và canonical đa ngữ — những nơi cần liệt kê mọi ngôn ngữ cùng lúc.

```php
Url::localized($post)
// [
//   'vi' => 'https://domain.com/vi/gioi-thieu',
//   'en' => 'https://domain.com/en/about-us',
// ]
```

Ngôn ngữ chưa dịch slug sẽ **tự lùi về slug dùng chung**, nên kết quả luôn là URL dùng được.
Trả về mảng rỗng nếu tham số không phải đối tượng có route (`page`, `post`, `products`…).

### `Url::localizedSlugs()`
Giống `Url::localized()` nhưng trả về **slug thô, chưa kèm tiền tố ngôn ngữ**. Dùng khi bạn cần tự
ghép URL theo quy ước riêng.

```php
Url::localizedSlugs($post)
// ['vi' => 'gioi-thieu', 'en' => 'about-us']
```

:::tip Chọn hàm nào
| Bạn đang làm gì | Dùng |
|---|---|
| Link ngay trong trang | [`Url::permalink()`](#urlpermalink) |
| Bộ chuyển ngôn ngữ | `Url::language()` |
| hreflang / sitemap / canonical | `Url::localized()` |
| Tự ghép URL từ slug | `Url::localizedSlugs()` |

Chi tiết cơ chế: [Đường dẫn riêng cho từng ngôn ngữ](../12-i18n%20Localization/05-Slug-Per-Language.md).
:::

### `Url::download()`
Hàm `Url::download` tải một file từ URL về server (HTTP client, timeout 120 giây, ghi trực tiếp xuống file) và lưu vào đường dẫn chỉ định. Trả về `true` nếu thành công, `false` nếu response không thành công; ném lại `Exception` nếu có lỗi kết nối.

```php
$success = Url::download(
    'https://example.com/file.zip',
    Path::storage('downloads/file.zip')
);
```