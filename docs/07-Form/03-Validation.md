### Xác Thực
Để xác thực cho form bạn cần thêm quy tắc xác thực vào field khi khởi tạo,
Quy tắc xác thực được tạo bằng đối tượng `SkillDo\Form\FormValidationRule`:

```php
$form = new Form();
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Form::rules()->notEmpty()
]);
```

### Các Quy Tắc Xác Thực

####  alpha
Trường được xác thực phải hoàn toàn là các ký tự chữ cái Unicode có trong `\p{L}` và `\p{M}`.

**Tham số:**

| Params   |  Type  |                                    Description |                   Default                   |
|----------|:------:|-----------------------------------------------:|:-------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ cho phép các ký tự chữ cái |

```php
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Form::rules()->alpha($message)
]);
```

####  alphaDash
Trường được xác thực phải hoàn toàn là các ký tự chữ và số Unicode có trong `\p{L}`, `\p{M}`, `\p{N}`, cũng như dấu gạch ngang ASCII (-) và dấu gạch dưới ASCII (_).

**Tham số:**

| Params   |  Type  |                                    Description |                  Default                   |
|----------|:------:|-----------------------------------------------:|:------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ cho phép a-z, 0-9, _ và - |

```php
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Form::rules()->alphaDash($message)
]);
```

####  alphaNum
Trường được xác thực phải hoàn toàn là các ký tự chữ và số Unicode có trong `\p{L}`, `\p{M}` và `\p{N}`.

**Tham số:**

| Params   |  Type  |                                    Description |                      Default                      |
|----------|:------:|-----------------------------------------------:|:-------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ cho phép các ký tự chữ cái và số |

```php
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Form::rules()->alphaNum($message)
]);
```

####  alphaSpaces
Trường được xác thực phải hoàn toàn là các ký tự chữ và số Unicode có trong `\p{L}`, `\p{M}` và `\p{N}`.

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Form::rules()->alphaSpaces($message)
]);
```

####  notEmpty
Kiểm tra xem giá trị input có phải là chuỗi rỗng không

**Tham số:**

| Params      | Đối số  |  Type  |                                            Description |         Default          |
|-------------|:-------:|:------:|-------------------------------------------------------:|:------------------------:|
| array $args | message | string |         Thông báo khi giá trị field không đúng yêu câu | `:attribute` là bắt buộc |
|             |  trim   |  bool  | Nếu true giá trị field sẽ được trim trước khi kiểm tra |           true           |

```php
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Form::rules()->notEmpty(array $args)
]);
```

####  Between
Kiểm tra xem giá trị đầu vào có nằm giữa (đúng hay không) hai số đã cho

**Tham số:**

| Params      | Đối số  |  Type  |                                    Description |                     Default                     |
|-------------|:-------:|:------:|-----------------------------------------------:|:-----------------------------------------------:|
| $min        |         |  int   |             Giá trị nhỏ nhất field cần đáp ứng |                                                 |
| $max        |         |  int   |         Giá trị lớn nhất field có thể nhận vào |                                                 |
| array $args | message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` phải nằm trong khoản :min đến :max |

```php
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Form::rules()->between(int $min, int $max, array $args)
]);
```

####  color
Xác thực màu ở các định dạng khác nhau

**Tham số:**

| Params      | Đối số  |  Type  |                                                                                         Description |                 Default                  |
|-------------|:-------:|:------:|----------------------------------------------------------------------------------------------------:|:----------------------------------------:|
| array $args | message | string |                                                      Thông báo khi giá trị field không đúng yêu câu | `:attribute` không đúng định dạng mã màu |
|             |  type   |  bool  | Loại mã màu (rgb, rgba, hex), nếu để tróng thì giá trị field đáp ứng một trong ba định dạng là được |                                          |

```php
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Form::rules()->color(array $args)
]);
```

####  colorRGB
Xác thực màu ở các định dạng rgb

####  colorRGBA
Xác thực màu ở các định dạng rgba

####  colorHex
Xác thực màu ở các định dạng hex

####  date
Xác thực một ngày

####  before
Trường được xác thực phải là giá trị trước ngày đã cho

####  after
Trường được xác thực phải là giá trị sau ngày đã cho

####  identical
Kiểm tra xem giá trị có giống với một trong các giá trị đã cho không

####  digits
Kiểm tra xem dữ liệu đầu vào chỉ chứa các chữ số

####  numeric
Kiểm tra xem giá trị có phải là số không

####  integer
Kiểm tra đầu vào có phải là số nguyên

####  emailAddress
Xác thực địa chỉ email

####  ip
Xác thực địa chỉ IP

####  ipv4
Xác thực địa chỉ IP v4

####  ipv6
Xác thực địa chỉ IP v6

####  lessThan
Kiểm tra xem giá trị có nhỏ hơn hoặc bằng số đã cho không

####  greaterThan
Kiểm tra xem giá trị có lớn hơn hoặc bằng số đã cho không

####  stringLength
Xác thực độ dài của chuỗi

####  url
Xác thực địa chỉ URL

####  unique
Xác thực value là duy nhất