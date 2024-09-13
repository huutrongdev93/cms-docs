> Class **SKD_Error**

SkillDo Error class.
>
SKD_Error là một class giúp việc xử lý lỗi trong plugin và cms dễ dàng hơn nhiều.
>
Các phiên bản của SKD_Error lưu trữ mã lỗi và thông báo đại diện cho một hoặc nhiều lỗi và liệu một biến có phải là phiên bản của SKD_Error hay không có thể được xác định bằng cách sử dụng hàm `is_skd_error()`.

### SKD_Error Class Methods
Chúng ta sẽ tìm hiểu các phương thức lớp có sẵn trong lớp SKD_Error

#### The `__construct` Method

Đây là phương thức khởi tạo và được sử dụng để khởi tạo đối tượng `SKD_Error`. Nó chấp nhận ba đối số: `$code`, `$message` và `$data`.

```php
$errorMessage = new SKD_Error(string $code, string $message);
```

#### The `add` Method

Bạn có thể sử dụng để thêm lỗi hoặc thêm thông báo bổ sung vào lỗi hiện có. Nó chấp nhận ba đối số: `$code`, `$message` và `$data`.

```php
$errorMessage->add(string $code, string $message);
```


#### The `getErrorCodes` Method

Bạn có thể sử dụng lấy danh sách toàn bộ mã code error

```php
$errorMessage->getErrorCodes();
```


#### The `getErrorMessages` Method

Method trả về một mảng chứa tất cả các thông báo lỗi có trong đối tượng `SKD_Error`. Nếu bạn chuyển `$code` vào đối số đầu tiên, Method sẽ trả về thông báo lỗi cho mã lỗi đã cho.

```php
$errorMessage->getErrorMessages(striing $code);
```

#### The `first` Method
Method trả về thông báo lỗi đầu tiên có trong đối tượng `SKD_Error`. Nếu có từ 2 thông báo lỗi trở lên method sẽ đính kèm số lượng error còn lại

```php
$errorMessage->first();
```

#### The `hasErrors` Method
Nó được sử dụng để kiểm tra xem đối tượng SKD_Error có lỗi nào không.

```php
if($errorMessage->hasErrors()) {
    $errorMessage->first();
}
```

#### The `remove` Method

Method được sử dụng để xóa tất cả các thông báo lỗi liên quan đến mã lỗi đã cho, cùng với mọi dữ liệu lỗi khác cho mã đó.

```php
$errorMessage->remove(string $code);
```


### Ví dụ `SKD_Error` hoạt động như thế nào
Để sử dụng lớp `SKD_Error` để xử lý lỗi, bạn cần khởi tạo lớp này ngay từ đầu. Sau đó, bạn có thể sử dụng các phương thức lớp để thao tác với đối tượng `SKD_Error`.

#### Cách thêm dữ liệu vào đối tượng `SKD_Error`
Cách có thể khởi tạo đối tượng SKD_Error.
```php
$errorMessage = new SKD_Error( 'cms', 'my favorite cms is SkillDo' );
```
Kiểm tra cấu trúc của đối tượng $errorMessage thông qua print_r() cho thấy:
```php
SKD_Error Object
(
    [errors] => Array
        (
            [cms] => Array
                (
                    [0] => my favorite cms is SkillDo
                )
        )
    [error_data] => Array
        (
        )
)
```

Để thêm hoặc nối thêm thông báo lỗi vào danh sách lỗi, sử dụng phương thức add, chấp nhận $code, $message và $data làm đối số.

```php
$errorMessage = new SKD_Error( 'cms', 'my favorite cms is SkillDo' );
$errorMessage->add('framework', 'my favorite framework is Laravel' );
```

Sử dụng print_r() lần nữa, hãy xem cấu trúc và thông tin của đối tượng SKD_Error $errorMessage của chúng ta.

```php
SKD_Error Object
(
    [errors] => Array
        (
            [cms] => Array
                (
                    [0] => my favorite cms is SkillDo
                )
            [framework] => Array
                (
                    [0] => my favorite framework is Laravel
                )
        )
    [error_data] => Array
        (
        )
)
```

#### Cách lấy dữ liệu từ đối tượng `SKD_Error`

Bạn có thể sử dụng phương thức `getErrorCodes()` để trả về một mảng gồm tất cả các mã lỗi.

```php
dd($errorMessage->getErrorCodes());
/* 
Output: 
Array 
( 
    [0] => cms 
    [1] => framework 
) 
*/
```

Phương thức getErrorMessages() truy xuất tất cả các thông báo lỗi khi đối số code không có, nhưng khi đối số $code được truyền, nó sẽ trả về các thông báo lỗi khớp với nó.

```php
dd($errorMessage->getErrorMessages());
/* 
Output: 
Array 
( 
    [0] => my favorite cms is SkillDo 
    [1] => my favorite framework is Laravel 
) 
*/
```
Khi bạn chuyển đối số đầu tiên, nó trông như thế này:

```php
dd($errorMessage->getErrorMessages('cms'));
/* 
Output: 
Array 
( 
    [0] => my favorite cms is SkillDo 
) 
*/
```

Phương thức first() truy xuất thông báo lỗi đầu tiên

```php
dd($errorMessage->first());
/* 
Output: 
my favorite cms is SkillDo. ( và 1 lỗi nữa )
*/
```

### Cách sử dụng `SKD_Error` trong tình huống thực tế

```php
$request = request();

if ($request->isMethod('post')) {
    $error = new SKD_Error();
    $email  = $request->input('email');
    $name   = $request->input('name');
    if(empty($email)) {
        $error->add('empty', 'Email is required field.');
    }
    if(!is_email($email)) {
        $error->add('invalid', 'Please enter valid email.');
    }
    if(empty($name)) {
        $error->add('empty','Name is required field.');
    }
    
    if ($error->hasErrors()) {
        echo $error->first()
    } 
    else {
      // continue with the submission data and redirect 
    }
}
```
