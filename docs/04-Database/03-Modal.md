Mỗi bảng cơ sở dữ liệu có một “Model” tương ứng dùng để tương tác với bảng đó. 
Ngoài việc truy xuất các bản ghi từ bảng cơ sở dữ liệu, các mô hình Model còn cho phép bạn chèn, cập nhật và xóa các bản ghi khỏi bảng.

### Tạo class model
Để thao tác với một bảng trong cơ sở dữ liệu bạn có thể tạo một model bằng cách kế thừa lại class `model`
```php
use Skilldo\Model\Model;

class ExModel extends Model
{
    // ...
}
```
### Table Name
Khai báo tên table trong database mà model sẽ theo tác
```php
use Skilldo\Model\Model;

class ExModel extends Model
{
    static string $table = 'ex_modal_table';
    // ...
}
```

### Truy xuất một hàng/cột từ một bảng
Nếu bạn chỉ cần truy xuất một hàng từ bảng cơ sở dữ liệu, bạn có thể sử dụng phương thức `get` hoặc `first` của model. 
Phương thức này sẽ trả về một đối tượng `stdClass` duy nhất:
> Phương thức get nhận vào một `Query Builder` để tạo câu lệnh query

```php
$ex = ExModel::get(Qr::set('id', 10));
//hoặc
$ex = ExModel::where('id', 10)->first();
```

### Truy xuất danh sách các giá trị cột

Nếu bạn cần lấy danh sách dữ liệu từ bảng cơ sở dữ liệu, bạn có thể sử dụng phương thức `gets` hoặc `all` của model.
Phương thức này sẽ trả về một đối tượng `Illuminate\Support\Collection` chứa các `stdClass`:
> Phương thức nhận vào một `Query Builder` để tạo câu lệnh query

```php
$ex = = ExModel::get(Qr::set()->where('id', '<=', 20));
//hoặc
$ex = ExModel::where('id', '<=', 20)->all();
```

### Đếm số lượng hàng data
Nếu bạn cần đếm danh sách dữ liệu từ bảng cơ sở dữ liệu, bạn có thể sử dụng phương thức `count` hoặc `amount` của model.
Phương thức này sẽ trả về số `int`:
> Phương thức nhận vào một `Query Builder` để tạo câu lệnh query

```php
$ex = ExModel::count(Qr::set('id','<=', 20));
//hoặc
$ex = ExModel::where('id', '<=', 20)->amount();
```

### Thêm data vào table
model cũng cung cấp phương thức `create` có thể được sử dụng để chèn các bản ghi vào bảng cơ sở dữ liệu. 
>
Phương thức `create` chấp nhận một mảng tên và giá trị cột, sau khi add thành công phương thức add sẽ trả về `id` của trường vừa add vào:
```php
ExModel::create([
    'username' => 'exampleUsername',
    'password' => '123',
    'email' => 'example@example.com'
]);
```

### Cập nhật data trong table
model cũng cung cấp phương thức `update` có thể được sử dụng để cập nhật các bản ghi trong bảng cơ sở dữ liệu.

```php
ExModel::where('id', 20)->update(['email' => 'exampleUp@example.com']);
```

### Xóa data trong table

Phương pháp `delete` của `model` có thể được sử dụng để xóa các bản ghi khỏi bảng. 
Phương thức `delete` trả về số lượng hàng bị ảnh hưởng.
Bạn có thể hạn chế các câu lệnh xóa bằng cách thêm `Query Builder` vào phương thức `delete`:

```php
$usersCount = ExModel::delete(Qr::set()->where('id', '<=', 20));
//hoặc
$usersCount = ExModel::where('id', '<=', 20)->remove();
```

### Insert
Phương thức `insert` sẽ tiến hành thêm mới hoặc cập nhật dữ liệu theo các điều kiện mà cms đưa ra, method `insert` xác định hành động thêm mới hay cập nhật bằng trường id
```php
//Thêm mới
ExModel::insert([
    'title' => 'đây là tiêu đề',
    'excerpt' => 'đây là mô tả',
]);
//cập nhật
ExModel::insert([
    'id' => 10,
    'title' => 'đây là tiêu đề',
    'excerpt' => 'đây là mô tả',
]);
```
### Columns
Để sử dụng phương thức insert bạn cần khai báo danh sách cột trong bảng cần sử dụng
```php
use Skilldo\Model\Model;

class ExModel extends Model
{
    static string $table = 'ex_modal_table';
    
    static array $columns = [
        'title'             => ['string'],
        'slug'              => [
            'datatype'      => ['string'],
            'type'          => 'post',
            'controller'    => 'frontend/post/detail/',
            'dependent'     => 'title'
        ],
        'content'           => ['wysiwyg'],
        'excerpt'           => ['wysiwyg'],
        'seo_title'         => ['string'],
        'seo_description'   => ['string'],
        'seo_keywords'      => ['string'],
        'status'            => ['int', 0],
        'image'             => ['image'],
        'post_type'         => ['string', 'post'],
        'public'            => ['int', 1],
        '_insert_config' => [
            'created'           => true,
            'updated'           => true,
            'seo_title'         => 'title',
            'seo_description'   => 'excerpt'
        ]
    ];
}
```
#### Column thông thường
Các column thông thường như title, name, content... sẻ trỏ đến một mãng chứa giá trị đầu là loại dữ liệu sẽ được lọc, giá trị thứ 2 là giá trị mặc định
Các loại dữ liệu được hỗ trợ

| Loại dữ liệu |    Mô tả     |                                     Hành động                                     |
|:------------:|:------------:|:---------------------------------------------------------------------------------:|
|     int      |  Số nguyên   |                         Dữ liệu sẽ được đưa về số nguyên                          |
|    float     | Số thập phân |                        Dữ liệu sẽ được đưa về số thập phân                        |
|    string    |    Chuổi     |           Dữ liệu sẽ được lọc các thành phần code như html sẽ bị xóa bỏ           |
|     slug     |  Chuổi slug  | Dữ liệu sẽ được lọc các thành phần code như html sẽ bị xóa bỏ và đưa về dạng slug |
|   wysiwyg    |    Chuổi     |                         Dữ liệu sẽ giữ lại code như html                          |
|    price     |     Giá      |                      Dữ liệu sẽ lọc chỉ giữ lại dấu , hay .                       |
|    image     |   Hình ảnh   |                   Dữ liệu sẽ lọc về dạng link hình ảnh của cms                    |
|     file     |     file     |                     Dữ liệu sẽ lọc về dạng link file của cms                      |
|    array     |    array     |          Dữ liệu nhận vào nếu là array sẽ mã hóa serialize về dạng chuổi          |

#### Column slug
Trường slug dùng để tạo router cho một module trong cms

| Loại dữ liệu |  Kiểu  |                    Mô tả                     |
|:------------:|:------:|:--------------------------------------------:|
|   datatype   | array  |              array kiểu dữ liệu              |
|     type     | string |                Module dữ liệu                |
|  controller  | string |       đường dẫn controller chạy module       |
|  dependent   | string | khi slug rỗng sẽ dùng column này để tạo slug |

#### Column _insert_config
Một số cấu hình thêm cho việc insert

| Loại dữ liệu |                                   Mô tả                                    |
|:------------:|:--------------------------------------------------------------------------:|
|   created    |   nếu true khi thêm dữ liệu sẽ tự động thêm thời gian vào column created   |
|   updated    | nếu true khi cập nhật dữ liệu sẽ tự động thêm thời gian vào column updated |
|  seo_title   |   khi thêm mới nếu seo_title trống sẽ lấy giá trị cột chỉ định thay thế    |
