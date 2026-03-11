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

| Method                               | Mô tả & Cách dùng                                                                                                                                                             |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `setApiStatus($status)`              | Thiết đặt mã trạng thái (`code`) trả về dùng cho Response json. Cú pháp chuỗi: `response()->setApiStatus(200)`                                                                |
| `success($message, $data = [])`      | Trả về Status (success) cùng thông điệp thành công. Sau khi gửi sẽ kết thúc chương trình. `response()->success('Cập nhật thành công!');`                                      |
| `error($message, $data = [])`        | Trả về Status (error) cho Client. Nếu `$message` là một đối tượng `Exception`, nó sẽ tự ghi (Log) lỗi vào hệ thống trước khi trả về. `response()->error('Tác vụ thất bại!');` |
| `api($status, $message, $data = [])` | Lõi xử lý của việc gửi ra JSON ở 2 hàm trên (gồm format mảng thành các root params `status`, `code`, `message`, `data`).                                                      |
| `file($file, $headers = [])`         | Khởi tạo đối tượng `BinaryFileResponse` kích hoạt browser hiển thị hoặc ép người dùng tải xuống (Download) tập tin vật lý trên ổ đĩa. `return response()->file($filePath);`   |


```php
response()->success('thành công!', [
    'id' => 1
]);
```

Kết quả response

```php
{
    "data": [
        "id" : 1
    ],
    "status" : "success",
    "code"   : "200",
    "message": "thành công!"
}
```

```php
response()->error('thất bại!', [
    'id' => 1
]);
```
Kết quả response
```php
{
    "data": [
        "id" : 1
    ],
    "status" : "error",
    "code"   : "400",
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

### 2.2. Response Helpers Cơ Bản (Từ Illuminate Router)
Đây là các hàm cơ bản mà Framework nào thuộc hệ sinh thái Laravel cũng có (Được giữ lại nguyên bản trên SkillDo). Tùy vào tính chất logic Route mà bạn hãy Return về dạng thích hợp:

- `return response('Hello World', 200);` (Trả về String văn bản chuẩn)
- `return response()->json([...]);` (Tự cast mảng thành nội dung loại Application/Json, cho Client dùng API tự do)
- `return redirect('/admin/post');` (Hoặc nếu redirect về url trước: `return redirect()->back();`)
- `return view('my-theme::home');` (Khởi tạo HTML hiển thị người dùng bằng Template)

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
#### Response download
Phương thức `download` có thể được sử dụng để tạo 1 response buộc trình duyệt của người dùng tải xuống tệp ở đường dẫn đã cho.

| Column Name |  Type  |                                Description |
| ----------- | :----: | -----------------------------------------: |
| $path       | string | Đường dẫn đến file cần download (bắt buộc) |
| $name       | string |          Tên file khi tài xuống (bắt buộc) |
| $headers    | array  | mãng header muốn thêm vào (không bắt buộc) |

```php
response()->download('uploads/file/download.png', 'file-name.png');
```
