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

Nếu bạn cần lấy danh sách dữ liệu từ bảng cơ sở dữ liệu, bạn có thể sử dụng phương thức `gets` hoặc `fetch` của model.
Phương thức này sẽ trả về một đối tượng `Illuminate\Support\Collection` chứa các `stdClass`:
> Phương thức nhận vào một `Query Builder` để tạo câu lệnh query

```php
$ex = = ExModel::get(Qr::set()->where('id', '<=', 20));
//hoặc
$ex = ExModel::where('id', '<=', 20)->fetch();
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
#### Columns
Để sử dụng phương thức insert bạn cần khai báo danh sách cột trong bảng cần sử dụng
```php
use Skilldo\Model\Model;

class ExModel extends Model
{
    static string $table = 'ex_modal_table';
    
    static array $columns = [
        'title'             => ['string'],
        'slug'              => ['string'],
        'content'           => ['wysiwyg'],
        'excerpt'           => ['wysiwyg'],
        'seo_title'         => ['string'],
        'seo_description'   => ['string'],
        'seo_keywords'      => ['string'],
        'status'            => ['int', 0],
        'image'             => ['image'],
        'post_type'         => ['string', 'post'],
        'public'            => ['int', 1],
    ];
}
```
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

#### Rules insert
Để thiết lập các quy định khi insert data bạn sử dụng thuộc tính rules
```php
static array $rules = [
    'slug'              => [
        'type'          => 'post',
        'controller'    => 'frontend/post/detail/',
        'dependent'     => 'title'
    ],
    'created'  => true,
    'updated'  => true,
    'user_created'      => true,
    'user_updated'      => true,
    'language'          => true,
    'add'               => [
        'takeIt' => [
            'seo_title'         => 'title',
            'seo_description'   => 'excerpt',
        ],
        'require' => [
            'title' => trans('Tiêu đề trang không được để trống')
        ]
    ],
    'hooks'    => [
        'columns' => 'columns_db_branch',
        'data' => 'pre_insert_branch_data',
    ]
];
```
- `slug` dùng để tạo router cho một module trong cms

| Loại dữ liệu |  Kiểu  |                    Mô tả                     |
|:------------:|:------:|:--------------------------------------------:|
|     type     | string |                Module dữ liệu                |
|  controller  | string |       đường dẫn controller chạy module       |
|  dependent   | string | khi slug rỗng sẽ dùng column này để tạo slug |

- Một số cấu hình thêm cho việc insert

| Loại dữ liệu |                                                        Mô tả                                                        |
|:------------:|:-------------------------------------------------------------------------------------------------------------------:|
|   created    |                       nếu true khi thêm dữ liệu sẽ tự động thêm thời gian vào column created                        |
|   updated    |                     nếu true khi cập nhật dữ liệu sẽ tự động thêm thời gian vào column updated                      |
| user_created |          nếu true khi cập nhật dữ liệu sẽ tự động thêm id user hiện đang thao tác vào column user_created           |
| user_updated |          nếu true khi cập nhật dữ liệu sẽ tự động thêm id user hiện đang thao tác vào column user_updated           |
|   language   |                                      Module dữ liệu để thêm vào bảng language                                       |
|    getQr     | Khi cập nhật data cần lấy object trước đó theo id nếu bạn muốn tùy chỉnh điều kiện lấy dữ liệu có thể sử dụng getQr |
- `hooks` dùng để thay đổi các hook mặc định của method insert

  | Loại dữ liệu |  Kiểu  |                                    Mô tả                                     |
  |:------------:|:------:|:----------------------------------------------------------------------------:|
  |   columns    | string |                 Tên hook dùng để cập nhật các trường columns                 |
  |     data     | string | Tên hook dùng để cập nhật các dữ liệu trước khi add hoặc update vào database |

- `add` Để thêm một số quy định cho lúc thêm mới dữ liệu

| Loại dữ liệu |                                       Mô tả                                       |
|:------------:|:---------------------------------------------------------------------------------:|
|    takeIt    | Danh sách các trường nếu bỏ trống sẽ tự động lấy dư liệu của trường khác thay thế |
|   require    |                        Danh sách các trường bắt buộc điền                         |
