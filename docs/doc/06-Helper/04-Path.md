#### `Path::upload($uri, $absolute = false)`
Hàm `Path::upload` hàm trả về đường dẫn thư mục upload.

```php
$absolute (bool | default false) nếu để true sẽ trả về đường dẫn tuyệt đối
Path::upload()
// uploads/
Path::upload('uploads/test/no-image.png')
// uploads/test/no-image.png
Path::upload('uploads/test/no-image.png', true)
//F:\path\source.4.x\skilldo\uploads/test/no-image.png // demo path
```

#### `Path::theme()`
Hàm `Path::theme` hàm trả về đường dẫn thư mục theme hiện đang active.
$absolute (bool | default false) nếu để true sẽ trả về đường dẫn tuyệt đối

```php
Path::theme()
// views/theme-store/
Path::theme('test/no-image.png')
// views/theme-store/test/no-image.png
Path::theme('test/no-image.png', true)
//F:\path\source.4.x\skilldo\views/theme-store/test/no-image.png // demo path
```

#### `Path::admin()`
Hàm `Path::admin` hàm trả về đường dẫn thư mục admin.
$absolute (bool | default false) nếu để true sẽ trả về đường dẫn tuyệt đối

```php
Path::admin()
// views/backend/
Path::admin('test/no-image.png')
// views/backend/test/no-image.png
Path::admin('test/no-image.png', true)
//F:\path\source.4.x\skilldo\views/backend/test/no-image.png // demo path
```

#### `Path::plugin()`
Hàm `Path::plugin` hàm trả về đường dẫn thư mục plugin.
$absolute (bool | default false) nếu để true sẽ trả về đường dẫn tuyệt đối

```php
Path::plugin()
// views/plugins/
Path::plugin('test/no-image.png')
// views/plugins/test/no-image.png
Path::plugin('test/no-image.png', true)
//F:\path\source.4.x\skilldo\views/plugins/test/no-image.png // demo path
```