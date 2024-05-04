|                                 |                             |                             |
|---------------------------------|:---------------------------:|----------------------------:|
| [Arr::get](#arrget)             |  [Arr::except](#arrexcept)  |     [Arr::query](#arrquery) |
| [Arr::has](#arrhas)             |  [Arr::exists](#arrexists)  |   [Arr::random](#arrrandom) |
| [Arr::hasAny](#arrhasany)       |   [Arr::first](#arrfirst)   |         [Arr::set](#arrset) |
| [Arr::add](#arradd)             |    [Arr::last](#arrlast)    | [Arr::shuffle](#arrshuffle) |
| [Arr::collapse](#arrcollapse)   |    [Arr::only](#arronly)    |     [Arr::where](#arrwhere) |
| [Arr::crossJoin](#arrcrossjoin) | [Arr::isAssoc](#arrisassoc) |   [Arr::forget](#arrforget) |
| [Arr::divide](#arrdivide)       | [Arr::prepend](#arrprepend) |                             |
| [Arr::dot](#arrdot)             |    [Arr::pull](#arrpull)    |                             |


### `Arr::get()`
Hàm `Arr::get` lấy giá trị từ mảng con sâu bên trong sử dụng kí hiệu "dot":

```php
$array = ['products' => ['desk' => ['price' => 100]]];
$price = Arr::get($array, 'products.desk.price');
// 100
```
Hàm `Arr::get` cũng nhận một giá trị mặc định, và trả lại nếu như một khoá không tìm thấy::

```php
$discount = Arr::get($array, 'products.desk.discount', 0);
// 0
```

### `Arr::has()`
Hàm `Arr::has` kiểm tra xem một item có tồn tại trong mảng hay không sử dụng kí hiệu "dot":

```php
$array = ['product' => ['name' => 'Desk', 'price' => 100]];
$contains = Arr::has($array, 'product.name');
// true

$contains = Arr::has($array, ['product.price', 'product.discount']);
// false
```

### `Arr::hasAny()`
Hàm `Arr::hasAny` kiểm tra xem bất kỳ một item trong mãng cần kiếm có tồn tại trong mảng tìm kiếm hay không sử dụng kí hiệu "dot":

```php
$array = ['product' => ['name' => 'Desk', 'price' => 100]];

$contains = Arr::hasAny($array, 'product.name');
// true

$contains = Arr::hasAny($array, ['product.name', 'product.discount']);
// true

$contains = Arr::hasAny($array, ['category', 'product.discount']);
// false
```

### `Arr::add()`
Hàm `Arr::add` thêm một cặp key / value vào trong mảng nếu key đó chưa tồn tại trong array:

```php
$array = Arr::add(['name' => 'Desk'], 'price', 100);
// ['name' => 'Desk', 'price' => 100]
$array = Arr::add(['name' => 'Desk', 'price' => null], 'price', 100);
// ['name' => 'Desk', 'price' => 100]
```

### `Arr::collapse()`
Hàm `Arr::collapse` gôm các mảng thành một mảng:

```php
$array = Arr::collapse([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
// [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### `Arr::crossJoin()`
Hàm `Arr::crossJoin` chéo các mảng được truyền vào, trả về một mãng Descartes với tất cả các hoán vị có thể:

```php
$matrix = Arr::crossJoin([1, 2], ['a', 'b']);

/*
[
[1, 'a'],
[1, 'b'],
[2, 'a'],
[2, 'b'],
]
*/

$matrix = Arr::crossJoin([1, 2], ['a', 'b'], ['I', 'II']);

/*
[
[1, 'a', 'I'],
[1, 'a', 'II'],
[1, 'b', 'I'],
[1, 'b', 'II'],
[2, 'a', 'I'],
[2, 'a', 'II'],
[2, 'b', 'I'],
[2, 'b', 'II'],
]
*/
```

### `Arr::divide()`
Hàm `Arr::divide` trả về hai mảng, một mảng chứa các key, mảng còn lại chứa các values của mảng gốc:

```php
[$keys, $values] = Arr::divide(['name' => 'Desk']);
// $keys: ['name']
// $values: ['Desk']
```

### `Arr::dot()`
Hàm `Arr::dot` àm flat các mảng đa chiều thành mảng một chiều sử dụng kí hiệu "dot" để đánh đấu độ sâu:

```php
$array = ['products' => ['desk' => ['price' => 100]]];
$flattened = Arr::dot($array);
// ['products.desk.price' => 100]
```

### `Arr::except()`
Hàm `Arr::except` loại bỏ các cặp key / value khỏi mảng:

```php
$array = ['name' => 'Desk', 'price' => 100];
$filtered = Arr::except($array, ['price']);
// ['name' => 'Desk']
```

### `Arr::exists()`
Hàm `Arr::exists` kiểm tra key có tồn tại trong mảng dã cho

```php
$array = ['name' => 'John Doe', 'age' => 17];
$exists = Arr::exists($array, 'name');
// true
$exists = Arr::exists($array, 'salary');
// false
```

### `Arr::first()`
Hàm `Arr::first` trả về phần tử đầu tiên của mảng theo một điều kiện:

```php
$array = [100, 200, 300];

$first = Arr::first($array, function ($value, $key) {
return $value >= 150;
});
// 200
```

Giá trị mặc định cũng có thể được truyền vào ở tham số thứ ba. Giá trị này sẽ được trả lại nếu không có giá trị nào thoả mãn điều kiện:

```php
$first = Arr::first($array, $callback, $default);
```

### `Arr::last()`
Hàm `Arr::last` trả về phần tử cuối cùng của mảng:

```php
$array = [100, 200, 300, 110];

$last = Arr::last($array, function ($value, $key) {
return $value >= 150;
});

// 300
```

Giá trị mặc định cũng có thể được truyền vào ở tham số thứ ba. Giá trị này sẽ được trả lại nếu không có giá trị nào thoả mãn điều kiện:
```php
$last = Arr::last($array, $callback, $default);
```

### `Arr::only()`
Hàm `Arr::only` sẽ trả lại giá trị của các cặp key / value được chỉ định từ một mảng cho trước:

```php
$array = ['name' => 'Desk', 'price' => 100, 'orders' => 10];
$slice = Arr::only($array, ['name', 'price']);
// ['name' => 'Desk', 'price' => 100]
```

### `Arr::isAssoc()`
Hàm `Arr::isAssoc` kiểm trả mãng có phải là một mãng kết hợp. Một mảng được coi là "kết hợp" nếu nó không có các phím số tuần tự bắt đầu bằng số không:
```php
$isAssoc = Arr::isAssoc(['product' => ['name' => 'Desk', 'price' => 100]]);
// true

$isAssoc = Arr::isAssoc([1, 2, 3]);
// false
```

### `Arr::prepend()`
Hàm `Arr::pull` thêm một cặp key / value vào trong mảng nếu key đó chưa tồn tại trong array:

```php
$array = ['one', 'two', 'three', 'four'];
$array = Arr::prepend($array, 'zero');
// ['zero', 'one', 'two', 'three', 'four']
```
Nếu cần, bạn có thể chỉ định key được sử dụng cho giá trị:

```php
$array = ['price' => 100];
$array = Arr::prepend($array, 'Desk', 'name');
// ['name' => 'Desk', 'price' => 100]
```

### `Arr::pull()`
Hàm `Arr::pull` trả lại và xoá một cặp key / value khỏi mảng:

```php
$array = ['name' => 'Desk', 'price' => 100];
$name = Arr::pull($array, 'name');
// $name: Desk
// $array: ['price' => 100]
```

Bạn có thể thiết lập giá trị mặc định sẽ được trả lại nếu khoá không tồn tại:
```php
$value = Arr::pull($array, $key, $default);
```

### `Arr::query()`
Hàm `Arr::query` chuyển mảng thành chuỗi truy vấn:

```php
$array = ['name' => 'Taylor', 'order' => ['column' => 'created_at', 'direction' => 'desc']];
Arr::query($array);
// name=Taylor&order[column]=created_at&order[direction]=desc
```

### `Arr::random()`
Hàm `Arr::random` trả về một giá trị ngẫu nhiên từ một mảng

```php
$array = [1, 2, 3, 4, 5];
$random = Arr::random($array);
```

Bạn cũng có thể xác định số lượng các mục để trở lại như là một lý luận thứ hai tùy chọn. Lưu ý rằng việc cung cấp đối số này sẽ trả về một mảng, ngay cả khi chỉ có một mục mong muốn:

```php
$items = Arr::random($array, 2);
// [2, 5] - (retrieved randomly)
```

### `Arr::set()`
Hàm `Arr::set` thiết lập giá trị sâu trong mảng con sử dụng kí hiệu "dot":

```php
$array = ['products' => ['desk' => ['price' => 100]]];
Arr::set($array, 'products.desk.price', 200);
// ['products' => ['desk' => ['price' => 200]]]
```

### `Arr::shuffle()`
Hàm `Arr::shuffle` sắp xếp ngẫu nhiên Shuffles các mục trong mảng:

```php
$array = Arr::shuffle([1, 2, 3, 4, 5]);
// [3, 2, 5, 1, 4] - (generated randomly)
```

### `Arr::where()`
Hàm `Arr::where` lọc mảng theo một Closure cho trước:

```php
$array = [100, '200', 300, '400', 500];
$filtered = Arr::where($array, function ($value, $key) {
return is_string($value);
});
// [1 => '200', 3 => '400']
```

### `Arr::forget()`
Hàm `Arr::forget` thêm một cặp key / value vào trong mảng nếu key đó chưa tồn tại trong array:

```php
$array = ['products' => ['desk' => ['price' => 100]]];
Arr::forget($array, 'products.desk');
// ['products' => []]
```