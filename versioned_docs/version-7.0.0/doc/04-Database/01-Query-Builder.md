Trình tạo truy vấn cơ sở dữ liệu của SkillDo cung cấp giao diện thuận tiện, trôi chảy để tạo và chạy các truy vấn cơ sở dữ liệu. 
Nó có thể được sử dụng với `model` để thực hiện hầu hết các hoạt động cơ sở dữ liệu

### Khai báo
Để sử dụng query builder bạn có thể dùng `Qr::set()` để khởi tạo query builder

```php
$args = Qr::set();
//Các tham số truyền vào set tương ứng với điều kiện where
$args = Qr::set($column, $operator, $value);
//Truyền vào number tương đương với where('id', $number)
$args =  Qr::set($number);

$user = model('users')->get($args);

//hoặc
$user = model('users')::where('id', $id)->first();
```

### Select

Bạn có thể không phải lúc nào cũng muốn chọn tất cả các cột từ bảng cơ sở dữ liệu. Sử dụng phương pháp này, bạn có thể chỉ định mệnh đề "select" tùy chỉnh cho truy vấn:select

```php
$args = Qr::set()->select('id', 'name');

$user = model('users')->get($args);

//hoặc
$user = model('users')::select('id', 'name')->first();
```

Đôi khi bạn có thể cần chèn một chuỗi tùy ý vào một truy vấn. Để tạo biểu thức chuỗi thô, bạn có thể sử dụng phương thức được cung cấp

```php
use Illuminate\Database\Capsule\Manager as DB;
$args = Qr::set()->select(DB::raw('count(*) as user_count, status'));
$user = model('users')->get($args);
//hoặc sử dụng
$args = Qr::set()->selectRaw('price * ? as price_with_tax', [1.0825]);
$product = model('products')->get($args);

//hoặc sử dụng
$product = model('products')::selectRaw('price * ? as price_with_tax', [1.0825])->first();
```

### Joins
```php
Inner Join Clause
Qr::set()->join('contacts', 'users.id', '=', 'contacts.user_id')
Left Join / Right Join Clause
Qr::set()->leftJoin('posts', 'users.id', '=', 'posts.user_id')
Qr::set()->rightJoin('posts', 'users.id', '=', 'posts.user_id')
```
### Where Clauses
Bạn có thể sử dụng method `where` của `Qr` để thêm mệnh đề "where" vào truy vấn. Cuộc gọi cơ bản nhất đến phương thức yêu cầu ba đối số. 
Đối số đầu tiên là tên của cột. Đối số thứ hai là một toán tử, có thể là bất kỳ toán tử nào được hỗ trợ của cơ sở dữ liệu. Đối số thứ ba là giá trị để so sánh với giá trị của cột

```php
$args = Qr::set()->where('votes', '=', 100)->where('age', '>', 35);
$exm = model('table')->gets($args);
//hoặc
$exm = model('table')::where('votes', '=', 100)->where('age', '>', 35)->fetch();
```

Để thuận tiện, nếu bạn muốn xác minh rằng một cột là một giá trị nhất định, bạn có thể chuyển giá trị làm đối số thứ hai cho phương thức. Query sẽ giả sử bạn muốn sử dụng toán tử: `=`
```php
$args = Qr::set()->where('votes', 100);
$exm = model('table')->gets($args);
//hoặc
$exm = model('table')::where('votes', 100)->fetch();
```
Như đã đề cập trước đây, bạn có thể sử dụng bất kỳ toán tử nào được hệ thống cơ sở dữ liệu của bạn hỗ trợ:
```php
$args = Qr::set()
    ->where('votes', '>=', 100)
    ->where('votes', '<>', 100)
    ->where('name', 'like', 'T%');
$exm = model('table')->gets($args);

//hoặc
$exm = model('table')::where('votes', '>=', 100)
    ->where('votes', '<>', 100)
    ->where('name', 'like', 'T%')
    ->fetch();
```
### Or Where Clauses

```php
$args = Qr::set()
    ->where('votes', '>', 100)
    ->orWhere('name', 'John');
$exm = model('table')->gets($args);
//hoặc
$exm = model('table')::where('votes', '>', 100)->orWhere('name', 'John')->fetch();
```

Nếu bạn cần nhóm một điều kiện "hoặc" trong ngoặc đơn, bạn có thể chuyển một Qr làm đối số đầu tiên cho phương thức

```php
$args = Qr::set()
    ->where('votes', '>', 100)
    ->orWhere(function($query) { $query->where('name', 'Abigail')->where('votes', '>', 50); });

$exm = model('table')->gets($args);

//hoặc
$exm = model('table')::where('votes', '>', 100)
    ->orWhere(function($query) {
        $query->where('name', 'Abigail')->where('votes', '>', 50); 
    })->fetch();
```

Ví dụ sẽ tạo mẫu SQL

```php
where votes > 100 or (name = 'Abigail' and votes > 50)
```

### Additional Where Clauses

#### whereIn / whereNotIn / orWhereIn / orWhereNotIn
Phương thức xác minh rằng giá trị của một cột đã cho được chứa trong mảng đã cho

```php
$args = Qr::set()->whereIn('id', [1, 100])
$args = Qr::set()->whereNotIn('id', [1, 100])
```

#### whereBetween / orWhereBetween
Phương pháp xác minh rằng giá trị của một cột nằm giữa hai giá trị

```php
$args = Qr::set()->whereBetween('votes', [1, 100])
```

#### whereNotBetween / orWhereNotBetween
Phương pháp xác minh rằng giá trị của một cột không nằm giữa hai giá trị

```php
$args = Qr::set()->whereNotBetween('votes', [1, 100])
```


### Ordering, Grouping, Limit & Offset

#### Ordering
Phương pháp này cho phép bạn sắp xếp kết quả của truy vấn theo một cột nhất định. Đối số đầu tiên được chấp nhận bởi phương thức phải là cột bạn muốn sắp xếp theo, trong khi đối số thứ hai xác định cách sắp xếp
```php
$args = Qr::set()
    ->orderBy('name', 'desc')
    ->orderBy('email', 'asc');
$exm = model('table')->gets($args);

$args = Qr::set()
    ->orderByDesc('name');
$exm = model('table')->gets($args);
```

#### Grouping
Như bạn mong đợi, các phương thức `groupBy` và `having` có thể được sử dụng để nhóm các kết quả truy vấn. phương thức `having` tương tự như phương thức Where:
```php
$args = Qr::set()
    ->groupBy('account_id')
    ->having('account_id', '>', 100);
$exm = model('table')->gets($args);
```

#### Limit & Offset
Bạn có thể sử dụng các phương thức `limit` và `offset` để set số lượng kết quả được trả về từ truy vấn:

```php
$args = Qr::set()
    ->offset(10)
    ->limit(5);
$exm = model('table')->gets($args);
```