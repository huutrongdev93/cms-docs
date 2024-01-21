|                                     |                                       |                                       |
|-------------------------------------|:-------------------------------------:|--------------------------------------:|
| [Str::clear](#strclear)             |       [Str::finish](#strfinish)       | [Str::replaceFirst](#strreplacefirst) |
| [Str::after](#strafter)             |           [Str::is](#stris)           |   [Str::replaceLast](#strreplacelast) |
| [Str::afterLast](#strafterlast)     | [Str::isSerialized](#strisserialized) |               [Str::ascii](#strascii) |
| [Str::before](#strbefore)           |   [Str::startsWith](#strstartswith)   |                 [Str::slug](#strslug) |
| [Str::beforeLast](#strbeforelast)   |       [Str::length](#strlength)       |               [Str::price](#strprice) |
| [Str::between](#strbetween)         |        [Str::limit](#strlimit)        |             [Str::substr](#strsubstr) |
| [Str::contains](#strcontains)       |        [Str::lower](#strlower)        |           [Str::ucfirst](#strucfirst) |
| [Str::containsAll](#strcontainsall) |        [Str::upper](#strupper)        |               [Str::title](#strtitle) |
| [Str::endsWith](#strendswith)       | [Str::replaceArray](#strreplacearray) |                                       |
| [Str::start](#strstart)             | [Str::replaceArray](#strreplacearray) |                                       |


### `Str::clear`
Hàm `Str::clear` xóa tất cả tag html khỏi chuỗi

```php
$slice = Str::clear('<p>This is <b>my name</b></p>');
// 'This is my name'
```

### `Str::after`
Hàm `Str::after` trả về mọi thứ sau một key đã cho trong một chuỗi. Toàn bộ chuỗi sẽ được trả lại nếu key không tồn tại trong chuỗi

```php
$slice = Str::after('This is my name', 'This is');
// ' my name'
```

### `Str::afterLast`
Hàm `Str::afterLast` trả về mọi thứ sau lần xuất hiện cuối cùng của key đã cho trong một chuỗi. Toàn bộ chuỗi sẽ được trả lại nếu key không tồn tại trong chuỗi

```php
$slice = Str::afterLast('App\Http\Controllers\Controller', '\\');
// 'Controller'
```

### `Str::before`
Hàm `Str::before` trả về mọi thứ trước một key đã cho trong một chuỗi. Toàn bộ chuỗi sẽ được trả lại nếu key không tồn tại trong chuỗi

```php
$slice = Str::before('This is my name', 'my name');
// 'This is '
```

### `Str::beforeLast`
Hàm `Str::beforeLast` trả về mọi thứ trước lần xuất hiện cuối cùng của key đã cho trong một chuỗi. Toàn bộ chuỗi sẽ được trả lại nếu key không tồn tại trong chuỗi

```php
$slice = Str::beforeLast('This is my name', 'is');
// 'This '
```

### `Str::between`
Hàm `Str::between` trả về phần chuỗi giữa hai giá trị

```php
$slice = Str::between('This is my name', 'This', 'name');
// ' is my '
```

### `Str::contains`
Hàm `Str::contains` cho biết nếu một chuỗi có chứa một chuỗi con khác hay không

```php
$contains = Str::contains('This is my name', 'my');
// true
```
Bạn cũng có sử dụng một mảng các giá trị để xác định nếu chuỗi cho trước chứa bất kỳ giá trị nào trong mãng

```php
$contains = Str::contains('This is my name', ['my', 'foo']);
// true
```

### `Str::containsAll`
Hàm `Str::containsAll` xác định xem chuỗi đã cho có chứa tất cả các giá trị trong một mảng hay không:
```php
$containsAll = Str::containsAll('This is my name', ['my', 'name']);
// true
```

### `Str::endsWith`
Hàm `Str::endsWith` cho biết nếu chuỗi cho trước kết thúc với giá trị kiểm tra

```php
$result = Str::endsWith('This is my name', 'name');
// true
```
Bạn cũng có sử dụng một mảng các giá trị để xác định nếu chuỗi cho trước kết thúc bất kỳ giá trị nào trong mãng

```php
$result = Str::endsWith('This is my name', ['name', 'foo']);
// true

$result = Str::endsWith('This is my name', ['this', 'foo']);
// false
```

### `Str::startsWith`
Hàm `Str::startsWith` cho biết nếu một chuỗi bắt đầu bằng một chuỗi con cho trước hay không

```php
$result = Str::startsWith('This is my name', 'This');
// true
```

### `Str::start`
Hàm `Str::start` têm một kỹ tự cho một chuỗi nếu nó không đã bắt đầu với ký tự cần thêm vào

```php
$adjusted = Str::start('this/string', '/');
// /this/string

$adjusted = Str::start('/this/string', '/');
// /this/string
```

### `Str::finish`
Hàm `Str::finish` thêm một kí tự vào cuối một chuỗi

```php
$adjusted = Str::finish('this/string', '/');
// this/string/
$adjusted = Str::finish('this/string/', '/');
// this/string/
```

### `Str::is`
Hàm `Str::is` cho biết nếu một chuỗi có khớp với một pattern nào không. Dấu * có thể đươc dùng để đánh dấu wildcards

```php
$matches = Str::is('foo*', 'foobar');
// true
$matches = Str::is('baz*', 'foobar');
// false
```

### `Str::isSerialized`
Hàm `Str::isSerialized` cho biết một chuổi có phải là chuổi định dạng serialized


### `Str::length`
Hàm `Str::length` trả về độ dài của chuỗi đã cho

```php
$length = Str::length('skilldo');
// 7
```

### `Str::limit`
Hàm `Str::limit` truncates chuỗi theo chiều dài được chỉ định

```php
$truncated = Str::limit('The quick brown fox jumps over the lazy dog', 20);
// The quick brown fox...
```
Bạn cũng có thể sử dụng đối số thứ ba để thay đổi chuỗi sẽ được thêm vào cuối:

```php
$truncated = Str::limit('The quick brown fox jumps over the lazy dog', 20, ' (...)');
// The quick brown fox (...)
```

### `Str::lower`
Hàm `Str::lower` chuyển chuỗi thành chữ thường

```php
$converted = Str::lower('LARAVEL');
// laravel
```

### `Str::upper`
Hàm `Str::upper` chuyển chuỗi đã cho thành chữ hoa

```php
$string = Str::upper('SkillDo');
// SKILLDO
```

### `Str::random`
Hàm `Str::random` tạo ra một chuỗi ngẫu nhiên chiều dài được chỉ định

```php
$random = Str::random(40);
```

### `Str::replaceArray`
Hàm `Str::replaceArray` thay thế một giá trị nhất định trong chuỗi tuần tự bằng cách sử dụng một mảng

```php
$string = 'The event will take place between ? and ?';
$replaced = Str::replaceArray('?', ['8:30', '9:00'], $string);
// The event will take place between 8:30 and 9:00
```

### `Str::replaceFirst`
Hàm `Str::replaceFirst` thay thế key xuất hiện đầu tiên của một giá trị trong một chuỗi.

```php
$replaced = Str::replaceFirst('the', 'a', 'the quick brown fox jumps over the lazy dog');
// a quick brown fox jumps over the lazy dog
```

### `Str::replaceLast`
Hàm `Str::replaceLast` thay thế key xuất hiện cuối cùng của một giá trị trong một chuỗi

```php
$replaced = Str::replaceLast('the', 'a', 'the quick brown fox jumps over the lazy dog');
// the quick brown fox jumps over a lazy dog
```

### `Str::ascii`
Hàm `Str::ascii` chuyển chuỗi thành một giá trị ASCII

```php
$slice = Str::ascii('û');
// 'u'
```

### `Str::slug`
Hàm `Str::slug` tạo ra một URL thân thiện "slug" từ chuỗi cho trước

```php
$slug = Str::slug('SKILLDO 7 CMS', '-');
// skilldo-7-cms
```

### `Str::price`
Hàm `Str::price` xóa các kỹ tự ".", "," khỏi chuổi và trả về biến kiểu int

```php
$price = Str::price('1.000.000');
//1000000
```

### `Str::substr`
Hàm `Str::substr` trả về phần chuỗi được chỉ định bởi tham số bắt đầu và độ dài

```php
$converted = Str::substr('The Skilldo CMS', 4, 7);
//Skilldo
```

### `Str::ucfirst`
Hàm `Str::ucfirst` viết hoa ký tự đầu tiên của chuổi

```php
$string = Str::ucfirst('foo bar');
// Foo bar
```

### `Str::title`
Hàm `Str::title` in hoa chữ cái đầu của từ trong chuổi

```php
$converted = Str::title('a nice title uses the correct case');
// A Nice Title Uses The Correct Case
```

### `Str::of`
Hàm `Str::of` Xử lý chuổi theo hướng đối tượng