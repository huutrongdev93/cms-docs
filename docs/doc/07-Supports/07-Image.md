# Image

> **File:** `packages/skilldo/cms/src/Support/Image.php`  
> **Namespace:** `SkillDo\Cms\Support\Image`  
> **Alias ngắn:** `\Image`

Class `Image` hỗ trợ việc tạo URL và thẻ HTML `<img>` cho các hình ảnh theo nhiều nguồn khác nhau. Mọi phương thức static đều trả về một `Image` instance, cho phép gọi theo kiểu chuỗi (fluent).

Tiền tố thư mục cho từng kiểu nguồn lấy từ config `media` (`packages/skilldo/cms/src/config/media.php`):

```php
'source'    => 'uploads/source/',
'medium'    => 'uploads/medium/',
'thumbnail' => 'uploads/thumbnail/',
'large'     => 'uploads/thumbnail/',   // mặc định large dùng chung thư mục thumbnail
```

---

## 1. Tạo Image Instance

Mỗi phương thức static tạo ra một `Image` instance với kiểu nguồn tương ứng. Bạn cần gọi `.html()` hoặc `.link()` ở cuối để lấy kết quả. Tất cả các phương thức static đều nhận tham số thứ hai là `$alt` (tùy chọn). Đường dẫn `$path` là **tương đối** so với thư mục media (không cần kèm `uploads/...`).

### `Image::make()`
Tạo ảnh với type tùy chọn: `Image::make(string $type, ?string $path = null, ?string $alt = null)`. Khi truyền `$path`, hệ thống tự nhận diện lại type nếu path là URL (→ `link`/`youtube`), chuỗi base64 (→ `base64`) hoặc bắt đầu bằng `watermark/` (→ `watermark`).

```php
// kiểu nguồn 'source'
$img = Image::make('source', '2026/03/photo.jpg')->html();

// Kiểu medium (tự động thêm thư mục uploads/medium/)
$img = Image::make('medium', '2026/03/photo.jpg')->html();

// Kiểu YouTube (tự động nhận diện URL YouTube)
$img = Image::make('youtube', 'https://www.youtube.com/watch?v=Lq5GO4M1-Gk')->html();

// Kèm alt ngay khi tạo
$img = Image::make('thumbnail', $product->image, 'Áo thun nam')->html();
```

### `Image::source()`
Tạo ảnh từ thư mục `uploads/source/` (nguồn gốc, kích thước gốc).

```php
$img = Image::source('2026/03/photo.jpg')->html();
// <img src="uploads/source/2026/03/photo.jpg" alt="..." loading="lazy" />
```

### `Image::thumb()`
Tạo ảnh từ thư mục `uploads/thumbnail/`.

```php
$img = Image::thumb('2026/03/photo.jpg')->html();
// <img src="uploads/thumbnail/2026/03/photo.jpg" ... />
```

### `Image::medium()`
Tạo ảnh từ thư mục `uploads/medium/`.

```php
$img = Image::medium('2026/03/photo.jpg')->html();
```

### `Image::large()`
Tạo ảnh theo kiểu `large`. Lưu ý: theo config `media` mặc định, `large` trỏ về cùng thư mục `uploads/thumbnail/`.

```php
$img = Image::large('2026/03/photo.jpg')->html();
```

> **Fallback tự động:** Với các kiểu `thumbnail` / `medium` / `large`, nếu file đã resize không tồn tại trên disk, URL sẽ tự động fallback về ảnh gốc trong `uploads/source/`.

### `Image::watermark()`
Tạo ảnh từ thư mục `watermark/` (URL dạng `https://domain.com/watermark/...`, yêu cầu Plugin watermark được kích hoạt). Chỉ áp dụng cho file `jpg`, `jpeg`, `png`, `webp`; các định dạng khác sẽ trả về ảnh nguồn `uploads/source/`.

```php
$img = Image::watermark('2026/03/photo.jpg')->html();
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
Tạo ảnh từ URL bên ngoài hoặc đường dẫn tuyệt đối (type nội bộ là `link`, URL được giữ nguyên).

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
Trả về chuỗi URL của ảnh (không bao gồm thẻ HTML). Kết quả đi qua filter `get_img_link`.

```php
$link = Image::source('2026/03/photo.jpg')->link();
// 'uploads/source/2026/03/photo.jpg'
```

### `.html()`
Trả về chuỗi HTML thẻ `<img>` đầy đủ. Tự động thêm `alt`, `title`, `loading="lazy"` và `onerror` (fallback về `uploads/no-image.png` khi ảnh lỗi).

Nếu không truyền `$alt` và không set attribute `alt`, hệ thống tự lấy alt theo thứ tự: `title`/`name` của object hiện tại (`Cms::getData('object')`) → `name` của category → `Option::get('general_label')` (tên website).

Attributes đi qua filter `get_img_params`, HTML cuối cùng đi qua filter `get_img`.

```php
$html = Image::source('2026/03/photo.jpg')->html('Hình ảnh sản phẩm');
// <img src="..." alt="Hình ảnh sản phẩm" title="Hình ảnh sản phẩm" onerror="..." loading="lazy" />
```

---

## 3. Thêm Attributes

### `.attribute(string $key, mixed $value)`
Thêm một attribute cho thẻ `<img>`.

```php
$img = Image::source('photo.jpg')
    ->attribute('class', 'img-fluid')
    ->attribute('width', 800)
    ->html();
// <img src="..." class="img-fluid" width="800" loading="lazy" />
```

### `.attributes(array $attributes)`
Gán toàn bộ mảng attribute (lưu ý: **thay thế** các attribute đã set trước đó, không merge).

```php
$img = Image::source('photo.jpg')
    ->attributes([
        'class'  => 'img-fluid rounded',
        'width'  => 800,
        'height' => 600,
    ])
    ->html();
```

Ngoài ra còn có `.getAttribute($key)` và `.removeAttribute($key)`. Attribute `class` nhận string hoặc mảng class; attribute `style` nhận string hoặc mảng `['property' => 'value']`.

---

## 4. Lazy Loading và Size

### Lazy Loading với Placeholder

```php
// Dùng preloader mặc định của theme (assets/images/preloader.gif)
$img = Image::source('photo.jpg')
    ->attribute('lazy', 'default')
    ->html();
// Thẻ img sẽ có src = preloader.gif và data-src = ảnh thật
// (cần kết hợp với JS xử lý lazy load)

// Hoặc truyền URL placeholder tùy ý
$img = Image::source('photo.jpg')
    ->attribute('lazy', Url::theme('assets/images/placeholder.png'))
    ->html();
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