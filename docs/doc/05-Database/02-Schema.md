# Schema Builder

> **Helper:** `schema()` (toàn cục)  
> **Namespace:** `Illuminate\Database\Schema\Builder`  
> **Tài liệu tham khảo:** [Laravel Schema](https://laravel.com/docs/12.x/migrations#creating-tables)

## 1. Schema Builder là gì?

Schema Builder cung cấp các phương thức để **tạo, sửa đổi và xóa cấu trúc bảng (table) trong database** mà không cần viết câu lệnh `CREATE TABLE` hay `ALTER TABLE` thô. Đây chính là công cụ dùng khi bạn cần thiết lập cơ sở dữ liệu cho Plugin của mình.

SkillDo CMS v8 cung cấp hàm global `schema()` (trả về `Illuminate\Database\Schema\Builder`) để bạn gọi nhanh từ bất kỳ đâu.

## 2. File Migration trong Plugin

Các thao tác Schema trong Plugin thường được đặt trong một file `database/database.php`. File này được gọi tự động khi Plugin **kích hoạt (activate)** hoặc **cập nhật (update)**.

Cấu trúc file chuẩn:

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use SkillDo\Database\DB;

return new class () extends Migration {

    public function up(): void
    {
        // Code tạo/sửa bảng khi Plugin kích hoạt
        if (!schema()->hasTable('my_plugin_table')) {
            schema()->create('my_plugin_table', function (Blueprint $table) {
                // ... định nghĩa các cột
            });
        }
    }

    public function down(): void
    {
        // Code xóa bảng khi Plugin gỡ bỏ
        schema()->drop('my_plugin_table');
    }
};
```

---

## 3. Tạo Bảng (Create Table)

Dùng `schema()->create($tableName, $callback)` để tạo bảng. Luôn nên kiểm tra `hasTable()` trước để tránh lỗi nếu bảng đã tồn tại.

```php
if (!schema()->hasTable('bookings')) {
    schema()->create('bookings', function (Blueprint $table) {
        $table->increments('id');        // ID tự tăng (PRIMARY KEY)
        $table->string('name', 200);     // Cột VARCHAR(200)
        $table->string('phone', 20)->nullable(); // Nullable
        $table->integer('service_id')->default(0);
        $table->tinyInteger('status')->default(1);
        $table->dateTime('booking_date')->nullable();
        $table->text('note')->nullable();
        $table->integer('user_created')->default(0);
        $table->integer('user_updated')->default(0);
        $table->dateTime('created')->default(DB::raw('CURRENT_TIMESTAMP'));
        $table->dateTime('updated')->nullable();
    });
}
```

### Cột Chuẩn SkillDo (Nên Dùng Cho Mọi Bảng Chính)
Hầu hết các bảng dữ liệu của CMS đều tuân theo quy ước:

| Cột                 | Kiểu                   | Mô tả                     |
| ------------------- | ---------------------- | ------------------------- |
| `id`                | `increments`           | Khóa chính, tự tăng       |
| `user_created`      | `integer`              | ID Admin đã tạo bản ghi   |
| `user_updated`      | `integer`              | ID Admin đã cập nhật cuối |
| `created`           | `dateTime`             | `CURRENT_TIMESTAMP`       |
| `updated`           | `dateTime`             | `nullable`                |
| `order`             | `integer`              | Vị trí hiển thị           |
| `status` / `public` | `tinyInteger`/`string` | Trạng thái hiển thị       |

---

## 4. Các Kiểu Cột Phổ Biến (Column Types)

```php
schema()->create('products', function (Blueprint $table) {
    // Số nguyên
    $table->increments('id');             // INT UNSIGNED AUTO_INCREMENT
    $table->integer('price')->default(0); // INT
    $table->tinyInteger('status')->default(1); // TINYINT
    $table->unsignedBigInteger('user_id')->nullable(); // BIGINT UNSIGNED

    // Chuỗi/Text
    $table->string('title', 200);         // VARCHAR(200)
    $table->string('slug', 200)->collation('utf8mb4_unicode_ci');
    $table->text('excerpt')->nullable();  // TEXT
    $table->longText('content')->nullable(); // LONGTEXT

    // Số thực
    $table->float('rate')->default(1);    // FLOAT
    $table->decimal('amount', 10, 2);     // DECIMAL(10,2)

    // Thời gian
    $table->dateTime('created')->default(DB::raw('CURRENT_TIMESTAMP'));
    $table->dateTime('updated')->nullable();
    $table->timestamp('expires_at')->nullable();

    // Logic
    $table->boolean('is_active')->default(true); // TINYINT(1)
    $table->enum('type', ['a', 'b', 'c'])->default('a'); // ENUM

    // Char & UUID
    $table->char('uuid', 36)->primary();  // CHAR(36) - dùng cho UUID
});
```

#### `bigIncrements()`
Phương thức `bigIncrements` tạo cột tương đương `UNSIGNED` `BIGINT` (khóa chính) tự động tăng:
```php
$table->bigIncrements('id');
```
#### `bigInteger()`
Phương thức `bigInteger` tạo cột tương đương `BIGINT`
```php
$table->bigInteger('votes');
```
#### `binary()`
Phương thức `binary` tạo một cột tương đương `BLOB`:
```php
$table->binary('photo');
```
#### `boolean()`
Phương thức `boolean` tạo cột tương đương `BOOLEAN`:
```php
$table->boolean('confirmed');
```
#### `char()`
The char method creates a CHAR equivalent column with of a given length:

```php
$table->char('name', 100);
```
#### `dateTimeTz()`
Phương thức `dateTimeTz` tạo cột tương đương `DATETIME` (có múi giờ) với độ chính xác tùy chọn (tổng digits):
```php
$table->dateTimeTz('created_at', $precision = 0);
```
#### `dateTime()`
Phương thức `dateTime` tạo cột tương đương `DATETIME` với độ chính xác tùy chọn (tổng digits):
```php
$table->dateTime('created_at', $precision = 0);
```
#### `date()`
Phương thức `date` tạo cột tương đương `DATE`:
```php
$table->date('created_at');
```
#### `decimal()`
Phương thức `decimal` tạo một cột tương đương `DECIMAL` với độ chính xác cho trước (tổng chữ số) và tỷ lệ (chữ số thập phân):
```php
$table->decimal('amount', $precision = 8, $scale = 2);
```

#### `double()`
Phương thức `double` tạo một cột tương đương `DOUBLE` với độ chính xác cho trước (tổng chữ số) và tỷ lệ (chữ số thập phân):
```php
$table->double('amount', 8, 2);
```
#### `enum()`
Phương thức `enum` tạo một cột tương đương `ENUM` với các giá trị hợp lệ đã cho:
```php
$table->enum('difficulty', ['easy', 'hard']);
```
#### `float()`
Phương thức `float` tạo một cột tương đương `FLOAT` với độ chính xác cho trước (tổng chữ số) và chữ số thập phân:
```php
$table->float('amount', 8, 2);
```
#### `foreignId()`
Phương thức foreignId tạo một cột tương đương `UNSIGNED` `BIGINT`:
```php
$table->foreignId('user_id');
```
#### `foreignUlid()`
Phương thức `foreignUlid` tạo cột tương đương `ULID`:
```php
$table->foreignUlid('user_id');
```
#### `foreignUuid()`
Phương thức `foreignUuid` tạo cột tương đương `UUID`:
```php
$table->foreignUuid('user_id');
```
#### `geometryCollection()`
Phương thức `geometryCollection` tạo ra một cột tương đương `GEOMETRYCOLLECTION` :
```php
$table->geometryCollection('positions');
```
#### `geometry()`
Phương thức `geometry` tạo ra một cột tương đương `GEOMETRY`:
```php
$table->geometry('positions');
```
#### `id()`
Phương thức `id` là bí danh của phương thức `bigIncrements`. Theo mặc định, phương thức sẽ tạo cột `id`; tuy nhiên, bạn có thể chuyển tên cột nếu bạn muốn gán một tên khác cho cột:
```php
$table->id();
```
#### `increments()`
Phương thức `increments` tạo ra một cột tương đương `UNSIGNED INTEGER` tự động tăng làm `primary key`:
```php
$table->increments('id');
```
#### `integer()`
Phương thức `integer` tạo một cột tương đương `INTEGER`:
```php
$table->integer('votes');
```

#### `json()`
Phương thức `json` tạo một cột tương đương `JSON`:
```php
$table->json('options');
```

#### `jsonb`
Phương thức `jsonb` tạo một cột tương đương `JSONB`:
```php
$table->jsonb('options');
```

#### `lineString`
Phương thức `lineString` tạo cột tương đương `LINESTRING`:
```php
$table->lineString('positions');
```

#### `longText`
Phương thức `longText` tạo cột tương đương `LONGTEXT`:
```php
$table->longText('description');
```

#### `macAddress`
Phương thức `macAddress` tạo một cột dùng để chứa địa chỉ MAC. Một số hệ thống cơ sở dữ liệu, chẳng hạn như PostgreSQL, có loại cột dành riêng cho loại dữ liệu này. Các hệ thống cơ sở dữ liệu khác sẽ sử dụng cột tương đương với chuỗi:
```php
$table->macAddress('device');
```

#### `mediumIncrements`
Phương thức `MediumIncrements` tạo cột tương đương `UNSIGNED MEDIUMINT` tăng tự động làm `primary key`:
```php
$table->mediumIncrements('id');
```

#### `mediumInteger`
Phương thức `MediumInteger` tạo cột tương đương `MEDIUMINT`:
```php
$table->mediumInteger('votes');
```

#### `mediumText`
Phương thức `MediumText` tạo cột tương đương `MEDIUMTEXT`:
```php
$table->mediumText('description');
```

#### `multiLineString`
Phương thức `multiLineString` tạo cột tương đương `MULTILINESTRING`:
```php
$table->multiLineString('positions');
```

#### `multiPoint`
Phương thức `multiPoint` tạo cột tương đương `MULTIPOINT`:
```php
$table->multiPoint('positions');
```

#### `multiPolygon`
Phương thức `multiPolygon` tạo cột tương đương `MULTIPOLYGON`:
```php
$table->multiPolygon('positions');
```

#### `nullableTimestamps`
Phương thức `nullableTimestamps` là bí danh của phương thức `timestamps`:
```php
$table->nullableTimestamps(0);
```

#### `point`
Phương thức `point` tạo cột tương đương `POINT`:
```php
$table->point('position');
```
#### `polygon`
Phương thức `polygon` tạo một cột tương đương `POLYGON`:
```php
$table->polygon('position');
```
#### `rememberToken`
Phương thức `RememberToken` tạo một cột tương đương `VARCHAR(100)` có thể rỗng, nhằm lưu trữ mã thông báo xác thực "remember" hiện tại:
```php
$table->rememberToken();
```

#### `set`
Phương thức set tạo một cột tương đương `SET` với danh sách các giá trị hợp lệ đã cho:
```php
$table->set('flavors', ['strawberry', 'vanilla']);
```

#### `smallIncrements`
Phương thức `SmallIncrements` tạo một cột tương đương `UNSIGNED SMALLINT` tự động tăng làm `primary key`:
```php
$table->smallIncrements('id');
```

#### `smallInteger`
Phương thức `SmallInteger` tạo một cột tương đương `SMALLINT`:
```php
$table->smallInteger('votes');
```

#### `string`
Phương thức `string` tạo cột tương đương `VARCHAR` có độ dài cho trước:
```php
$table->string('name', 100);
```

#### `text`
Phương thức `text` tạo một cột tương đương `TEXT`:
```php
$table->text('description');
```

#### `timeTz`
Phương thức `timeTz` tạo cột tương đương `TIME` (có múi giờ) với độ chính xác tùy chọn (tổng chữ số):
```php
$table->timeTz('sunrise', $precision = 0);
```

#### `time`
Phương thức `time` tạo cột tương đương `TIME` với độ chính xác tùy chọn (tổng chữ số):
```php
$table->time('sunrise', $precision = 0);
```

#### `timestampTz`
Phương thức `timestampTz` tạo cột tương đương `TIMESTAMP` (có múi giờ) với độ chính xác tùy chọn (tổng chữ số):
```php
$table->timestampTz('added_at', $precision = 0);
```

#### `timestamp`
Phương thức `timestamp` tạo cột tương đương `TIMESTAMP` với độ chính xác tùy chọn (tổng chữ số):
```php
$table->timestamp('added_at', $precision = 0);
```

#### `tinyIncrements`
Phương thức `tinyIncrements` tạo một cột tương đương `UNSIGNED TINYINT` tăng tự động làm `primary key`:
```php
$table->tinyIncrements('id');
```

#### `tinyInteger`
Phương thức `tinyInteger` tạo một cột tương đương `TINYINT`:
```php
$table->tinyInteger('votes');
```

#### `tinyText`
Phương thức `tinyText` tạo một cột tương đương `TINYTEXT`:
```php
$table->tinyText('notes');
```

#### `unsignedBigInteger`
Phương thức `unsignedBigInteger` tạo một cột tương đương `UNSIGNED BIGINT`:
```php
$table->unsignedBigInteger('votes');
```

#### `unsignedDecimal`
Phương thức `unsignedDecimal` tạo một cột tương đương `UNSIGNED DECIMAL` với độ chính xác tùy chọn (tổng chữ số) và tỷ lệ (chữ số thập phân):
```php
$table->unsignedDecimal('amount', $precision = 8, $scale = 2);
```

#### `unsignedInteger`
Phương thức `unsignedInteger` tạo một cột tương đương `UNSIGNED INTEGER`:
```php
$table->unsignedInteger('votes');
```

#### `unsignedMediumInteger`
Phương thức `unsignedMediumInteger` tạo cột tương đương `UNSIGNED MEDIUMINT`:
```php
$table->unsignedMediumInteger('votes');
```

#### `unsignedSmallInteger`
Phương thức `unsignedSmallInteger` tạo một cột tương đương `UNSIGNED SMALLINT`:
```php
$table->unsignedSmallInteger('votes');
```

#### `unsignedTinyInteger`
Phương thức `unsignedTinyInteger` tạo một cột tương đương `UNSIGNED TINYINT`:
```php
$table->unsignedTinyInteger('votes');
```

#### `ulid`
Phương thức `ulid` tạo cột tương đương `ULID`:
```php
$table->ulid('id');
```

#### `uuid`
Phương thức `uuid` tạo cột tương đương `UUID`:
```php
$table->uuid('id');
```

#### `year`
Phương thức `year` tạo cột tương đương `YEAR`:
```php
$table->year('birth_year');
```

---

## 5. Thêm Index & Ràng Buộc

```php
schema()->create('products', function (Blueprint $table) {
    $table->increments('id');
    $table->string('title', 200);
    $table->string('slug', 200);
    $table->integer('category_id')->default(0);
    $table->string('status')->default('public');

    // Index trên 1 cột (tăng tốc tìm kiếm)
    $table->index('slug');
    $table->index('title');

    // Index trên nhiều cột (Composite Index)
    $table->index(['category_id', 'status']);

    // Unique index (không cho trùng giá trị)
    $table->unique('slug');
});
```

---

## 6. Chỉnh Sửa Bảng Hiện Có (Alter Table)

Dùng `schema()->table($name, $callback)` để thêm/sửa/xóa cột trong bảng đã có.

### Thêm Cột (Add Column)
```php
// Thêm cột 'rating' vào bảng 'products' nếu chưa có
if (!schema()->hasColumn('products', 'rating')) {
    schema()->table('products', function (Blueprint $table) {
        $table->integer('rating')->default(0)->after('price_sale');
    });
}
```

### Đổi Kiểu / Thuộc Tính Cột (Modify Column)
```php
schema()->table('users', function (Blueprint $table) {
    $table->string('username', 255)
        ->charset('utf8mb4')
        ->collation('utf8mb4_unicode_ci')
        ->nullable()
        ->change(); // Phải gọi ->change() khi sửa cột đã có
});
```

### Xóa Cột (Drop Column)
```php
schema()->table('products', function (Blueprint $table) {
    $table->dropColumn('old_column'); // Xóa 1 cột

    $table->dropColumn(['col1', 'col2']); // Xóa nhiều cột
});
```

---

## 7. Kiểm Tra Tồn Tại

```php
// Kiểm tra bảng có tồn tại không?
if (schema()->hasTable('bookings')) { ... }

// Kiểm tra cột có tồn tại không?
if (schema()->hasColumn('products', 'weight')) { ... }

// Kiểm tra nhiều cột cùng lúc
if (schema()->hasColumns('users', ['email', 'phone', 'address'])) { ... }
```

---

## 8. Đổi Tên & Xóa Bảng

```php
// Đổi tên bảng
schema()->rename('old_table_name', 'new_table_name');

// Xóa bảng (báo lỗi nếu không tồn tại)
schema()->drop('bookings');

// Xóa bảng nếu tồn tại (an toàn hơn, không báo lỗi)
schema()->dropIfExists('bookings');
```

---

## 9. Bảng Metadata Chuẩn CMS

Theo quy ước của SkillDo CMS, nếu Module của bạn cần lưu trữ dữ liệu mở rộng (ví dụ: metabox, tùy chọn), hãy tạo thêm một bảng `{tên_bảng}_metadata` chuẩn:

```php
if (!schema()->hasTable('bookings_metadata')) {
    schema()->create('bookings_metadata', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('object_id')->default(0); // ID của bảng cha
        $table->string('meta_key', 100)->collation('utf8mb4_unicode_ci')->nullable();
        $table->longText('meta_value')->collation('utf8mb4_unicode_ci')->nullable();
        $table->integer('order')->default(0);
        $table->dateTime('created')->default(DB::raw('CURRENT_TIMESTAMP'));
        $table->dateTime('updated')->nullable();
        $table->index('object_id'); // Index để tìm kiếm nhanh
        $table->index('meta_key');
    });
}
```
