# Eloquent Model

> **File:** `packages/skilldo/framework/src/Database/Eloquent/Model.php`  
> **Namespace:** `SkillDo\Database\Eloquent\Model`  
> **Tài liệu tham khảo:** [Laravel Eloquent](https://laravel.com/docs/12.x/eloquent)

## 1. Eloquent Model là gì?

Eloquent là một ORM (Object-Relational Mapper) - giúp bạn làm việc với bảng Database thông qua các đối tượng PHP (class) thay vì viết SQL thuần.

Class `SkillDo\Database\Eloquent\Model` là phiên bản tùy chỉnh của Eloquent được SkillDo CMS v8 xây dựng lại (không kế thừa `Illuminate\Database\Eloquent\Model`).

**Traits tích hợp sẵn** trong Model (namespace `SkillDo\Traits\Eloquent\*`):
- **ModelStatic** (các phương thức static: `all()`...)
- **ModelMeta** (đọc/ghi bảng metadata: `getMeta`, `addMeta`, `updateMeta`, `deleteMeta`)
- **ModelEvent** (Hooks tự động: `saving`, `saved`, `deleted`...)
- **HasGlobalScopes** (`addGlobalScope`)
- **HasUniqueIds** (nền tảng cho `HasUuids` / `HasUlids` — primary key UUID/ULID)
- **HasRelationships** (`hasOne`, `hasMany`, `belongsTo`, `belongsToMany`)

**Traits tùy chọn** (tự khai báo `use` khi cần):
- **SoftDeletes** (Xóa mềm với cột `trash` kiểu số 0/1)
- **ModelRoute** (Tự động quản lý URL/Slug qua bảng `routes`)
- **ModelLanguage** (Đa ngôn ngữ qua bảng `language`)

## 2. Tạo Model cho Plugin

### Bước 1: Khai Báo Class Model
Tạo file đặt trong `app/Models/` của Plugin:

```php
<?php
namespace MyPlugin\Models;

use SkillDo\Database\Eloquent\Model;

class Booking extends Model
{
    // Tên bảng trong database (nếu bỏ qua sẽ suy ra từ tên class dạng snake_case số nhiều)
    protected string $table = 'bookings';

    // Khai báo kiểu dữ liệu cho các cột ĐẶC BIỆT (đặc điểm riêng của SkillDo Model, khác Laravel)
    // Lưu ý: KHÔNG cần liệt kê hết — hệ thống tự đọc toàn bộ cột + default
    // từ schema database (cache key `table_columns_{table}`).
    // Chỉ khai báo cột cần kiểu xử lý đặc biệt: wysiwyg, image, json, array...
    // hoặc cần default khác với database.
    protected array $columns = [
        'note'       => ['wysiwyg'],
        'options'    => ['json'],
        'status'     => ['int', 1],    // [kiểu, giá_trị_mặc_định]
    ];
}
```

### Bước 2: Đăng Ký Alias (Tùy Chọn)
Mở file `bootstrap/config.php` của Plugin và đăng ký class alias qua `SkillDo\AliasLoader` (cú pháp giống cách CMS đăng ký `SkillDo\Model\*` trong `CmsServiceProvider::aliases()`):

```php
// Trong bootstrap/config.php
\SkillDo\AliasLoader::getInstance()->alias('Booking', \MyPlugin\Models\Booking::class);

// Sau đó có thể dùng
$bookings = Booking::where('status', 1)->get();
```

---

## 3. Các Thao Tác CRUD Cơ Bản

### 3.1 Lấy Dữ Liệu (Read)

```php
use MyPlugin\Models\Booking;

// Lấy tất cả
$bookings = Booking::all();

// Lấy bản ghi với điều kiện
$activeBookings = Booking::where('status', 1)->get();

// Lấy một bản ghi theo ID
$booking = Booking::find(5);
echo $booking->name;

// Lấy bản ghi đầu tiên khớp điều kiện
$booking = Booking::where('phone', '0901234567')->first();

// Đếm số lượng
$count = Booking::where('status', 1)->count();
```

> [!WARNING]
> **`Model::get()` gọi TĨNH khác hẳn Laravel.** Trait `ModelStatic` định nghĩa lại `get()` ở dạng static:
>
> ```php
> static function get($id = 0)
> {
>     if(is_numeric($id)) return static::query()->find($id);
>
>     return static::query()->first();
> }
> ```
>
> Nghĩa là:
>
> | Cách gọi | Trả về |
> |---|---|
> | `Booking::get()` | **MỘT** bản ghi đầu tiên (tương đương `first()`) — **không phải** danh sách |
> | `Booking::get(5)` | Bản ghi có id = 5 (tương đương `find(5)`) |
> | `Booking::all()` | Collection **tất cả** bản ghi |
> | `Booking::where(...)->get()` | Collection (đây là `get()` của Query Builder, hoạt động như Laravel) |
>
> Muốn lấy danh sách mà không có điều kiện, dùng `Booking::all()` hoặc `Booking::query()->get()`.

### Các static helper riêng của SkillDo

Ngoài API Eloquent chuẩn, trait `ModelStatic` bổ sung:

| Method | Mô tả |
|---|---|
| `all()` | Collection tất cả bản ghi |
| `get($id = 0)` | Một bản ghi (xem cảnh báo trên) |
| `create($data)` | Thêm mới, trả về `int\|string` id hoặc `SKD_Error` |
| `insert($data, $oldObject = null)` | Có primary key trong `$data` thì **update**, không có thì **create** |
| `inserts($data)` | Insert hàng loạt qua Query Builder (không bắn model event) |
| `updateBatch($values, $index = null, $raw = false)` | Cập nhật nhiều bản ghi trong một câu lệnh |
| `delete($id = 0)` | Xóa cứng |

### 3.2 Thêm Mới (Create)

**Chỉ có một cách thêm mới: dùng `create()`** — trả về ID vừa insert (`int|string`) hoặc `SKD_Error` nếu thất bại:

```php
$bookingId = Booking::create([
    'name'       => 'Nguyễn Văn A',
    'phone'      => '0901234567',
    'service_id' => 3,
    'status'     => 1,
    'note'       => 'Yêu cầu đặc biệt...',
]);

if (is_skd_error($bookingId)) {
    // Xử lý lỗi
    echo $bookingId->first();
} else {
    echo "Tạo thành công, ID = " . $bookingId;
}
```

> **Lưu ý (khác Laravel):** KHÔNG thể tạo bản ghi mới bằng cách `new Booking()` rồi gọi `save()`. Phương thức `save()` của SkillDo Model **chỉ dành cho UPDATE** — nó trả về `false` ngay nếu model chưa có primary key (`empty($this->getKey())`) hoặc không có thay đổi (`!isDirty()`).

### 3.3 Cập Nhật (Update)

**Cách 1: Lấy bản ghi rồi sửa**
```php
$booking = Booking::find(5);
$booking->status = 2;
$booking->note   = 'Đã xác nhận';
$booking->save();  // UPDATE — yêu cầu model đã có ID; trả về ID nếu thành công, false nếu không có gì thay đổi
```

**Cách 2: Mass update qua Query Builder**
```php
Booking::where('status', 0)
    ->where('created', '<', '2026-01-01')
    ->update(['status' => 3]); // Cập nhật tất cả khớp điều kiện
```

### 3.4 Xóa (Delete)

`delete()` luôn là **xóa cứng** (xóa thật khỏi DB) — kể cả khi model dùng trait `SoftDeletes` (xóa mềm dùng `trash()`, xem mục 7). Khi xóa thành công, hệ thống tự dọn route (`ModelRoute`), bản dịch (`ModelLanguage`) và metadata liên quan, rồi trả về mảng các ID đã xóa (hoặc `false` nếu không xóa được gì).

```php
// Lấy bản ghi rồi xóa
$booking = Booking::find(5);
$booking->delete();

// Xóa theo điều kiện (hàng loạt)
Booking::where('status', 3)->delete();

// Xóa theo ID cụ thể
Booking::whereIn('id', [1, 2, 3])->delete();
```

---

## 4. Model Events (Hooks Tự Động)

Model của SkillDo hỗ trợ các hook lắng nghe sự kiện được khai báo trong `boot()`. Đây là tính năng rất mạnh để tự động hóa logic khi lưu/xóa dữ liệu.

```php
class Booking extends Model
{
    protected string $table = 'bookings';

    protected static function boot(): void
    {
        parent::boot();

        // Chạy TRƯỚC khi lưu (cả insert lẫn update)
        static::saving(function (Booking $booking) {
            // Chuẩn hóa số điện thoại trước khi lưu
            $booking->phone = preg_replace('/\D/', '', $booking->phone);
        });

        // Chạy SAU khi lưu thành công
        static::saved(function (Booking $booking, $action) {
            // $action = 'add' (thêm mới) | 'update' (cập nhật)
            if ($action === 'add') {
                // Gửi email thông báo đặt lịch mới
                // NotificationService::sendBookingConfirmation($booking);
            }
        });

        // Chạy SAU khi xóa thành công
        static::deleted(function (Booking $booking, $listIdRemove, $objects) {
            // Dọn dẹp dữ liệu liên quan
            \Illuminate\Support\Facades\DB::table('booking_services')
                ->whereIn('booking_id', $listIdRemove)
                ->delete();
        });
    }
}
```

**Danh sách Events hỗ trợ** (trait `SkillDo\Traits\Eloquent\ModelEvent`):

| Event | Thời điểm kích hoạt |
|---|---|
| `saving` | Trước khi lưu (Insert hoặc Update) |
| `saved` | Sau khi lưu thành công — callback nhận `($model, $action)` với `$action = 'add'\|'update'` |
| `creating` | Trước khi Insert mới |
| `created` | Sau khi Insert thành công |
| `updating` | Trước khi Update (mass update qua builder) |
| `updated` | Sau khi Update thành công |
| `deleting` | Trước khi Delete — callback nhận `($model, $listId, $objects)` |
| `deleted` | Sau khi Delete thành công — callback nhận `($model, $listIdRemove, $objects)` |
| `retrieved` | Sau khi bản ghi được load từ DB (`get()`/`first()`) |
| `trashing` / `trashed` | Trước / sau khi xóa mềm bằng `trash()` (cần trait `SoftDeletes`) |
| `restoring` / `restored` | Trước / sau khi khôi phục bằng `restore()` (cần trait `SoftDeletes`) |
| `booting` / `booted` | Khi model boot lần đầu / sau khi khởi tạo instance |
| `columnsCreated` / `rulesCreated` | Sau khi build xong danh sách cột / rules từ schema |
| `setQueryBuilding` / `setQueryBuilt` | Khi query builder của model đang/đã được khởi tạo (dùng để tùy biến query mặc định) |

---

## 5. Query Scopes (Phạm Vi Truy Vấn Tùy Biến)

Scope giúp bạn đóng gói các điều kiện WHERE phức tạp thành một phương thức gọi dễ đọc.

```php
class Booking extends Model
{
    // Định nghĩa Local Scope
    // Tên hàm luôn bắt đầu bằng tiền tố 'scope'
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeByService($query, $serviceId)
    {
        return $query->where('service_id', $serviceId);
    }
}

// Cách gọi (KHÔNG cần viết 'scope', gọi trực tiếp tên sau tiền tố):
$bookings = Booking::active()->get();
$bookings = Booking::active()->byService(3)->orderBy('created', 'desc')->get();
```

---

## 6. Relationships (Quan Hệ Giữa Các Bảng)

SkillDo Model hỗ trợ các loại quan hệ Eloquent cơ bản qua trait `HasRelationships`: `hasOne()`, `hasMany()`, `belongsTo()`, `belongsToMany()` (các class Relation tương ứng nằm trong namespace `SkillDo\Database\Eloquent\Relations\*`). Hỗ trợ Eager Loading qua `with()` và Lazy Loading khi truy cập thuộc tính trùng tên method relation:

### hasMany (Một-Nhiều)
```php
class User extends Model
{
    public function bookings(): \SkillDo\Database\Eloquent\Relations\HasMany
    {
        // User có nhiều Booking (dựa trên cột 'user_created' trong bảng bookings)
        return $this->hasMany(Booking::class, 'user_created', 'id');
    }
}

// Lấy user kèm danh sách booking (Eager Loading - tránh N+1)
$users = User::with('bookings')->get();

foreach ($users as $user) {
    foreach ($user->bookings as $booking) {
        echo $booking->name;
    }
}
```

### belongsTo (Nhiều-Một)
```php
class Booking extends Model
{
    public function user(): \SkillDo\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'user_created', 'id');
    }
}

$booking = Booking::find(1);
echo $booking->user->firstname;
```

---

## 7. Soft Deletes (Xóa Mềm)

SkillDo sử dụng cột `trash` kiểu số (`0` = bình thường, `1` = đã xóa mềm) thay vì `deleted_at` (khác Laravel). Khi bảng của bạn có cột `trash`, hãy dùng Trait `SoftDeletes` — trait này đăng ký global scope `SoftDeletingScope` tự động thêm `WHERE trash = 0` vào mọi query.

```php
use SkillDo\Database\Eloquent\Model;
use SkillDo\Traits\Eloquent\SoftDeletes;

class Booking extends Model
{
    use SoftDeletes; // Kích hoạt tính năng xóa mềm

    protected string $table = 'bookings';
}
```

Sau đó, bạn có thể:
```php
// Xóa mềm bằng trash() — cập nhật cột trash = 1, bản ghi vẫn còn trong DB
// Bắn events: trashing → trashed
Booking::whereKey(5)->trash();

// LƯU Ý: delete() vẫn là XÓA CỨNG (xóa thật) kể cả khi dùng SoftDeletes
Booking::whereKey(5)->delete();

// Mặc định, các query đều ẩn bản ghi đã xóa mềm
$active = Booking::all(); // Chỉ lấy trash = 0

// Lấy CẢ bản ghi đã xóa mềm
$all = Booking::withTrashed()->get();

// Chỉ lấy bản ghi đã xóa mềm (trash = 1)
$trashed = Booking::onlyTrashed()->get();

// Loại trừ bản ghi đã xóa mềm (tương đương mặc định)
$active = Booking::withoutTrashed()->get();

// Khôi phục bản ghi đã xóa mềm (trash = 0)
// Bắn events: restoring → restored
Booking::onlyTrashed()->whereKey(5)->restore();
```

---

## 8. Model Meta (Dữ Liệu Mở Rộng)

Trait `ModelMeta` (tích hợp sẵn trong mọi Model) cung cấp API đọc/ghi metadata, ủy quyền cho `SkillDo\Cms\Support\Metadata`. Dữ liệu được lưu vào bảng `{tên_bảng}_metadata` nếu tồn tại, ngược lại fallback vào bảng dùng chung `metabox` (có cột `object_type`):

```php
// Thêm meta mới
Booking::addMeta($bookingId, 'payment_method', 'momo');

// Cập nhật meta (tự thêm mới nếu chưa có)
Booking::updateMeta($bookingId, 'payment_method', 'momo');

// Đọc meta
$method = Booking::getMeta($bookingId, 'payment_method', true);
// true (mặc định) = trả về giá trị đơn, false = trả về mảng tất cả giá trị

// Xóa meta
Booking::deleteMeta($bookingId, 'payment_method');
```

Ngoài ra, khi gọi `create()`/`save()` mà attributes có key `metadata` (mảng `meta_key => meta_value`), hệ thống tự động tách ra và lưu vào bảng metadata.

---

## 9. ModelLanguage — Đa Ngôn Ngữ

> **Trait:** `SkillDo\Traits\Eloquent\ModelLanguage`

Trait `ModelLanguage` tạo liên kết giữa Model và bảng `language` của CMS, cho phép đối tượng hỗ trợ **đa ngôn ngữ (i18n)**. Khi khách truy cập ở ngôn ngữ không phải mặc định, hệ thống tự động `JOIN` bảng `language` và **ghi đè** các cột nội dung bằng bản dịch tương ứng.

### Các cột được hỗ trợ đa ngôn ngữ

Mặc định CMS chỉ hỗ trợ dịch 4 cột sau cho mỗi bản ghi:

| Cột | Mô tả |
|---|---|
| `title` | Tiêu đề |
| `name` | Tên |
| `excerpt` | Mô tả ngắn |
| `content` | Nội dung chi tiết |

### Cách kích hoạt

Khai báo Trait và thuộc tính `$language` trong `__construct()`. Giá trị `$language` là **key định danh** object type trong bảng `language` (thường đặt trùng tên bảng):

```php
<?php
namespace MyPlugin\Models;

use SkillDo\Database\Eloquent\Model;
use SkillDo\Traits\Eloquent\ModelLanguage;

class Service extends Model
{
    use ModelLanguage;

    protected string $table = 'services';

    protected array $columns = [
        'title'   => ['string'],
        'excerpt' => ['string'],
        'content' => ['wysiwyg'],
    ];

    public function __construct($attributes = [])
    {
        // Đặt key định danh object_type trong bảng language
        $this->language = 'services';

        parent::__construct($attributes);
    }
}
```

### Cơ chế hoạt động
Khi người dùng đang ở ngôn ngữ **không phải mặc định** (vd: `en`, `jp`...) và ở ngoài khu vực Admin:
- Mọi câu query `Service::all()` hoặc `Service::where(...)->get()` sẽ tự động **INNER JOIN** bảng `language`
- Kết quả trả về: `title`, `name`, `excerpt`, `content` là của ngôn ngữ hiện tại thay vì ngôn ngữ mặc định

### Lưu dữ liệu đa ngôn ngữ

Khi cần lưu bản dịch kèm theo bản ghi chính, truyền dữ liệu ngôn ngữ dưới dạng key là mã ngôn ngữ:

```php
Service::create([
    'title'   => 'Dịch vụ A',       // Ngôn ngữ mặc định
    'excerpt' => 'Mô tả ngắn...',
    'content' => '<p>Nội dung...</p>',

    // Bản dịch tiếng Anh (key là mã ngôn ngữ)
    'en' => [
        'title'   => 'Service A',
        'excerpt' => 'Short description...',
        'content' => '<p>Content...</p>',
    ],

    // Bản dịch tiếng Nhật
    'ja' => [
        'title'   => 'サービスA',
        'excerpt' => '簡単な説明...',
    ],
]);
```

---

## 10. ModelRoute — Đường Dẫn URL (Slug)

> **Trait:** `SkillDo\Traits\Eloquent\ModelRoute`

Trait `ModelRoute` tạo liên kết giữa Model và bảng `routes` của CMS, cho phép đối tượng có **URL truy cập từ giao diện người dùng** (Frontend). Khi tạo mới một bản ghi, hệ thống tự động tạo một bản ghi tương ứng trong bảng `routes` dựa trên `slug` của đối tượng.

**Dùng cho:** Bài viết, Trang nội dung, Sản phẩm, Danh mục — bất kỳ đối tượng nào cần có URL riêng trên Frontend.

### Cách kích hoạt

Khai báo Trait và thuộc tính `$route` trong `__construct()`:

```php
<?php
namespace MyPlugin\Models;

use App\Controllers\Web\ServiceController; // Controller xử lý trang Detail
use SkillDo\Database\Eloquent\Model;
use SkillDo\Traits\Eloquent\ModelRoute;
use SkillDo\Traits\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes, ModelRoute;

    protected string $table = 'services';

    protected array $columns = [
        'title'  => ['string'],
        'slug'   => ['string'],   // Bắt buộc phải có cột slug
        'status' => ['string', 'public'],
    ];

    public function __construct($attributes = [])
    {
        // Cấu hình route cho object này
        $this->route = [
            'type'       => 'services',           // object_type trong bảng routes (unique key)
            'controller' => ServiceController::class, // Controller xử lý request
            'method'     => 'detail',             // Method trong Controller
            'dependent'  => 'title',              // Cột dùng để generate slug tự động
        ];

        parent::__construct($attributes);
    }
}
```

### Giải thích các key trong `$route`

| Key | Bắt buộc | Mô tả |
|---|---|---|
| `type` | ✅ | Định danh `object_type` trong bảng `routes`. Phải **unique** toàn hệ thống (không trùng với `post`, `page`, `products`...) |
| `controller` | ✅ | Class Controller sẽ xử lý khi URL được truy cập |
| `method` | ✅ | Method trong Controller (thường là `detail`) |
| `dependent` | ✅ | Cột dữ liệu dùng để tự động tạo `slug` nếu `slug` chưa được nhập (vd: lấy từ `title`) — xử lý bởi `SkillDo\Cms\Support\Router::buildSlug()` |
| `namespace` | ❌ | Namespace của route, mặc định `frontend` |
| `callback` | ❌ | Nếu khai báo `callback` mà không có `controller`, hệ thống mặc định dùng `App\Controllers\Web\HomeController::page` và lưu callback vào bảng `routes` |

### Cơ chế hoạt động

Khi gọi `Service::create([...])`:
1. Hệ thống tạo bản ghi trong bảng `services`
2. Tự động tạo một bản ghi tương ứng trong bảng `routes`:
   - `slug` = giá trị từ cột `slug` (hoặc generate từ cột `dependent` nếu slug trống)
   - `controller` = class controller đã khai báo
   - `method` = phương thức đã khai báo
   - `object_type` = `services`
   - `directional` = `services` (trùng `type`)
   - `namespace` = `frontend` (hoặc giá trị tùy chỉnh)
   - `object_id` = ID vừa tạo

Từ đó khi khách mở URL `https://domain.com/ten-dich-vu`, Router của CMS sẽ tra bảng `routes`, tìm ra `ServiceController@detail` và dispatch request đến đúng hàm xử lý.

### Kết hợp cả ModelLanguage và ModelRoute

Đây là pattern phổ biến nhất, tương tự như `Product` trong plugin `sicommerce`:

```php
<?php
namespace MyPlugin\Models;

use MyPlugin\Controllers\Web\ServiceController;
use SkillDo\Database\Eloquent\Model;
use SkillDo\Traits\Eloquent\ModelLanguage;
use SkillDo\Traits\Eloquent\ModelRoute;
use SkillDo\Traits\Eloquent\SoftDeletes;

class Service extends Model
{
    use SoftDeletes, ModelLanguage, ModelRoute;

    protected string $table = 'services';

    protected array $columns = [
        'title'   => ['string'],
        'slug'    => ['string'],
        'excerpt' => ['wysiwyg'],
        'content' => ['wysiwyg'],
        'image'   => ['image'],
        'status'  => ['string', 'public'],
        'public'  => ['int', 1],
        'order'   => ['int', 0],
    ];

    protected array $rules = [
        'add' => [
            'require' => [
                'title' => 'Vui lòng nhập tiêu đề dịch vụ'
            ]
        ],
    ];

    public function __construct($attributes = [])
    {
        $this->route = [
            'type'       => 'services',
            'controller' => ServiceController::class,
            'method'     => 'detail',
            'dependent'  => 'title',
        ];

        $this->language = 'services';

        parent::__construct($attributes);
    }
}
```
