# String

> **Namespace:** `Illuminate\Support\Str`
> **Alias ngắn:** `\Str`
> **Tài liệu tham khảo:** [Laravel String Helpers](https://laravel.com/docs/12.x/strings#strings-method-list)

SkillDo CMS v8 mở rộng `Illuminate\Support\Str` của Laravel, bổ sung thêm các phương thức đặc thù như `Str::clear()`, `Str::price()`, `Str::isSerialized()`. Tất cả gọi bằng alias `Str::`.

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
| [Str::endsWith](#strendswith)       | [Str::replaceArray](#strreplacearray) |               [Str::of](#strof)       |
| [Str::start](#strstart)             |       [Str::random](#strrandom)       |                                       |


### `Str::clear`
Hàm `Str::clear` xóa tất cả tag HTML khỏi chuỗi:

```php
$slice = Str::clear('<p>This is <b>my name</b></p>');
// 'This is my name'
```

### `Str::after`
Hàm `Str::after` trả về mọi thứ sau một key đã cho trong một chuỗi. Toàn bộ chuỗi sẽ được trả lại nếu key không tồn tại trong chuỗi:

```php
$slice = Str::after('This is my name', 'This is');
// ' my name'
```

### `Str::afterLast`
Hàm `Str::afterLast` trả về mọi thứ sau lần xuất hiện cuối cùng của key đã cho trong một chuỗi:

```php
$slice = Str::afterLast('App\Http\Controllers\Controller', '\\');
// 'Controller'
```

### `Str::before`
Hàm `Str::before` trả về mọi thứ trước một key đã cho trong một chuỗi:

```php
$slice = Str::before('This is my name', 'my name');
// 'This is '
```

### `Str::beforeLast`
Hàm `Str::beforeLast` trả về mọi thứ trước lần xuất hiện cuối cùng của key đã cho trong một chuỗi:

```php
$slice = Str::beforeLast('This is my name', 'is');
// 'This '
```

### `Str::between`
Hàm `Str::between` trả về phần chuỗi giữa hai giá trị:

```php
$slice = Str::between('This is my name', 'This', 'name');
// ' is my '
```

### `Str::contains`
Hàm `Str::contains` cho biết nếu một chuỗi có chứa một chuỗi con khác hay không:

```php
$contains = Str::contains('This is my name', 'my');
// true
```
Bạn cũng có thể sử dụng một mảng các giá trị để xác định nếu chuỗi cho trước chứa bất kỳ giá trị nào trong mảng:

```php
$contains = Str::contains('This is my name', ['my', 'foo']);
// true
```

### `Str::containsAll`
Hàm `Str::containsAll` xác định xem chuỗi đã cho có chứa **tất cả** các giá trị trong một mảng hay không:
```php
$containsAll = Str::containsAll('This is my name', ['my', 'name']);
// true
```

### `Str::endsWith`
Hàm `Str::endsWith` cho biết nếu chuỗi cho trước kết thúc với giá trị kiểm tra:

```php
$result = Str::endsWith('This is my name', 'name');
// true
```
Bạn cũng có thể sử dụng một mảng các giá trị:

```php
$result = Str::endsWith('This is my name', ['name', 'foo']);
// true

$result = Str::endsWith('This is my name', ['this', 'foo']);
// false
```

### `Str::startsWith`
Hàm `Str::startsWith` cho biết nếu một chuỗi bắt đầu bằng một chuỗi con cho trước hay không:

```php
$result = Str::startsWith('This is my name', 'This');
// true
```

### `Str::start`
Hàm `Str::start` thêm một ký tự cho một chuỗi nếu nó chưa bắt đầu với ký tự cần thêm:

```php
$adjusted = Str::start('this/string', '/');
// /this/string

$adjusted = Str::start('/this/string', '/');
// /this/string
```

### `Str::finish`
Hàm `Str::finish` thêm một ký tự vào cuối một chuỗi nếu nó chưa kết thúc bằng ký tự đó:

```php
$adjusted = Str::finish('this/string', '/');
// this/string/
$adjusted = Str::finish('this/string/', '/');
// this/string/
```

### `Str::is`
Hàm `Str::is` cho biết nếu một chuỗi có khớp với một pattern nào không. Dấu `*` có thể được dùng để đánh dấu wildcards:

```php
$matches = Str::is('foo*', 'foobar');
// true
$matches = Str::is('baz*', 'foobar');
// false
```

### `Str::isSerialized`
Hàm `Str::isSerialized` cho biết một chuỗi có phải là chuỗi định dạng serialized hay không:

```php
$result = Str::isSerialized('a:1:{s:4:"name";s:4:"Desk";}');
// true

$result = Str::isSerialized('just a string');
// false
```

### `Str::length`
Hàm `Str::length` trả về độ dài của chuỗi đã cho:

```php
$length = Str::length('skilldo');
// 7
```

### `Str::limit`
Hàm `Str::limit` cắt ngắn chuỗi theo chiều dài được chỉ định:

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
Hàm `Str::lower` chuyển chuỗi thành chữ thường:

```php
$converted = Str::lower('LARAVEL');
// laravel
```

### `Str::upper`
Hàm `Str::upper` chuyển chuỗi đã cho thành chữ hoa:

```php
$string = Str::upper('SkillDo');
// SKILLDO
```

### `Str::random`
Hàm `Str::random` tạo ra một chuỗi ngẫu nhiên với chiều dài được chỉ định:

```php
$random = Str::random(40);
```

### `Str::replaceArray`
Hàm `Str::replaceArray` thay thế một giá trị nhất định trong chuỗi tuần tự bằng cách sử dụng một mảng:

```php
$string = 'The event will take place between ? and ?';
$replaced = Str::replaceArray('?', ['8:30', '9:00'], $string);
// The event will take place between 8:30 and 9:00
```

### `Str::replaceFirst`
Hàm `Str::replaceFirst` thay thế lần xuất hiện đầu tiên của một giá trị trong một chuỗi:

```php
$replaced = Str::replaceFirst('the', 'a', 'the quick brown fox jumps over the lazy dog');
// a quick brown fox jumps over the lazy dog
```

### `Str::replaceLast`
Hàm `Str::replaceLast` thay thế lần xuất hiện cuối cùng của một giá trị trong một chuỗi:

```php
$replaced = Str::replaceLast('the', 'a', 'the quick brown fox jumps over the lazy dog');
// the quick brown fox jumps over a lazy dog
```

### `Str::ascii`
Hàm `Str::ascii` chuyển chuỗi thành một giá trị ASCII:

```php
$slice = Str::ascii('û');
// 'u'
```

### `Str::slug`
Hàm `Str::slug` tạo ra một URL "slug" thân thiện từ chuỗi cho trước:

```php
$slug = Str::slug('SkillDo 8 CMS', '-');
// skilldo-8-cms
```

### `Str::price`
Hàm `Str::price` là hàm mở rộng đặc thù của SkillDo. Xóa các ký tự `"."`, `","` khỏi chuỗi và trả về kiểu `int`:

```php
$price = Str::price('1.000.000');
// 1000000
```

### `Str::substr`
Hàm `Str::substr` trả về phần chuỗi được chỉ định bởi tham số bắt đầu và độ dài:

```php
$converted = Str::substr('The SkillDo CMS', 4, 7);
// SkillDo
```

### `Str::ucfirst`
Hàm `Str::ucfirst` viết hoa ký tự đầu tiên của chuỗi:

```php
$string = Str::ucfirst('foo bar');
// Foo bar
```

### `Str::title`
Hàm `Str::title` in hoa chữ cái đầu của từng từ trong chuỗi:

```php
$converted = Str::title('a nice title uses the correct case');
// A Nice Title Uses The Correct Case
```

### `Str::of`
Hàm `Str::of` trả về một `Stringable` instance cho phép xử lý chuỗi theo hướng đối tượng (fluent):

```php
$result = Str::of('  SkillDo CMS  ')
    ->trim()
    ->lower()
    ->slug('-');
// skilldo-cms
```