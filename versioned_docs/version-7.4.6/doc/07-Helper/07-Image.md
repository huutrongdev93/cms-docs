# Image
Thư viện được thêm vào từ phiên bản <span class="badge text-bg-pink">version 7.3.3</span>, hỗ trợ việc thao tác vói image

### Tạo image
#### Thumbnail
Tạo ảnh từ thư mục `uploads/thumbnail`
```php
Image::thumb($path, $alt = null)
```

#### Medium
Tạo ảnh từ thư mục `uploads/medium`
```php
Image::medium($path, $alt = null)
```

#### Large
Tạo ảnh từ thư mục `uploads/large`
```php
Image::large($path, $alt = null)
```

#### watermark
Tạo ảnh từ thư mục `uploads/source` có kèm watermark (yêu cầu có plugin watermark)
```php
Image::watermark($path, $alt = null)
```

#### youtube
Lấy ảnh thumb từ đường dẫn youtube
```php
Image::youtube($url, $alt = null)
```

#### base64
Tạo ảnh từ mã base64
```php
Image::base64($path, $alt = null)
```

#### url
Tạo ảnh từ đường dẫn hình ảnh
```php
Image::url($path, $alt = null)
```

#### theme
Tạo ảnh từ thư mục `views/<theme-current>/assets/images`
```php
Image::theme($path, $alt = null)
```

#### plugin
Tạo ảnh từ thư mục plugin `views/plugins`
```php
Image::plugin($pluginName, $path, $alt = null)
```

### Thao tác
#### Lấy link ảnh đã xử lý
```php
$link = Image::source('image/logo-skilldo.png')->link()
```

#### Lấy html
Để tạo string html `<img src="...">` bạn sử dụng method `html`
```php
$img = Image::source('image/logo-skilldo.png')->html()
```

#### Thêm attribute
Thêm attribute cho thẻ html
```php
$img = Image::source('image/logo-skilldo.png')->attribute('class', 'img-top')->html()
```
hoặc

```php
$img = Image::source('image/logo-skilldo.png')->attributes(['class' => 'img-top'])->html()
```