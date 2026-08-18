# Response

> **File khai báo gốc:** `packages/skilldo/framework/src/Http/Response.php`
>
> **Kế thừa:** `Illuminate\Http\Response`
>
> **Namespace API:** `SkillDo\Http\Response`

## 1. Response trong SkillDo là gì?

Sau khi hệ thống nhận và xử lý xong một Request (ví dụ tương tác DB, thay đổi dữ liệu,...), ứng dụng cần gửi trả kết quả về cho trình duyệt (Client). Kết quả gửi về chính là một đối tượng `Response`.

SkillDo CMS v8 cung cấp một class Response chuẩn (`SkillDo\Http\Response`) kế thừa từ hệ thống Response của Laravel 12 (`Illuminate\Http\Response`). Nhờ vậy, bạn có đầy đủ công cụ như trả về string, array, View HTML, File trực tiếp (Download) hay điển hình nhất là JSON Data cho các yêu cầu AJAX.

## 2. Danh Sách Method Thường Dùng (Đặc trưng của SkillDo)

Class `SkillDo\Http\Response` được mở rộng với các hàm chuyên biệt dành riêng cho việc xử lý Ajax/API. Điểm đặc biệt của các hàm `success()` và `error()` trong SkillDo là **ngay lập tức xuất kết quả và ngắt (die)** quá trình thực thi script PHP tiếp sau đấy, nhằm trả về JSON Output sớm nhất.

| Method                               | Mô tả & Cách dùng                                                                                                                                                                                          |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `setApiStatus($status)`              | Thiết đặt mã trạng thái (`code`) trả về dùng cho Response json (gọi TRƯỚC `success()`/`error()`). Nếu không gọi, mặc định `success` = `200`, `error` = `400`. `response()->setApiStatus(201)`              |
| `success($message, $data = [])`      | Trả về Status (success) cùng thông điệp thành công. Sau khi gửi sẽ kết thúc chương trình. `response()->success('Cập nhật thành công!');`                                                                   |
| `error($message, $data = [])`        | Trả về Status (error) cho Client. Nếu `$message` là một đối tượng `Exception`, nó sẽ tự ghi (Log) lỗi vào hệ thống và đính kèm `file`/`trace` vào `data` trước khi trả về. `response()->error('Tác vụ thất bại!');` |
| `api($status, $message, $data = [])` | Lõi xử lý của việc gửi ra JSON ở 2 hàm trên (gồm format mảng thành các root params `status`, `code`, `message`, `data`). Nếu `$message` là `SKD_Error` sẽ tự lấy lỗi đầu tiên (`->first()`).               |
| `file($file, $headers = [])`         | Khởi tạo đối tượng `BinaryFileResponse` kích hoạt browser hiển thị hoặc ép người dùng tải xuống (Download) tập tin vật lý trên ổ đĩa. `return response()->file($filePath);`                                |

> **Lưu ý:** `$data` truyền vào `success()`/`error()` sẽ được convert tự động (mảng, `Collection`, Eloquent `Model` đều được `Utils::toArray()`). Nếu `$data` là mảng đã chứa key `data` thì toàn bộ mảng đó được trải (spread) lên root của JSON thay vì bọc thêm một lớp `data`.

> **Lưu ý về HTTP status:** giá trị `code` (`setApiStatus`, mặc định 200/400) chỉ là **field trong JSON body** — hàm `api()` không tự đổi HTTP status code (vẫn là `200` trừ khi bạn chủ động gọi `->setStatusCode(...)` trước, như các middleware API vẫn làm). Client JS của CMS phân biệt thành công/thất bại qua field `status`/`code`, không qua HTTP status.


```php
response()->success('thành công!', [
    'id' => 1
]);
```

Kết quả response

```json
{
    "data": {
        "id": 1
    },
    "status": "success",
    "code": 200,
    "message": "thành công!"
}
```

```php
response()->error('thất bại!', [
    'id' => 1
]);
```
Kết quả response
```json
{
    "data": {
        "id": 1
    },
    "status": "error",
    "code": 400,
    "message": "thất bại!"
}
```


### 2.1. Ví Dụ Các Response Phổ Biến Cho CMS Developer

**Ajax Form Callback (Báo Cập Nhật Thành Công/Thất Bại)**
> Dạng Json này tương thích 100% với trình xử lý Ajax trên CMS do UI Admin Skilldo cung cấp. Bạn nên ưu tiên sử dụng `success()` và `error()`.

```php
use SkillDo\Http\Request;

class UserController
{
    public function updateAvatar(Request $request)
    {
        // ... xử lý thay đổi hình ảnh

        if ($uploadThanhCong) {
            response()->success('Cập nhật ảnh đại diện thành công');
            // Dòng code dưới đây KHÔNG bao giờ chạy tới (die process)
        }

        response()->error('File không hợp lệ hoặc vượt quá dung lượng!');
    }
}
```

Kết quả Client nhận được khi gọi `response()->success(...)`:
```json
{
  "status": "success",
  "code": 200,
  "message": "Cập nhật ảnh đại diện thành công",
  "data": []
}
```

**Trả về Download File Trong Module Tùy Biến**
Khi bạn muốn tạo một API cho phép tải file PDF hoặc hình ảnh ra khỏi thư mục server mà không cho Client truy cập theo URL.

```php
class MediaController
{
    public function downloadPdf($id)
    {
        $pathToFile = storage_path('uploads/invoices/HD_' . $id . '.pdf');
        
        return response()->file($pathToFile);
    }
}
```

### 2.2. Các Kiểu Trả Về Từ Controller / Route

> **Khác Laravel:** helper `response()` của SkillDo **không nhận tham số** — nó trả về **singleton** `SkillDo\Http\Response` (khai báo tại `packages/skilldo/framework/src/Support/common.php`). Không tồn tại `response('text', 200)`, `response()->json()`, `response()->download()` hay `redirect()->back()`.

Router (`SkillDo\Routing\Router::prepareResponse()`) sẽ tự chuyển đổi giá trị Controller return về Response phù hợp:

- `return 'Hello World';` — String (hoặc object có `__toString`) → Response HTML 200.
- `return ['key' => 'value'];` — Mảng / `Arrayable` / `Jsonable` / `JsonSerializable` / `stdClass` → tự convert thành `JsonResponse` (thay cho `response()->json()` của Laravel).
- `return view('my-theme::home');` — Khởi tạo HTML hiển thị người dùng bằng Template.
- `return response()->file($filePath);` — Trả file vật lý (`BinaryFileResponse`).
- `return null;` — Response rỗng 200.

**Redirect:** helper `redirect()` của SkillDo là một hàm global **gửi header và kết thúc script ngay** (không return được):

```php
// Signature thực tế: redirect($uri = '', $method = 'location', $http_response_code = 302): void
redirect('admin/post');            // header Location + exit (302)
redirect('san-pham', 'refresh');   // dùng header Refresh thay vì Location
redirect('en/san-pham', 'location', 301); // redirect 301
```

URI không bắt đầu bằng `http(s)://` sẽ tự được nối với `Url::base()`. Không có `redirect()->back()`.

> **Lưu ý về singleton:** vì `response()` luôn trả về cùng một instance, mọi header bạn set qua `response()->header(...)` trong Controller sẽ được Router merge vào Response cuối cùng kể cả khi bạn không `return response()` trực tiếp.

#### Response header
Các response khi trả về máy chủ web đều có phần header chứa một số các thông tin để trình duyệt có thể sử dụng trong quá trình tạo nội dung hiển thị cho người dùng.
Bạn có thể sử dụng phương thức `header` để thêm 1 loạt các header vào response trước khi gửi lại cho người dùng.
```php
response()
    ->header('Content-Type', 'application/json')
    ->header('X-Header-One', 'Header Value')
    ->header('X-Header-Two', 'Header Value');
```
Hoặc, bạn có thể sử dụng phương thức withHeaders để chỉ định một mảng các tiêu đề được thêm vào response.

```php
response()
    ->withHeaders([
        'Content-Type' => 'application/json',
        'X-Header-One' => 'Header Value',
        'X-Header-Two' => 'Header Value',
    ]);
```
#### Ép trình duyệt tải xuống (Download)
SkillDo **không có** method `download()` riêng. Để buộc trình duyệt tải file xuống thay vì hiển thị, dùng `file()` kết hợp header `Content-Disposition` (tham số thứ hai của `file()` là mảng headers truyền thẳng vào `BinaryFileResponse`):

```php
return response()->file($pathToFile, [
    'Content-Disposition' => 'attachment; filename="file-name.png"',
]);
```

## 3. Điều Khiển Cache Của Response (Mở rộng SkillDo)

Mặc định, Router (`prepareResponse()`) **tự động bật HTTP cache 10 giây** (`Cache-Control: public, max-age=10`) cho mọi response thành công của request cacheable (GET/HEAD) mà **không phải** `JsonResponse`. Class `SkillDo\Http\Response` mở rộng thêm các method để Controller chủ động kiểm soát hành vi này:

| Method                | Mô tả & Cách dùng                                                                                                                                            |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `noCache()`           | Tắt cache hoàn toàn cho response: set `Cache-Control: no-cache, no-store, must-revalidate` + `Pragma: no-cache` + `Expires: 0`. `response()->noCache();`      |
| `setMaxAge($seconds)` | (Override) Đặt `max-age` và đánh dấu "controller đã tự config cache" — Router sẽ KHÔNG auto-apply 10s nữa.                                                    |
| `setPublic()`         | (Override) Đặt cache public, đồng thời đánh dấu đã tự config cache.                                                                                           |
| `setPrivate()`        | (Override) Đặt cache private, đồng thời đánh dấu đã tự config cache.                                                                                          |
| `isCacheDisabled()`   | Kiểm tra controller đã gọi `noCache()` chưa (trả về `bool`).                                                                                                  |
| `isCacheConfigured()` | Kiểm tra controller đã tự config cache (gọi `noCache`/`setMaxAge`/`setPublic`/`setPrivate`) chưa — Router dùng flag này để quyết định có auto-cache 10s không. |

```php
// Trang động không được phép cache
public function cart()
{
    response()->noCache();

    return view('theme::cart');
}

// Trang tĩnh muốn cache lâu hơn 10s mặc định
public function about()
{
    response()->setPublic();
    response()->setMaxAge(3600); // 1 giờ

    return view('theme::about');
}
```

> **Debug:** khi `APP_DEBUG=true` và request là AJAX, mỗi lần gọi `success()`/`error()`/`api()` hệ thống sẽ tự append log truy vấn SQL (action + query log) vào file `storage/logs/query-log.log`.
