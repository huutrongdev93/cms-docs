Schema Builder là một class giúp chúng ta làm việc với các cơ sở dữ liệu với các hàm định sẵn.
## Table
### Tạo Table

Để tạo một bảng cơ sở dữ liệu mới, hãy sử dụng phương thức `create` trên `Schema` Facade. 
Phương thức `create` chấp nhận hai đối số:

| Arguments |  Type   |                                                                   Description |
|-----------|:-------:|------------------------------------------------------------------------------:|
| $table    | string  |                                                                  Tên của bảng |
| $closure  | closure | `closure` nhận đối tượng `Blueprint` có thể được sử dụng để xác định bảng mới |

```php
schema()->create('users', function (Illuminate\Database\Schema\Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email');
    $table->timestamps();
});
```

Khi tạo bảng, bạn có thể sử dụng bất kỳ column methods nào của blueprint để xác định các cột của bảng

### Kiểm tra sự tồn tại của Table / Column
Bạn có thể kiểm tra sự tồn tại của table bằng method `hasTable`

```php
if (schema()->hasTable('users')) {
    //The "users" table exists...
}
```
Bạn có thể kiểm tra sự tồn tại của Column bằng method `hasColumn`

```php
if (schema()->hasColumn('users', 'email')) {
    // The "users" table exists and has an "email" column...
}
```

### Cập nhật Table

Phương thức `table` trên `schema` có thể được sử dụng để cập nhật các table hiện có. 
Giống như phương `create`, phương thức bảng chấp nhận hai đối số:

| Arguments |  Type   |                                                                                  Description |
|-----------|:-------:|---------------------------------------------------------------------------------------------:|
| $table    | string  |                                                                    Tên của bảng cần cập nhật |
| $closure  | closure | `closure` nhận đối tượng `Blueprint` mà bạn có thể sử dụng để thêm cột hoặc chỉ mục vào bảng |

```php
schema()->table('users', function (Illuminate\Database\Schema\Blueprint $table) {
    $table->integer('votes');
});
```

### Đổi tên Table / Xóa Table

Để đổi tên table cơ sở dữ liệu hiện có, hãy sử dụng phương thức `rename` :

```php
schema()->rename($from, $to);
```

| Arguments |  Type  |          Description |
|-----------|:------:|---------------------:|
| $from     | string | Tên của bảng cần đổi |
| $to       | string |     Tên mới của bảng |

Để xóa một table hiện có, bạn có thể sử dụng các phương thức `drop` hoặc `dropIfExists`:

```php
schema()->drop('users');
schema()->dropIfExists('users');
```

## Column

### Các loại columns có sẵn

schema `Blueprint` cung cấp nhiều phương thức tương ứng với các loại cột khác nhau mà bạn có thể thêm vào bảng cơ sở dữ liệu của mình. Mỗi phương pháp có sẵn được liệt kê trong bảng dưới đây:

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

### Column Modifiers

Ngoài các loại column được liệt kê ở trên, còn có một số "modifiers" column mà bạn có thể sử dụng khi thêm column vào bảng cơ sở dữ liệu. 
Ví dụ: để tạo cột "nullable", bạn có thể sử dụng phương thức `nullable`:

```php
use Illuminate\Database\Schema\Blueprint;
 
schema()->table('users', function (Blueprint $table) {
    $table->string('email')->nullable();
});
```
Bảng sau chứa tất cả các công cụ sửa đổi column có sẵn. Danh sách này không bao gồm các công cụ sửa đổi chỉ mục:

| Modifier                            |                                                                                  Description |
|-------------------------------------|---------------------------------------------------------------------------------------------:|
| `->after('column')`                 |                                            Đặt vị trí của column "sau" một cột khác (MySQL). |
| `->autoIncrement()`                 |                                Đặt các column INTEGER làm column tăng tự động (primary key). |
| `->charset('utf8mb4')`              |                                                       Chỉ định character cho column (MySQL). |
| `->collation('utf8mb4_unicode_ci')` |                                 Chỉ định đối chiếu cho column (MySQL/PostgreSQL/SQL Server). |
| `->comment('my comment') `          |                                              Thêm comment vào một column (MySQL/PostgreSQL). |
| `->default($value)`                 |                                                      Chỉ định giá trị "mặc định" cho column. |
| `->first()`                         |                                   Đặt vị trí của column thành "đầu tiên" trong bảng (MySQL). |
| `->from($integer)`                  |                            Đặt giá trị bắt đầu của trường tăng tự động (MySQL / PostgreSQL). |
| `->invisible()`                     |                                   Làm cho column "ẩn" đối với các truy vấn SELECT * (MySQL). |
| `->nullable($value = true)`         |                                                          Cho phép chèn giá trị NULL vào cột. |
| `->storedAs($expression)`           |                                      Tạo một cột được tạo được lưu trữ (MySQL / PostgreSQL). |
| `->unsigned()`                      |                                                     Đặt các cột INTEGER là UNSIGNED (MySQL). |
| `->useCurrent()`                    |                         Đặt cột TIMESTAMP để sử dụng CURRENT_TIMESTAMP làm giá trị mặc định. |
| `->useCurrentOnUpdate()`            |            Đặt cột TIMESTAMP để sử dụng CURRENT_TIMESTAMP khi bản ghi được cập nhật (MySQL). |
| `->virtualAs($expression)`          |                                           Tạo một cột được tạo ảo (MySQL/PostgreSQL/SQLite). |
| `->generatedAs($expression)`        |                      Tạo cột nhận dạng với các tùy chọn trình tự được chỉ định (PostgreSQL). |
| `->always()`                        | Xác định mức độ ưu tiên của các giá trị chuỗi so với đầu vào cho cột nhận dạng (PostgreSQL). |

### Vị Trí Column
Khi sử dụng database MySQL, phương thức `after` có thể được sử dụng để thêm các cột sau một cột hiện có trong schema:
```php
use Illuminate\Database\Schema\Blueprint;
schema()->table('users', function (Blueprint $table) {
    $table->after('password', function (Blueprint $table) {
        $table->string('address_line1');
        $table->string('address_line2');
        $table->string('city');
    });
});
```


### Điều chỉnh Column
Phương thức `change` cho phép bạn sửa đổi loại và thuộc tính của các Column hiện có. 
> Ví dụ: Để xem phương thức `change` hoạt động như thế nào, hãy tăng kích thước của Column name từ 25 lên 50. 
Để thực hiện điều này, chúng ta chỉ cần xác định trạng thái mới của cột và sau đó gọi phương thức thay đổi:

```php
use Illuminate\Database\Schema\Blueprint;
schema()->table('users', function (Blueprint $table) {
    $table->string('name', 50)->change();
});
```

Khi sửa đổi một Column, bạn phải bao gồm rõ ràng tất cả các loại và thuộc tính mà bạn muốn giữ lại trong định nghĩa Column - mọi thuộc tính bị thiếu sẽ bị loại bỏ. 
Ví dụ: để giữ lại các thuộc tính `unsigned`, `default` và `comment`, bạn phải gọi rõ ràng từng thuộc tính sửa đổi khi thay đổi cột:

```php
use Illuminate\Database\Schema\Blueprint;
schema()->table('users', function (Blueprint $table) {
    $table->integer('votes')->unsigned()->default(1)->comment('my comment')->change();
});
```

### Đổi Tên Column
Để đổi tên một Column, bạn có thể sử dụng phương thức `renameColumn` do schema cung cấp:

```php
use Illuminate\Database\Schema\Blueprint;
schema()->table('users', function (Blueprint $table) {
    $table->renameColumn('from', 'to');
});
```

### Xóa Column
Để xóa một cột, bạn có thể sử dụng phương thức `dropColumn` trên schema:

```php
use Illuminate\Database\Schema\Blueprint;
schema()->table('users', function (Blueprint $table) {
    $table->dropColumn('votes');
});
```

Bạn có thể loại bỏ nhiều cột khỏi một bảng bằng cách truyền một mảng tên cột vào phương thức `dropColumn`:

```php
use Illuminate\Database\Schema\Blueprint;
schema()->table('users', function (Blueprint $table) {
    $table->dropColumn(['votes', 'avatar', 'location']);
});
```

## Indexes

### Tạo Indexes 
schema builder hỗ trợ một số loại chỉ mục. Ví dụ sau tạo một cột email mới và chỉ định rằng các giá trị của nó phải là duy nhất. Để tạo chỉ mục, chúng ta có thể xâu chuỗi phương thức `unique` vào định nghĩa cột:

```php
schema()->table('users', function (Blueprint $table) {
    $table->string('email')->unique();
});
```
Bạn thậm chí có thể chuyển một array các cột sang vào phương thức index để tạo index phức hợp:

```php
$table->index(['account_id', 'created_at']);
```

### Các loại chỉ mục có sẵn

| Command                                 |                                    Description |
|-----------------------------------------|-----------------------------------------------:|
| `$table->primary('id');`                |                                Thêm khóa chính |
| `$table->primary(['id', 'parent_id']);` | Thêm phím tổng hợp nhiều column làm khóa chính |
| `$table->unique('email');`              |                        Thêm một index duy nhất |
| `$table->index('state');`               |                                     Thêm index |
| `$table->fullText('body');`             |        Thêm full text index (MySQL/PostgreSQL) |
