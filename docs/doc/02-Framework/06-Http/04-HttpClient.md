# HTTP Client

- **File khai báo gốc:** `packages/skilldo/framework/src/Http/Http.php`
- **Kế thừa:** `Illuminate\Http\Client\Factory`
- **Namespace API:** `SkillDo\Http\Http`

## 1. HTTP Client trong SkillDo là gì?

SkillDo CMS v8 cung cấp một thư viện HTTP Client mạnh mẽ, thân thiện để tạo các **outbound HTTP requests** (Gửi yêu cầu giao tiếp với các server/API bên ngoài). 

Thực chất, công cụ này là một class đóng gói (Wrapper) và gọi trực tiếp tới lõi xử lý `Illuminate\Http\Client\Factory` của Laravel, dựa trên trình xử lý HTTP nổi tiếng là **Guzzle HTTP Client**. Nhờ vậy, bạn có đầy đủ mọi tính năng mạnh mẽ của Guzzle nhưng cú pháp lại cực kỳ ngắn gọn và tự nhiên.

## 2. Cách Sử Dụng HTTP Client

Để gửi yêu cầu giao tiếp, bạn sử dụng trực tiếp class Helper (tương tự như Facade) `\SkillDo\Http\Http` trên bất kỳ Module hay Plugin nào. Tùy theo Method API yêu cầu từ nền tảng khác, bạn gọi phương thức tĩnh tương ứng (`get`, `post`, `put`, `patch`, `delete`).

Ví dụ Gửi GET Request đơn giản:
```php
use SkillDo\Http\Http;

$response = Http::get('http://example.com/api/users');

// Nếu thành công sẽ nhận được 1 đối tượng Response
return $response->json();
```

---

## 3. Các Cách Gửi Request Thường Dùng (Examples)

### 3.1 Gửi Tham Số Query String (GET)
Khi gửi GET request mà có URL queries, ngoài cách nối URL `?key=value`, bạn có thể truyền vào mảng tham số ở argument thứ 2 để Framework tự Format giúp bạn tránh lỗi mã hóa ký tự đặc biệt (URL Encode).

```php
$response = Http::get('http://example.com/api/search', [
    'keyword' => 'Sikido',
    'page' => 1,
]);
```

### 3.2 Gửi JSON Data (POST / PUT)
Theo mặc định, mảng dữ liệu mà bạn truyền vào method `post` hoặc `put` sẽ gửi dưới dạng Payload JSON (`application/json`). Bạn không cần Encode thủ công.

```php
$response = Http::post('http://example.com/api/users/create', [
    'name' => 'Nguyễn Hữu Trọng',
    'email' => 'admin@sikido.vn',
    'role' => 'administrator'
]);
```

Nếu server đối tác yêu cầu gửi form theo chuẩn Form URL Encoded (`application/x-www-form-urlencoded`), bạn gọi thêm method `asForm()`:
```php
$response = Http::asForm()->post('http://example.com/api/post', [
    'title' => 'Sample post title',
]);
```

### 3.3 Đính Kèm Tiêu Đề (Headers)
Bạn có thể cấu hình thông tin trên Request Header bằng hàm `withHeaders()`. Đặc biệt ở những Restful APIs có khóa `Authorization` Bearer token.

```php
$response = Http::withHeaders([
    'X-Client-ID' => 'SikidoApp',
    'Accept' => 'application/json'
])
// Hỗ trợ nhanh gắn Token mà không cần gõ 'Authorization' => 'Bearer $token'
->withToken('A1C2E3B4XYZ') 
->get('http://example.com/api/profile');
```

---

## 4. Xử Lý Kết Quả Trả Về (Class HTTP Response)

Khi một kết nối thành công (không gặp lỗi Timeout của Server), hàm HTTP của thư viện sẽ luôn trả về lớp `Illuminate\Http\Client\Response`. Lớp này cung cấp dồi dào sức mạnh để kiểm tra mã trạng thái và bóc tách dữ liệu ra (Body Data).

### 4.1. Lấy dữ liệu (Body)
| Method         | Mô tả & Cách dùng                                                                                                      |
|----------------|------------------------------------------------------------------------------------------------------------------------|
| `body()`       | Trả về nội dung phản hồi thô (Chuỗi nguyên thủy/String raw).                                                           |
| `json()`       | Trả về cấu trúc mảng Array PHP, nội dung sẽ được `json_decode` tự động (Hữu dụng nhất).`$results = $response->json();` |
| `object()`     | Trả về đối tượng `stdClass` thay vì mảng.                                                                              |
| `header($key)` | Trích xuất riêng 1 giá trị phía Server đối tác ném về Header trên Response.                                            |
| `headers()`    | Lấy tất cả Headers thành mảng.                                                                                         |

### 4.2. Kiểm tra trạng thái HTTP (Status Code)
Thay vì tự bắt Regex với Guzzle thì công cụ wrapper cho ra các hàm sau:

| Method          | Mô tả & Cách dùng                                                     |
|-----------------|-----------------------------------------------------------------------|
| `status()`      | Trả về trạng thái kiểu (Integer), vd: `200`, `404`, `500`...          |
| `successful()`  | `true` khi mã trả về nằm giữa khoảng báo thành công `200` và `299`.   |
| `failed()`      | `true` khi HTTP Code lớn hơn hoặc bằng `400` (Thất bại / Lỗi Server). |
| `clientError()` | `true` khi là lỗi Client `4xx` (Ví dụ 404, 401 Unauth...).            |
| `serverError()` | `true` khi là lỗi lập trình Server `5xx`.                             |

Thao tác Kiểm tra lỗi mẫu:
```php
$response = Http::get('http://mysite.com/missing-page');

if ($response->successful()) 
{ // Mọi thứ đều ổn 
    $data = $response->json();
}

if ($response->clientError()) 
{ // Ví dụ 404 
    echo 'Server báo lỗi quyền hạn hoặc không tìm thấy trang';
}
```

---

## 5. Các Chức Năng Nâng Cao

### Setting Timeout
Nếu thiết bị đối tác phản hồi lâu hơn bạn kỳ vọng, việc connection bị "giữ" sẽ làm gián đoạn toàn bộ request từ Client hiện tại. Để giải quyết, dùng `timeout(số_giây)`:

```php
// Hủy bỏ và đánh sập request sau 5s nếu server API kia chưa làm xong.
$response = Http::timeout(5)->get('http://example.com/api'); 
```

### Thử Lại (Retry)
Rất hữu ích đối phó với hiện tượng "mạng chập chờn / Bad connection". Tính năng này sẽ tự động thử gửi lại Request nếu kết nối bị rớt.

```php
// Thử lại 3 lần. Nếu vẫn rớt thì mỗi lần delay một khoảng cách là 200 milliseconds
$response = Http::retry(3, 200)->post('http://example.com/api/ping', [
    'ping' => 'pong'
]);
```
