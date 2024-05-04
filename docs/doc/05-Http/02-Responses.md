# Response
Khi mỗi request từ trình duyệt gửi lên máy chủ web xử lý xong sẽ trả về một response cho trình duyệt để hiển thị các nội dung cho người dùng.

### Response api
#### success & error
Sử dụng response để trả kết quả về cho trình duyệt dưới dạng json
Để trả về kết quả thành công bạn sử dụng phương thức `success`, method `success` nhận vào 2 tham số

| Column Name |       Type        |                                       Description |
|-------------|:-----------------:|--------------------------------------------------:|
| $message    | string, SKD_Error | Thông báo thành công hoặc một đối tượng skd_error |
| $data       |       array       |                              Data trả về kèm theo |

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

Để trả về kết quả thất bại bạn sử dụng phương thức `error`, method `error` nhận vào 2 tham số

| Column Name |       Type        |                                       Description |
|-------------|:-----------------:|--------------------------------------------------:|
| $message    | string, SKD_Error | Thông báo thành công hoặc một đối tượng skd_error |
| $data       |       array       |                              Data trả về kèm theo |

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

#### status code
Mặc định success sẽ trả về mã code 200 và error trả về mã code 400, để thay đổi mã code bạn sử dụng phương thức `setApiCode`
```php
response()->setApiCode(1001)->error('thất bại!');
```

### Status http
Để set mã trạng thái cho trang bạn sử dụng method `setStatus`
```php
//trả về trang 404
response()->setStatus(404)->send();
```

### Response header
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
### Response download
Phương thức `download` có thể được sử dụng để tạo 1 response buộc trình duyệt của người dùng tải xuống tệp ở đường dẫn đã cho.

| Column Name |  Type  |                                Description |
|-------------|:------:|-------------------------------------------:|
| $path       | string | Đường dẫn đến file cần download (bắt buộc) |
| $name       | string |          Tên file khi tài xuống (bắt buộc) |
| $headers    | array  | mãng header muốn thêm vào (không bắt buộc) |

```php
response()->download('uploads/file/download.png', 'file-name.png');
```

### Response file
Phương thức `file` có thể được sử dụng để hiển thị tệp, chẳng hạn như hình ảnh hoặc PDF, trực tiếp trong trình duyệt của người dùng thay vì bắt đầu tải xuống.

| Column Name |  Type  |                                Description |
|-------------|:------:|-------------------------------------------:|
| $path       | string | Đường dẫn đến file cần hiển thị (bắt buộc) |
| $headers    | array  | mãng header muốn thêm vào (không bắt buộc) |

```php
response()->file('uploads/file/download.png');
```