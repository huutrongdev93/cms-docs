Trình tạo truy vấn cơ sở dữ liệu của SkillDo cung cấp giao diện thuận tiện, trôi chảy để tạo và chạy các truy vấn cơ sở dữ liệu. 
Nó có thể được sử dụng với `model` để thực hiện hầu hết các hoạt động cơ sở dữ liệu

### Khai báo
Để sử dụng query builder bạn có thể dùng `Qr::set()` để khởi tạo query builder

```php
use SkillDo\DB;

$users = DB::table('users')->get();

$user = DB::table('users')->where('id', $id)->first();
```

### Select

Bạn có thể không phải lúc nào cũng muốn chọn tất cả các cột từ bảng cơ sở dữ liệu. Sử dụng phương pháp này, bạn có thể chỉ định mệnh đề "select" tùy chỉnh cho truy vấn:select

```php
$users = DB::table('users')->select('id', 'name')->get();

$user = DB::table('users')->select('id', 'name')->first();
```

Đôi khi bạn có thể cần chèn một chuỗi tùy ý vào một truy vấn. Để tạo biểu thức chuỗi thô, bạn có thể sử dụng phương thức được cung cấp

```php
use SkillDo\DB;

$users = DB::table('users')->select(DB::raw('count(*) as user_count, status'))->get();

$products = DB::table('products')->selectRaw('price * ? as price_with_tax', [1.0825])->get();

$product = DB::table('products')->selectRaw('price * ? as price_with_tax', [1.0825])->first();
```

### Joins
```php
//Inner Join Clause
DB::table('users')->join('contacts', 'users.id', '=', 'contacts.user_id')->get();

//Left Join / Right Join Clause
DB::table('users')->leftJoin('posts', 'users.id', '=', 'posts.user_id')->get();

DB::table('users')->rightJoin('posts', 'users.id', '=', 'posts.user_id')->get();
```
### Where Clauses
Bạn có thể sử dụng method `where` của `Qr` để thêm mệnh đề "where" vào truy vấn. Cuộc gọi cơ bản nhất đến phương thức yêu cầu ba đối số. 
Đối số đầu tiên là tên của cột. Đối số thứ hai là một toán tử, có thể là bất kỳ toán tử nào được hỗ trợ của cơ sở dữ liệu. Đối số thứ ba là giá trị để so sánh với giá trị của cột

```php
$exm = DB::table('table')->where('votes', '=', 100)->where('age', '>', 35)->get();
```

Để thuận tiện, nếu bạn muốn xác minh rằng một cột là một giá trị nhất định, bạn có thể chuyển giá trị làm đối số thứ hai cho phương thức. Query sẽ giả sử bạn muốn sử dụng toán tử: `=`
```php
$exm = DB::table('table')->where('votes', 100)->get();
```
Như đã đề cập trước đây, bạn có thể sử dụng bất kỳ toán tử nào được hệ thống cơ sở dữ liệu của bạn hỗ trợ:
```php
$exm = DB::table('table')
    ->where('votes', '>=', 100)
    ->where('votes', '<>', 100)
    ->where('name', 'like', 'T%')
    ->get();
```
### Or Where Clauses

```php
$exm = DB::table('table')
    ->where('votes', '>', 100)
    ->orWhere('name', 'John');
    ->get();
```

Nếu bạn cần nhóm một điều kiện "hoặc" trong ngoặc đơn, bạn có thể chuyển một Qr làm đối số đầu tiên cho phương thức

```php
$exm = DB::table('table')
        ->where('votes', '>', 100)
        ->orWhere(function($query) { 
            $query->where('name', 'Abigail')->where('votes', '>', 50); 
        })
        ->get();
```

Ví dụ sẽ tạo mẫu SQL

```php
where votes > 100 or (name = 'Abigail' and votes > 50)
```

### Additional Where Clauses

#### whereIn / whereNotIn / orWhereIn / orWhereNotIn
Phương thức xác minh rằng giá trị của một cột đã cho được chứa trong mảng đã cho

```php
$args = DB::table('table')->whereIn('id', [1, 100])
$args = DB::table('table')->whereNotIn('id', [1, 100])
```

#### whereBetween / orWhereBetween
Phương pháp xác minh rằng giá trị của một cột nằm giữa hai giá trị

```php
$args = DB::table('table')->whereBetween('votes', [1, 100])
```

#### whereNotBetween / orWhereNotBetween
Phương pháp xác minh rằng giá trị của một cột không nằm giữa hai giá trị

```php
$args = DB::table('table')->whereNotBetween('votes', [1, 100])
```


### Ordering, Grouping, Limit & Offset

#### Ordering
Phương pháp này cho phép bạn sắp xếp kết quả của truy vấn theo một cột nhất định. Đối số đầu tiên được chấp nhận bởi phương thức phải là cột bạn muốn sắp xếp theo, trong khi đối số thứ hai xác định cách sắp xếp
```php
$exm = DB::table('table')
    ->orderBy('name', 'desc')
    ->orderBy('email', 'asc')
    ->get();
```

#### Grouping
Như bạn mong đợi, các phương thức `groupBy` và `having` có thể được sử dụng để nhóm các kết quả truy vấn. phương thức `having` tương tự như phương thức Where:
```php
$exm = DB::table('table')
    ->groupBy('account_id')
    ->having('account_id', '>', 100)
    ->get();
```

#### Limit & Offset
Bạn có thể sử dụng các phương thức `limit` và `offset` để set số lượng kết quả được trả về từ truy vấn:

```php
$exm = DB::table('table')
    ->offset(10)
    ->limit(5)
    ->get();
```

### Delete Statements
Method `delete` của Query builder có thể được sử dụng để xóa các bản ghi khỏi bảng.
Method `delete` trả về số lượng hàng bị ảnh hưởng. 
Bạn có thể hạn chế các câu lệnh xóa bằng cách thêm mệnh đề "where" trước khi gọi phương thức xóa:

```php
$deleted = DB::table('users')->delete();
 
$deleted = DB::table('users')->where('votes', '>', 100)->delete();
```

Nếu bạn muốn xóa toàn bộ bảng, thao tác này sẽ xóa tất cả bản ghi khỏi bảng và đặt lại auto-incrementing ID về 0, bạn có thể sử dụng phương thức `truncate`:

```php
DB::table('users')->truncate();
```