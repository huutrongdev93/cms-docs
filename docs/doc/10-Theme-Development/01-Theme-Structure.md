# Cấu Trúc Thư Mục Của Theme v8

Trong SkillDo CMS v8, một Theme không chỉ đơn giản là chứa vài file giao diện HTML thô sơ. V8 đã nâng cấp khái niệm Theme lên thành một "Ứng dụng thu nhỏ" chứa đựng logic, controller, assets và bộ máy dịch thuật riêng biệt.

## Tổng Quan

SkillDo v8 hỗ trợ **2 loại theme**:

| Theme | Thư mục | Mô tả |
|---|---|---|
| **theme-store** | `views/theme-store/` | Theme chính — chứa toàn bộ giao diện, logic, services |
| **theme-child** | `views/theme-child/` | Theme con — chỉ override các file cần thay đổi từ theme-store |

### Cơ chế ưu tiên

Khi CMS load một view, nó tìm kiếm **theme-child trước**, nếu không có thì fallback sang **theme-store**:

```
Theme::partial('include/header')
  → views/theme-child/include/header.blade.php   (ưu tiên)
  → views/theme-store/include/header.blade.php   (fallback)
```

---

## Cấu Trúc theme-store

```
views/theme-store/
│
├── bootstrap/                     # Khởi tạo theme — load tự động
│   ├── config.php                 # Cấu hình chính: providers, hooks, assets, sidebars
│   ├── layout.php                 # Đăng ký layout cho từng loại trang
│   ├── ajax.php                   # Đăng ký tất cả Ajax handlers
│   ├── options.php                # Load theme option files
│   └── account.php                # Cấu hình dashboard & sidebar tài khoản thành viên
│
├── app/                           # Mã nguồn PHP của theme (PSR-4: namespace Theme\*)
│   ├── Ajax/                      # Ajax handler classes
│   │   ├── ThemeAuthAjax.php      # Ajax: đăng nhập, đăng ký, quên mật khẩu
│   │   ├── ThemeAccountAjax.php   # Ajax: quản lý tài khoản (login-required)
│   │   ├── ThemeTableAjax.php     # Ajax: load table data
│   │   └── Admin/                 # Ajax admin-only
│   │       └── LayoutAjax.php     # Ajax: quản lý layout admin
│   │
│   ├── Providers/
│   │   └── ThemeServiceProvider.php  # Service Provider của theme
│   │
│   ├── Services/                  # Business logic services
│   │   ├── ThemeAssetService.php  # Đăng ký & render CSS/JS assets
│   │   ├── ThemeHeadService.php   # Meta tags, script variables
│   │   ├── ThemeStyleService.php  # CSS inline generation
│   │   ├── ThemeScriptService.php # Script inline, Google Fonts
│   │   ├── ThemeHeaderService.php # Header assets & render
│   │   ├── ThemeFooterService.php # Footer render
│   │   ├── ThemeSidebarService.php# Sidebar registration & render
│   │   ├── ThemeHomeService.php   # Trang chủ render
│   │   ├── ThemePageService.php   # Trang chi tiết render
│   │   └── ThemeWidgetService.php # Widget rendering service
│   │
│   ├── Supports/                  # Helper/Support classes
│   │   ├── ThemeLayout.php        # Quản lý danh sách layouts
│   │   ├── ThemeSidebar.php       # Sidebar CSS helpers
│   │   ├── ThemeBreadcrumb.php    # Breadcrumb builder
│   │   ├── ThemeWidget.php        # Widget builder (alias)
│   │   ├── AccountSidebar.php     # Menu sidebar tài khoản
│   │   ├── AccountDashboard.php   # Dashboard widgets tài khoản
│   │   └── WalkerNavMenu.php      # Menu navigation walker
│   │
│   ├── Modules/                   # Feature modules (Admin only)
│   │   └── Admin/                 # Admin module classes
│   │
│   ├── Macros/                    # Blade/Str macro extensions
│   └── theme-setting/             # Theme option configuration
│       └── options/               # Option files (mỗi file = 1 nhóm option)
│
├── layouts/                       # Template layout files (Blade)
│   ├── template-home.blade.php
│   ├── template-full-width.blade.php
│   ├── template-sidebar-right.blade.php
│   ├── template-sidebar-left.blade.php
│   ├── template-user.blade.php
│   └── template-empty.blade.php   (+ nhiều layout khác)
│
├── include/                       # Partial views (dùng Theme::partial())
│   ├── head.blade.php             # <head> với @do_action('cle_header')
│   ├── header.blade.php           # Navigation header
│   ├── footer.blade.php           # Footer
│   ├── sidebar-right.blade.php    # Sidebar phải
│   ├── sidebar-left.blade.php     # Sidebar trái
│   ├── breadcrumb.blade.php       # Breadcrumb
│   ├── top.blade.php              # Top bar
│   ├── mobile-header.blade.php    # Mobile header
│   └── loop/, post/, page/, product/  # Partial views theo loại nội dung
│
├── language/                      # Translation files của theme
│   ├── vi/...
│   └── en/...
│
├── assets/                        # CSS, JS, images của theme
│   ├── css/
│   ├── js/
│   └── images/
│
├── resources/                     # Resources admin (account pages, admin UI)
│
├── widget/                        # Widget view files
│
├── home-index.blade.php           # Content trang chủ
├── post-index.blade.php           # Content danh sách bài viết
├── post-detail.blade.php          # Content chi tiết bài viết
├── page-detail.blade.php          # Content chi tiết trang
├── user-login.blade.php           # Trang đăng nhập
├── user-register.blade.php        # Trang đăng ký
├── user-profile.blade.php         # Trang hồ sơ
└── 404-error.blade.php            # Trang lỗi 404
```

---

## Cấu Trúc theme-child

> **Nguyên tắc theme-child:** Chỉ tạo file khi cần override. Không cần copy toàn bộ theme-store.

---

## bootstrap/config.php — Cấu hình chính

Đây là file quan trọng nhất của theme, được load đầu tiên.

```php
<?php
use SkillDo\Cms\Support\Theme;
use Theme\Providers\ThemeServiceProvider;

Theme::config()
    ->providers([
        ThemeServiceProvider::class  // Đăng ký Service Provider
    ])
    ->booted('hooks', function (\SkillDo\Cms\Support\ThemeConfig $theme)
    {
        // ── ASSETS ──────────────────────────────────────────────
        add_action('theme_init', [\Theme\Services\ThemeAssetService::class, 'assets']);
        add_action('cle_header', [\Theme\Services\ThemeAssetService::class, 'assetsHeader']);
        add_action('cle_footer', [\Theme\Services\ThemeAssetService::class, 'assetsFooter']);

        // ── HEAD TAGS (meta, title, canonical...) ────────────────
        add_action('cle_header', [\Theme\Services\ThemeHeadService::class, 'metas'], 1);
        add_action('cle_header', [\Theme\Services\ThemeHeadService::class, 'tags'], 5);
        add_action('cle_header', [\Theme\Services\ThemeHeadService::class, 'scriptVariable'], 30);
        add_action('cle_header', [\Theme\Services\ThemeHeadService::class, 'styleVariable'], 40);

        // ── CSS INLINE ───────────────────────────────────────────
        add_action('cle_header', [\Theme\Services\ThemeStyleService::class, 'css'], 999);

        // ── SCRIPTS ──────────────────────────────────────────────
        add_action('cle_header', [\Theme\Services\ThemeScriptService::class, 'headerScript'], 999);
        add_action('cle_footer', [\Theme\Services\ThemeScriptService::class, 'footerScript'], 999);

        // ── SIDEBARS ─────────────────────────────────────────────
        add_action('init', [\Theme\Services\ThemeSidebarService::class, 'register']);
        add_action('theme_sidebar_left',  [\Theme\Services\ThemeSidebarService::class, 'renderSidebarLeft']);
        add_action('theme_sidebar_right', [\Theme\Services\ThemeSidebarService::class, 'renderSidebarRight']);
    });
```

---

## bootstrap/layout.php — Đăng ký Layout

```php
<?php
use Theme\Supports\ThemeLayout;

Theme::config()->booted('layout', function (\SkillDo\Cms\Support\ThemeConfig $theme)
{
    $theme->layouts([
        'home.index'      => 'template-home',           // Trang chủ
        'page.detail'     => ThemeLayout::layout('page')['template'] ?? '',
        'post.index'      => 'template-sidebar-right',  // Danh sách bài viết
        'post.detail'     => 'template-sidebar-right',  // Chi tiết bài viết
        'products.index'  => 'template-sidebar-left',   // Danh sách sản phẩm
        'products.detail' => 'template-full-width',     // Chi tiết sản phẩm
        'user.index'      => 'template-user',            // Tài khoản
    ]);
});
```

**Các layout key:**
- `home.index` — Trang chủ
- `page.detail` — Chi tiết trang
- `post.index` — Danh sách bài viết
- `post.detail` — Chi tiết bài viết
- `products.index` — Danh sách sản phẩm
- `products.detail` — Chi tiết sản phẩm
- `user.index` — Trang tài khoản

---

## Layout Files — Cấu trúc HTML

Mỗi layout là một file Blade đầy đủ HTML:

```blade
{{-- layouts/template-sidebar-right.blade.php --}}
<!DOCTYPE html>
<html lang="{{Language::current()}}" @do_action('in_tag_html')>
    {!! Theme::partial('include/head') !!}
    <body @do_action('in_tag_body')>
        {!! Theme::partial('include/header') !!}

        <div class="container">
            <div class="row">
                <div class="col-lg-9">
                    {!! Theme::content() !!}  {{-- Nội dung trang --}}
                </div>
                <div class="col-lg-3 sidebar">
                    {!! Theme::partial('include/sidebar-right') !!}
                </div>
            </div>
        </div>

        @do_action('template_wrapper_after')

        {!! Theme::partial('include/footer') !!}
    </body>
</html>
```

### Theme Helpers

| Helper | Mô tả |
|---|---|
| `Theme::content()` | Render nội dung trang hiện tại |
| `Theme::partial('path/view')` | Include partial view (theme-child → theme-store) |
| `Language::current()` | Ngôn ngữ hiện tại (`vi`, `en`) |
| `Template::getClass()` | CSS class của template hiện tại |
| `Template::getPage()` | Tên page hiện tại |

---

## Service Provider của Theme

```php
<?php
namespace Theme\Providers;

use SkillDo\AliasLoader;
use SkillDo\ServiceProvider;

class ThemeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Đăng ký class aliases dùng trong theme
        $loader = AliasLoader::getInstance();
        $loader->alias('ThemeWidget', \Theme\Supports\ThemeWidget::class);
        $loader->alias('walker_nav_menu', \Theme\Supports\WalkerNavMenu::class);
    }

    public function boot(): void
    {
        // Chạy sau khi tất cả providers đã register
    }
}
```

---

## Action Hooks Trong Theme

| Hook | Thời điểm | Ví dụ sử dụng |
|---|---|---|
| `cle_header` | Trong `<head>` | Thêm CSS, meta tags |
| `cle_footer` | Cuối `<body>` | Thêm JS scripts |
| `theme_init` | Theme khởi tạo | Đăng ký assets |
| `in_tag_html` | Trong `<html>` | Thêm attributes |
| `in_tag_body` | Trong `<body>` | Thêm class, data |
| `theme_sidebar_left` | Render sidebar trái | Custom widgets |
| `theme_sidebar_right` | Render sidebar phải | Custom widgets |
| `theme_custom_css` | CSS tùy chỉnh | Custom CSS rules |
| `template_wrapper_before` | Trước content | Inject HTML |
| `template_wrapper_after` | Sau content | Inject HTML |
| `theme_footer_script` | Script footer | Google Fonts, GTM |

---

## Theme Partial Functions

### `Theme::partial(string $path): string`
Include partial view, ưu tiên theme-child trước theme-store.

```blade
{!! Theme::partial('include/header') !!}
{!! Theme::partial('include/footer') !!}
{!! Theme::partial('include/sidebar-right') !!}
{!! Theme::partial('loop/post-item', ['post' => $post]) !!}
```

### `theme_include(string $file): mixed`
Include PHP file từ thư mục theme (ưu tiên theme-child).

```php
theme_include('app/theme-setting/theme-setting.php');
```

