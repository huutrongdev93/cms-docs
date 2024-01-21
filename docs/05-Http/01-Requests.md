# Request

Lớp `Request` của SkillDo dựa trên lớp `Illuminate\Http\Request` của Laravel cung cấp một đối tượng để tương tác với yêu cầu HTTP hiện tại đang được ứng dụng của bạn xử lý cũng như truy xuất dữ liệu đầu vào, cookie và file đã được gửi cùng với yêu cầu.

## Tương tác với Request

### Sử dụng Request

Trong ajax callback sẽ tự động nhận được request là tham số đầu tiên và bạn cần thêm gợi ý lớp `SkillDo\Request\HttpRequest` để sử dụng
```php
#[NoReturn]
function ajaxCallback(SkillDo\Request\HttpRequest $request, $model): void
{
    if($request->isMethod('post')) {
    
        response()->success('thành công!');
    }
    
    response()->error('không thành công');
}
```

Hoặc

```php
use SkillDo\Request\HttpRequest;
#[NoReturn]
function ajaxCallback(HttpRequest $request, $model): void
{
    if($request->isMethod('post')) {
    
        response()->success('thành công!');
    }
    
    response()->error('không thành công');
}
```

Hoặc bạn cũng có thể gọi `request` bằng phương thức toàn cục: `request()`

```php
request()->input('name')
```

### Path, Host and Method

#### Request Path

Phương thức `path` trả về thông tin đường dẫn của yêu cầu. Vì vậy, nếu yêu cầu đến được nhắm mục tiêu tại `http://example.com/foo/bar`, phương thức đường dẫn sẽ trả về `foo/bar`:

```php
$uri = request()->path();
```

#### Kiểm tra đường dẫn request

Phương thức `is` cho phép bạn xác minh rằng đường dẫn yêu cầu đến khớp với một mẫu nhất định. 
Bạn có thể sử dụng ký tự `*` làm ký tự đại diện khi sử dụng phương pháp này:

```php
if (request()->is('admin/*')) {
    // ...
}
```

#### Truy xuất Request URL

Để truy xuất URL đầy đủ cho Request, bạn có thể sử dụng phương thức `url` hoặc `fullUrl`. 
Phương thức `url` sẽ trả về URL không có chuỗi truy vấn, trong khi phương thức `fullUrl` bao gồm chuỗi truy vấn:

```php
$url = request()->url();
 
$urlWithQueryString = request()->fullUrl();
```

Nếu bạn muốn nối thêm dữ liệu query string vào URL hiện tại, bạn có thể gọi phương thức `fullUrlWithQuery`. 
Phương thức này hợp nhất mảng các biến chuỗi truy vấn đã cho với chuỗi truy vấn hiện tại:

```php
request()->fullUrlWithQuery(['type' => 'phone']);
```

Nếu bạn muốn lấy URL hiện tại mà không có tham số query string nhất định, bạn có thể sử dụng phương thức `fullUrlWithoutQuery`:

```php
request()->fullUrlWithoutQuery(['type']);
```

#### Truy xuất Request Host

Bạn có thể truy xuất "host" của Request thông qua các phương thức `host`, `httpHost` và `schemeAndHttpHost` :

```php
$request->host();
$request->httpHost();
$request->schemeAndHttpHost();
```

#### Truy xuất Request Method

Phương thức `method` sẽ trả về loại HTTP Request. Bạn có thể sử dụng phương thức `isMethod` để xác minh loại HTTP khớp với một loại nhất định:
```php
$method = $request->method();

if ($request->isMethod('post')) {
// ...
}
```

### Request Headers

Bạn có thể lấy request header từ `SkillDo\Request\HttpRequest` bằng cách sử dụng phương thức `header`. Nếu header không có trong request, `null` sẽ được trả về. Tuy nhiên, phương thức `header` chấp nhận một tham số thứ hai tùy chọn sẽ được trả về nếu header không có trong request:

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

### Request IP Address
Phương thức `ip` có thể được sử dụng để lấy địa chỉ IP của máy khách đã thực hiện Request đến ứng dụng của bạn:

```php
$ipAddress = $request->ip();
```
Nếu bạn muốn lấy một mảng các địa chỉ IP, bao gồm tất cả các địa chỉ IP của máy khách đã được chuyển tiếp bởi proxy, bạn có thể sử dụng phương thức `ips`. 
Địa chỉ IP "gốc" (original) của máy khách sẽ ở cuối mảng:

```php
$ipAddresses = $request->ips();
```
## Input

### Lấy Dữ liệu Input

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

Sử dụng một số phương thức đơn giản, bạn có thể truy cập tất cả dữ liệu đầu vào của người dùng từ thể hiện `SkillDo\Request\HttpRequest` mà không phải lo lắng về loại HTTP nào được sử dụng cho request. 
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

Bạn cũng có thể truy cập Input bằng cách sử dụng các thuộc tính động trên `SkillDo\Http\HttpRequest`. 
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

### Kiểm Tra Input
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

## Files

### Xử lý File Uploaded

Bạn có thể lấy file đã tải lên từ một thể hiện `SkillDo\Http\HttpRequest` bằng cách sử dụng phương thức `file` hoặc sử dụng các thuộc tính động. 
Phương thức `file` trả về một thể hiện của lớp `Illuminate\Http\UploadedFile`, mở rộng từ lớp PHP `SplFileInfo` và cung cấp nhiều phương thức để tương tác với file:

```php
$file = $request->file('photo');
 
$file = $request->photo;

```

Bạn có thể xác định xem một file có hiện diện trong request không bằng cách sử dụng phương thức `hasFile`:

```php
if ($request->hasFile('photo')) {
    // ...
}
```

### Kiểm Tra Việc Upload Thành Công

Ngoài việc kiểm tra xem file có tồn tại hay không, 
bạn cũng có thể xác nhận xem có vấn đề nào trong quá trình tải lên file không thông qua phương thức `isValid`:

```php
if ($request->file('photo')->isValid()) {
    // ...
}
```
### File Paths và Extensions

Class `UploadedFile` cũng chứa các phương thức để truy cập đường dẫn đầy đủ và phần mở rộng của file. 
Phương thức `extension` sẽ cố gắng đoán phần mở rộng của tệp tin dựa trên nội dung của nó. 
Phần mở rộng này có thể khác so với phần mở rộng được cung cấp bởi máy khách:

```php
$path = $request->photo->path();
 
$extension = $request->photo->extension();
```

### Lưu Files

Để lưu trữ một file đã upload,
class `UploadedFile` có một phương thức `store` sẽ di chuyển file đã tải lên đến một vị trí trên local filesystem của bạn.
>
Phương thức `store` chấp nhận đường dẫn mà file nên được lưu trữ liên quan đến thư mục gốc được cấu hình của hệ thống tệp tin. 
Đường dẫn này không nên chứa tên file, vì một `ID` duy nhất sẽ tự động được tạo ra để làm tên file.

```php
$path = $request->photo->store('uploads/source/images');
```
Nếu bạn không muốn một tên file được tạo tự động, bạn có thể sử dụng phương thức `storeAs`, 
chấp nhận đường dẫn, tên file và tên folder như là các đối số của nó:

```php
$path = $request->photo->storeAs('uploads/source/images', 'filename.jpg');
```