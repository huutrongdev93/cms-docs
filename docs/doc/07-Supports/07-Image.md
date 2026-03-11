# Image

> **File:** `packages/skilldo/cms/src/Support/Image.php`
> **Namespace:** `SkillDo\Cms\Support\Image`
> **Alias ngắn:** `\Image`

Class `Image` hỗ trợ việc tạo URL và thẻ HTML `<img>` cho các hình ảnh theo nhiều nguồn khác nhau. Mọi phương thức static đều trả về một `Image` instance, cho phép gọi theo kiểu chuỗi (fluent).

---

## 1. Tạo Image Instance

Mỗi phương thức static tạo ra một `Image` instance với kiểu nguồn tương ứng. Bạn cần gọi `.html()` hoặc `.link()` ở cuối để lấy kết quả.

### `Image::source()`
Tạo ảnh từ thư mục `uploads/` (nguồn gốc, kích thước gốc).

```php
$img = Image::source('uploads/2026/03/photo.jpg')->html();
// <img src="uploads/2026/03/photo.jpg" alt="..." loading="lazy" />
```

### `Image::thumb()`
Tạo ảnh từ thư mục `uploads/thumbnail/`.

```php
$img = Image::thumb('uploads/2026/03/photo.jpg')->html();
// <img src="uploads/thumbnail/2026/03/photo.jpg" ... />
```

### `Image::medium()`
Tạo ảnh từ thư mục `uploads/medium/`.

```php
$img = Image::medium('uploads/2026/03/photo.jpg')->html();
```

### `Image::large()`
Tạo ảnh từ thư mục `uploads/large/`.

```php
$img = Image::large('uploads/2026/03/photo.jpg')->html();
```

### `Image::watermark()`
Tạo ảnh từ thư mục `uploads/watermark/` (yêu cầu có Plugin watermark được kích hoạt).

```php
$img = Image::watermark('uploads/2026/03/photo.jpg')->html();
```

### `Image::youtube()`
Lấy ảnh thumbnail từ URL video YouTube.

```php
$img = Image::youtube('https://www.youtube.com/watch?v=Lq5GO4M1-Gk')->html();
// <img src="https://img.youtube.com/vi/Lq5GO4M1-Gk/0.jpg" ... />

// Lấy link thay vì HTML
$link = Image::youtube('https://www.youtube.com/watch?v=Lq5GO4M1-Gk')->link();
```

### `Image::base64()`
Tạo ảnh từ chuỗi mã base64.

```php
$img = Image::base64('data:image/png;base64,iVBORw0KGgo...')->html();
```

### `Image::url()`
Tạo ảnh từ URL bên ngoài hoặc đường dẫn tuyệt đối.

```php
$img = Image::url('https://example.com/photo.jpg')->html();
```

### `Image::theme()`
Tạo ảnh từ thư mục `assets/images/` của theme đang kích hoạt.

```php
$img = Image::theme('logo.png')->html();
// <img src="views/my-theme/assets/images/logo.png" ... />
```

### `Image::admin()`
Tạo ảnh từ thư mục `assets/images/` của admin backend.

```php
$img = Image::admin('icons/user.png')->html();
```

### `Image::plugin()`
Tạo ảnh từ thư mục của plugin.

```php
// Image::plugin($pluginFolderName, $imagePath)
$img = Image::plugin('sicommerce', 'assets/images/banner.png')->html();
// Tương đương src: plugins/sicommerce/assets/images/banner.png
```

---

## 2. Lấy Kết Quả

### `.link()`
Trả về chuỗi URL của ảnh (không bao gồm thẻ HTML).

```php
$link = Image::source('uploads/2026/03/photo.jpg')->link();
// 'uploads/2026/03/photo.jpg'
```

### `.html()`
Trả về chuỗi HTML thẻ `<img>` đầy đủ. Tự động thêm `alt`, `title` và `loading="lazy"`.

```php
$html = Image::source('uploads/2026/03/photo.jpg')->html('Hình ảnh sản phẩm');
// <img src="..." alt="Hình ảnh sản phẩm" title="Hình ảnh sản phẩm" loading="lazy" />
```

---

## 3. Thêm Attributes

### `.attribute(string $key, mixed $value)`
Thêm một attribute cho thẻ `<img>`.

```php
$img = Image::source('uploads/photo.jpg')
    ->attribute('class', 'img-fluid')
    ->attribute('width', 800)
    ->html();
// <img src="..." class="img-fluid" width="800" loading="lazy" />
```

### `.attributes(array $attributes)`
Thêm nhiều attribute cùng lúc.

```php
$img = Image::source('uploads/photo.jpg')
    ->attributes([
        'class'  => 'img-fluid rounded',
        'width'  => 800,
        'height' => 600,
    ])
    ->html();
```

---

## 4. Lazy Loading và Size

### Lazy Loading với Placeholder

```php
// Dùng preloader mặc định của theme
$img = Image::source('uploads/photo.jpg')
    ->attribute('lazy', 'default')
    ->html();
// Thẻ img sẽ có src = preloader.gif và data-src = ảnh thật
// (cần kết hợp với JS xử lý lazy load)
```

---

## 5. Ví Dụ Tổng Hợp

```php
// Hiển thị ảnh sản phẩm với thumbnail và class CSS
echo Image::thumb($product->image)
    ->attribute('class', 'product-img')
    ->html($product->title);

// Lấy link ảnh để dùng trong background CSS
$bgUrl = Image::large($post->image)->link();
echo '<div style="background-image: url(' . $bgUrl . ')"></div>';

// Ảnh từ plugin
echo Image::plugin('my-plugin', 'images/no-product.png')
    ->attribute('class', 'img-placeholder')
    ->html('No product image');

// Thumbnail từ YouTube
echo Image::youtube($video->url)
    ->attribute('class', 'video-thumb')
    ->html($video->title);
```