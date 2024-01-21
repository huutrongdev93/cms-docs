Mỗi bảng cơ sở dữ liệu có một “Model” tương ứng dùng để tương tác với bảng đó. 
Ngoài việc truy xuất các bản ghi từ bảng cơ sở dữ liệu, các mô hình Model còn cho phép bạn chèn, cập nhật và xóa các bản ghi khỏi bảng.

## Model
Để thao tác với một bảng trong cơ sở dữ liệu bạn có thể sử dụng function `model`, để thao tác với table nào bạn chỉ cần truyền tên table vào function model
```php
$model = model($table);
```
### Truy xuất một hàng/cột từ một bảng
Nếu bạn chỉ cần truy xuất một hàng từ bảng cơ sở dữ liệu, bạn có thể sử dụng phương thức `get` của model. 
Phương thức này sẽ trả về một đối tượng `stdClass` duy nhất:
> Phương thức nhận vào một `Query Builder` để tạo câu lệnh query

```php
$user = model('users')->get(Qr::set('id', 10));
```

### Truy xuất danh sách các giá trị cột

Nếu bạn cần lấy danh sách dữ liệu từ bảng cơ sở dữ liệu, bạn có thể sử dụng phương thức `gets` của model.
Phương thức này sẽ trả về một đối tượng `Illuminate\Support\Collection` chứa các `stdClass`:
> Phương thức nhận vào một `Query Builder` để tạo câu lệnh query

```php
$users = model('users')->get(Qr::set()->where('id', '<=', 20));
```

### Đếm số lượng hàng data
Nếu bạn cần đếm danh sách dữ liệu từ bảng cơ sở dữ liệu, bạn có thể sử dụng phương thức `count` của model.
Phương thức này sẽ trả về số `int`:
> Phương thức nhận vào một `Query Builder` để tạo câu lệnh query

```php
$user = model('users')->count(Qr::set('id', 10));
```

### Thêm data vào table
model cũng cung cấp phương thức `add` có thể được sử dụng để chèn các bản ghi vào bảng cơ sở dữ liệu. 
>
Phương thức `add` chấp nhận một mảng tên và giá trị cột, sau khi add thành công phương thức add sẽ trả về `id` của trường vừa add vào:
```php
model('users')->add([
    'username' => 'exampleUsername',
    'password' => '123',
    'email' => 'example@example.com'
]);
```

### Cập nhật data trong table
model cũng cung cấp phương thức `update` có thể được sử dụng để cập nhật các bản ghi trong bảng cơ sở dữ liệu.
>
Phương thức `update` chấp nhận 2 đối số: một 

| Arguments | Type  |                              Description |
|-----------|:-----:|-----------------------------------------:|
| $update   | array | mảng tên và giá trị các cột cần cập nhật |
| $query    |  Qr   |     Query builder tạo điều kiện cập nhật |

```php
model('users')->update(['email' => 'exampleUp@example.com'], Qr::set()->where('id', 20));
```

### Xóa data trong table

Phương pháp `delete` của `model` có thể được sử dụng để xóa các bản ghi khỏi bảng. 
Phương thức `delete` trả về số lượng hàng bị ảnh hưởng.
Bạn có thể hạn chế các câu lệnh xóa bằng cách thêm `Query Builder` vào phương thức `delete`:

```php
$usersCount = model('users')->delete(Qr::set()->where('id', '<=', 20));
```