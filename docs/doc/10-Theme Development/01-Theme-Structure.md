# Cấu Trúc Theme

Trong SkillDo CMS v8, một Theme không chỉ đơn giản là chứa vài file giao diện HTML thô sơ. V8 đã nâng cấp khái niệm Theme lên thành một "Ứng dụng thu nhỏ" chứa đựng logic, controller, assets và bộ máy dịch thuật riêng biệt.

## Tổng Quan

SkillDo v8 hỗ trợ **2 loại theme**:

| Theme           | Thư mục              | Mô tả                                                         |
|-----------------|----------------------|---------------------------------------------------------------|
| **theme-store** | `views/theme-store/` | Theme chính — chứa toàn bộ giao diện, logic, services         |
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
├── theme.json                     # Manifest: providers, autoload PSR-4
│
├── bootstrap/                     # Khởi tạo theme — load tự động
│   ├── config.php                 # Cấu hình chính: hooks, assets, sidebars, builders
│   ├── layout.php                 # Đăng ký layout cho từng loại trang
│   ├── ajax.php                   # Đăng ký tất cả Ajax handlers
│   ├── options.php                # Load theme option files
│   ├── admin.php                  # Đăng ký hooks/filters cho khu vực Admin
│   └── account.php                # Cấu hình dashboard & sidebar tài khoản thành viên
│
├── app/                           # Mã nguồn PHP của theme (PSR-4: namespace Theme\*)
│   │
│   ├── Ajax/                      # Ajax handler classes
│   │   ├── ThemeAjax.php          # Ajax: xử lý chung của theme
│   │   ├── ThemeAuthAjax.php      # Ajax: đăng nhập, đăng ký, quên mật khẩu
│   │   ├── ThemeAccountAjax.php   # Ajax: quản lý tài khoản (login-required)
│   │   ├── ThemeTableAjax.php     # Ajax: load table data
│   │   └── Admin/
│   │       └── LayoutAjax.php     # Ajax: quản lý layout admin
│   │
│   ├── Builders/                  # Xử lý assets và render từng phần giao diện
│   │   ├── ThemeHeader.php        # Render header + đăng ký assets header
│   │   ├── ThemeFooter.php        # Render footer + đăng ký assets footer
│   │   ├── ThemeHome.php          # Render trang chủ + đăng ký assets home
│   │   ├── ThemePage.php          # Render giao diện tùy chỉnh từng trang
│   │   └── ThemeLayout.php        # Render giao diện theo layout
│   │
│   ├── Layouts/                   # Layout logic classes (PSR-4: Theme\Layouts\*)
│   │   ├── PageDetail.php         # Logic layout trang chi tiết (page)
│   │   ├── PostDetail.php         # Logic layout bài viết chi tiết
│   │   └── PostIndex.php          # Logic layout danh sách bài viết
│   │
│   ├── Providers/
│   │   └── ThemeServiceProvider.php  # Service Provider của theme
│   │
│   ├── Services/                  # Business logic services
│   │   ├── ThemeAssetService.php          # Đăng ký & render CSS/JS assets
│   │   ├── ThemeHeadService.php           # Meta tags, script variables
│   │   ├── ThemeStyleService.php          # CSS inline generation
│   │   ├── ThemeScriptService.php         # Script inline, Google Fonts
│   │   ├── ThemeSidebarService.php        # Sidebar registration & render
│   │   ├── ThemeWidgetService.php         # Widget asset rendering service
│   │   └── ThemeAccountDashboardWidget.php# Widget dashboard tài khoản thành viên
│   │
│   ├── Supports/                  # Helper/Support classes
│   │   ├── ThemeAutoloader.php    # Autoload component files (widget, heading...)
│   │   ├── ThemeLayout.php        # Quản lý danh sách layouts tùy chỉnh
│   │   ├── ThemeSidebar.php       # Sidebar CSS helpers
│   │   ├── ThemeBreadcrumb.php    # Breadcrumb builder
│   │   ├── ThemeBreadcrumbItem.php# Breadcrumb item builder
│   │   ├── ThemeWidget.php        # Widget builder (alias)
│   │   ├── ThemeAuthForm.php      # Form xác thực (login / register / forgot)
│   │   ├── ThemeCssBuild.php      # CSS builder helper
│   │   ├── ThemeHeaderStyle.php   # CSS helper cho header
│   │   ├── ThemeHeadingStyle.php  # CSS helper cho heading
│   │   ├── ThemeNavigationStyle.php# CSS helper cho navigation
│   │   ├── AccountSidebar.php     # Menu sidebar tài khoản
│   │   ├── AccountDashboard.php   # Dashboard widgets tài khoản
│   │   ├── AccountRouter.php      # Router tài khoản thành viên
│   │   ├── AccountStore.php       # Store dữ liệu tài khoản
│   │   └── WalkerNavMenu.php      # Menu navigation walker
│   │
│   ├── Modules/                   # Feature modules (Admin only)
│   │   └── Admin/
│   │       ├── Layout/
│   │       │   └── Layout.php         # Quản lý layout trang — Admin module
│   │       └── System/
│   │           ├── ThemeAuth.php      # Tab cài đặt xác thực trong Admin
│   │           ├── ThemeGallery.php   # Tab cài đặt gallery trong Admin
│   │           └── ThemeSocial.php    # Tab cài đặt mạng xã hội trong Admin
│   │
│   ├── Macros/
│   │   └── ThemeMixin.php         # Blade/Str macro extensions
│   │
│   ├── Options/                   # Theme option configuration files
│   │   ├── banner.php             # Option banner
│   │   ├── fonts.php              # Option fonts
│   │   ├── footer.php             # Option footer
│   │   ├── general.php            # Option chung
│   │   ├── header.php             # Option header desktop
│   │   ├── header-mobile.php      # Option header mobile
│   │   ├── map.php                # Option bản đồ
│   │   ├── mobile.php             # Option mobile
│   │   ├── navigation.php         # Option navigation/menu
│   │   └── post.php               # Option bài viết
│   │
│   └── helpers/
│       └── helper.php             # Helper functions của theme
│
├── layouts/                       # Template layout files (Blade) — full HTML page
│   ├── template-home.blade.php                    # Trang chủ mặc định
│   ├── template-home-3.blade.php                  # Trang chủ style 3
│   ├── template-full-width.blade.php              # Full width (không sidebar)
│   ├── template-full-width-banner.blade.php       # Full width + banner
│   ├── template-sidebar.blade.php                 # Sidebar (generic)
│   ├── template-sidebar-right.blade.php           # Sidebar phải
│   ├── template-sidebar-left.blade.php            # Sidebar trái
│   ├── template-sidebar-right-banner-content.blade.php
│   ├── template-sidebar-right-banner-full.blade.php
│   ├── template-sidebar-left-banner-content.blade.php
│   ├── template-sidebar-left-banner-full.blade.php
│   ├── template-sidebar-banner-content.blade.php
│   ├── template-sidebar-banner-full.blade.php
│   ├── template-user.blade.php                    # Trang tài khoản thành viên
│   └── template-empty.blade.php                  # Không có layout (trống)
│
├── resources/                     # Partial views theo nhóm chức năng
│   ├── common/                    # Partials dùng chung
│   │   ├── head.blade.php         # <head> tag block
│   │   ├── alert.blade.php        # Alert message
│   │   ├── banner.blade.php       # Banner common
│   │   ├── breadcrumb.blade.php   # Breadcrumb
│   │   └── loading.blade.php      # Loading indicator
│   ├── layout/                    # Partials cho layout
│   │   ├── header.blade.php       # Navigation header desktop
│   │   ├── footer.blade.php       # Footer
│   │   ├── sidebar-left.blade.php # Sidebar trái
│   │   ├── sidebar-right.blade.php# Sidebar phải
│   │   └── top.blade.php          # Top bar
│   ├── mobile/                    # Partials cho mobile
│   │   ├── mobile-header.blade.php
│   │   ├── mobile-menu.blade.php
│   │   ├── mobile-navigation.blade.php
│   │   ├── mobile-search.blade.php
│   │   └── mobile-category-icon.blade.php
│   ├── account/                   # Partials trang tài khoản
│   │   ├── account-nav.blade.php
│   │   └── profile-widget.blade.php
│   └── admin/                     # Partials cho Admin backend
│       └── theme-layout/          # UI quản lý layout
│           ├── main.blade.php
│           ├── layout.blade.php
│           ├── layout-item.blade.php
│           ├── components.blade.php
│           ├── navigation.blade.php
│           └── heading-default/
│               ├── index.blade.php
│               └── item.blade.php
│
├── include/                       # Partial views theo loại nội dung
│   ├── loop/                      # Loop item views
│   │   ├── item_post.blade.php
│   │   ├── item_post_horizontal.blade.php
│   │   └── item_post_sidebar.blade.php
│   ├── page/                      # Page partials
│   │   └── title.blade.php
│   ├── post/                      # Post partials
│   │   ├── detail/                # Chi tiết bài viết
│   │   │   ├── title.blade.php
│   │   │   ├── share.blade.php
│   │   │   └── related.blade.php
│   │   ├── item/
│   │   │   └── css.blade.php
│   │   └── list/                  # Danh sách bài viết
│   │       ├── title.blade.php
│   │       └── pagination.blade.php
│   └── product/                   # Product partials
│       ├── detail/                # Chi tiết sản phẩm
│       │   ├── breadcrumb.blade.php
│       │   └── mobile-cart.blade.php
│       └── list/                  # Danh sách sản phẩm
│           ├── title.blade.php
│           └── pagination.blade.php
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
├── widget/                        # Widget blocks & elements
│   ├── widget.json                # Danh sách widget đăng ký
│   ├── blocks/                    # Widget blocks (about, banner, feedback, products...)
│   │   ├── about/                 # Widget giới thiệu (style1 → style21)
│   │   ├── banner/                # Widget banner
│   │   ├── brands/                # Widget thương hiệu/đối tác
│   │   ├── email/                 # Widget email/newsletter
│   │   ├── feedback/              # Widget đánh giá/testimonial
│   │   ├── footer/                # Widget footer
│   │   ├── form/                  # Widget form liên hệ
│   │   ├── items/                 # Widget danh sách items (style1 → style26)
│   │   ├── page-builder/          # Widget page builder
│   │   ├── post/                  # Widget bài viết (style1 → style19)
│   │   ├── post-video/            # Widget bài viết có video
│   │   ├── products/              # Widget sản phẩm (style1 → style21, flash-sale)
│   │   ├── products-category/     # Widget danh mục sản phẩm
│   │   ├── question/              # Widget hỏi đáp
│   │   ├── question-feedback/     # Widget hỏi đáp + feedback
│   │   ├── question-post/         # Widget hỏi đáp + bài viết
│   │   ├── question-video/        # Widget hỏi đáp + video
│   │   ├── slider/                # Widget slider (style1 → style14)
│   │   ├── tien-ich/              # Widget tiện ích (content, map, menu-tags)
│   │   └── videos/                # Widget video gallery
│   └── elements/                  # Widget elements (button, cart, auth-button...)
│       ├── auth-button/
│       ├── button/
│       └── cart/
│
├── home-index.blade.php           # Content trang chủ
├── post-index.blade.php           # Content danh sách bài viết
├── post-detail.blade.php          # Content chi tiết bài viết
├── page-detail.blade.php          # Content chi tiết trang
├── page-lien-he.blade.php         # Content trang liên hệ
├── user-login.blade.php           # Trang đăng nhập
├── user-register.blade.php        # Trang đăng ký
├── user-forgot.blade.php          # Trang quên mật khẩu
├── user-reset.blade.php           # Trang đặt lại mật khẩu
├── user-password.blade.php        # Trang đổi mật khẩu
├── user-dispatch.blade.php        # Trang điều hướng tài khoản
├── user-index.blade.php           # Trang dashboard tài khoản
├── user-profile.blade.php         # Trang hồ sơ thành viên
├── empty.blade.php                # Template trống
└── 404-error.blade.php            # Trang lỗi 404
```

---

## theme.json — Manifest

```json
{
    "name": "Theme Store",
    "description": "A theme store for your application.",
    "version": "5.0.0",
    "author": "SKD Software",
    "providers": [
        "Theme\\Providers\\ThemeServiceProvider"
    ],
    "autoload": {
        "psr-4": {
            "Theme\\Builders": "app\\Builders",
            "Theme\\Layouts":  "app\\Layouts",
            "Theme\\Custom":   "app\\Custom"
        }
    }
}
```

> **Lưu ý:** Namespace `Theme\*` (Services, Supports, Ajax, Modules…) được tự động register bởi CMS dựa trên thư mục `app/` của theme mà không cần khai báo trong `theme.json`.

---

## Cấu Trúc theme-child

> **Nguyên tắc theme-child:** Chỉ tạo file khi cần override. Không cần copy toàn bộ theme-store.

---

## bootstrap/config.php — Cấu hình chính

Đây là file quan trọng nhất của theme, được load đầu tiên.

```php
<?php
use SkillDo\Cms\Support\Theme;
use Theme\Supports\ThemeAutoloader;
use SkillDo\Cms\Menu\ThemeMenu;

Theme::config()
    ->booted('hooks', function (\SkillDo\Cms\Support\ThemeConfig $theme)
    {
        // ── AUTOLOAD COMPONENTS (widget, heading styles) ─────────
        $autoload = ThemeAutoloader::getInstance();
        // ... tự động load các component đang active
        $autoload->preloadFiles();

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
        add_action('theme_custom_css', [\Theme\Services\ThemeStyleService::class, 'postItemCss'], 999);
        add_action('cle_header', [\Theme\Services\ThemeStyleService::class, 'css'], 999);

        // ── SCRIPTS ──────────────────────────────────────────────
        add_action('theme_footer_script', [\Theme\Services\ThemeScriptService::class, 'googleFonts']);
        add_action('cle_header', [\Theme\Services\ThemeScriptService::class, 'headerScript'], 999);
        add_action('cle_footer', [\Theme\Services\ThemeScriptService::class, 'footerScript'], 999);

        // ── SIDEBARS ─────────────────────────────────────────────
        add_action('init', [\Theme\Services\ThemeSidebarService::class, 'register']);
        add_action('theme_sidebar_left',  [\Theme\Services\ThemeSidebarService::class, 'renderSidebarLeft']);
        add_action('theme_sidebar_right', [\Theme\Services\ThemeSidebarService::class, 'renderSidebarRight']);
        add_action('theme_custom_css',    [\Theme\Supports\ThemeSidebar::class, 'headingCss']);

        // ── HEADER BUILDER ───────────────────────────────────────
        add_action('theme_custom_assets',  [\Theme\Builders\ThemeHeader::class, 'assets'], 10, 2);
        add_action('cle_header_desktop',   [\Theme\Builders\ThemeHeader::class, 'render']);

        // ── HOME BUILDER ─────────────────────────────────────────
        if (Theme::isHome()) {
            add_action('theme_custom_assets', [\Theme\Builders\ThemeHome::class, 'assets'], 30, 2);
        }

        // ── WIDGET ASSETS ────────────────────────────────────────
        add_action('theme_custom_assets',         [\Theme\Services\ThemeWidgetService::class, 'styleAssets'], 10, 2);
        add_action('theme_custom_script_no_tag',  [\Theme\Services\ThemeWidgetService::class, 'scriptAssets']);

        // ── FOOTER BUILDER ───────────────────────────────────────
        add_action('theme_custom_assets', [\Theme\Builders\ThemeFooter::class, 'assets'], 10, 2);

        // ── MENU LOCATIONS ───────────────────────────────────────
        ThemeMenu::addLocation('mobile-nav', 'Menu mobile');
    });
```

---

## bootstrap/layout.php — Đăng ký Layout

```php
<?php
use SkillDo\Cms\Support\Theme;
use Theme\Layouts\PageDetail;
use Theme\Layouts\PostDetail;
use Theme\Layouts\PostIndex;
use Theme\Supports\ThemeLayout;

Theme::config()->booted('layout', function (\SkillDo\Cms\Support\ThemeConfig $theme)
{
    $theme->layouts([
        'home.index'          => 'template-home',
        'home.search'         => 'template-sidebar-none',
        'page.detail'         => ThemeLayout::layout('page')['template'] ?? '',
        'post.index'          => ThemeLayout::layout('post_category')['template'] ?? '',
        'post.detail'         => ThemeLayout::layout('post')['template'] ?? '',
        'products.index'      => ThemeLayout::layout('products_category')['template'] ?? '',
        'products.detail'     => ThemeLayout::layout('products')['template'] ?? 'template-full-width',
        'products.collection' => ThemeLayout::layout('products_collection')['template'] ?? '',
        'user.index'          => 'template-user',
        'user.password'       => 'template-user',
    ]);

    add_action('theme_init', function () {
        new PageDetail();
        new PostIndex();
        new PostDetail();
    }, 100);
});
```

**Các layout key:**

| Key | Mô tả |
|---|---|
| `home.index` | Trang chủ |
| `home.search` | Trang tìm kiếm |
| `page.detail` | Chi tiết trang tùy chỉnh |
| `post.index` | Danh sách bài viết |
| `post.detail` | Chi tiết bài viết |
| `products.index` | Danh sách sản phẩm |
| `products.detail` | Chi tiết sản phẩm |
| `products.collection` | Bộ sưu tập sản phẩm |
| `user.index` | Dashboard tài khoản |
| `user.password` | Đổi mật khẩu |

---

## Layout Files — Cấu trúc HTML

Mỗi layout là một file Blade đầy đủ HTML:

```blade
{{-- layouts/template-sidebar-right.blade.php --}}
<!DOCTYPE html>
<html lang="{{Language::current()}}" @do_action('in_tag_html')>
    {!! Theme::partial('resources/common/head') !!}
    <body @do_action('in_tag_body')>
        {!! Theme::partial('resources/layout/header') !!}

        <div class="container">
            <div class="row">
                <div class="col-lg-9">
                    {!! Theme::content() !!}  {{-- Nội dung trang --}}
                </div>
                <div class="col-lg-3 sidebar">
                    {!! Theme::partial('resources/layout/sidebar-right') !!}
                </div>
            </div>
        </div>

        @do_action('template_wrapper_after')

        {!! Theme::partial('resources/layout/footer') !!}
    </body>
</html>
```

### Theme Helpers

| Helper | Mô tả |
|---|---|
| `Theme::content()` | Render nội dung trang hiện tại |
| `Theme::partial('path/view')` | Include partial view (theme-child → theme-store) |
| `Theme::isHome()` | Kiểm tra đang ở trang chủ |
| `Theme::name()` | Tên thư mục theme đang active |
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

| Hook                         | Thời điểm                  | Ví dụ sử dụng                     |
|------------------------------|----------------------------|-----------------------------------|
| `cle_header`                 | Trong `<head>`             | Thêm CSS, meta tags               |
| `cle_header_desktop`         | Render header desktop      | Inject HTML header                |
| `cle_footer`                 | Cuối `<body>`              | Thêm JS scripts                   |
| `theme_init`                 | Theme khởi tạo             | Đăng ký assets, layout            |
| `theme_custom_assets`        | Load assets tùy chỉnh      | Đăng ký assets theo trang         |
| `theme_custom_css`           | CSS tùy chỉnh              | Custom CSS rules, sidebar heading |
| `theme_custom_script_no_tag` | Script không có tag        | Widget script assets              |
| `theme_footer_script`        | Script footer              | Google Fonts, GTM                 |
| `in_tag_html`                | Trong `<html>`             | Thêm attributes                   |
| `in_tag_body`                | Trong `<body>`             | Thêm class, data                  |
| `theme_sidebar_left`         | Render sidebar trái        | Custom widgets                    |
| `theme_sidebar_right`        | Render sidebar phải        | Custom widgets                    |
| `template_wrapper_before`    | Trước content              | Inject HTML                       |
| `template_wrapper_after`     | Sau content                | Inject HTML                       |
| `theme_account_sidebar`      | Khởi tạo sidebar tài khoản | Thêm menu tài khoản               |
| `theme_account_init`         | Khởi tạo trang tài khoản   | Custom logic tài khoản            |

---

## Theme Partial Functions

### `Theme::partial(string $path): string`
Include partial view, ưu tiên theme-child trước theme-store.

```blade
{!! Theme::partial('resources/common/head') !!}
{!! Theme::partial('resources/layout/header') !!}
{!! Theme::partial('resources/layout/footer') !!}
{!! Theme::partial('resources/layout/sidebar-right') !!}
{!! Theme::partial('resources/mobile/mobile-header') !!}
{!! Theme::partial('include/loop/item_post', ['post' => $post]) !!}
```

### `theme_include(string $file): mixed`
Include PHP file từ thư mục theme (ưu tiên theme-child).

```php
theme_include('app/Options/general.php');
```
