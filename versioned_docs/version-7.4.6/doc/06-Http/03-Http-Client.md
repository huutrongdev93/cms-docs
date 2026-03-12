# HTTP Client
Lớp `HTTP` của SkillDo dựa trên thư viện `Guzzle`
## Tạo Request
Để tạo một request, bạn có thể sử dụng các phương thức `head`, `get`, `post`, `put`, `patch`, and `delete` của class `Http`.
```php
use SkillDo\Http\Http;
 
$response = Http::get('http://example.com');
```

Phương thức `get` trả về một phiên bản của `Illuminate\Http\Client\Response`, 
cung cấp nhiều phương thức khác nhau có thể được sử dụng để kiểm tra response như sau:
```php
$response->body() : string;
$response->json($key = null, $default = null) : array|mixed;
$response->object() : object;
$response->collect($key = null) : Illuminate\Support\Collection;
$response->status() : int;
$response->successful() : bool;
$response->redirect(): bool;
$response->failed() : bool;
$response->clientError() : bool;
$response->header($header) : string;
$response->headers() : array;
```

Ngoài các method được liệt kê ở trên, các method sau có thể được sử dụng để xác định xem response có mã status nhất định hay không
```php
$response->ok() : bool;                  // 200 OK
$response->created() : bool;             // 201 Created
$response->accepted() : bool;            // 202 Accepted
$response->noContent() : bool;           // 204 No Content
$response->movedPermanently() : bool;    // 301 Moved Permanently
$response->found() : bool;               // 302 Found
$response->badRequest() : bool;          // 400 Bad Request
$response->unauthorized() : bool;        // 401 Unauthorized
$response->paymentRequired() : bool;     // 402 Payment Required
$response->forbidden() : bool;           // 403 Forbidden
$response->notFound() : bool;            // 404 Not Found
$response->requestTimeout() : bool;      // 408 Request Timeout
$response->conflict() : bool;            // 409 Conflict
$response->unprocessableEntity() : bool; // 422 Unprocessable Entity
$response->tooManyRequests() : bool;     // 429 Too Many Requests
$response->serverError() : bool;         // 500 Internal Server Error
```

## Gửi Data Request
Thông thường khi thực hiện các request `POST`, `PUT` và `PATCH` là bạn cần gửi dữ liệu bổ sung cùng với request của bạn, 
vì vậy các method cũng chấp nhận một array làm đối số thứ hai. Theo mặc định, dữ liệu sẽ được gửi bằng loại nội dung application/json:

```php
use SkillDo\Http\Http;
 
$response = Http::post('http://example.com/users', [
    'name' => 'Steve',
    'role' => 'Network Administrator',
]);
```

### Query Parameters cho GET
Khi thực hiện yêu cầu GET, bạn có thể nối trực tiếp chuỗi truy vấn vào URL hoặc chuyển một array các cặp key/value làm đối số thứ hai cho phương thức get:
```php
$response = Http::get('http://example.com/users', [
    'name' => 'Taylor',
    'page' => 1,
]);
//hoặc
$response = Http::get('http://example.com/users?name=Taylor&page=1');
```
Ngoài ra, bạn cũng có thể sử dụng method `withQueryParameters`

```php
$response = Http::withQueryParameters([
    'name' => 'Taylor',
    'page' => 1,
])->get('http://example.com/users');
```
### Form URL Encoded Requests
Nếu bạn muốn gửi dữ liệu bằng cách sử dụng loại nội dung là `application/x-www-form-urlencoded`, bạn có thể sử dụng method `asForm`

```php
$response = Http::asForm()->post('http://example.com/users', [
    'name' => 'Sara',
    'role' => 'Privacy Consultant',
]);
```

## Headers
headers có thể được thêm vào yêu cầu bằng method `withHeaders`. Method `withHeaders` này chấp nhận một mảng các cặp key/value:

```php
$response = Http::withHeaders([
    'X-First' => 'foo',
    'X-Second' => 'bar'
])->post('http://example.com/users', [
    'name' => 'Taylor',
]);
```