# File Storage

File Storage là một thư viện lưu trữ file dựa trên `Flysystem`. 
Nó cung cấp một giao diện để tương tác với nhiều loại hệ thống tập tin. 
>
Để sử dụng storage bạn có thể sử dụng các method `static`, ví dụ như method `put` để tạo file
```php
Storage::put('file.png')
```

Mặc định các thao lưu, xóa, thêm file hay thư mục điều bên trong thư mục lưu trữ của cms `uploads`, 
nếu bạn cần thao tác với thư mục khác bạn có thể sử dụng phương thức `make` nhận vào một đối số là thư mục cần thao tác, mặc định giá trị này sẽ được đặt thành thư mục lưu trữ của cms `uploads`
```php
$storage = Storage::make(string $path)
```

## Files

### Lấy Files

Phương thức `get` có thể được sử dụng để lấy nội dung của một `file`. Nội dung chuỗi thô của `file` sẽ được trả về bởi phương thức. 
Hãy nhớ rằng, tất cả các đường dẫn `file` nên được chỉ định tương đối đối với "root" của ổ đĩa:


```php
$contents = Storage::get('source/file.jpg');
```
Nếu file bạn đang lấy có nội dung là `JSON`, bạn có thể sử dụng phương thức `json` để lấy file và giải mã nội dung của nó:

```php
$contents = Storage::get('source/file.json');
```

Phương thức `exists` có thể được sử dụng để xác định xem một file có tồn tại không:

```php
if (Storage::exists('file.jpg')) {
    // ...
}
```
Phương thức `missing` có thể được sử dụng để xác định xem một file đã mất hay chưa:

```php
if (Storage::missing('file.jpg')) {
    // ...
}
```

### Thông tin Files

Ngoài việc đọc và ghi files, Storage còn có thể cung cấp thông tin về chính files đó. 
>
Phương thức `size` có thể được sử dụng để lấy kích thước của một file tính bằng byte:

```php
$size = Storage::size('file.jpg');
```
Phương thức `lastModified` trả về thời điểm sửa đổi cuối cùng của file dưới dạng dấu thời gian UNIX:

```php
$time = Storage::lastModified('file.jpg');
```
MIME type của một file cụ thể có thể được lấy qua phương thức `mimeType`:

```php
$mime = Storage::mimeType('file.jpg');
```

### Lưu Files

Phương thức `put` có thể được sử dụng để lưu trữ nội dung của file lên ổ đĩa. 
Bạn cũng có thể truyền một PHP `resource` cho phương thức `put`, sẽ sử dụng hỗ trợ dòng của Flysystem ở dưới. 
Hãy nhớ rằng, tất cả các đường dẫn file nên được chỉ định tương đối đối với "root" được cấu hình cho ổ đĩa:

```php
Storage::put('file.jpg', $contents);
```

#### Lữu File Thất Bại

Nếu phương thức `put` (hoặc các hoạt động "ghi" khác) không thể ghi file vào ổ đĩa, `false` sẽ được trả về:

```php
if (!Storage::put('file.jpg', $contents)) {
    // File không thể được ghi vào ổ đĩa...
}
```
#### Thêm nội dung vào Đầu hoặc Cuối Files

Phương thức `prepend` và `append` cho phép bạn ghi vào đầu hoặc cuối của một file:

```php
Storage::prepend('file.log', 'Text được thêm vào đầu');
Storage::append('file.log', 'Text được thêm vào cuối');
```

### Copying và Moving Files

Phương thức `copy` có thể được sử dụng để sao chép một file tồn tại vào một vị trí mới trên ổ đĩa, 
trong khi phương thức `move` có thể được sử dụng để đổi tên hoặc di chuyển một file tồn tại vào vị trí mới:

```php
Storage::copy('old/file.jpg', 'new/file.jpg');
Storage::move('old/file.jpg', 'new/file.jpg');
```

### Upload Files

Trong ứng dụng web, một trong những trường hợp sử dụng phổ biến nhất để lưu trữ files là lưu trữ các files được người dùng tải lên như ảnh và tài liệu.
Storage giúp việc lưu trữ các files được tải lên trở nên rất dễ dàng bằng cách sử dụng phương thức `store` trên một instance của file đã được tải lên. 
Gọi phương thức store với đường dẫn mà bạn muốn lưu trữ file đã tải lên:

```php
$path = request()->file('avatar')->store('avatars');
```

Có một số điều quan trọng cần lưu ý về ví dụ này. 
Lưu ý rằng `store` chỉ nhận tên thư mục, không phải tên file. 
Mặc định, phương thức `store` sẽ tạo ra một ID duy nhất để làm tên file. 
Phần mở rộng của file sẽ được xác định bằng cách kiểm tra kiểu MIME của file. 
Đường dẫn đến file sẽ được trả về bởi phương thức `store` để bạn có thể lưu trữ đường dẫn, bao gồm tên file được tạo ra, trong cơ sở dữ liệu của bạn.

#### Tạo Tên Files

Nếu bạn không muốn tự động gán một tên file cho file đã lưu trữ của bạn, bạn có thể sử dụng phương thức `storeAs`, nhận đường dẫn, tên file và (tùy chọn) ổ đĩa như là các đối số của nó:

```php
$request = request();
$path = $request->file('avatar')->storeAs(
    'avatars', $request->input('id')
);
```
Các ký tự Unicode không thể in và không hợp lệ sẽ tự động bị loại bỏ khỏi đường dẫn của file. Do đó, bạn nên làm sạch đường dẫn của file trước khi truyền chúng vào Storage file của SkillDo. Đường dẫn file được chuẩn hóa bằng cách sử dụng phương thức `League\Flysystem\WhitespacePathNormalizer::normalizePath`

#### Thông tin Files Upload

Nếu bạn muốn lấy tên và phần mở rộng ban đầu của file đã tải lên, bạn có thể sử dụng các phương thức `getClientOriginalName` và `getClientOriginalExtension`:

```php
$file = $request->file('avatar');
$name = $file->getClientOriginalName();
$extension = $file->getClientOriginalExtension();
```

Tuy nhiên, hãy nhớ rằng các phương thức `getClientOriginalName` và `getClientOriginalExtension` là không an toàn, 
vì tên file và phần mở rộng có thể bị can thiệp bởi người dùng. 
Vì lý do này, bạn thường nên sử dụng các phương thức `hashName` và `extension` để lấy tên và phần mở rộng cho file tải lên cụ thể:

```php
$file = $request->file('avatar');
$name = $file->hashName(); // Tạo ra một tên duy nhất, ngẫu nhiên...
$extension = $file->extension(); // Xác định phần mở rộng của file dựa trên kiểu MIME của file...
```

### Xóa File

Phương thức `delete` chấp nhận một file hoặc một mảng các files để xóa:

```php
Storage::delete('file.jpg');
Storage::delete(['file.jpg', 'file2.jpg']);
```

## Directories


### Lấy Tất cả Files Trong Một Dir

Phương thức `files` trả về một mảng của tất cả các files trong một thư mục cụ thể. 
Nếu bạn muốn lấy danh sách tất cả các files trong một thư mục cụ thể bao gồm tất cả các thư mục con, bạn có thể sử dụng phương thức `allFiles`:

```php
$files = Storage::files($directory);
$files = Storage::allFiles($directory);
```

### Lấy Tất cả Dir Trong Một Dir
Phương thức `directories` trả về một mảng của tất cả các thư mục trong một thư mục cụ thể. 
Ngoài ra, bạn có thể sử dụng phương thức `allDirectories` để lấy danh sách tất cả các thư mục trong một thư mục cụ thể và tất cả các thư mục con của nó:
```php
$directories = Storage::directories($directory);
$directories = Storage::allDirectories($directory);
```

### Tạo Một Dir
Phương thức `makeDirectory` sẽ tạo ra thư mục đã cho, bao gồm bất kỳ thư mục con cần thiết:

```php
Storage::makeDirectory($directory);
```

### Xóa Một Dir
Cuối cùng, phương thức `deleteDirectory` có thể được sử dụng để xóa bỏ một thư mục và tất cả các files của nó:

```php
Storage::deleteDirectory($directory);
```