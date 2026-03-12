### Khởi Tạo Xác Thực
Để xác thực cho form bạn cần thêm quy tắc xác thực vào field khi khởi tạo,
Quy tắc xác thực được tạo bằng đối tượng `SkillDo\Validate\Rule`:

```php
use SkillDo\Validate\Rule;
$form = new Form();
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Rule::make()->notEmpty()
]);
```
### Xác Thực
#### Xác thực bằng form
Để xác thực các request của một form đã hợp lệ hay chưa bạn sử dụng phương thức `validate` của class `SkillDo\Http\Request`.
Phương thức validate của request nhận vào một đối số có thể là đối tượng `Form`, `FormAdmin` hoặc `SkillDo\Validate\Rule` và trả về đối tượng `SkillDo\Validate\Validate`

```php
use SkillDo\Validate\Rule;
//Tạo form
$form = new Form();
$form->text('myField', [
    'label' => 'My Field',
    'validations' => Rule::make()->notEmpty()
]);

//Xác thực
$request = request();

$validate = $request->validate($form);
```

Để kiểm tra request đã hợp lệ hay chưa bạn có thể sử dụng phương thức `fails`, nếu trả về `true` tức có request không hợp lệ, hoặc `passes` (ngược lại với fails)

```php
$validate = $request->validate($form);
if($validate->fails()) {
    //todo fail validation
}
```

Để lấy danh sách message lỗi khi xác thực bạn sử dụng phương thức `error`, phương thức sẽ trả về một đối tượng là `SKD_Error`

```php
$validate = $request->validate($form);

if($validate->fails()) {

    $errors = $validate->errors();
}
```
#### Xác thực không form

Hoặc bạn có thể tạo validate mà không cần form bằng cách sử dụng phương thức `validate` của `SkillDo\Http\Request` hoặc `make` của `SkillDo\Validate\Validate`.

```php
use SkillDo\Validate\Validate;
use SkillDo\Validate\Rule;

$request = request();

$validate = $request->validate([
    'username' => Rule::make('Tên đăng nhập')->notEmpty(),
    'password' => Rule::make('Mật khẩu')->notEmpty(),
]);

if($validate->fails()) {
    $errors = $validate->errors();
}
```
hoặc
```php
use SkillDo\Validate\Validate;
use SkillDo\Validate\Rule;

$request = request();

$validate = Validate::make($request->all(), [
    'username' => Rule::make('Tên đăng nhập')->notEmpty(),
    'password' => Rule::make('Mật khẩu')->notEmpty(),
])->validate();

if($validate->fails()) {
    $errors = $validate->errors();
}
```

### Các Quy Tắc Xác Thực

####  `alpha`
Trường được xác thực phải hoàn toàn là các ký tự chữ cái Unicode.

```php
Rule::make()->alpha();
```

####  `alphaDash`
Trường được xác thực phải hoàn toàn là các ký tự chữ (a-z, A-Z), số (0-9), dấu gạch ngang (-) và dấu gạch dưới (_).

```php
Rule::make()->alphaDash();
```

####  `alphaNum`
Trường được xác thực phải hoàn toàn là các ký tự chữ (a-z, A-Z) và số (0-9).

```php
Rule::make()->alphaNum();
```

####  `alphaSpaces`
Trường được xác thực phải hoàn toàn là các ký tự chữ và dấu cách.

```php
Rule::make()->alphaSpaces();
```

####  `notEmpty`
Kiểm tra xem giá trị input có phải là chuỗi rỗng không

**Tham số:**

| Params | Type |                                                                 Description | Default |
|--------|:----:|----------------------------------------------------------------------------:|:-------:|
| $trim  | bool |               Nếu true value sẽ được lượt bỏ khoản trắng trước khi kiểm tra |  true   |

```php
Rule::make()->notEmpty(true);
```

####  `Between`
Kiểm tra xem giá trị đầu vào có nằm giữa (đúng hay không) hai số đã cho.

Giá trị đầu vào có thể là
* Chuỗi (string) : dựa trên độ dài (khi đi kèm điều kiện xác thực `string`)
* Số (number) : dựa trên độ lớn (khi đi kèm điều kiện xác thực `numeric` hoặc `integer`)
* Mãng (array) : dựa trên số lượng phân tử

**Tham số:**

| Params | Đối số | Type |                                               Description | Default |
|--------|:------:|:----:|----------------------------------------------------------:|:-------:|
| $min   |        | int  |                        Giá trị nhỏ nhất field cần đáp ứng |         |
| $max   |        | int  |                    Giá trị lớn nhất field có thể nhận vào |         |
| $equal |        | bool | Nếu true cho phép giá trị cần so sánh được phép bằng nhau |  true   |

```php
Rule::make()->between(int $min, int $max, bool $equal);
```

####  `color`
Xác thực màu ở các định dạng khác nhau

**Tham số:**

| Params | Type  |                            Description |         Default         |
|--------|:-----:|---------------------------------------:|:-----------------------:|
| $types | array | Loại mã màu (rgb, rgba, hex, keyword), | rgb, rgba, hex, keyword |

```php
Rule::make()->color(['rgb', 'hex']);
```
Kiểu các loại được hỗ trợ:

| Type    |         Ví dụ          |
|---------|:----------------------:|
| hex     |     #0000FF, #00F      |
| rgb     |   rgb(255, 255, 255)   |
| rgba    | rgba(255, 255, 255, 1) |
| keyword |   	transparent, red    |

####  `colorRGB`
Xác thực màu ở các định dạng `rgb` như rgb(255, 255, 255)

```php
Rule::make()->colorRGB();
```

####  `colorRGBA`
Xác thực màu ở các định dạng rgba như rgba(255, 255, 255, 1)

```php
Rule::make()->colorRGBA();
```

####  `colorHex`
Xác thực màu ở các định dạng `hex` như #0000FF, #00F

```php
Rule::make()->colorHex();
```

####  `date`
Xác thực định dạng ngày tháng năm

**Tham số:**

| Params  |  Type  |                           Description | Default |
|---------|:------:|--------------------------------------:|:-------:|
| $format | string | format kiểu ngày tháng năm sẽ so sánh |  d/m/Y  |

```php
Rule::make()->date('d/m/Y');
```

####  `before`
Trường được xác thực phải là giá trị trước ngày đã cho

**Tham số:**

| Params  |  Type  |                           Description | Default |
|---------|:------:|--------------------------------------:|:-------:|
| $time   | string |                 Thời gian cần so sánh |         |
| $format | string | format kiểu ngày tháng năm sẽ so sánh |  d/m/Y  |

```php
Rule::make()->before('10/06/2024', 'd/m/Y');
```

####  `after`
Trường được xác thực phải là giá trị sau ngày đã cho

**Tham số:**

| Params  |  Type  |                           Description | Default |
|---------|:------:|--------------------------------------:|:-------:|
| $time   | string |                 Thời gian cần so sánh |         |
| $format | string | format kiểu ngày tháng năm sẽ so sánh |  d/m/Y  |

```php
Rule::make()->after('10/06/2024', 'd/m/Y');
```

####  `identical`
Kiểm tra xem giá trị có giống với một trong các giá trị đã cho không

**Tham số:**

| Params |  Type  |                                                                                       Description | Default |
|--------|:------:|--------------------------------------------------------------------------------------------------:|:-------:|
| $data  | string |                                                  Tên field lấy giá trị so sánh hoặc chuổi so sanh |         |
| $type  | string | Nếu type là input $data được xem như tên field, nếu type là string data được xem như chuổi string | string  |

```php
$form->password('password', [
    'label' => 'Nhập mật khẩu',
    'validations' => Rule::make()->notEmpty()
]);
$form->password('re_password', [
    'label' => 'Nhập lại mật khẩu',
    'validations' => Rule::make()
        ->notEmpty()
        ->identical('password', 'input')
]);
//giá trị nhập vào field re_password phải giống với field password
```

####  `digits`
Kiểm tra xem dữ liệu đầu vào chỉ chứa các chữ số

```php
Rule::make()->digits();
```

####  `numeric`
Kiểm tra xem giá trị có phải là số không

```php
Rule::make()->numeric();
```

####  `integer`
Kiểm tra đầu vào có phải là số nguyên

**Tham số:**

| Params      |       Đối số       |  Type  |                                                    Description |   Default    |
|-------------|:------------------:|:------:|---------------------------------------------------------------:|:------------:|
| array $args | thousandsSeparator | string | Dấu phân cách hàng ngàng (trống, dấu cách, dấu phẩy, dấu chấm) |    trống     |
|             |  decimalSeparator  | string |              Dấu phân cách hàng thập phân (dấu phẩy, dấu chấm) | dấu chấm (.) |

```php
Rule::make()->integer($args);
```

####  `email`
Xác thực đúng định dạng địa chỉ email

```php
Rule::make()->email();
```

####  `ip`
Xác thực địa chỉ IP (ipv4 hoặc ipv6)

```php
Rule::make()->ip();
```

####  `ipv4`
Xác thực địa chỉ IP v4

```php
Rule::make()->ipv4();
```

####  `ipv6`
Xác thực địa chỉ IP v6

```php
Rule::make()->ipv6();
```

####  `lessThan`
So sánh giá trị hai trường dữ liệu, Trường được xác thực phải nhỏ hơn trường đã cho. Hai trường phải cùng loại dữ liệu.
Đối với dữ liệu chuỗi (string), giá trị tương ứng với số ký tự. 
Đối với dữ liệu số (numeric), giá trị tương ứng với một giá trị nguyên nhất định (phải đi kèm validate rule số hoặc số nguyên). 
Đối với một mảng, kích thước tương ứng với số lượng (`count`) của mảng

**Tham số:**

| Params     |  Type  |                                                Description | Default |
|------------|:------:|-----------------------------------------------------------:|:-------:|
| $fieldName | string |                             Tên trường dữ liệu cần so sánh |         |
| $fieldId   | string | id trường dữ liệu cần so sánh, dùng khi so sánh ở frontend |         |
| $equal     |  bool  |                        cho phép giá trị 2 trường bằng nhau |  true   |

```php
Rule::make()->lessThan(string $fieldName, string $fieldId, bool $equal);
```


####  `max`
Kiểm tra xem giá trị trường được kiểm tra có nhỏ hơn hoặc bằng số đã cho không

**Tham số:**

| Params | Type  |                         Description | Default |
|--------|:-----:|------------------------------------:|:-------:|
| $max   | float |                   Con số để so sánh |         |
| $equal | bool  | cho phép giá trị 2 trường bằng nhau |  true   |

```php
Rule::make()->max(float $max, bool $equal);
```

####  `greaterThan`
So sánh giá trị hai trường dữ liệu, Trường được xác thực phải lớn hơn trường đã cho. Hai trường phải cùng loại dữ liệu.
Đối với dữ liệu chuỗi (string), giá trị tương ứng với số ký tự.
Đối với dữ liệu số (numeric), giá trị tương ứng với một giá trị nguyên nhất định (phải đi kèm validate rule số hoặc số nguyên).
Đối với một mảng, kích thước tương ứng với số lượng (`count`) của mảng

**Tham số:**

| Params     |  Type  |                                                Description | Default |
|------------|:------:|-----------------------------------------------------------:|:-------:|
| $fieldName | string |                             Tên trường dữ liệu cần so sánh |         |
| $fieldId   | string | id trường dữ liệu cần so sánh, dùng khi so sánh ở frontend |         |
| $equal     |  bool  |                        cho phép giá trị 2 trường bằng nhau |  true   |

```php
Rule::make()->greaterThan(string $fieldName, string $fieldId, bool $equal);
```

####  `min`
Kiểm tra xem giá trị trường được kiểm tra có lớn hơn hoặc bằng số đã cho không

**Tham số:**

| Params | Type  |                         Description | Default |
|--------|:-----:|------------------------------------:|:-------:|
| $min   | float |                   Con số để so sánh |         |
| $equal | bool  | cho phép giá trị 2 trường bằng nhau |  true   |

```php
Rule::make()->min(float $min, bool $equal);
```

####  `string`
Trường được xác thực phải là một chuỗi

```php
Rule::make()->string();
```

####  `url`
Xác thực địa chỉ URL

**Tham số:**

| Params      |       Đối số       |  Type  |                           Description |   Default   |
|-------------|:------------------:|:------:|--------------------------------------:|:-----------:|
| array $args |      protocol      | string |                         Các giao thức | http, https |
|             | allowEmptyProtocol |  bool  | Nếu true cho phép không cần giao thức |    false    |

```php
Rule::make()->url(array $args);
```

####  `unique`
Xác thực value là duy nhất

**Tham số:**

| Params      |    Đối số     |  Type  |                                                  Description | Default |
|-------------|:-------------:|:------:|-------------------------------------------------------------:|:-------:|
| $table      |               | string |                             Table lấy dữ liệu trong database |         |
| $column     |               | string |                                      Cột so sánh trong table |         |
| array $args |    ignore     | string |                             Giá trị bỏ qua không cần so sánh |         |
|             | ignore_column | string | Cột bỏ qua giá trị ignore, nếu không điền sẽ lấy cột $column |         |
|             |   callback    | clouse |       Function callback điều chỉnh điều kiện so sánh dữ liệu |         |

```php
Rule::make()->unique('users', 'email', [
    'ignore' => 'admin@gmail.com'
]);
//kiểm tra email của users có trùng lập không nhưng bỏ qua nếu field trùng với admin@gmail.com

Rule::make()->unique('users', 'phone', [
    'callback' => function (Qr $args) {
        $args->where('status', 'public');
        return $args;
    }
]);
//kiểm tra email của những users có trạng thái public có trùng lập không
```

####  `phone`
Kiểm tra số điện thoại

**Tham số:**

| Params   | Type  | Description | Default |
|----------|:-----:|------------:|:-------:|
| $country | array |    Quốc gia |   vi    |

```php
Rule::make()->phone(['vi', 'zh']);
```
Các quốc gia được hỗ trợ:

| Key |    Name    |
|-----|:----------:|
| vi  |  Việt Nam  |
| zh  | Trung Quốc |
| ja  |  Nhật Bản  |
| en  | 	Nước Anh  |

####  `in`
Kiểm tra giá trị nhập vào có nằm trong danh sách giá trị cho trước

**Tham số:**

| Params | Type  |                 Description | Default |
|--------|:-----:|----------------------------:|:-------:|
| $data  | array | danh sách giá trị cho trước |         |

```php
Rule::make()->in(['pending', 'confirm', 'cancel']);
```

####  `requiredIf`
Kiểm tra giá trị nhập vào là bắt buộc theo một điều kiện cho trước

**Tham số:**

| Params    |   Type   |      Description | Default |
|-----------|:--------:|-----------------:|:-------:|
| $callback | callable | method điều kiện |         |

```php
Rule::make()->requiredIf(function ($request) {
    return $request->has('filter1')
});
```

####  `custom`
Kiểm tra giá trị nhập vào dự theo function custom của bạn

**Tham số:**

| Params   |  Type   |                                                            Description | Default |
|----------|:-------:|-----------------------------------------------------------------------:|:-------:|
| $closure | Closure | function kiểm tra trả về `true` nếu hợp lệ và `false` nếu không hợp lệ |         |

```php
Rule::make()->custom(function ($value) {

    if(!is_numeric($value)) return false;
    
    return $value%2;
});
```

##  Error Messages

Sau khi xác thực, nếu xác thực bị `fail` hệ thống sẽ trả về cho bạn một đối tượng `SKD_Error` trong đó chứa các thông báo lỗi mặc định.
Nếu cần, bạn có thể cung cấp các thông báo lỗi của bạn cho phiên bản trình xác thực thay vì các thông báo lỗi mặc định do Skilldo cung cấp. 
bằng cách sử dụng phương thức `errorMessage`:

```php
use SkillDo\Validate\Rule;

$form = new Form();

$form->text('myField', [
    'label' => 'My Field',
    'validations' => Rule::make()
                            ->notEmpty()
                            ->integer()
                            ->max(10)
                            ->errorMessage([
                                 'notEmpty' => 'Không được để trống trường :attribute',                      
                                 'max' => [
                                    'numeric' => 'Vui long điền số cho trường :attribute nhỏ hơn :max'
                                 ]                    
                            ])
]);
```

Hoặc

```php
use SkillDo\Validate\Validate;
use SkillDo\Validate\Rule;

$request = request();

$validate = $request->validate([
    'myField' => Rule::make()->notEmpty()->integer()->max(10)
        ->errorMessage([
             'notEmpty' => 'Không được để trống trường :attribute',                      
             'max' => [
                'numeric' => 'Vui long điền số cho trường :attribute nhỏ hơn :max'
             ]                    
        ]),
]);

if($validate->fails()) {
    $errors = $validate->errors();
}
```

## Xác Thực JS
Ngoài xác thực trên server cms còn cung cấp xác thực trên client khi `setIsValid` của form được bật, sau đây là danh sách rule được hỗ trợ

| Params      |                      Cần thêm                      | Description |  
|-------------|:--------------------------------------------------:|------------:|
| alpha       |                                                    |             |
| alphaDash   |                                                    |             |
| alphaNum    |                                                    |             |
| alphaSpaces |                                                    |             |
| notEmpty    |                                                    |             |
| color       |                                                    |             |
| colorRGB    |                                                    |             |
| colorRGBA   |                                                    |             |
| colorHex    |                                                    |             |
| ip          |                                                    |             |
| ipv4        |                                                    |             |
| ipv6        |                                                    |             |
| ipv6        |                                                    |             |
| file        |                                                    |             |
| lessThan    |                                                    |             |
| email       |                                                    |             |
| phone       |                                                    |             |
| between     | phải có rule là string, file, numeric hoặc integer |             |
| min         | phải có rule là string, file, numeric hoặc integer |             |
| max         | phải có rule là string, file, numeric hoặc integer |             |
| date        |                                                    |             |
| before      |                                                    |             |
| after       |                                                    |             |