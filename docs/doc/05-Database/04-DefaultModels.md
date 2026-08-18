# Model Mặc Định

Đây là toàn bộ các Model được cung cấp sẵn bởi SkillDo CMS và Framework. Bạn có thể sử dụng trực tiếp các Model này trong Plugin hoặc Theme mà không cần khai báo lại.

Các Model đều nằm trong hai package chính:
- **CMS:** `packages/skilldo/cms/src/Models/` 
- **Namespace** `SkillDo\Cms\Models`
- **Framework (API):** `packages/skilldo/framework/src/Api/Models/`
- **Namespace** `SkillDo\Api\Models`

**Về alias:** `CmsServiceProvider::aliases()` đăng ký các Model CMS dưới namespace alias **`SkillDo\Model\*`** (vd: `SkillDo\Model\Post`, `SkillDo\Model\User`...). Chỉ riêng **`\Gallery`** và **`\GalleryItem`** có alias gốc (root alias) trỏ thẳng vào Model. Lưu ý hai alias gốc dễ nhầm:
- `\Language` → `SkillDo\Cms\Support\Language` (class hỗ trợ đa ngôn ngữ, **không phải** Model `SkillDo\Cms\Models\Language`)
- `\ThemeMenu` → `SkillDo\Cms\Menu\ThemeMenu` (class quản lý menu, **không phải** Model `SkillDo\Cms\Models\ThemeMenu`)

---

## 1. CMS Models

### `Post` — Bài Viết

| Thuộc tính        | Giá trị                                      |
|-------------------|----------------------------------------------|
| **File**          | `cms/src/Models/Post.php`                    |
| **Namespace**     | `SkillDo\Cms\Models\Post`                    |
| **Bảng DB**       | `{prefix}post`                               |
| **Alias**         | `SkillDo\Model\Post`                         |
| **Traits**        | `SoftDeletes`, `ModelRoute`, `ModelLanguage` |
| **Route type**    | `post`                                       |
| **Language type** | `post`                                       |

**Mô tả:** Model quản lý bài viết (blog, tin tức, portfolio...). Hỗ trợ đa ngôn ngữ, URL slug, Soft Delete và phân loại theo `post_type`.

**Ví dụ sử dụng:**
```php
use SkillDo\Cms\Models\Post;

// Lấy 10 bài viết mới nhất dạng 'post' đang public
$posts = Post::where('post_type', 'post')
    ->orderBy('created', 'desc')
    ->limit(10)
    ->get();

// Lấy bài viết theo ID
$post = Post::find(5);
echo $post->title;
echo $post->content;

// Tạo bài viết mới
$id = Post::create([
    'title'     => 'Tiêu đề bài viết',
    'content'   => '<p>Nội dung...</p>',
    'post_type' => 'post',
    'public'    => 1,
]);
```

---

### `PostCategory` — Danh Mục Bài Viết

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/PostCategory.php` |
| **Namespace** | `SkillDo\Cms\Models\PostCategory` |
| **Bảng DB** | `{prefix}categories` |
| **Alias** | `SkillDo\Model\PostCategory` |
| **Traits** | `ModelRoute`, `ModelLanguage` |
| **Route type** | `post_categories` |
| **Language type** | `post_categories` |

**Mô tả:** Model quản lý danh mục bài viết. Hỗ trợ cấu trúc cây phân cấp (NestedSet), đa ngôn ngữ, URL slug. Field `cate_type` để phân biệt loại danh mục (mặc định `post_categories`).

**Ví dụ sử dụng:**
```php
use SkillDo\Cms\Models\PostCategory;

// Lấy toàn bộ danh mục dạng cây phẳng (flat tree, duyệt cha → con) — trả về array
$categories = PostCategory::tree();

// Lấy dạng phân cấp lồng nhau (mỗi item có ->child) — trả về Collection
$categories = PostCategory::multilevel();

// Lấy danh mục dạng options cho select box (id => name) — trả về Collection
$options = PostCategory::options();

// Lấy danh mục theo cate_type riêng (dùng cho portfolio, project...)
$categories = PostCategory::where('cate_type', 'portfolio_categories')->tree();

// Lấy danh mục của một bài viết cụ thể — trả về Collection
$categories = PostCategory::getsByPost(5);
```

> **Lưu ý:** `tree()`, `multilevel()`, `options()`, `getsByPost()` là các scope **thực thi query ngay và trả về kết quả** (array/Collection) — không chain `->get()` phía sau. Các điều kiện `where(...)` phải đặt **trước** khi gọi scope.

---

### `Tag` — Thẻ

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/Tag.php` |
| **Namespace** | `SkillDo\Cms\Models\Tag` |
| **Bảng DB** | `{prefix}tags` + bảng nối `{prefix}tag_relationships` |
| **Alias** | `SkillDo\Model\Tag` |
| **Traits** | `ModelLanguage` |
| **Language type** | `tags` |
| **Có từ** | phiên bản **8.1.3** |

**Mô tả:** Phân loại **phẳng, không phân cấp** cho nội dung. Khác với `PostCategory`, thẻ dùng bảng riêng và **không ghi vào bảng `routes`** — toàn bộ trang lưu trữ dùng chung một route `/tag/{slug}`, nên `slug` chỉ cần duy nhất trong phạm vi bảng `tags`.

**Ví dụ sử dụng:**
```php
use SkillDo\Cms\Models\Tag;
use SkillDo\Cms\Support\TagService;

// Thẻ của một bài viết
$tags = TagService::getsByObject($postId);

// Danh sách [id => name] cho select
$options = Tag::query()->options();

// Lọc bài viết theo thẻ
$posts = Post::where('public', 1)->whereByTag($tag)->get();
```

> Chi tiết đầy đủ (bật thẻ cho post type khác, field nhập thẻ, hook mở rộng): xem [Thẻ (Tag)](../06-Cms/Tags.md).

---

### `Page` — Trang Nội Dung

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/Page.php` |
| **Namespace** | `SkillDo\Cms\Models\Page` |
| **Bảng DB** | `{prefix}page` |
| **Alias** | `SkillDo\Model\Page` |
| **Traits** | `SoftDeletes`, `ModelRoute`, `ModelLanguage` |
| **Route type** | `page` |
| **Language type** | `page` |

**Mô tả:** Model quản lý trang nội dung tĩnh (About, Contact, Privacy...). Tương tự `Post` nhưng không có `post_type`, dành riêng cho các trang đơn.

**Ví dụ sử dụng:**
```php
use SkillDo\Cms\Models\Page;

$page = Page::where('slug', 'gioi-thieu')->first();
echo $page->title;
echo $page->content;
```

---

### `User` — Người Dùng

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/User.php` |
| **Namespace** | `SkillDo\Cms\Models\User` |
| **Bảng DB** | `{prefix}users` |
| **Alias** | `SkillDo\Model\User` |
| **Traits** | `SoftDeletes` |

**Mô tả:** Model quản lý tài khoản người dùng. Tích hợp sẵn validation username/email, hash mật khẩu Argon2id (fallback Bcrypt nếu PHP không hỗ trợ, tự migrate hash MD5 cũ khi đăng nhập), cập nhật Role tự động khi `saved`. Dùng Eloquent Builder riêng: `SkillDo\Database\Eloquent\UserBuilder`.

**Các cột chính:** `username`, `password`, `salt`, `firstname`, `lastname`, `email`, `phone`, `status`, `activation_key`, `role`

**Ví dụ sử dụng:**
```php
use SkillDo\Cms\Models\User;

// Tìm user theo email
$user = User::where('email', 'test@example.com')->first();

// Tạo user mới (password tự động hash)
$userId = User::create([
    'username'  => 'john_doe',
    'password'  => 'mypassword123',  // Sẽ được hash tự động trong saving event
    'firstname' => 'John',
    'lastname'  => 'Doe',
    'email'     => 'john@example.com',
    'role'      => 'subscriber',
]);

// Đổi mật khẩu
$user = User::find(5);
$user->changePassword('newPassword123');

// Lấy danh sách bài viết của user
$posts = $user->posts()->get();
```

---

### `Gallery` — Nhóm Album Ảnh

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/Gallery.php` |
| **Namespace** | `SkillDo\Cms\Models\Gallery` |
| **Bảng DB** | `{prefix}group` (dùng chung với ThemeMenu, phân biệt bởi `object_type = 'gallery'`) |
| **Alias** | `\Gallery`, `SkillDo\Model\Gallery` |

**Mô tả:** Model quản lý Album/Group gallery. Global scope tự thêm `object_type = 'gallery'`. Khi xóa Album sẽ tự động xóa toàn bộ `GalleryItem` bên trong (theo `group_id`). Có các helper static `Gallery::addOption()`, `Gallery::getOption()`, `Gallery::removeOption()` (ủy quyền cho `GalleryOption`).

```php
use SkillDo\Cms\Models\Gallery;

$galleries = Gallery::orderBy('order')->get();
```

---

### `GalleryItem` — Ảnh Trong Album

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/GalleryItem.php` |
| **Namespace** | `SkillDo\Cms\Models\GalleryItem` |
| **Bảng DB** | `{prefix}galleries` |
| **Alias ngắn** | `\GalleryItem` |

**Mô tả:** Model quản lý từng ảnh/file trong gallery. Hỗ trợ metadata (alt text, caption...). Dùng `object_type` để gắn với đối tượng cha (vd: `post_post`, `products`).

```php
use SkillDo\Cms\Models\GalleryItem;

// Lấy gallery của một bài viết
$images = GalleryItem::where('object_id', 5)
    ->where('object_type', 'post_post')
    ->orderBy('order')
    ->get();

// Thêm ảnh vào gallery của bài viết
GalleryItem::create([
    'object_id'   => 5,
    'object_type' => 'post_post',
    'value'       => 'uploads/2026/03/photo.jpg',
]);
```

---

### `ThemeMenu` — Menu Điều Hướng (Nhóm)

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/ThemeMenu.php` |
| **Namespace** | `SkillDo\Cms\Models\ThemeMenu` |
| **Bảng DB** | `{prefix}group` (dùng chung, phân biệt bởi `object_type = 'menu'`) |
| **Alias ngắn** | `\ThemeMenu` |

**Mô tả:** Model quản lý nhóm/vị trí Menu (Header, Footer, Sidebar...). `options` là mảng liệt kê các `location` mà menu này được gán vào.

```php
use SkillDo\Cms\Models\ThemeMenu;

// Lấy menu theo vị trí (location)
$menu = ThemeMenu::getByLocation('header');

// Lấy tất cả menu — dùng all(), KHÔNG dùng get() (get() tĩnh chỉ trả về 1 bản ghi)
$menus = ThemeMenu::all();
```

---

### `ThemeMenuItem` — Mục Menu

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/ThemeMenuItem.php` |
| **Namespace** | `SkillDo\Cms\Models\ThemeMenuItem` |
| **Bảng DB** | `{prefix}menu` |
| **Alias ngắn** | `\ThemeMenuItem` |

**Mô tả:** Model quản lý từng mục trong Menu (link, bài viết, trang, danh mục...). Hỗ trợ phân cấp (parent_id) và `getItems()` để lấy cây menu đệ quy.

```php
use SkillDo\Cms\Models\ThemeMenuItem;

// Lấy các mục menu cấp 1 của một menu cụ thể
$items = ThemeMenuItem::where('menu_id', 1)
    ->where('parent_id', 0)
    ->orderBy('order')
    ->get();

// Lấy cây menu đầy đủ (đệ quy)
ThemeMenuItem::getItems($items, 1);

foreach ($items as $item) {
    echo $item->name . ' → ' . $item->slug;
    foreach ($item->child as $child) {
        echo '  ' . $child->name;
    }
}
```

---

### `Widget` — Widget Sidebar

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/Widget.php` |
| **Namespace** | `SkillDo\Cms\Models\Widget` |
| **Bảng DB** | `{prefix}widget` |
| **Alias ngắn** | `\Widget` |

**Mô tả:** Model lưu trữ dữ liệu cấu hình của các Widget được đặt vào Sidebar.

---

### `Router` — Bảng URL Routing

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/Router.php` |
| **Namespace** | `SkillDo\Cms\Models\Router` |
| **Bảng DB** | `{prefix}routes` |
| **Alias ngắn** | `\Router` |

**Mô tả:** Model nội bộ của hệ thống, lưu trữ bảng mapping giữa `slug` URL và Controller xử lý tương ứng. Được quản lý tự động bởi Trait `ModelRoute` — **thông thường không cần thao tác trực tiếp**.

```php
use SkillDo\Cms\Models\Router;

// Tìm route theo slug
$route = Router::where('slug', 'san-pham-a')->first();
echo $route->controller; // Ecommerce\Controllers\Web\ProductController
echo $route->method;     // detail
```

---

### `Language` — Bảng Đa Ngôn Ngữ

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/Language.php` |
| **Namespace** | `SkillDo\Cms\Models\Language` |
| **Bảng DB** | `{prefix}language` |
| **Primary Key** | `language_id` |
| **Alias ngắn** | `SkillDo\Model\Language` (**không phải** `\Language`) |

**Mô tả:** Model nội bộ của hệ thống, lưu trữ bản dịch của các đối tượng (`Post`, `Page`, `Product`...). Được quản lý tự động bởi Trait `ModelLanguage` — **thông thường không cần thao tác trực tiếp**.

---

### `ElementBuilderSection` — Section Element Builder

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/ElementBuilderSection.php` |
| **Namespace** | `SkillDo\Cms\Models\ElementBuilderSection` |
| **Bảng DB** | `{prefix}element_builder_sections` |

**Mô tả:** Model nội bộ lưu trữ các section được tạo bởi Element Builder (Page Builder của CMS).

---

### `ElementBuilderBlock` — Block Dùng Lại

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/ElementBuilderBlock.php` |
| **Namespace** | `SkillDo\Cms\Models\ElementBuilderBlock` |
| **Bảng DB** | `{prefix}element_builder_blocks` |

**Mô tả:** Model nội bộ lưu các block được lưu lại để tái sử dụng nhiều nơi trong Page Builder.

---

### `ElementBuilderDraft` — Bản Nháp

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/ElementBuilderDraft.php` |
| **Namespace** | `SkillDo\Cms\Models\ElementBuilderDraft` |
| **Bảng DB** | `{prefix}element_builder_draft` |

**Mô tả:** Model nội bộ lưu bản nháp đang chỉnh sửa trong Page Builder (chưa xuất bản).

---

### `ElementBuilderHistories` — Lịch Sử Chỉnh Sửa

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/ElementBuilderHistories.php` |
| **Namespace** | `SkillDo\Cms\Models\ElementBuilderHistories` |
| **Bảng DB** | `{prefix}element_builder_histories` |

**Mô tả:** Model nội bộ lưu lịch sử phiên bản của từng section (giới hạn 20 phiên bản/section).

> Chi tiết kiến trúc Page Builder: xem [Builder Architecture](../06-Cms/Builder-Architecture.md).

---

## 2. Framework (API) Models

Các Model này được dùng bởi hệ thống **REST API** của Framework. Chúng hỗ trợ xác thực bằng JWT/OAuth Access Token và API Key.

### `AccessToken` — JWT Access Token

| Thuộc tính | Giá trị |
|---|---|
| **File** | `framework/src/Api/Models/AccessToken.php` |
| **Namespace** | `SkillDo\Api\Models\AccessToken` |
| **Bảng DB** | `{prefix}oauth_access_tokens` |
| **Primary Key** | `id` (UUID - `char(36)`) |
| **Traits** | `HasUuids` |

**Mô tả:** Lưu trữ JWT Access Token đã cấp cho người dùng. Hỗ trợ revoke (thu hồi) và có thời gian hết hạn.

---

### `RefreshToken` — JWT Refresh Token

| Thuộc tính | Giá trị |
|---|---|
| **File** | `framework/src/Api/Models/RefreshToken.php` |
| **Namespace** | `SkillDo\Api\Models\RefreshToken` |
| **Bảng DB** | `{prefix}oauth_refresh_tokens` |
| **Primary Key** | `id` (UUID - `char(36)`) |

**Mô tả:** Lưu trữ Refresh Token dùng để làm mới Access Token khi hết hạn.

---

### `ApiKey` — API Key

| Thuộc tính | Giá trị |
|---|---|
| **File** | `framework/src/Api/Models/ApiKey.php` |
| **Namespace** | `SkillDo\Api\Models\ApiKey` |
| **Bảng DB** | `{prefix}api_keys` |

**Mô tả:** Lưu trữ API Key của người dùng/ứng dụng. Hỗ trợ các trạng thái `active`, `revoked`, `expired`.

---

## 3. Tóm Tắt Nhanh

| Model | Alias | Bảng | Traits chính |
|---|---|---|---|
| `Post` | `SkillDo\Model\Post` | `post` | SoftDeletes, ModelRoute, ModelLanguage |
| `PostCategory` | `SkillDo\Model\PostCategory` | `categories` | ModelRoute, ModelLanguage |
| `Page` | `SkillDo\Model\Page` | `page` | SoftDeletes, ModelRoute, ModelLanguage |
| `User` | `SkillDo\Model\User` | `users` | SoftDeletes |
| `Tag` | `SkillDo\Model\Tag` | `tags` | ModelLanguage |
| `Gallery` | `SkillDo\Model\Gallery`, `\Gallery` | `group` | — |
| `GalleryItem` | `SkillDo\Model\GalleryItem`, `\GalleryItem` | `galleries` | — |
| `ThemeMenu` | `SkillDo\Model\ThemeMenu` | `group` | — |
| `ThemeMenuItem` | `SkillDo\Model\ThemeMenuItem` | `menu` | — |
| `Widget` | `SkillDo\Model\Widget` | `widget` | — |
| `Router` | `SkillDo\Model\Router` | `routes` | — |
| `Language` | `SkillDo\Model\Language` | `language` | — |
| `ElementBuilderSection` | — | `element_builder_sections` | — |
| `ElementBuilderBlock` | — | `element_builder_blocks` | — |
| `ElementBuilderDraft` | — | `element_builder_draft` | — |
| `ElementBuilderHistories` | — | `element_builder_histories` | — |
| `AccessToken` | — | `oauth_access_tokens` | HasUuids |
| `RefreshToken` | — | `oauth_refresh_tokens` | HasUuids |
| `ApiKey` | — | `api_keys` | — |

> **Cảnh báo về alias gốc:** chỉ `\Gallery` và `\GalleryItem` là alias gốc trỏ vào Model. `\Language` và `\ThemeMenu` là alias gốc của **class hỗ trợ** (`SkillDo\Cms\Support\Language`, `SkillDo\Cms\Menu\ThemeMenu`), không phải Model cùng tên. Các Model khác **không có alias gốc** — dùng `SkillDo\Model\*` hoặc `SkillDo\Cms\Models\*`.
