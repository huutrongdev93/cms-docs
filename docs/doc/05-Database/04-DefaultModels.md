# Danh Sách Model Mặc Định của CMS & Framework

Đây là toàn bộ các Model được cung cấp sẵn bởi SkillDo CMS và Framework. Bạn có thể sử dụng trực tiếp các Model này trong Plugin hoặc Theme mà không cần khai báo lại.

Các Model đều nằm trong hai package chính:
- **CMS:** `packages/skilldo/cms/src/Models/` — Namespace `SkillDo\Cms\Models`
- **Framework (API):** `packages/skilldo/framework/src/Api/Models/` — Namespace `SkillDo\Api\Models`

---

## 1. CMS Models

### `Post` — Bài Viết

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/Post.php` |
| **Namespace** | `SkillDo\Cms\Models\Post` |
| **Bảng DB** | `{prefix}post` |
| **Alias ngắn** | `\Post` |
| **Traits** | `SoftDeletes`, `ModelRoute`, `ModelLanguage` |
| **Route type** | `post` |
| **Language type** | `post` |

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
| **Alias ngắn** | `\PostCategory` |
| **Traits** | `ModelRoute`, `ModelLanguage` |
| **Route type** | `post_categories` |
| **Language type** | `post_categories` |

**Mô tả:** Model quản lý danh mục bài viết. Hỗ trợ cấu trúc cây phân cấp (NestedSet), đa ngôn ngữ, URL slug. Field `cate_type` để phân biệt loại danh mục (mặc định `post_categories`).

**Ví dụ sử dụng:**
```php
use SkillDo\Cms\Models\PostCategory;

// Lấy toàn bộ danh mục dạng cây phẳng (flat tree)
$categories = PostCategory::tree()->get();

// Lấy dạng mảng phân cấp lồng nhau (nested)
$categories = PostCategory::multilevel()->get();

// Lấy danh mục dạng options cho select box (id => name)
$options = PostCategory::options()->get();

// Lấy danh mục theo cate_type riêng (dùng cho portfolio, project...)
$categories = PostCategory::where('cate_type', 'portfolio_categories')->get();

// Lấy danh mục của một bài viết cụ thể
$categories = PostCategory::getsByPost(5)->get();
```

---

### `Page` — Trang Nội Dung

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/Page.php` |
| **Namespace** | `SkillDo\Cms\Models\Page` |
| **Bảng DB** | `{prefix}page` |
| **Alias ngắn** | `\Page` |
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
| **Alias ngắn** | `\User` |
| **Traits** | `SoftDeletes` |

**Mô tả:** Model quản lý tài khoản người dùng. Tích hợp sẵn validation username/email, hash mật khẩu Argon2id, cập nhật Role tự động khi `saved`.

**Các cột chính:** `username`, `password`, `salt`, `firstname`, `lastname`, `email`, `phone`, `status`, `role`

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
| **Alias ngắn** | `\Gallery` |

**Mô tả:** Model quản lý Album/Group gallery. Khi xóa Album sẽ tự động xóa toàn bộ `GalleryItem` bên trong.

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

// Lấy tất cả menu
$menus = ThemeMenu::get();
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
| **Alias ngắn** | `\Language` |

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

### `ElementBuilderTemplate` — Template Element Builder

| Thuộc tính | Giá trị |
|---|---|
| **File** | `cms/src/Models/ElementBuilderTemplate.php` |
| **Namespace** | `SkillDo\Cms\Models\ElementBuilderTemplate` |
| **Bảng DB** | `{prefix}element_builder_templates` |

**Mô tả:** Model nội bộ lưu trữ các template được tạo bởi Element Builder.

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
| `Post` | `\Post` | `post` | SoftDeletes, ModelRoute, ModelLanguage |
| `PostCategory` | `\PostCategory` | `categories` | ModelRoute, ModelLanguage |
| `Page` | `\Page` | `page` | SoftDeletes, ModelRoute, ModelLanguage |
| `User` | `\User` | `users` | SoftDeletes |
| `Gallery` | `\Gallery` | `group` | — |
| `GalleryItem` | `\GalleryItem` | `galleries` | — |
| `ThemeMenu` | `\ThemeMenu` | `group` | — |
| `ThemeMenuItem` | `\ThemeMenuItem` | `menu` | — |
| `Widget` | `\Widget` | `widget` | — |
| `Router` | `\Router` | `routes` | — |
| `Language` | `\Language` | `language` | — |
| `ElementBuilderSection` | — | `element_builder_sections` | — |
| `ElementBuilderTemplate` | — | `element_builder_templates` | — |
| `AccessToken` | — | `oauth_access_tokens` | HasUuids |
| `RefreshToken` | — | `oauth_refresh_tokens` | HasUuids |
| `ApiKey` | — | `api_keys` | — |
