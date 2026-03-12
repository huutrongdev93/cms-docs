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
                    └───────┬───────────┬─────────────┘
                            │           │
              ┌─────────────▼───┐  ┌─────▼───────────┐
              │   Web Group     │  │   API Group     │
              │                 │  │                 │
              │ StartSession    │  │ StartSession    │
              │ VerifyCsrfToken │  │                 │
              │ SetLanguage     │  │                 │
              └────────┬────────┘  └────────┬────────┘
                       │                    │
              ┌────────▼────────┐  ┌────────▼──────────┐
              │ Route Middleware │  │ Route Middleware │
              │ (auth, etc.)    │  │ (jwt, api-key,    │
              │                 │  │  api.auth)        │
              └────────┬────────┘  └────────┬──────────┘
                       │                    │
              ┌────────▼────────────────────▼────────┐
              │         Controller@method()          │
              └────────────────┬─────────────────────┘
                               │
              ┌────────────────▼─────────────────────┐
              │           Response::send()           │
              └──────────────────────────────────────┘
```

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
│  Container  Routing  Database  Http  Events      │
│  Config     Session  Filesystem  Translation     │
│  Support    Log      Encryption  Hashing         │
└──────────────────────────────────────────────────┘
```

## Service Provider Registration Order

```
1. ApiServiceProvider          ← config jwt, middleware aliases, migration
2. CmsServiceProvider          ← CMS core: models, hooks, plugins, themes
   ├── DatabaseServiceProvider ← Database connection
   ├── SessionServiceProvider  ← Session management
   ├── ViewServiceProvider     ← BladeOne template engine
   ├── TranslationProvider     ← Multi-language
   ├── FilesystemProvider      ← Storage
   ├── HookServiceProvider     ← Action/Filter hooks
   └── PluginServiceProvider   ← Load all plugins
```