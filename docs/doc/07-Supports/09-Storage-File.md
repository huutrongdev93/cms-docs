# Storage và File

## 1. Storage

> **File:** `packages/skilldo/framework/src/Filesystem/Storage.php`  
> **Namespace:** `SkillDo\Filesystem\Storage`  
> **Alias ngắn:** `\Storage`  
> **Tài liệu tham khảo:** [Laravel Filesystem](https://laravel.com/docs/12.x/filesystem)

`Storage` là một lớp bao bọc Laravel Filesystem, cho phép thao tác với file hệ thống qua các **Disk** đã được cấu hình sẵn. Mỗi disk là một "ổ đĩa ảo" trỏ đến một thư mục cụ thể trên server.

---

### 1.1 Các Disk Sẵn Có

SkillDo CMS v8 cấu hình sẵn 5 disk trong `config/filesystems.php`:

| Disk | Thư mục gốc | Dùng để |
|---|---|---|
| `root` | `/` (thư mục gốc project) | Thao tác file ở thư mục gốc |
| `storage` | `storage/` | Lưu file nội bộ (log, cache, session...) |
| `plugins` | `plugins/` | Thao tác file trong thư mục plugins |
| `views` | `views/` | Thao tác file trong thư mục views/theme |
| `uploads` | `storage/uploads/` | Quản lý ảnh, file upload của người dùng |

---

### 1.2 Khởi Tạo Disk

```php
// Lấy disk theo tên
$disk = Storage::disk('storage');
$disk = Storage::disk('plugins');
$disk = Storage::disk('uploads');
```

---

### 1.3 Đọc File

```php
$disk = Storage::disk('storage');

// Kiểm tra file có tồn tại không
if ($disk->exists('cms/config.json')) {
    // Đọc nội dung file dạng string
    $content = $disk->get('cms/config.json');

    // Đọc file JSON và decode thành array
    $data = $disk->json('cms/config.json');
}

// Lấy kích thước file (bytes)
$size = $disk->size('cms/config.json');

// Lấy thời gian sửa đổi cuối (Unix timestamp)
$time = $disk->lastModified('cms/config.json');
```

---

### 1.4 Ghi File

```php
$disk = Storage::disk('storage');

// Ghi nội dung vào file (tạo mới hoặc ghi đè)
$disk->put('cms/my-plugin/config.json', json_encode($data));

// Thêm nội dung vào cuối file (append)
$disk->append('cms/my-plugin/activity.log', date('Y-m-d') . ': Đã xử lý xong');

// Ghi vào đầu file (prepend)
$disk->prepend('cms/my-plugin/activity.log', '=== Log mới nhất ===');
```

---

### 1.5 Xóa File và Thư Mục

```php
$disk = Storage::disk('storage');

// Xóa một file
$disk->delete('cms/my-plugin/old-file.json');

// Xóa nhiều file cùng lúc
$disk->delete(['cms/file1.json', 'cms/file2.json']);

// Xóa thư mục (và toàn bộ nội dung bên trong)
$disk->deleteDirectory('cms/my-plugin/temp');
```

---

### 1.6 Thư Mục

```php
$disk = Storage::disk('storage');

// Tạo thư mục mới
$disk->makeDirectory('cms/my-plugin/data');

// Liệt kê các file trong thư mục
$files = $disk->files('cms/my-plugin');
// ['cms/my-plugin/config.json', 'cms/my-plugin/data.log']

// Liệt kê file kể cả thư mục con
$allFiles = $disk->allFiles('cms/my-plugin');

// Liệt kê các thư mục con
$dirs = $disk->directories('cms/my-plugin');

// Liệt kê tất cả thư mục con (đệ quy)
$allDirs = $disk->allDirectories('cms');
```

---

### 1.7 Upload File (Disk `uploads`)

Disk `uploads` trỏ vào `storage/uploads/` — thư mục lưu ảnh và file do người dùng upload lên.

```php
$disk = Storage::disk('uploads');

// Upload file từ Request
$file = request()->file('image');
if ($file) {
    $path = $disk->putFile('products', $file);
    // $path = 'products/randomname.jpg'
}

// Upload với tên file tự chọn
$path = $disk->putFileAs('products', $file, 'my-product.jpg');
// $path = 'products/my-product.jpg'

// Kiểm tra và xóa ảnh cũ
if ($disk->exists('products/old-image.jpg')) {
    $disk->delete('products/old-image.jpg');
}
```

---

### 1.8 Thao Tác Thư Mục Plugin (Disk `plugins`)

```php
$disk = Storage::disk('plugins');

// Đọc file cấu hình của plugin
$config = $disk->json('my-plugin/config.json');

// Ghi file CSS được generate tự động
$disk->put('my-plugin/assets/css/custom.css', $cssContent);

// Kiểm tra thư mục tồn tại
if (!$disk->exists('my-plugin/assets')) {
    $disk->makeDirectory('my-plugin/assets');
}

// Liệt kê các file template
$templates = $disk->files('my-plugin/templates');
```

---

### 1.9 Thao Tác Thư Mục Views/Theme (Disk `views`)

```php
$disk = Storage::disk('views');

// Đọc file view
$content = $disk->get('my-theme/index.blade.php');

// Kiểm tra file template tồn tại
if ($disk->exists('my-theme/partials/header.blade.php')) {
    // Dùng template có header riêng
}

// Tạo file view mới (dùng trong Plugin DevTool/generator)
$disk->put('my-theme/partials/my-widget.blade.php', $templateContent);
```

---

### 1.10 Ví Dụ Thực Tế — Plugin Lưu Cấu Hình Ra File

```php
use SkillDo\Filesystem\Storage;

class MyPluginConfig
{
    private const FILE = 'my-plugin/runtime-config.json';

    private static function disk()
    {
        return Storage::disk('storage');
    }

    public static function get(): array
    {
        if (!static::disk()->exists(static::FILE)) {
            return [];
        }
        return static::disk()->json(static::FILE) ?? [];
    }

    public static function save(array $config): void
    {
        static::disk()->put(static::FILE, json_encode($config, JSON_PRETTY_PRINT));
    }

    public static function clear(): void
    {
        if (static::disk()->exists(static::FILE)) {
            static::disk()->delete(static::FILE);
        }
    }
}

// Sử dụng
MyPluginConfig::save(['api_key' => 'abc123', 'mode' => 'live']);
$config = MyPluginConfig::get();
```

---

## 2. File

> **File:** `packages/skilldo/framework/src/Support/File.php`  
> **Namespace:** `SkillDo\Support\File`  
> **Alias ngắn:** `\File`  
> **Extends:** `Illuminate\Filesystem\Filesystem`  
> **Tài liệu tham khảo:** [Laravel File](https://laravel.com/docs/12.x/helpers#files)

`File` là lớp bao bọc `Illuminate\Filesystem\Filesystem` của Laravel. Khác với `Storage` (dùng **disk ảo** với đường dẫn tương đối), `File` làm việc trực tiếp với **đường dẫn tuyệt đối** trên server.

> **Khi nào dùng `File` thay vì `Storage`?**
> - Cần đường dẫn **tuyệt đối** (ví dụ: kết hợp với `Path::`)
> - Thao tác ngoài các disk đã cấu hình
> - Copy, move file giữa các thư mục khác nhau

---

### 2.1 Kiểm Tra File/Thư Mục

```php
use SkillDo\Support\Path;

// Kiểm tra file tồn tại
$path = Path::storage('cms/my-plugin/config.json');
if (File::exists($path)) {
    // file tồn tại
}

// Kiểm tra là file
File::isFile($path);
// true

// Kiểm tra là thư mục
File::isDirectory(Path::storage('cms/my-plugin'));
// true

// Kiểm tra có thể ghi
File::isWritable($path);
```

---

### 2.2 Đọc File

```php
// Đọc toàn bộ nội dung file
$content = File::get(Path::storage('cms/config.json'));

// Đọc file dưới dạng mảng các dòng
$lines = File::lines(Path::storage('cms/activity.log'));

// Lấy phần mở rộng file
$ext = File::extension('/uploads/photo.jpg');
// 'jpg'

// Lấy tên file (không có đuôi)
$name = File::name('/uploads/photo.jpg');
// 'photo'

// Lấy tên file đầy đủ (có đuôi)
$basename = File::basename('/uploads/photo.jpg');
// 'photo.jpg'

// Lấy thư mục chứa file
$dir = File::dirname('/uploads/2026/photo.jpg');
// '/uploads/2026'

// Lấy kích thước file (bytes)
$size = File::size(Path::storage('cms/config.json'));

// Lấy thời gian sửa đổi cuối
$time = File::lastModified(Path::storage('cms/config.json'));
```

---

### 2.3 Ghi File

```php
// Ghi nội dung vào file (tạo mới hoặc ghi đè)
File::put(Path::storage('cms/my-plugin/config.json'), json_encode($data));

// Thêm nội dung vào cuối file
File::append(Path::storage('cms/my-plugin/activity.log'), "New line\n");

// Ghi vào đầu file
File::prepend(Path::storage('cms/my-plugin/activity.log'), "Header line\n");
```

---

### 2.4 Copy, Move, Xóa

```php
$src  = Path::storage('cms/my-plugin/config.json');
$dest = Path::storage('cms/my-plugin/config.backup.json');

// Copy file
File::copy($src, $dest);

// Di chuyển file
File::move($src, $dest);

// Xóa file
File::delete($src);

// Xóa nhiều file
File::delete([$src, $dest]);

// Xóa thư mục (kể cả nội dung bên trong)
File::deleteDirectory(Path::storage('cms/my-plugin/temp'));

// Xóa nội dung trong thư mục nhưng giữ lại thư mục
File::cleanDirectory(Path::storage('cms/my-plugin/temp'));
```

---

### 2.5 Thư Mục

```php
$dir = Path::storage('cms/my-plugin/data');

// Tạo thư mục (kể cả thư mục cha)
File::makeDirectory($dir, 0755, true);

// Sao chép toàn bộ thư mục
File::copyDirectory(
    Path::storage('cms/old-plugin'),
    Path::storage('cms/new-plugin')
);

// Lấy danh sách file trong thư mục
$files = File::files(Path::storage('cms/my-plugin'));

// Lấy danh sách file (kể cả thư mục con)
$allFiles = File::allFiles(Path::storage('cms/my-plugin'));

// Lấy danh sách thư mục con
$dirs = File::directories(Path::storage('cms'));
```

---

### 2.6 Ví Dụ Thực Tế — Dùng `File` Trong Plugin ActivatorService

```php
use SkillDo\Support\Path;
use SkillDo\Support\Facades\File;

class ActivatorService
{
    // Tạo thư mục cần thiết khi kích hoạt plugin
    public function up(): void
    {
        $storagePath = Path::storage('cms/my-plugin');

        if (!File::isDirectory($storagePath)) {
            File::makeDirectory($storagePath, 0755, true);
        }

        // Copy file cấu hình mẫu
        $sampleConfig = Path::plugin('my-plugin/config.sample.json');
        $activeConfig = Path::storage('cms/my-plugin/config.json');

        if (!File::exists($activeConfig)) {
            File::copy($sampleConfig, $activeConfig);
        }
    }

    // Dọn dẹp khi gỡ plugin
    public function down(): void
    {
        $storagePath = Path::storage('cms/my-plugin');

        if (File::isDirectory($storagePath)) {
            File::deleteDirectory($storagePath);
        }
    }
}
```

---

## 3. So Sánh `Storage` và `File`

| Tiêu chí | `Storage::disk('...')` | `File` |
|---|---|---|
| **Đường dẫn** | Tương đối từ root của disk | Tuyệt đối trên server |
| **Cấu hình disk** | Cần khai báo disk trong `filesystems.php` | Không cần, dùng đường dẫn trực tiếp |
| **Kết hợp với** | Tên file tương đối | `Path::` helper |
| **Dùng khi** | Làm việc trong các thư mục đã được cấu hình (`storage`, `plugins`, `uploads`...) | Cần đường dẫn tuyệt đối hoặc thao tác ngoài disk cấu hình |
| **Ví dụ** | `Storage::disk('storage')->get('cms/file.json')` | `File::get(Path::storage('cms/file.json'))` |
