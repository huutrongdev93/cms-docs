# Theme.json & Theme-Child.json

Trong SkillDo CMS v8, ngoài cách cấu hình theme qua `bootstrap/config.php` (PHP), bạn còn có thể khai báo cấu hình qua **file JSON**. Đây là cách tinh gọn và được ưu tiên cho các khai báo tĩnh như providers, middlewares, popover và form fields.

---

## 1. Tổng Quan Thứ Tự Nạp

Hệ thống CMS đọc và hợp nhất dữ liệu theo thứ tự sau trong mỗi lần khởi động:

```
1. views/theme-store/theme.json       ← base (theme chính)
2. views/theme-child/theme.json       ← override (ghi đè lên theme chính khi trùng key)
3. views/theme-child/theme-child.json ← bổ sung (chỉ thêm key mới, không override)
```

Sau đó dữ liệu JSON được hợp nhất tiếp với cấu hình từ `app('themeConfig')` (bootstrap/config.php).

---

## 2. Cấu Trúc Đầy Đủ của `theme.json`

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
            "Theme\\Layouts": "app\\Layouts"
        }
    },
    "middlewares": {
        "global": [],
        "aliases": {
            "theme.auth": "Theme\\Middlewares\\ThemeAuthMiddleware"
        },
        "groups": {
            "web": [
                "Theme\\Middlewares\\ThemeSetupMiddleware"
            ]
        }
    },
    "includes": [],
    "cms": {
        "form": {
            "popover": {
                "myThemePopover": "Theme\\Cms\\Form\\Popovers\\MyThemePopover"
            },
            "fields": {
                "myThemeField": {
                    "class": "Theme\\Cms\\Form\\Field\\MyThemeField"
                }
            }
        }
    }
}
```

### Giải thích từng khối

| Khối                     | Mô tả                                                                               |
|--------------------------|-------------------------------------------------------------------------------------|
| `name` / `description` / `version` / `author` | Thông tin hiển thị của theme |
| `providers`              | Danh sách Service Provider sẽ được tự động `register()` và `boot()`                 |
| `autoload.psr-4`         | Map namespace → thư mục **ngoài** danh sách PSR-4 mặc định (xem mục 7)              |
| `middlewares.global`     | Middleware chạy trên **mọi** request, trước cả bước match route                      |
| `middlewares.aliases`    | Alias ngắn gọn cho Middleware, dùng trong `->middleware('theme.auth')`              |
| `middlewares.groups`     | Gán Middleware vào nhóm route (`web` / `api`)                                       |
| `includes`               | Danh sách file được `include` thêm khi nạp theme                                    |
| `cms.form.popover`       | Đăng ký Popover tuỳ chỉnh cho Form Builder Admin                                    |
| `cms.form.fields`        | Đăng ký Custom Field tuỳ chỉnh cho Form Builder Admin                               |

> [!NOTE]
> Dạng cũ `"aliases": { "middlewares": { … } }` (alias ở **cấp cao nhất**) vẫn được chấp nhận: khi nạp xong, Loader gộp nó vào `middlewares.aliases`, và khi trùng key thì `middlewares.aliases` thắng. Với code mới hãy dùng `middlewares.aliases`.

---

## 3. `theme.json` trong Theme-Store (Theme Chính)

Đặt tại: `views/theme-store/theme.json`

Đây là file cấu hình **base** của theme chính. Tất cả khai báo ở đây áp dụng cho toàn bộ hệ thống khi theme-store đang active.

```json
{
    "providers": [
        "Theme\\Providers\\ThemeServiceProvider"
    ],
    "middlewares": {
        "groups": {
            "web": [
                "Theme\\Middlewares\\ThemeSetupMiddleware"
            ]
        }
    },
    "cms": {
        "form": {
            "popover": {
                "themeProducts": "Theme\\Cms\\Form\\Popovers\\ThemeProductsPopover"
            }
        }
    }
}
```

---

## 4. `theme.json` trong Theme-Child (Ghi Đè)

Đặt tại: `views/theme-child/theme.json`

Khi file này tồn tại, CMS nạp nó **sau** `theme-store/theme.json` ở chế độ `override: true` — tức là **popover / form field trùng key sẽ bị thay thế** bằng khai báo của theme con. Dùng khi bạn muốn ghi đè một popover hoặc form field của theme gốc.

```json
{
    "providers": [
        "Theme\\Providers\\ThemeServiceProvider",
        "Theme\\Providers\\ChildServiceProvider"
    ],
    "cms": {
        "form": {
            "popover": {
                "themeProducts": "Theme\\Cms\\Form\\Popovers\\OverrideProductsPopover"
            }
        }
    }
}
```

> [!IMPORTANT]
> **`providers` không bao giờ bị thay thế** — Loader luôn **cộng dồn** provider của cả ba file (`$collected['providers'][] = …`). Vì vậy trong `theme-child/theme.json` bạn **chỉ cần khai provider mới**, không phải chép lại provider của theme-store. Khai lại cũng vô hại vì danh sách được lọc trùng khi nạp.
>
> Điều này cũng đúng với `autoload.psr-4`, `middlewares.*` và `includes` — tất cả đều gộp thêm chứ không ghi đè khối.

---

## 5. `theme-child.json` trong Theme-Child (Bổ Sung)

Đặt tại: `views/theme-child/theme-child.json`

File này được nạp cuối cùng ở chế độ `override: false` — popover / form field **trùng key sẽ bị bỏ qua**, chỉ key mới được thêm vào. Dùng khi bạn muốn chắc chắn không vô tình đè lên khai báo của theme gốc.

```json
{
    "providers": [
        "Theme\\Providers\\ChildServiceProvider"
    ],
    "middlewares": {
        "groups": {
            "web": [
                "Theme\\Middlewares\\ChildSetupMiddleware"
            ]
        }
    },
    "cms": {
        "form": {
            "popover": {
                "childSpecialPopover": "Theme\\Cms\\Form\\Popovers\\ChildSpecialPopover"
            }
        }
    }
}
```

---

## 6. So Sánh `theme.json` (child) vs `theme-child.json`

Cả hai file đều được nạp; khác biệt **chỉ nằm ở hai khối `cms.form.popover` và `cms.form.fields`**:

| Khối trong JSON | `theme-child/theme.json` | `theme-child/theme-child.json` |
|---|:---:|:---:|
| `cms.form.popover` | **Ghi đè** key trùng của theme-store | Chỉ thêm key mới, **giữ nguyên** key trùng |
| `cms.form.fields` | **Ghi đè** key trùng | Chỉ thêm key mới |
| `providers` | Cộng dồn | Cộng dồn |
| `autoload.psr-4` | Cộng dồn | Cộng dồn |
| `middlewares.*` | Cộng dồn | Cộng dồn |
| `includes` | Cộng dồn | Cộng dồn |

Nói cách khác: dùng `theme-child/theme.json` khi cần **thay thế** một popover / form field của theme gốc; dùng `theme-child.json` khi chỉ muốn **thêm** mà chắc chắn không đụng vào cái có sẵn.

---

## 7. Namespace Chuẩn Cho Code Trong Theme

> [!IMPORTANT]
> **Theme cha và theme con dùng CHUNG một prefix `Theme\`** — không có namespace `ThemeChild\`. Loader map mỗi namespace con tới **hai** thư mục: `views/<theme-child>/app/...` trước, rồi `views/theme-store/app/...`. Class nằm ở theme con vì thế tự động ghi đè class cùng tên ở theme cha.

Chín namespace con được map sẵn (không cần khai `autoload`):

`Theme\Ajax`, `Theme\Cms`, `Theme\Controllers`, `Theme\Middlewares`, `Theme\Providers`, `Theme\Modules`, `Theme\Supports`, `Theme\Models`, `Theme\Services` → `app/{Ajax,Cms,Controllers,Middlewares,Providers,Modules,Supports,Models,Services}/`

| Namespace                                | Tìm ở (theo thứ tự)                                            |
|------------------------------------------|-----------------------------------------------------------------|
| `Theme\Providers\ThemeServiceProvider`   | `views/theme-child/app/Providers/…` → `views/theme-store/app/Providers/…` |
| `Theme\Middlewares\ThemeSetupMiddleware` | `views/theme-child/app/Middlewares/…` → `views/theme-store/app/Middlewares/…` |
| `Theme\Cms\Form\Popovers\MyPopover`      | `…/app/Cms/Form/Popovers/MyPopover.php`                          |
| `Theme\Cms\Form\Field\MyField`           | `…/app/Cms/Form/Field/MyField.php`                               |
| `Theme\Providers\ChildServiceProvider`   | Provider **riêng của theme con**: `views/theme-child/app/Providers/ChildServiceProvider.php` |

Namespace **ngoài** chín cái trên (ví dụ `Theme\Builders`, `Theme\Layouts`) phải khai trong `autoload.psr-4` của `theme.json` — như theme-store đang làm.

> `app/Macros` và `app/helpers` được **nạp theo từng file**, không qua PSR-4, nên file trong đó **không đặt namespace**.

---

## 8. Kết Hợp JSON và bootstrap/config.php

Khai báo qua `theme.json` và qua `bootstrap/config.php` (PHP) **bổ sung cho nhau** — không loại trừ:

```php
// bootstrap/config.php — vẫn dùng được song song với theme.json
Theme::config()
    ->providers([
        ThemeServiceProvider::class
    ])
    ->booted('hooks', function (\SkillDo\Cms\Support\ThemeConfig $theme) {
        // hooks, assets...
    });
```

```json
// theme.json — khai báo tĩnh, không cần viết PHP
{
    "middlewares": {
        "groups": {
            "web": ["Theme\\Middlewares\\ThemeSetupMiddleware"]
        }
    }
}
```

> **Khuyến nghị:** Dùng `theme.json` cho các khai báo tĩnh (providers, middlewares, popover). Dùng `bootstrap/config.php` cho logic động (hooks, layouts, sidebars).

