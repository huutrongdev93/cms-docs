### Vị trí
Mặc định Theme hỗ trợ 2 vị trí hiển thị tài nguyên là header và footer, để lấy vị trí cần thêm bạn dùng method `location`
```php
$header = Template::asset()->location('header');
$footer = Template::asset()->location('footer');
```
### Thêm tài nguyên
Để thêm một tài nguyên vào vị trí bạn sử dụng method `add`
```php
$header = Template::asset()->location('header');
$header->add('lib1', 'node_module/lib1/css/demo.min.css', ['minify' => true]);
$header->add('lib2', 'node_module/lib2/css/demo.min.css', ['minify' => false]);
$header->add('lib3', 'node_module/lib3/css/demo.min.css', ['minify' => true]);

$footer = Template::asset()->location('footer');
$header->add('lib1', 'node_module/lib1/js/demo.min.js', ['minify' => true]);
$header->add('lib2', 'node_module/lib2/js/demo.min.js', ['minify' => false]);
$header->add('lib3', 'node_module/lib3/js/demo.min.js', ['minify' => true]);
```

### Hook Thêm tài nguyên
Bạn có thể sử dụng hook `theme_custom_assets` để thêm tài nguyên, hook nhận vào 2 đối số là header và footer

```php
function customAssetsTheme(AssetPosition $header, AssetPosition $footer) {
    $header = Template::asset()->location('header');
    $header->add('lib1', 'node_module/lib1/css/demo.min.css', ['minify' => true]);
    $header->add('lib2', 'node_module/lib2/css/demo.min.css', ['minify' => false]);
    $header->add('lib3', 'node_module/lib3/css/demo.min.css', ['minify' => true]);
    
    $footer = Template::asset()->location('footer');
    $header->add('lib1', 'node_module/lib1/js/demo.min.js', ['minify' => true]);
    $header->add('lib2', 'node_module/lib2/js/demo.min.js', ['minify' => false]);
    $header->add('lib3', 'node_module/lib3/js/demo.min.js', ['minify' => true]);
}

add_action('theme_custom_assets', 'customAssetsTheme', 10, 2);
```

### File Thêm tài nguyên
Theme hiện tại mặc định cung cấp cho bạn file `theme-assets.php` nằm trong thư mục `theme-custom` để bạn có thể viết code custom assets vào đó.