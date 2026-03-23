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
    "providers": [
        "Theme\\Providers\\ThemeServiceProvider"
    ],
    "aliases": {
        "middlewares": {
            "theme.auth": "Theme\\Middlewares\\ThemeAuthMiddleware"
        }
    },
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

| Khối                  | Mô tả                                                                               |
|-----------------------|-------------------------------------------------------------------------------------|
| `providers`           | Danh sách Service Provider sẽ được tự động `register()` và `boot()`                 |
| `aliases.middlewares` | Đăng ký alias ngắn gọn cho Middleware, dùng được trong `->middleware('theme.auth')` |
| `middlewares.groups`  | Gán Middleware vào nhóm route (`web` / `api`) — chạy trên mọi request thuộc nhóm đó |
| `cms.form.popover`    | Đăng ký Popover Handle tuỳ chỉnh cho Form Builder Admin                             |
| `cms.form.fields`     | Đăng ký Custom Field tuỳ chỉnh cho Form Builder Admin                               |

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

Khi file này tồn tại, CMS sẽ **override** (ghi đè) các key trùng từ `theme-store/theme.json`. Dùng khi bạn muốn thay thế hoàn toàn một provider hay popover của theme gốc.

```json
{
    "providers": [
        "Theme\\Providers\\ThemeServiceProvider",
        "ThemeChild\\Providers\\ChildServiceProvider"
    ],
    "cms": {
        "form": {
            "popover": {
                "themeProducts": "ThemeChild\\Cms\\Form\\Popovers\\OverrideProductsPopover"
            }
        }
    }
}
```

> Khi sử dụng `theme-child/theme.json`, toàn bộ khối `providers` của theme-store bị **thay thế** — vì vậy bạn cần khai báo lại đầy đủ các provider cần thiết.

---

## 5. `theme-child.json` trong Theme-Child (Bổ Sung)

Đặt tại: `views/theme-child/theme-child.json`

Đây là file **chỉ bổ sung thêm** — các key đã tồn tại trong `theme-store/theme.json` sẽ **không bị ghi đè**. Dùng khi bạn chỉ muốn thêm provider, middleware hoặc popover mới mà không ảnh hưởng đến theme gốc.

```json
{
    "providers": [
        "ThemeChild\\Providers\\ChildServiceProvider"
    ],
    "middlewares": {
        "groups": {
            "web": [
                "ThemeChild\\Middlewares\\ChildSetupMiddleware"
            ]
        }
    },
    "cms": {
        "form": {
            "popover": {
                "childSpecialPopover": "ThemeChild\\Cms\\Form\\Popovers\\ChildSpecialPopover"
            }
        }
    }
}
```

---

## 6. So Sánh `theme.json` (child) vs `theme-child.json`

| Tính năng                          | `theme-child/theme.json` | `theme-child/theme-child.json` |
|------------------------------------|:------------------------:|:------------------------------:|
| Override key trùng với theme-store |           ✅ Có           |            ❌ Không             |
| Bổ sung key mới                    |           ✅ Có           |              ✅ Có              |
| Thích hợp cho                      |  Thay thế cấu hình gốc   |     Mở rộng thêm tính năng     |

---

## 7. Namespace Chuẩn Cho Code Trong Theme

Khi khai báo class trong `theme.json`, namespace phải khớp với cấu trúc thư mục:

| Namespace                                   | Đường dẫn file                                               |
|---------------------------------------------|--------------------------------------------------------------|
| `Theme\Providers\ThemeServiceProvider`      | `views/theme-store/app/Providers/ThemeServiceProvider.php`   |
| `Theme\Middlewares\ThemeSetupMiddleware`    | `views/theme-store/app/Middlewares/ThemeSetupMiddleware.php` |
| `Theme\Cms\Form\Popovers\MyPopover`         | `views/theme-store/app/Cms/Form/Popovers/MyPopover.php`      |
| `Theme\Cms\Form\Field\MyField`              | `views/theme-store/app/Cms/Form/Field/MyField.php`           |
| `ThemeChild\Providers\ChildServiceProvider` | `views/theme-child/app/Providers/ChildServiceProvider.php`   |

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

