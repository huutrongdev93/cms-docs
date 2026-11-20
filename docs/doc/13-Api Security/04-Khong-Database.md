# Chạy Không Cần Database

Có những site chỉ cần vài endpoint API đơn giản: nhận webhook, chuyển tiếp request sang dịch vụ khác, trả cấu hình tĩnh cho app mobile… Những site này không cần trang quản trị, theme hay plugin, và cũng không cần cơ sở dữ liệu.

Trước đây, kể cả khi đã tắt admin, theme và plugin trong config, CMS vẫn bắt kết nối database và đẩy mọi truy cập về trang cài đặt `/install`. Từ **8.7.1**, chỉ cần một dòng trong `.env`.

---

## 1. Bật chế độ

Trong file `.env`:

```dotenv
DB_ENABLED=false
```

Các biến `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`… bị bỏ qua, có thể để trống. Không cần chạy `/install`.

Muốn quay lại chạy bình thường thì đổi thành `DB_ENABLED=true` (hoặc xoá dòng này, mặc định là `true`).

Kiểm tra trong code:

```php
use SkillDo\Database\DB;

if (DB::enabled())
{
    // site có database
}
```

---

## 2. Khi tắt database, hệ thống thay đổi những gì

| Thành phần | Hành vi |
|---|---|
| Kết nối database | Không mở. Mọi lệnh đi qua database (`DB::table()`, `schema()`, Model Eloquent) **ném `RuntimeException`** với thông báo nhắc `DB_ENABLED=false` |
| Trang cài đặt `/install`, `/upgrade` | Không còn. Hệ thống coi như đã cài đặt, không kiểm tra phiên bản database |
| Admin, plugin, theme | **Tự tắt**, kể cả khi `cms.admin.use`, `cms.plugins.use`, `cms.theme.use` đang là `true`, vì cả ba đều lưu dữ liệu trong database |
| Route | Chỉ nạp **`routes/api.php`**. Không có `routes/admin.php`, `routes/web.php`, `/ajax`, OAuth, trang theo slug |
| Đường dẫn không khớp route nào | Trả **404 dạng JSON** (thay cho trang 404 của theme) |
| `Option::get($name, $default)` | Luôn trả `$default` |
| `Option::update()` / `add()` / `delete()` | Ném lỗi (không có nơi lưu) |
| Cache, Session, View (BladeOne), Validate, Http client, Log | Vẫn dùng bình thường (lưu file trong `storage/`) |

Phản hồi 404 có cùng khuôn với `response()->error()`:

```json
{"data":[],"status":"error","code":"404","message":"Not Found"}
```

---

## 3. Viết endpoint

Khai route trong `routes/api.php` như bình thường. Lưu ý: file này **không tự gắn tiền tố** `/api`, hãy tự viết đầy đủ đường dẫn.

```php
use SkillDo\Support\Facades\Route;

// GET /api/ping
Route::get('api/ping', 'App\Controllers\Api\PingController@index');

// POST /api/webhook
Route::post('api/webhook', 'App\Controllers\Api\PingController@webhook');
```

Controller đặt ở `app/Controllers/Api/`:

```php
namespace App\Controllers\Api;

use Illuminate\Http\JsonResponse;
use SkillDo\Http\Request;
use SkillDo\Validate\Rule;

class PingController
{
    // Trả mảng: router tự đổi sang JSON, status 200
    public function index(Request $request): array
    {
        return [
            'status' => 'success',
            'time'   => date('c'),
        ];
    }

    public function webhook(Request $request)
    {
        $validate = $request->validate([
            'event' => Rule::make('Sự kiện')->notEmpty(),
        ]);

        if ($validate->fails())
        {
            response()->error($validate->errors());
        }

        // Ghi log ra file thay vì database
        \Log::info('webhook', $request->all());

        // Cần status khác 200 thì trả JsonResponse, status được giữ nguyên
        return new JsonResponse(['status' => 'success'], 202);
    }
}
```

`response()->success()` / `response()->error()` vẫn dùng được như trong bài [Xây Dựng RESTful API](./01-Restful-API.md).

---

## 4. Xác thực khi không có database

Middleware `jwt`, `api-key`, `api.auth` và OAuth đều lưu token trong database nên **không dùng được** ở chế độ này. Cách đơn giản nhất là so một khoá bí mật đặt trong `.env`.

**Bước 1.** Khai khoá trong `.env`:

```dotenv
API_STATIC_KEY=mot-chuoi-ngau-nhien-du-dai
```

**Bước 2.** Đưa khoá vào config, tạo file `config/api.php` ở thư mục gốc:

```php
<?php

return [
    'static_key' => env('API_STATIC_KEY', ''),
];
```

Không gọi thẳng `env()` trong middleware: khi tắt debug, config được cache và `.env` không còn được đọc ở mỗi request, `env()` sẽ trả rỗng.

**Bước 3.** Tạo middleware `app/Http/Middleware/StaticApiKey.php`:

```php
namespace App\Http\Middleware;

use Illuminate\Http\JsonResponse;
use SkillDo\Http\Request;

class StaticApiKey
{
    public function handle(Request $request, \Closure $next)
    {
        $key = (string) config('api.static_key');

        // hash_equals: so sánh thời gian hằng, không lộ khoá qua thời gian phản hồi
        if ($key === '' || !hash_equals($key, (string) $request->header('X-API-Key')))
        {
            return new JsonResponse([
                'data'    => [],
                'status'  => 'error',
                'code'    => '401',
                'message' => 'Unauthorized',
            ], 401);
        }

        return $next($request);
    }
}
```

**Bước 4.** Gắn vào route bằng tên class:

```php
use App\Http\Middleware\StaticApiKey;

Route::middleware(StaticApiKey::class)->group(function () {
    Route::post('api/webhook', 'App\Controllers\Api\PingController@webhook');
});
```

Client gửi khoá trong header `X-API-Key: mot-chuoi-ngau-nhien-du-dai`.

---

## 5. Lưu ý

- **Route có sẵn trong `routes/api.php` cần database**: `api/auth/login`, `api/auth/refresh`, `api/auth/current`, `api/auth/logout`, `keys/*` và `schedule-run`. Gọi tới sẽ ra lỗi. Có thể xoá các route này khỏi file nếu không dùng.
- **Route 404 nhận mọi method**: route chỉ khai `post` mà gọi bằng `GET` sẽ nhận 404 chứ không phải 405.
- **Lỗi khi lỡ dùng database** là `RuntimeException`. Bật `APP_DEBUG=true` để xem dòng code nào gọi tới.
- **Config cache**: khi `APP_DEBUG=false`, `bootstrap/cache/config.php` lưu luôn trạng thái `DB_ENABLED`. Sửa `.env` thì cache tự làm mới, nhưng đừng chép file cache từ site khác sang.
- **Không có trang quản trị** để xem log hay đổi cấu hình. Log nằm trong `storage/logs/`, cấu hình sửa trực tiếp trong `.env` và `config/`.

---

## 6. Dành cho lập trình viên lõi

Những chỗ chạy ở mọi request mà đọc database phải hỏi `DB::enabled()` trước. Các điểm đã xử lý:

| File | Vai trò |
|---|---|
| `framework/src/config/database.php` | Khoá `enabled` (đọc `DB_ENABLED`) |
| `framework/src/Database/DatabaseServiceProvider.php` | `registerDisabled()`: bind `db` thành closure ném lỗi |
| `cms/src/Providers/CmsServiceProvider.php` | `withoutDatabase()`: ép tắt admin, plugin, theme trước khi đăng ký provider |
| `cms/src/Support/InstallationState.php` | `isInstalled()` trả `true` |
| `cms/src/Http/Middleware/CheckDatabaseVersion.php` | Bỏ qua kiểm tra phiên bản |
| `cms/src/Providers/SystemServiceProvider.php` | Không đọc bảng `system` |
| `cms/src/Support/Option.php` | `get()` trả giá trị mặc định |
| `cms/src/Providers/CmsRouteServiceProvider.php` | Chỉ nạp `routes/api.php` + route 404 JSON (`NoDatabaseController`) |

Kiểm thử bằng `composer nodb`: mỗi ca boot ứng dụng trong một tiến trình riêng với `DB_ENABLED=false` và `DB_HOST` trỏ vào địa chỉ không tồn tại, nên còn chỗ nào mở kết nối là test đỏ ngay.
