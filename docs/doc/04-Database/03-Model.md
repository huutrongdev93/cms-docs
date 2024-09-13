Mỗi bảng cơ sở dữ liệu có một “Model” tương ứng dùng để tương tác với bảng đó. 
Ngoài việc truy xuất các bản ghi từ bảng cơ sở dữ liệu, các mô hình Model còn cho phép bạn chèn, cập nhật và xóa các bản ghi khỏi bảng.

### Model
Để thao tác với một bảng trong cơ sở dữ liệu bạn có thể tạo một model bằng cách kế thừa lại class `model`
```php
use Skilldo\Model\Model;

class ExModel extends Model
{
    // ...
}
```
#### Table Name
Khai báo tên table trong database mà model sẽ theo tác
```php
use Skilldo\Model\Model;

class ExModel extends Model
{
    protected string $table = 'ex_modal_table';
    // ...
}
```

#### Primary Keys
Model cũng sẽ giả định rằng table cơ sở dữ liệu tương ứng của mỗi model có một cột khóa chính có tên `id`. 
Nếu cần, bạn có thể chỉ định $primaryKey trên model của mình để chỉ định một column khác làm khóa chính của model:

```php
use Skilldo\Model\Model;

class ExModel extends Model
{
    protected string $table = 'ex_modal_table';
    
    protected string $primaryKey = 'ex_modal_id';
    // ...
}
```

#### Columns
Chứa danh sách column của table

```php
use Skilldo\Model\Model;

class ExModel extends Model
{
    protected string $table = 'ex_modal_table';
    
    protected string $primaryKey = 'ex_modal_id';
    
    protected array $columns = [
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
Các column thông thường được model tự động tạo từ database, đối với các column có kiểu xử lý dữ liệu đặc biệt bạn sẻ trỏ đến một mãng chứa 2 giá trị,
giá trị đầu là loại dữ liệu, giá trị thứ 2 là giá trị mặc định
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
### Truy Xuất Dữ Liệu
#### Một hàng/cột từ một bảng
Nếu bạn chỉ cần truy xuất một hàng từ bảng cơ sở dữ liệu, bạn có thể sử dụng phương thức `get` hoặc `first` của model. 
Phương thức này sẽ trả về một đối tượng `Model` duy nhất:
> Phương thức get nhận vào một `Query Builder` để tạo câu lệnh query

```php
$ex = ExModel::get(Qr::set('id', 10));

// Find a ExModel by ID
$ex = ExModel::whereKey(10)->first();

// Find a ExModel by ID
$ex = ExModel::find(10);
```

#### Danh sách dữ liệu

Nếu bạn cần lấy danh sách dữ liệu từ bảng cơ sở dữ liệu, bạn có thể sử dụng phương thức `gets` hoặc `fetch` của model.
Phương thức này sẽ trả về một đối tượng `Illuminate\Support\Collection` chứa các `Model`:
> Phương thức nhận vào một `Query Builder` để tạo câu lệnh query

```php
$ex = ExModel::get(Qr::set()->where('id', '<=', 20));

$ex = ExModel::where('id', '<=', 20)->fetch();

$ex = ExModel::whereKey([1,2,3,4,5])->fetch();
```

#### Đếm số lượng data
Nếu bạn cần đếm danh sách dữ liệu từ bảng cơ sở dữ liệu, bạn có thể sử dụng phương thức `count` hoặc `amount` của model.
Phương thức này sẽ trả về số `int`:
> Phương thức nhận vào một `Query Builder` để tạo câu lệnh query

```php
$count = ExModel::count(Qr::set('id','<=', 20));

$count = ExModel::where('id', '<=', 20)->amount();

$max = ExModel::where('active', 1)->max('price');

$sum = ExModel::where('active', 1)->sum('price');
```

### Thêm mới và cập nhật Model
#### Thêm mới
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

#### Cập nhật
model cũng cung cấp phương thức `update` có thể được sử dụng để cập nhật các bản ghi trong bảng cơ sở dữ liệu.
Cập nhật bằng đối tượng Model  

```php
$user = User::find(1);
$user->firstname = 'Updated Fist Name';
$user->save();
```
cập nhật nhiều bản ghi cùng một lúc dựa trên các điều kiện

```php
ExModel::whereKey(20)->update(['email' => 'exampleUp@example.com']);
```
#### Insert
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

Để thiết lập các quy định khi insert data bạn sử dụng thuộc tính rules
```php
use Skilldo\Model\Model;

class ExModel extends Model
{
    protected string $table = 'ex_modal_table';
    
    protected string $primaryKey = 'ex_modal_id';
    
    protected array $rules = [
        //.. 
    ];
}

```
- `slug`: bạn sẽ khai báo khi model của bạn chứa đối tượng có thể tạo ra đường dẫn mà người dùng có thể truy cập được

| Loại dữ liệu |  Kiểu  |                                            Mô tả                                            |
|:------------:|:------:|:-------------------------------------------------------------------------------------------:|
|     type     | string |                                       Module dữ liệu                                        |
|   callback   | string |    Tên `callback` sẽ hiển thị giao diện khi người dùng truy cập đường dẫn `domain/slug`     |
|  dependent   | string | Nếu data dùng để thêm mới không chứa column `slug` thì model sẽ dùng column này để tạo slug |

```php
namespace SkillDo\Model;

class ExModel extends Model
{
    protected string $table = 'ex_modal_table';
    
    protected string $primaryKey = 'ex_modal_id';
    
    protected array $rules = [
        'slug'              => [
            'type'          => 'post',
            'callback'      => 'ThisIsMethodView', 
            'dependent'     => 'title'
        ],
    ];
}
```

```php
function ThisIsMethodView(SkillDo\Http\Request $request, $id) {

    $object = ExModel::find($id);
    
    Cms::setData('object', $object);
    
    $template = Theme::template();
    
    $template->setLayout('layout-file-name');
    
    $template->setView('view-file-name');
}
```

- `Timestamps` : Theo mặc định, Model sử dụng các cột `created` và `updated` trong bảng cơ sở dữ liệu tương ứng với Model của bạn.
Model sẽ tự động lưu thời gian vào các cột này khi model tạo hoặc cập nhật dữ liệu. Nếu bạn không muốn các cột này được Model quản lý tự động, bạn nên đặt created, updated trong rules có giá trị `false`:

| Loại dữ liệu |                                    Mô tả                                     |
|:------------:|:----------------------------------------------------------------------------:|
|   created    |   nếu `true` khi thêm dữ liệu sẽ tự động thêm thời gian vào column created   |
|   updated    | nếu `true` khi cập nhật dữ liệu sẽ tự động thêm thời gian vào column updated |

Nếu bạn cần thay đổi tên của các cột được sử dụng để lưu trữ timestamps, bạn có thể sử dụng các hằng số `CREATED_AT` và `UPDATE_AT` trên Model của mình:
```php
<?php
namespace SkillDo\Model;
class ExModel extends Model
{
    protected string $table = 'ex_modal_table';
    
    protected string $primaryKey = 'ex_modal_id';
    
    const CREATED_AT = 'creation_date';
    
    const UPDATED_AT = 'updated_date';
    
    protected array $rules = [
        'created'  => true,
        'updated'  => true,
    ];
}
```
- `useraction` : Theo mặc định, Model sử dụng các cột `user_created` và `user_updated` trong bảng cơ sở dữ liệu tương ứng với Model của bạn.
  Model sẽ tự động lưu id user đang login vào các cột này khi model tạo hoặc cập nhật dữ liệu. Nếu bạn không muốn các cột này được Model quản lý tự động, bạn nên đặt user_created, user_updated trong rules có giá trị `false`:

| Loại dữ liệu |                                               Mô tả                                                |
|:------------:|:--------------------------------------------------------------------------------------------------:|
| user_created | nếu `true` khi cập nhật dữ liệu sẽ tự động thêm id user hiện đang thao tác vào column user_created |
| user_updated | nếu `true` khi cập nhật dữ liệu sẽ tự động thêm id user hiện đang thao tác vào column user_updated |

Nếu bạn cần thay đổi tên của các cột được sử dụng để lưu trữ `useraction`, bạn có thể sử dụng các hằng số `USER_CREATED_AT` và `USER_UPDATED_AT` trên Model của mình:
```php
<?php
namespace SkillDo\Model;
class ExModel extends Model
{
    protected string $table = 'ex_modal_table';
    
    protected string $primaryKey = 'ex_modal_id';
    
    const USER_CREATED_AT = 'user_add_id';
    
    const USER_CREATED_AT = 'user_up_id';
    
    protected array $rules = [
        'user_created'  => true,
        'user_updated'  => true,
    ];
}
```

- `language` : Nếu Model của bạn có hỗ trợ đâ ngôn ngữ thì bạn đặt gia trị cho `language` là tên module của bạn. Mặc định cms chỉ hỗ trợ đa ngôn ngữ các column có tên là `title`, `name`, `excerpt`, `content`

```php
<?php
namespace SkillDo\Model;
class ExModel extends Model
{
    protected string $table = 'ex_modal_table';
    
    protected string $primaryKey = 'ex_modal_id';
    
    protected array $rules = [
        'language'  => 'ExModel',
    ];
}
```

```php
//Thêm mới
ExModel::insert([
    'title' => 'đây là tiêu đề',
    'excerpt' => 'đây là mô tả',
    'language' => [
        'en' => [
            'title' => 'this is title',
            'excerpt' => 'this is description',
        ]
    ]
]);
```

- `hooks` dùng để thay đổi các hook mặc định của method insert

  | Loại dữ liệu |  Kiểu  |                                    Mô tả                                     |
    |:------------:|:------:|:----------------------------------------------------------------------------:|
  |   columns    | string |                 Tên hook dùng để cập nhật các trường columns                 |
  |     data     | string | Tên hook dùng để cập nhật các dữ liệu trước khi add hoặc update vào database |

```php
<?php
namespace SkillDo\Model;
class ExModel extends Model
{
    protected string $table = 'ex_modal_table';
    
    protected string $primaryKey = 'ex_modal_id';
    
    protected array $rules = [
        'hooks'    => [
            'columns' => 'columns_db_ex_modal_table',
            'data' => 'pre_insert_ex_modal_table_data',
        ]
    ];
}
```

- `add` Để thêm một số quy định cho lúc thêm mới dữ liệu

| Loại dữ liệu |                                       Mô tả                                       |
|:------------:|:---------------------------------------------------------------------------------:|
|    takeIt    | Danh sách các trường nếu bỏ trống sẽ tự động lấy dư liệu của trường khác thay thế |
|   require    |                   Danh sách các trường bắt buộc phải có giá trị                   |

```php
<?php
namespace SkillDo\Model;
class ExModel extends Model
{
    protected string $table = 'ex_modal_table';
    
    protected string $primaryKey = 'ex_modal_id';
    
    protected array $rules = [
        'add'               => [
            'takeIt' => [
                'seo_title'         => 'title',
                'seo_description'   => 'excerpt',
            ],
            'require' => [
                'title' => 'Tiêu đề trang không được để trống'
            ]
        ]
    ];
}
```
Lúc thêm dữ liệu nếu column `seo_title` không có giá trị sẽ tự động lấy giá trị từ trường `title`  
Lúc thêm dữ liệu nếu column `seo_description` không có giá trị sẽ tự động lấy giá trị từ trường `excerpt`  

### Xóa dữ liệu

- Để xóa một model, bạn có thể gọi phương thức remove trên model instance:

```php 
$page = SkillDo\Model\Page::find(1);
$page->remove();
```

- Xóa model bằng Queries

Phương thức `delete` của `model` có thể được sử dụng để xóa các bản ghi khỏi bảng.
Phương thức `delete` trả về số lượng hàng bị ảnh hưởng.
Bạn có thể hạn chế các câu lệnh xóa bằng cách thêm `Query Builder` vào phương thức `delete`:
```php
ExModel::delete(Qr::set()->where('id', '<=', 20));
//hoặc
ExModel::where('id', '<=', 20)->remove();
```

- Bạn có thể gọi phương thức `truncate` để xóa tất cả dữ liệu của model. Thao tác `truncate` cũng sẽ đặt lại mọi ID auto-incrementing trên bảng được liên kết của model:

```php
ExModel::truncate();
```

### Soft Deleting

Ngoài việc thực sự xóa các bản ghi khỏi cơ sở dữ liệu của bạn, Model còn có thể "soft delete" các model. 
Khi các model bị xóa mềm, chúng không thực sự bị xóa khỏi cơ sở dữ liệu của bạn. 
Thay vào đó, column `trash` được đặt trên model cho biết model đã bị "xóa". Để bật tính năng "soft delete" cho một model, hãy thêm trait `SkillDo\Traits\SoftDeletes` vào model:

```php
<?php
namespace SkillDo\Model;

use SkillDo\Traits\SoftDeletes;

class ExModel extends Model
{
    use SoftDeletes;
}
```

Bạn cũng nên thêm cột `trash` vào cơ sở dữ liệu của mình.

```php
if(!schema()->hasTable('ex_modal_table')) {
    schema()->create('ex_modal_table', function (Blueprint $table) {
        $table->tinyInteger('trash')->default(0);
    });
}
```

#### Trash
Cho một đối tượng model vào thùng rác

```php
$object = ExModel::find(1);
$object->trash();
```
Cho nhiều đối tượng model vào thùng rác

```php
ExModel::whereKey([1,2,3,4,5])->trash();
```

#### Restore

Đôi khi bạn có thể muốn "bỏ xóa" một object đã xóa mềm. Để khôi phục một model đã bị xóa tạm thời, bạn có thể gọi phương thức `restore`  

Khôi phục một đối tượng model

```php
$object = ExModel::where('trash', 1)->first();
$object->restore();
```
Khôi phục nhiều đối tượng model

```php
ExModel::whereKey([1,2,3,4,5])->where('trash', 1)->restore();
```
