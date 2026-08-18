# Kiến Trúc Hệ Thống

## Biểu Đồ Tổng Quan

```
                    ┌───────────────────────────────┐
                    │        HTTP Request           │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │         index.php             │
                    │   require bootstrap/app.php   │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │      Application::configure() │
                    │     ┌───────────────────────┐ │
                    │     │   withRouting()       │ │
                    │     │   withMiddleware()    │ │
                    │     │   create()            │ │
                    │     └───────────────────────┘ │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │       Kernel::handle()        │
                    │                               │
                    │  ┌──────────────────────────┐ │
                    │  │   Bootstrap Pipeline     │ │
                    │  │  1. LoadEnvVariables     │ │
                    │  │  2. HandleExceptions     │ │
                    │  │  3. LoadConfiguration    │ │
                    │  │  4. RegisterFacades      │ │
                    │  │  5. RegisterMacros       │ │
                    │  │  6. RegisterProviders    │ │
                    │  │  7. BootProviders        │ │
                    │  └──────────────────────────┘ │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │   Global Middleware Pipeline  │
                    │                               │
                    │  ValidatePostSize             │
                    │  HandleCors                   │
                    │  SecurityHeaders              │
                    │  RequestSanitizer             │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼─────────────────┐
                    │       Router::dispatch()        │
                    │                                 │
                    │  Match route → middleware group │
                    └────┬────────────────────────┬───┘
                         │                        │
              ┌──────────────────────┐  ┌───────────────────┐
              │      Web Group       │  │     API Group     │
              │                      │  │                   │
              │ TrailingSlash        │  │ StartSession      │
              │ StartSession         │  │                   │
              │ CheckInstallation    │  │                   │
              │ CheckDatabaseVersion │  │                   │
              │ VerifyCsrfToken      │  │                   │
              │ SetLanguage          │  │                   │
              └──────────┬───────────┘  └─────────┬─────────┘
                         │                        │
              ┌──────────▼───────────┐  ┌─────────▼─────────┐
              │   Route Middleware   │  │  Route Middleware │
              │   (auth, etc.)       │  │  (jwt, api-key,   │
              │                      │  │   api.auth)       │
              └──────────┬───────────┘  └─────────┬─────────┘
                         │                        │
              ┌──────────▼────────────────────────▼─────────┐
              │             Controller@method()             │
              └──────────────────────┬──────────────────────┘
                                     │
              ┌──────────────────────▼──────────────────────┐
              │              Response::send()               │
              └─────────────────────────────────────────────┘
```

Ghi chú:

- Tên đầy đủ của các bootstrapper (namespace `SkillDo\Bootstrap\*`, khai báo trong `Http\Kernel::$bootstrappers`): `LoadEnvironmentVariables` → `HandleExceptions` → `LoadConfiguration` → `RegisterFacades` → `RegisterMacros` → `RegisterProviders` → `BootProviders`.
- `HandleExceptions` cài đặt error/exception/shutdown handler và dùng **Spatie Ignition** để render trang lỗi.
- Sau khi `Response::send()` hoàn tất, `Application::handleRequest()` bắn hook `do_action('shutdown', $response, $request)`.
- Toàn bộ flow được kích hoạt từ `index.php` → `bootstrap/app.php` → `$app->handleRequest($request)`.

## Package Dependencies

```
┌──────────────────────────────────────────────┐
│              Application Layer               │
│                                              │
│   app/Controllers/    routes/    views/      │
│   config/            bootstrap/              │
└──────────────────┬───────────────────────────┘
                   │ uses
┌──────────────────▼──────────────────────────────┐
│                                                 │
│   ┌──────────────────┐  ┌─────────────────┐     │
│   │   CMS Package    │  │  API Module     │     │
│   │   skilldo/cms    │  │  (framework)    │     │
│   │                  │  │                 │     │
│   │ SkillDo\Cms\*    │  │ SkillDo\Api\*   │     │
│   │                  │  │                 │     │
│   │ • Models         │  │ • JWT Auth      │     │
│   │ • Hooks          │  │ • API Key Auth  │     │
│   │ • Plugins        │  │ • Tokens        │     │
│   │ • Forms/Tables   │  │ • Repositories  │     │
│   │ • Roles          │  │                 │     │
│   │ • Theme/Widget   │  └────────┬────────┘     │
│   └────────┬─────────┘           │              │
│            │                     │              │
│            │     depends on      │              │
│   ┌────────▼─────────────────────▼───────────┐  │
│   │         Framework Package                │  │
│   │         skilldo/framework                │  │
│   │                                          │  │
│   │  SkillDo\*                               │  │
│   │                                          │  │
│   │  Application  Container  ServiceProvider │  │
│   │  Http         Routing    Database        │  │
│   │  Cache        Session    Filesystem      │  │
│   │  Validate     View       Translation     │  │
│   │  Log          Support    Facades         │  │
│   └──────────────────┬───────────────────────┘  │
│                      │                          │
└──────────────────────┼──────────────────────────┘
                       │ built on
┌──────────────────────▼───────────────────────────┐
│         Illuminate Components (Laravel 12)       │
│                                                  │
│  Container  Events  Routing  Http  View          │
│  Database  Validation  Filesystem  Session       │
│  Config  Console  Support                        │
└──────────────────────────────────────────────────┘
```

## Service Provider Registration Order

Bootstrapper `RegisterProviders` luôn merge 6 provider nền của framework vào **đầu** danh sách `config('app.providers')` (danh sách này mặc định chỉ gồm `ApiServiceProvider` + `CmsServiceProvider`, khai báo trong `packages/skilldo/framework/src/config/app.php`). Sau đó `Application::registerConfiguredProviders()` gọi `register()` theo đúng thứ tự:

```
1. SkillDo\Session\SessionServiceProvider          ← singleton 'session'
2. SkillDo\Filesystem\FileSystemServiceProvider    ← singleton 'files', 'filesystem'
3. SkillDo\Log\LogServiceProvider                  ← singleton 'log'
4. SkillDo\Database\DatabaseServiceProvider        ← kết nối Eloquent, bind 'db'
5. SkillDo\View\ViewServiceProvider                ← singleton 'view' (BladeOne)
6. SkillDo\Translation\TranslationServiceProvider  ← singleton 'translator'
--- tiếp theo: config('app.providers') ---
7. SkillDo\Api\ApiServiceProvider                  ← config jwt, middleware alias: jwt, api-key, api.auth
8. SkillDo\Cms\Providers\CmsServiceProvider        ← aliases CMS + đăng ký lồng các provider con:
   ├── SkillDo\Cms\Hooks\HookServiceProvider           ← Action/Filter hooks
   ├── SkillDo\Cms\Providers\SystemServiceProvider
   ├── SkillDo\Cms\Providers\PluginServiceProvider     ← chỉ khi config('cms.plugins.use')
   ├── SkillDo\Cms\Providers\LanguageServiceProvider
   ├── SkillDo\Cms\Providers\TaxonomyServiceProvider   ← chỉ khi config('cms.admin.use')
   ├── SkillDo\Cms\Providers\TemplateServiceProvider
   ├── SkillDo\Cms\Providers\AjaxServiceProvider
   ├── SkillDo\Cms\Providers\AgentServiceProvider
   ├── SkillDo\Cms\Roles\RoleServiceProvider
   └── SkillDo\Cms\Providers\CmsRouteServiceProvider
```

Ngoài danh sách trên, `SkillDo\Routing\RouteServiceProvider` được đăng ký qua callback `booting()` (cài đặt sẵn trong `ApplicationBuilder::withRouting()`), tức chạy ở **đầu giai đoạn boot** — nạp các file route (`routes/admin.php`, `routes/web.php` vào group `web`; `routes/api.php` vào group `api` với prefix `api`) trước khi các provider khác `boot()`. Middleware alias `auth`/`guest` do `CmsServiceProvider` đăng ký.