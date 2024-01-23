### Khởi Tạo Xác Thực
Để xác thực cho form bạn cần thêm quy tắc xác thực vào field khi khởi tạo,
Quy tắc xác thực được tạo bằng đối tượng `SkillDo\Form\FormValidationRule`:

```php
$form = new Form();
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Form::rules()->notEmpty()
]);
```
### Xác Thực
Để xác thực các request của một form đã hợp lệ hay chưa bạn sử dụng phương thức `validate` của class `SkillDo\Http\HttpRequest`.
Phương thức validate của request nhận vào một đối số có thể là đối tượng `Form`, `FormAdmin` hoặc `SkillDo\Form\FormValidation` và trả về đối tượng `SkillDo\Validate\Validate`

```php
//Tạo form
$form = new Form();
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Form::rules()->notEmpty()
]);

//Xác thực
$request = request();

$validate = $request->validate($form);
```

Để kiểm tra request đã hợp lệ hay chưa bạn có thể sử dụng phương thức `fails`, nếu trả về `true` tức có request không hợp lệ

```php
$validate = $request->validate($form);
if($validations->fails()) {
    //todo fail validation
}
```

Để lấy danh sách message lỗi khi xác thực bạn sử dụng phương thức `error`, phương thức sẽ trả về một đối tượng là [SKD_Error](/Services/Errors)

```php
$validate = $request->validate($form);

if($validations->fails()) {

    $errors = $validations->errors();
}
```

### Các Quy Tắc Xác Thực

####  `alpha`
Trường được xác thực phải hoàn toàn là các ký tự chữ cái Unicode có trong `\p{L}` và `\p{M}`.

**Tham số:**

| Params   |  Type  |                                    Description |                   Default                   |
|----------|:------:|-----------------------------------------------:|:-------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ cho phép các ký tự chữ cái |

```php
Form::rules()->alpha($message);
```

####  `alphaDash`
Trường được xác thực phải hoàn toàn là các ký tự chữ và số Unicode có trong `\p{L}`, `\p{M}`, `\p{N}`, cũng như dấu gạch ngang ASCII (-) và dấu gạch dưới ASCII (_).

**Tham số:**

| Params   |  Type  |                                    Description |                  Default                   |
|----------|:------:|-----------------------------------------------:|:------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ cho phép a-z, 0-9, _ và - |

```php
Form::rules()->alphaDash($message);
```

####  `alphaNum`
Trường được xác thực phải hoàn toàn là các ký tự chữ và số Unicode có trong `\p{L}`, `\p{M}` và `\p{N}`.

**Tham số:**

| Params   |  Type  |                                    Description |                      Default                      |
|----------|:------:|-----------------------------------------------:|:-------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ cho phép các ký tự chữ cái và số |

```php
Form::rules()->alphaNum($message);
```

####  `alphaSpaces`
Trường được xác thực phải hoàn toàn là các ký tự chữ và số Unicode có trong `\p{L}`, `\p{M}` và `\p{N}`.

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
Form::rules()->alphaSpaces($message);
```

####  `notEmpty`
Kiểm tra xem giá trị input có phải là chuỗi rỗng không

**Tham số:**

| Params      | Đối số  |  Type  |                                            Description |         Default          |
|-------------|:-------:|:------:|-------------------------------------------------------:|:------------------------:|
| array $args | message | string |         Thông báo khi giá trị field không đúng yêu câu | `:attribute` là bắt buộc |
|             |  trim   |  bool  | Nếu true giá trị field sẽ được trim trước khi kiểm tra |           true           |

```php
Form::rules()->notEmpty(array $args);
```

####  `Between`
Kiểm tra xem giá trị đầu vào có nằm giữa (đúng hay không) hai số đã cho

**Tham số:**

| Params      | Đối số  |  Type  |                                    Description |                     Default                     |
|-------------|:-------:|:------:|-----------------------------------------------:|:-----------------------------------------------:|
| $min        |         |  int   |             Giá trị nhỏ nhất field cần đáp ứng |                                                 |
| $max        |         |  int   |         Giá trị lớn nhất field có thể nhận vào |                                                 |
| array $args | message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` phải nằm trong khoản :min đến :max |

```php
Form::rules()->between(int $min, int $max, array $args);
```

####  `color`
Xác thực màu ở các định dạng khác nhau

**Tham số:**

| Params      | Đối số  |  Type  |                                                                                           Description |                 Default                  |
|-------------|:-------:|:------:|------------------------------------------------------------------------------------------------------:|:----------------------------------------:|
| array $args | message | string |                                                        Thông báo khi giá trị field không đúng yêu câu | `:attribute` không đúng định dạng mã màu |
|             |  type   |  bool  | Loại mã màu (rgb, rgba, hex), nếu không điền thì giá trị field đáp ứng một trong ba định dạng là được |                                          |

```php
Form::rules()->color(array $args);
```

####  `colorRGB`
Xác thực màu ở các định dạng `rgb`

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
Form::rules()->colorRGB($message);
```

####  `colorRGBA`
Xác thực màu ở các định dạng rgba

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
Form::rules()->colorRGBA($message);
```

####  `colorHex`
Xác thực màu ở các định dạng `hex`

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
Form::rules()->colorHex($message);
```

####  `date`
Xác thực định dạng ngày tháng năm

**Tham số:**

| Params      | Đối số  |  Type  |                                    Description |                 Default                  |
|-------------|:-------:|:------:|-----------------------------------------------:|:----------------------------------------:|
| array $args | message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` không đúng định dạng mã màu |
|             | format  | string |          format kiểu ngày tháng năm sẽ so sánh |                dd/mm/yyyy                |

```php
Form::rules()->date(array $args);
```

####  `before`
Trường được xác thực phải là giá trị trước ngày đã cho

**Tham số:**

| Params      | Đối số  |  Type  |                                    Description |                 Default                  |
|-------------|:-------:|:------:|-----------------------------------------------:|:----------------------------------------:|
| array $args | message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` không đúng định dạng mã màu |
|             | format  | string |          format kiểu ngày tháng năm sẽ so sánh |                dd/mm/yyyy                |

```php
Form::rules()->before(array $args);
```

####  `after`
Trường được xác thực phải là giá trị sau ngày đã cho

**Tham số:**

| Params      | Đối số  |  Type  |                                    Description |                 Default                  |
|-------------|:-------:|:------:|-----------------------------------------------:|:----------------------------------------:|
| array $args | message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` không đúng định dạng mã màu |
|             | format  | string |          format kiểu ngày tháng năm sẽ so sánh |                dd/mm/yyyy                |

```php
Form::rules()->after(array $args);
```

####  `identical`
Kiểm tra xem giá trị có giống với một trong các giá trị đã cho không

**Tham số:**

| Params      | Đối số  |  Type  |                                                                                       Description |                     Default                     |
|-------------|:-------:|:------:|--------------------------------------------------------------------------------------------------:|:-----------------------------------------------:|
| $data       |         | string |                                                  Tên field lấy giá trị so sánh hoặc chuổi so sanh |                                                 |
| $type       |         | string | Nếu type là input $data được xem như tên field, nếu type là string data được xem như chuổi string |                     string                      |
| array $args | message | string |                                                    Thông báo khi giá trị field không đúng yêu câu | `:attribute` phải nằm trong khoản :min đến :max |

```php
$form->password('password', [
    'label' => 'Nhập mật khẩu',
    'validations' => Form::rules()->notEmpty()
]);
$form->password('re_password', [
    'label' => 'Nhập lại mật khẩu',
    'validations' => Form::rules()
        ->notEmpty()
        ->identical('password', 'input')
]);
//giá trị nhập vào field re_password phải giống với field password
```

####  `digits`
Kiểm tra xem dữ liệu đầu vào chỉ chứa các chữ số

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
Form::rules()->digits($message);
```

####  `numeric`
Kiểm tra xem giá trị có phải là số không

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
Form::rules()->digits($message);
```

####  `integer`
Kiểm tra đầu vào có phải là số nguyên

**Tham số:**

| Params      |       Đối số       |  Type  |                                                    Description |                 Default                  |
|-------------|:------------------:|:------:|---------------------------------------------------------------:|:----------------------------------------:|
| array $args |      message       | string |                 Thông báo khi giá trị field không đúng yêu câu | `:attribute` không đúng định dạng mã màu |
|             | thousandsSeparator | string | Dấu phân cách hàng ngàng (trống, dấu cách, dấu phẩy, dấu chấm) |                  trống                   |
|             |  decimalSeparator  | string |              Dấu phân cách hàng thập phân (dấu phẩy, dấu chấm) |               dấu chấm (.)               |

```php
Form::rules()->integer($args);
```

####  `emailAddress`
Xác thực đúng định dạng địa chỉ email

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
Form::rules()->emailAddress($message);
```

####  `ip`
Xác thực địa chỉ IP (ipv4 hoặc ipv6)

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
Form::rules()->ip($message);
```

####  `ipv4`
Xác thực địa chỉ IP v4

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
Form::rules()->ipv4($message);
```

####  `ipv6`
Xác thực địa chỉ IP v6

**Tham số:**

| Params   |  Type  |                                    Description |                       Default                       |
|----------|:------:|-----------------------------------------------:|:---------------------------------------------------:|
| $message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` chỉ chứa các ký tự chữ cái và dấu cách |

```php
Form::rules()->ipv6($message);
```

####  lessThan
Kiểm tra xem giá trị có nhỏ hơn hoặc bằng số đã cho không

**Tham số:**

| Params      | Đối số  |  Type  |                                    Description |                     Default                     |
|-------------|:-------:|:------:|-----------------------------------------------:|:-----------------------------------------------:|
| $max        |         | float  |                              Con số để so sánh |                                                 |
| array $args | message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` phải nằm trong khoản :min đến :max |

```php
Form::rules()->lessThan(float $max, array $args);
```

####  `greaterThan`
Kiểm tra xem giá trị có lớn hơn hoặc bằng số đã cho không

**Tham số:**

| Params      | Đối số  |  Type  |                                    Description |                     Default                     |
|-------------|:-------:|:------:|-----------------------------------------------:|:-----------------------------------------------:|
| $min        |         | float  |                              Con số để so sánh |                                                 |
| array $args | message | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` phải nằm trong khoản :min đến :max |

```php
Form::rules()->greaterThan(float $min, array $args);
```

####  `stringLength`
Xác thực độ dài của chuỗi

**Tham số:**

| Params      | Đối số  |  Type  |                                            Description |         Default          |
|-------------|:-------:|:------:|-------------------------------------------------------:|:------------------------:|
| $min        |         |  int   |                                       Độ dài tối thiểu |                          |
| $max        |         |  int   |                                          Độ dài tối đa |                          |
| array $args | message | string |         Thông báo khi giá trị field không đúng yêu câu | `:attribute` là bắt buộc |
|             |  trim   |  bool  | Nếu true giá trị field sẽ được trim trước khi kiểm tra |           true           |

```php
Form::rules()->stringLength(int $min, int $max, array $args);
```

####  `url`
Xác thực địa chỉ URL

**Tham số:**

| Params      |       Đối số       |  Type  |                                    Description |         Default          |
|-------------|:------------------:|:------:|-----------------------------------------------:|:------------------------:|
| array $args |      message       | string | Thông báo khi giá trị field không đúng yêu câu | `:attribute` là bắt buộc |
|             |      protocol      | string |                                  Các giao thức |       http, https        |
|             | allowEmptyProtocol |  bool  |          Nếu true cho phép không cần giao thức |          false           |

```php
Form::rules()->url(array $args);
```

####  `unique`
Xác thực value là duy nhất

**Tham số:**

| Params      |    Đối số     |  Type  |                                                  Description |         Default          |
|-------------|:-------------:|:------:|-------------------------------------------------------------:|:------------------------:|
| $table      |               | string |                             Table lấy dữ liệu trong database |                          |
| $column     |               | string |                                      Cột so sánh trong table |                          |
| array $args |    message    | string |               Thông báo khi giá trị field không đúng yêu câu | `:attribute` là bắt buộc |
|             |    ignore     | string |                             Giá trị bỏ qua không cần so sánh |                          |
|             | ignore_column | string | Cột bỏ qua giá trị ignore, nếu không điền sẽ lấy cột $column |                          |
|             |   callback    | clouse |       Function callback điều chỉnh điều kiện so sánh dữ liệu |                          |

```php
Form::rules()->unique('users', 'email', [
    'ignore' => 'admin@gmail.com'
]);
//kiểm tra email của users có trùng lập không nhưng bỏ qua nếu field trùng với admin@gmail.com

Form::rules()->unique('users', 'phone', [
    'callback' => function (Qr $args) {
        $args->where('status', 'public');
        return $args;
    }
]);
//kiểm tra email của những users có trạng thái public có trùng lập không
```