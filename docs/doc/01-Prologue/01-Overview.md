# Tổng Quan

SkillDo CMS là một hệ thống quản trị nội dung (CMS) được phát triển bởi Sikido — hướng tới việc xây dựng website doanh nghiệp, thương mại điện tử, và blog một cách nhanh chóng, dễ mở rộng. Dự án sử dụng kiến trúc modular với hệ thống Plugin và Theme linh hoạt, lấy cảm hứng từ kiến trúc của Laravel nhưng được tùy biến sâu với framework riêng mang tên SkillDo Framework.
>
SkillDo v8 là bản tái kiến trúc toàn diện trên nền tảng Illuminate Components (Laravel 12), tách biệt hoàn toàn hai lớp Framework và CMS thành hai package độc lập thông qua Composer PSR-4 autoload.

## Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                    │
│              app/Controllers, routes/, views/           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │     CMS Package     │  │     API Module           │  │
│  │  SkillDo\Cms\*      │  │  SkillDo\Api\*           │  │
│  │                     │  │                          │  │
│  │  • Models (User,    │  │  • JWT Authentication    │  │
│  │    Post, Page...)   │  │  • API Key Management    │  │
│  │  • Hooks System     │  │  • Token Repositories    │  │
│  │  • Plugin System    │  │  • Middlewares           │  │
│  │  • Theme/Template   │  │                          │  │
│  │  • Form/Table       │  └──────────────────────────┘  │
│  │  • Widget/Element   │                                │
│  │  • Taxonomy/Roles   │                                │
│  └──────────┬──────────┘                                │
│             │ depends on                                │
│  ┌──────────▼──────────────────────────────────────────┐│
│  │              Framework Package                      ││
│  │              SkillDo\*                              ││
│  │                                                     ││
│  │  • Application / Container (IoC)                    ││
│  │  • HTTP (Request, Response, Kernel)                 ││
│  │  • Routing (Route, Router, Middleware Pipeline)     ││
│  │  • Database (Eloquent ORM, Query Builder, Schema)   ││
│  │  • Cache, Session, Filesystem, View                 ││
│  │  • Validation, Translation, Logging                 ││
│  │  • Service Providers, Facades                       ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
├─────────────────────────────────────────────────────────┤
│           Illuminate Components (Laravel 12)            │
│      Container, Routing, Database, HTTP, Events...      │
└─────────────────────────────────────────────────────────┘
```

## Cấu Trúc Thư Mục Dự Án
```
sourcev8/
├── app/                         # Application layer
│   └──Controllers/
│      ├── Admin/                # controllers quản trị
│      ├── Api/                  # API controllers (Auth, ApiKey)
│      └── Web/                  # controllers frontend
│
├── bootstrap/                    # Khởi tạo ứng dụng
│   ├── app.php                   # Cấu hình Application + Routing + Middleware
│   ├── autoload.php
│   └── cache/                    # Config cache, route cache
│
├── config/                       # Cấu hình hệ thống
│   ├── app.php                   # Providers, aliases, timezone, debug
│   ├── cache.php                 # File / Redis / Memcached
│   ├── cms.php                   # CMS core: admin, plugin, theme, user, widget
│   ├── cors.php                  # CORS policy
│   ├── csrf.php                  # CSRF protection
│   ├── database.php              # MySQL connection
│   ├── filesystems.php           # Local disk definitions
│   ├── language.php              # i18n config (vi, en)
│   ├── media.php                 # Media settings
│   ├── request-sanitizer.php     # XSS input sanitization
│   └── security-headers.php      # CSP, X-Frame, X-XSS headers
│
├── language/                     # Tệp ngôn ngữ
│   ├── en/
│   └── vi/
│
├── packages/                     # Packages nội bộ (core)
│   └── skilldo/
│      ├── framework/            # ⭐ SkillDo Framework (core engine)
│      └── cms/                  # ⭐ SkillDo CMS Module
│
├── plugins/                      # plugins mở rộng
│
├── routes/                       # Định tuyến
│   ├── admin.php                 # Admin routes (prefix: /admin)
│   ├── api.php                   # API routes (JWT + API Key)
│   └── web.php                   # Frontend routes
│
├── storage/                      # Lưu trữ runtime
│   ├── autoload/
│   ├── cms/
│   ├── framework/
│   ├── logs/
│   └── uploads/
│
├── views/                        # Templates
│   ├── admin/                    # Admin UI (Blade templates)
│   ├── theme-store/              # Theme chính (frontend)
│   └── theme-child/              # Theme con (override)
│
├── vendor/                       # Composer dependencies
├── node_modules/                 # NPM dependencies
│
├── .env                          # Environment variables
├── .htaccess                     # Apache rewrite rules
├── composer.json                 # PHP dependencies
├── package.json                  # JS dependencies
└── index.php                     # Entry point
```
>
Created: `01/01/2017`
>
By: [Sikido Technologies](https://sikido.vn)
>
Email: kythuat@sikido.com
>

Thank you for purchasing this CMS. If you have any questions that are beyond the scope of this help file, please feel free to email via my user page contact form here for quickly support. Thank you so much!
:::warning
Skilldo là cms do bộ phận SKDTeam phát triển nhằm mục đích phát triển sản phẩm và sử dụng nội bộ của công ty Siêu Kinh Doanh. Nên bạn sẽ không thể download hay nhận được bất kì hướng dẫn nào nếu bạn không phải là nhân viên SKD.
:::
