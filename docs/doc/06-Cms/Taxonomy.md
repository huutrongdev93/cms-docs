# Taxonomy

> **File:** `packages/skilldo/cms/src/Taxonomy/Taxonomy.php`  
> **Namespace:** `SkillDo\Cms\Taxonomy\Taxonomy`  
> **Alias ngắn:** `\Taxonomy`

Taxonomy là hệ thống cho phép Plugin **đăng ký các loại nội dung (Post Type)** và **loại danh mục (Category Type)** riêng, tích hợp sẵn vào giao diện Admin của CMS mà không cần viết lại toàn bộ logic.

**Ví dụ thực tế:** Plugin video gallery đăng ký `video-gallery` (Post Type) và `video-category` (Category Type). CMS tự động tạo menu quản lý, form thêm/sửa/xóa, phân quyền theo cấu hình.

---

## 1. Post Type

### 1.1 Đăng Ký Post Type

```php
Taxonomy::addPost(string $postType, array $args): bool
```

Thường được gọi trong `TaxonomyService` của Plugin, được khởi động qua `ServiceProvider`.

```php
<?php
namespace MyPlugin\Services;

use SkillDo\Cms\Taxonomy\Taxonomy;

class MyPluginTaxonomyService
{
    static function register(): void
    {
        Taxonomy::addPost('services', [
            'labels' => [
                'name'          => 'Dịch vụ',        // Tên hiển thị (số nhiều)
                'singular_name' => 'Dịch vụ',        // Tên hiển thị (số ít)
            ],
            'public'             => true,   // Hiển thị ở Frontend
            'show_in_nav_menus'  => true,   // Hiển thị trong quản lý Menu
            'show_in_nav_admin'  => true,   // Hiển thị trong Admin navigation
            'menu_position'      => 5,      // Vị trí trong sidebar Admin
            'menu_icon'          => '<i class="fas fa-cogs"></i>',
            'supports'           => [
                'info'  => ['title', 'excerpt', 'content'],
                'media' => ['image'],
                'seo'   => ['slug', 'seo_title', 'seo_keywords', 'seo_description'],
                'theme' => ['theme_layout', 'theme_view'],
            ],
            'capabilities' => [
                'view'   => 'view_services',
                'add'    => 'add_services',
                'edit'   => 'edit_services',
                'delete' => 'delete_services',
            ],
        ]);
    }
}
```

### 1.2 Tham Số `$args` cho Post Type

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `labels.name` | string | Tên hiển thị dạng số nhiều (vd: "Dịch vụ") |
| `labels.singular_name` | string | Tên hiển thị dạng số ít |
| `labels.add_new_item` | string | Nhãn nút "Thêm mới" |
| `labels.edit_item` | string | Nhãn trang sửa |
| `public` | bool | Hiển thị ngoài Frontend và Admin (mặc định `true`) |
| `show_in_nav_menus` | bool | Hiển thị trong trang quản lý Menu (Giao diện → Menu). Mặc định `0` (tắt) |
| `show_in_nav_admin` | bool | Hiển thị trong thanh điều hướng Admin (mặc định `true`) |
| `exclude_from_search` | bool | Ẩn khỏi kết quả tìm kiếm (mặc định `true`) |
| `menu_position` | int | Thứ tự trong sidebar Admin (càng nhỏ càng lên trên, mặc định `3`) |
| `menu_icon` | string | HTML icon cho menu item |
| `supports` | array | Map nhóm → danh sách field. Key là tên nhóm (`info`, `media`, `seo`, `theme`), value là mảng tên field. Nếu bỏ trống sẽ dùng bộ mặc định đầy đủ |
| `capabilities` | array | Mapping capability cho từng hành động: `view`, `add`, `edit`, `delete`. Mặc định: `view_posts`, `add_posts`, `edit_posts`, `delete_posts` |

> **Shortcut keys:** có thể truyền `admin_nav_header` (ghi đè `labels.name`) và `name` (ghi đè `labels.singular_name`) ở cấp ngoài cùng của `$args` — hệ thống tự chuyển vào `labels` rồi xóa key gốc.
>
> Đăng ký trùng `$postType` đã tồn tại sẽ trả về `false` (không ghi đè).

### 1.3 Các Nhóm và Field Hỗ Trợ trong `supports`

`supports` là một **associative array** với key là tên nhóm và value là danh sách field trong nhóm đó:

```php
'supports' => [
    'info'  => ['title', 'excerpt', 'content'],
    'media' => ['image'],
    'seo'   => ['slug', 'seo_title', 'seo_keywords', 'seo_description'],
    'theme' => ['theme_layout', 'theme_view'],
],
```

| Nhóm | Field khả dụng |
|---|---|
| `info` | `title`, `excerpt`, `content`, `public` |
| `media` | `image` |
| `seo` | `slug`, `seo_title`, `seo_description`, `seo_keywords` |
| `theme` | `theme_layout`, `theme_view` |

| Field | Mô tả |
|---|---|
| `title` | Tiêu đề |
| `excerpt` | Mô tả ngắn |
| `content` | Nội dung (WYSIWYG) |
| `image` | Ảnh đại diện |
| `public` | Trạng thái hiển thị (public/private) |
| `slug` | Đường dẫn URL |
| `seo_title` | Tiêu đề SEO |
| `seo_description` | Mô tả SEO |
| `seo_keywords` | Từ khóa SEO |
| `theme_layout` | Chọn layout của theme |
| `theme_view` | Chọn view template |

---

## 2. Category Type

### 2.1 Đăng Ký Category Type

Gọi ngay sau khi đăng ký Post Type, truyền `$postType` để liên kết 2 loại với nhau.

```php
Taxonomy::addCategory(string $cateType, string $postType, array $args): bool
```

```php
Taxonomy::addCategory('service-category', 'services', [
    'labels' => [
        'name'          => 'Danh mục dịch vụ',
        'singular_name' => 'Danh mục dịch vụ',
    ],
    'public'            => true,
    'show_in_nav_menus' => true,  // Hiển thị trong quản lý Menu
    'show_in_nav_admin' => true,  // Hiển thị trong Admin navigation
    'parent'            => true,  // Cho phép danh mục cha/con (phân cấp)
    'supports' => [
        'info'     => ['name', 'excerpt'],
        'media'    => ['image'],
        'seo'      => ['slug', 'seo_title', 'seo_keywords', 'seo_description'],
        'theme'    => ['theme_layout', 'theme_view'],
        'category' => ['parent_id'],
    ],
]);
```

### 2.2 Tham Số `$args` cho Category Type

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `labels.name` | string | Tên hiển thị |
| `labels.singular_name` | string | Tên số ít |
| `labels.add_new_item` | string | Nhãn nút "Thêm mới" |
| `public` | bool | Hiển thị Frontend (mặc định `true`) |
| `show_in_nav_menus` | bool | Hiển thị trong quản lý Menu. Mặc định `0` (tắt) |
| `show_in_nav_admin` | bool | Hiển thị trong Admin navigation (mặc định `true`) |
| `exclude_from_search` | bool | Ẩn khỏi kết quả tìm kiếm (mặc định `true`) |
| `parent` | bool | Cho phép danh mục phân cấp cha/con (mặc định `true`) |
| `show_admin_column` | bool | Hiển thị cột category trong bảng Admin của Post Type (mặc định `false`) |
| `supports` | array | Map nhóm → danh sách field (tương tự Post Type, thêm nhóm `category` với field `parent_id`). Bỏ trống sẽ dùng bộ mặc định đầy đủ |
| `capabilities` | array | `edit`, `delete`. Mặc định: `post_categories_list`, `post_categories_delete` |

> Shortcut keys `admin_nav_header` / `name` hoạt động giống Post Type. Key `post_type` trong detail của Category Type được hệ thống tự gán khi link với Post Type — không cần truyền tay.

---

## 3. Ví Dụ Thực Tế — Đăng Ký Trong ServiceProvider

```php
<?php
// plugins/my-plugin/app/Providers/MyPluginServiceProvider.php

namespace MyPlugin\Providers;

use MyPlugin\Services\MyPluginTaxonomyService;
use SkillDo\ServiceProvider;

class MyPluginServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Đăng ký Taxonomy khi CMS khởi động
        add_action('init', [MyPluginTaxonomyService::class, 'register']);
    }
}
```

---

## 4. Các Method Khác của `Taxonomy`

### Kiểm Tra & Lấy Thông Tin

```php
// Kiểm tra Post Type đã được đăng ký chưa
$exists = Taxonomy::hasPost('services');
// true / false

// Kiểm tra Category Type đã được đăng ký chưa
$exists = Taxonomy::hasCategory('service-category');
// true / false

// Lấy danh sách tất cả Post Type đã đăng ký (keyed by postType, kèm đầy đủ config)
$postTypes = Taxonomy::getPost();
// ['post' => [...], 'services' => [...], ...]

// Lấy thông tin config của một Post Type cụ thể
$detail = Taxonomy::getPost('services');
// ['labels' => [...], 'public' => true, ...]

// Alias của getPost() không tham số — tường minh hơn khi cần toàn bộ data
$allPosts = Taxonomy::getPostDetail();

// Lấy tất cả Category Type đã đăng ký (keyed by cateType, kèm đầy đủ config)
$cateTypes = Taxonomy::getCategory();

// Lấy thông tin config của một Category Type cụ thể
$detail = Taxonomy::getCategory('service-category');
// ['labels' => [...], 'public' => true, 'post_type' => 'services', ...]

// Lấy danh sách Category Type liên kết với một Post Type
// $output = TaxonomyService::OUT_NAMES  → trả về mảng tên (mặc định)
// $output = TaxonomyService::OUT_DETAILS → trả về mảng config đầy đủ
$linkedCats = Taxonomy::getCategoryByPost('services');
// ['service-category']

$linkedCatsDetail = Taxonomy::getCategoryByPost('services', \SkillDo\Cms\Taxonomy\TaxonomyService::OUT_DETAILS);
// ['service-category' => ['labels' => [...], ...]]

// Cũng chấp nhận object có thuộc tính post_type
$linkedCats = Taxonomy::getCategoryByPost($postObject);
```

### Hủy Đăng Ký (Dùng trong DeactivatorService)

```php
// Hủy đăng ký Post Type (đồng thời gỡ liên kết với tất cả Category Type)
Taxonomy::removePost('services');

// Hủy đăng ký Category Type hoàn toàn (đồng thời gỡ khỏi tất cả Post Type)
Taxonomy::removeCategory('service-category');

// Chỉ gỡ liên kết Category Type khỏi một Post Type cụ thể (giữ lại Category Type)
Taxonomy::removeCategory('service-category', 'services');
```
