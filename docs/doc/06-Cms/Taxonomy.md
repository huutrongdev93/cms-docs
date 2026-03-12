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
                'group' => ['info', 'media', 'seo'],
                'field' => [
                    'title', 'excerpt', 'content',
                    'image', 'public', 'slug',
                    'seo_title', 'seo_keywords', 'seo_description',
                ],
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
| `public` | bool | Hiển thị ngoài Frontend và Admin |
| `show_in_nav_menus` | bool | Hiển thị trong trang quản lý Menu (Giao diện → Menu) |
| `show_in_nav_admin` | bool | Hiển thị trong thanh điều hướng Admin |
| `menu_position` | int | Thứ tự trong sidebar Admin (càng nhỏ càng lên trên) |
| `menu_icon` | string | HTML icon cho menu item |
| `supports.group` | array | Nhóm field hiển thị: `info`, `media`, `seo`, `theme` |
| `supports.field` | array | Các field cụ thể: `title`, `content`, `image`, `slug`... |
| `capabilities` | array | Mapping capability cho từng hành động: `view`, `add`, `edit`, `delete` |

### 1.3 Các Field Hỗ Trợ trong `supports.field`

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
        'name'     => 'Danh mục dịch vụ',
        'singular' => 'Danh mục dịch vụ',
    ],
    'public'            => true,
    'show_in_nav_menus' => true,  // Hiển thị trong quản lý Menu
    'show_in_nav_admin' => true,  // Hiển thị trong Admin navigation
    'parent'            => true,  // Cho phép danh mục cha/con (phân cấp)
    'supports' => [
        'group' => ['info', 'media', 'seo'],
        'field' => ['name', 'excerpt', 'image', 'slug', 'seo_title', 'seo_description'],
    ],
]);
```

### 2.2 Tham Số `$args` cho Category Type

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `labels.name` | string | Tên hiển thị |
| `labels.singular` | string | Tên số ít |
| `public` | bool | Hiển thị Frontend |
| `show_in_nav_menus` | bool | Hiển thị trong quản lý Menu |
| `show_in_nav_admin` | bool | Hiển thị trong Admin navigation |
| `parent` | bool | Cho phép danh mục phân cấp cha/con |
| `supports.field` | array | Các field hỗ trợ (tương tự Post Type) |

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

// Lấy danh sách tất cả Post Type đã đăng ký
$postTypes = Taxonomy::getPost();
// ['post', 'video-gallery', 'services', ...]

// Lấy thông tin chi tiết của một Post Type
$detail = Taxonomy::getPost('services');
// ['labels' => [...], 'public' => true, ...]

// Lấy tất cả Post Type với chi tiết đầy đủ
$allPosts = Taxonomy::getPostDetail();

// Lấy danh sách Category Type đã đăng ký
$cateTypes = Taxonomy::getCategory();

// Lấy thông tin chi tiết của một Category Type
$detail = Taxonomy::getCategory('service-category');

// Lấy danh sách Category Type liên kết với một Post Type
$linkedCats = Taxonomy::getCategoryByPost('services');
// ['service-category']
```

### Hủy Đăng Ký (Dùng trong DeactivatorService)

```php
// Hủy đăng ký Post Type
Taxonomy::removePost('services');

// Hủy đăng ký Category Type
Taxonomy::removeCategory('service-category');

// Hủy liên kết Category Type khỏi Post Type (giữ lại Category Type)
Taxonomy::removeCategory('service-category', 'services');
```
