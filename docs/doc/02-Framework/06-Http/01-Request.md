# Request

> **File:** `packages/skilldo/framework/src/Http/Request.php`
> 
> **Kế thừa:** `Illuminate\Http\Request`
> 
> **Namespace:** `SkillDo\Http\Request`

## 1. Request trong SkillDo là gì?

Lớp `Request` của SkillDo được xây dựng dựa trên cốt lõi của thư viện `Illuminate\Http\Request` (Laravel 12). 
Nó đóng vai trò thu thập, phản ánh và quản lý tất cả các tham số, thông tin đến từ phía máy khách gửi lên server. Thông qua đối tượng Request, bạn có thể dễ dàng truy xuất dữ liệu Form (POST/GET), URL, File uploads, tham số Header và cả Cookie.

## 2. Cách Sử Dụng Request

Bạn có thể tương tác với Request bằng hai cách phổ biến: **Dependency Injection** (Tự động tiêm thông qua tham số hàm) hoặc **Global Helper function**.

### Sử dụng qua Dependency Injection (Truyền vào hàm)
Rất hữu dụng ở Controller hoặc các Callback AJAX. Bạn chỉ cần Type-hint class `SkillDo\Http\Request`, Framework sẽ tự động Resolve (tiêm) đối tượng đó vào hàm cho bạn.

```php
use SkillDo\Http\Request;

class UserController
{
    public function store(Request $request) 
    {
        $name = $request->input('name');
        
        // ...
    }
}
```

Trong Ajax Callback:
```php
use SkillDo\Http\Request;

function myAjaxHandler(Request $request) 
{
    if ($request->isMethod('post')) 
    {
        // xử lý dữ liệu
    }
}
```

### Sử dụng bằng Global Helper `request()`
Bạn có thể gọi helper function `request()` ở bất cứ đâu trong quy trình xử lý để truy cập nhanh thể hiện (instance) của Request hiện tại:

```php
$name = request()->input('name');
$allInputs = request()->all();
```

---

## 3. Danh Sách Method Thường Dùng

Do kế thừa 100% từ Laravel HTTP Request, bạn có thể sử dụng tất cả các hàm mạnh mẽ được cung cấp bởi Framework này, kết hợp cùng một số method tùy chỉnh trên hệ thống SkillDo.

### 3.1. Truy xuất Dữ Liệu Đầu Vào (Inputs)

#### Lấy Tất cả Dữ liệu Input

Bạn có thể lấy tất cả dữ liệu Input của yêu cầu đến dưới dạng một mảng bằng cách sử dụng phương thức `all`.
Phương thức này có thể sử dụng mà không cần biết liệu yêu cầu đến có phải là từ một form HTML hay là một request XHR không:

```php
$input = $request->all();
```

Bằng cách sử dụng phương thức `collect`, bạn có thể lấy tất cả dữ liệu đầu vào của yêu cầu đến dưới dạng một `collect`:

```php
$input = $request->collect();
```

Phương thức `collect` cũng cho phép bạn lấy một phần nhỏ của dữ liệu input của request đến dưới dạng một bộ sưu tập:

```php
$request->collect('users')->each(function (string $user) {
    // ...
});
```

#### Lấy Giá Trị Dữ liệu Input

Sử dụng một số phương thức đơn giản, bạn có thể truy cập tất cả dữ liệu đầu vào của người dùng từ thể hiện `SkillDo\Http\Request` mà không phải lo lắng về loại HTTP nào được sử dụng cho request.
Bất kỳ loại HTTP nào đi nữa, phương thức `input` có thể sử dụng để lấy dữ liệu input của người dùng:

```php
$name = $request->input('name');
```

Bạn có thể truyền một giá trị default làm đối số thứ hai cho phương thức `input`. Giá trị này sẽ được trả về nếu giá trị input được yêu cầu không có trong request:

```php
$name = $request->input('name', 'Sally');
```

Khi làm việc với các forms chứa đầu vào là mảng, sử dụng ký hiệu "dấu chấm" để truy cập các mảng:

```php
$name = $request->input('products.0.name');
$names = $request->input('products.*.name');
```

Bạn có thể gọi phương thức `input` mà không có bất kỳ đối số nào để lấy tất cả các giá trị đầu vào dưới dạng một mảng liên kết:

```php
$input = $request->input();
```

#### Lấy Dữ Liệu Từ Query String

Trong khi phương thức `input` lấy giá trị từ toàn bộ dữ liệu yêu cầu (bao gồm Query String), phương thức `query` sẽ chỉ lấy giá trị từ Query String:

```php
$name = $request->query('name');
```

Nếu dữ liệu Query String request không có, đối số thứ hai cho phương thức này sẽ được trả về:

```php
$name = $request->query('name', 'Helen');
```

Bạn có thể gọi phương thức `query` mà không có bất kỳ đối số nào để lấy tất cả các giá trị Query String dưới dạng một mảng liên kết:

```php
$query = $request->query();
```

#### Lấy Giá Trị Input JSON

Khi gửi các yêu cầu JSON đến ứng dụng của bạn, bạn có thể truy cập dữ liệu JSON thông qua phương thức `input` miễn là header `Content-Type` của request được đặt đúng thành `application/json`.
Bạn có thể sử dụng cú pháp "dấu chấm" để lấy giá trị có lồng trong các mảng/đối tượng JSON:

```php
$name = $request->input('user.name');
```

#### Lấy Giá Trị Input Dạng Chuỗi

Thay vì lấy dữ liệu đầu vào của request dưới dạng chuỗi nguyên thuỷ, bạn có thể sử dụng phương thức `string` để lấy dữ liệu yêu cầu dưới dạng một `Stringable`:

```php
$name = $request->string('name')->trim();
```

#### Lấy Giá Trị Input Dạng Boolean

Khi xử lý các phần tử HTML như ô checkboxes, ứng dụng của bạn có thể nhận được các giá trị "đúng" thực sự là chuỗi.
Ví dụ, "true" hoặc "on". Để thuận tiện, bạn có thể sử dụng phương thức `boolean` để lấy những giá trị này dưới dạng `boolean`. Phương thức boolean trả về `true` cho 1, "1", true, "true", "on", và "yes". Tất cả các giá trị khác sẽ trả về false:

```php
$archived = $request->boolean('archived');
```

#### Lấy Giá Trị Input Dạng Date

Để thuận tiện, giá trị input chứa ngày/giờ có thể được lấy dưới dạng các thể hiện của Carbon bằng cách sử dụng phương thức `date`.
Nếu yêu cầu không chứa giá trị đầu vào với tên đã cho, `null` sẽ được trả về:

```php
$birthday = $request->date('birthday');
```

Các đối số thứ hai và thứ ba được chấp nhận bởi phương thức `date` có thể được sử dụng để chỉ định định dạng ngày và múi giờ tương ứng:

```php
$elapsed = $request->date('elapsed', '!H:i', 'Europe/Madrid');
```

Nếu giá trị đầu vào hiện diện nhưng có định dạng không hợp lệ, một InvalidArgumentException sẽ được ném ra; do đó, khuyến nghị kiểm tra giá trị đầu vào trước khi gọi phương thức date.

#### Lấy Input Thông Qua Thuộc Tính Động

Bạn cũng có thể truy cập Input bằng cách sử dụng các thuộc tính động trên `SkillDo\Http\Request`.
Ví dụ, nếu một trong các form của bạn chứa một trường `name`, bạn có thể truy cập giá trị của trường như sau:

```php
$name = $request->name;
```

Khi sử dụng các thuộc tính động, SkillDo sẽ tìm giá trị của tham số trong dữ liệu yêu cầu.

#### Lấy Một Phần Của Dữ Liệu Input

Nếu bạn cần lấy một phần của dữ liệu đầu vào,
bạn có thể sử dụng các phương thức `only` và `except`. Cả hai phương thức này đều chấp nhận một mảng đơn hoặc một danh sách động các đối số:

```php
$input = $request->only(['username', 'password']);
$input = $request->only('username', 'password');
$input = $request->except(['credit_card']);
$input = $request->except('credit_card');
```

|    Method     |                                Mô tả & Cách dùng                                |
|:-------------:|:-------------------------------------------------------------------------------:|
|   `path()`    |  Lấy đường dẫn URI. Ví dụ vào `domain.com/admin/user` thì trả về `admin/user`.  |
|    `url()`    |                       Lấy đầy đủ URL bỏ đi Query String.                        |
|  `fullUrl()`  |                       Lấy đầy đủ URL có kèm Query String.                       |
|    `ip()`     |                  Lấy địa chỉ IP của Client. `request()->ip()`                   |

### 3.2. Kiểm Tra Trạng Thái Request

Bạn có thể sử dụng phương thức `has` để xác định xem một giá trị có hiện diện trong request hay không.
Phương thức `has` trả về `true` nếu giá trị đó hiện diện trong yêu cầu:

```php
if ($request->has('name')) {
    // ...
}
```

Khi truyền vào một mảng, phương thức `has` sẽ xác định xem tất cả các giá trị cụ thể đã được chỉ định có hiện diện không:

```php
if ($request->has(['name', 'email'])) {
    // ...
}
```

Phương thức `hasAny` trả về `true` nếu bất kỳ giá trị cụ thể nào đã được chỉ định có hiện diện:

```php
if ($request->hasAny(['name', 'email'])) {
    // ...
}
```

Phương thức `whenHas` sẽ thực hiện `closure` đã cho nếu một giá trị hiện diện trong request:

```php
$request->whenHas('name', function (string $input) {
    // ...
});
```

Một closure thứ hai có thể được truyền vào phương thức `whenHas`, sẽ được thực hiện nếu giá trị cụ thể đã được chỉ định không hiện diện trong yêu cầu:

```php
$request->whenHas('name', function (string $input) {
    // The "name" value is present...
}, function () {
    // The "name" value is not present...
});
```

Nếu bạn muốn xác định xem một giá trị có hiện diện trong yêu cầu và không phải là một chuỗi rỗng, bạn có thể sử dụng phương thức `filled`:

```php
if ($request->filled('name')) {
    // ...
}
```

Phương thức `anyFilled` trả về `true` nếu bất kỳ giá trị cụ thể nào đã được chỉ định không phải là một chuỗi rỗng:

```php
if ($request->anyFilled(['name', 'email'])) {
    // ...
}
```

Phương thức `whenFilled` sẽ thực hiện closure đã cho nếu một giá trị hiện diện trong yêu cầu và không phải là một chuỗi rỗng:

```php
$request->whenFilled('name', function (string $input) {
    // ...
});
```

Một closure thứ hai có thể được truyền vào phương thức `whenFilled`, sẽ được thực hiện nếu giá trị cụ thể đã được chỉ định không "filled":

```php
$request->whenFilled('name', function (string $input) {
    // The "name" value is filled...
}, function () {
    // The "name" value is not filled...
});
```

Để xác định xem một khóa cụ thể có vắng mặt từ yêu cầu hay không, bạn có thể sử dụng phương thức `missing` và `whenMissing`:

```php
if ($request->missing('name')) {
    // ...
}
 
$request->whenMissing('name', function (array $input) {
    // The "name" value is missing...
}, function () {
    // The "name" value is present...
});
```
|       Method       |                                                                               Mô tả & Cách dùng                                                                                |
|:------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `isMethod('post')` |                                                             Kiểm tra xem method http có đúng loại mong muốn không.                                                             |
|      `ajax()`      | *(Mở rộng bởi SkillDo)* Kiểm tra request có phải gửi qua AJAX không. Tự phát hiện theo header `Accept`, `x-requested-with` hoặc prefix `api/`. `if(request()->ajax()) { ... }` |

### 3.3. Headers

Bạn có thể lấy request header từ `SkillDo\Http\Request` bằng cách sử dụng phương thức `header`. Nếu header không có trong request, `null` sẽ được trả về. Tuy nhiên, phương thức `header` chấp nhận một tham số thứ hai tùy chọn sẽ được trả về nếu header không có trong request:

```php
$value = $request->header('X-Header-Name');
$value = $request->header('X-Header-Name', 'default');
```

Phương thức `hasHeader` có thể được sử dụng để xác định xem request có chứa một header cụ thể hay không:

```php
if ($request->hasHeader('X-Header-Name')) {
    // ...
}
```

Bạn có thể sử dụng phương thức `bearerToken` để lấy một mã thông báo từ header `Authorization`. Nếu không có header nào như vậy, một chuỗi trống sẽ được trả về:

```php
$token = $request->bearerToken();
```

### 3.4. Xử Lý File Upload

Lấy file tải lên thông qua `request()->file()`. Nó sẽ trả về một thể hiện của lớp `Illuminate\Http\UploadedFile`.

```php
// Lấy object file
$file = request()->file('avatar');

// Kiểm tra có tải File lên không?
if (request()->hasFile('avatar')) 
{
    // Upload hợp lệ không
    if ($file->isValid()) 
    {
        $extension = $file->extension(); // lấy đuôi file
        
        // Chuyển file tới đường dẫn mong muốn (Tự gen tên random)
        $path = $file->store('uploads/avatars');
        
        // Hoặc muốn đặt tên cụ thể
        $path = $file->storeAs('uploads/avatars', 'avatar_1.jpg');
    }
}
```

Class `UploadedFile` cũng chứa các phương thức để truy cập đường dẫn đầy đủ và phần mở rộng của file.
Phương thức `extension` sẽ cố gắng đoán phần mở rộng của tệp tin dựa trên nội dung của nó.
Phần mở rộng này có thể khác so với phần mở rộng được cung cấp bởi máy khách:

```php
$path = $request->avatar->path();
 
$extension = $request->avatar->extension();
```

### 3.4. Các Method Chuyên Biệt SkillDo (Mở rộng)

|          Method          |                                                                                                   Mô tả & Cách dùng                                                                                                    |
|:------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `cookie($key, $default)` |                                                    Lấy giá trị cookie sử dụng class Core Cookie của SkillDo. `$theme = request()->cookie('theme_color', 'light');`                                                     |
|    `hasCookie($key)`     |                                                                            Kiểm tra cookie trên Cms. `request()->hasCookie('theme_color')`                                                                             |
|    `validate($rules)`    | *(Mở rộng bởi SkillDo)* Kích hoạt thư viện `SkillDo\Validate\Validate` tự động kiểm tra dữ liệu đầu vào. Đầu vào có thể truyền 1 mảng Rule hoặc class Form / FormAdmin. `request()->validate(['name' => 'required']);` |
