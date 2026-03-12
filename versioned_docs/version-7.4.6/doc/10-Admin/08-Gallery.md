# Thư viện ảnh

### Thêm thông tin
Các thư viện có sẳn các data mặc định nếu bạn muốn thêm các thông tin của riêng bạn thì có thể sử dụng method `Gallery::addOption`

#### Trang thư viện
Thêm thông tin cho từng ảnh ở trang gallery
```php
Gallery::addOption('gallery', ['field' => 'demo', 'label' => 'Tiêu đề demo', 'type' => 'text']);
```

#### Trang nội dung
Thêm thông tin cho từng ảnh ở trang nội dung
```php
Gallery::addOption('page', ['field' => 'demo', 'label' => 'Tiêu đề demo', 'type' => 'text']);
```

#### Trang bài viết
Thêm thông tin cho từng ảnh ở trang chi tiết bài viết với `object_type` là post type của bài viết
```php
Gallery::addOption('post', [
    'object_type' => 'post', 
    'field' => 'demo',   
    'label' => 'Tiêu đề demo', 
    'type' => 'text'
]);
```

#### Trang sản phẩm
Thêm thông tin cho từng ảnh ở trang chi tiết sản phẩm
```php
Gallery::addOption('products', [
    'field' => 'demo',   
    'label' => 'Tiêu đề demo', 
    'type' => 'text'
]);
```

### Lấy thông tin
Các thông tin tùy chỉnh của bạn khi lưu được thêm vào gallery item metadata,
để lấy dữ liệu thì bạn sử dụng model `\SkillDo\Model\GalleryItem`

#### Trang thư viện
Lấy hình ảnh và thông tin của thư viện
```php
//Lấy danh sách thư viện
$gallery = \SkillDo\Model\Gallery::where('id', 10)->get();

//Lấy danh sách file của thư viện có id là 10
$items = \SkillDo\Model\GalleryItem::where('object_id', 10)->where('object_type', 'gallery')->get();

//Lấy danh sách thông tin kèm theo
foreach ($items as $item)
{
    $demo = \SkillDo\Model\GalleryItem::getMeta($item->id, 'demo', true);
}
```

#### Trang nội dung
Lấy hình ảnh và thông tin trang nội dung
```php
//Lấy danh sách file của page có id là 10
$items = \SkillDo\Model\GalleryItem::where('object_id', 10)->where('object_type', 'page')->get();

//Lấy danh sách thông tin kèm theo
foreach ($items as $item)
{
    $demo = \SkillDo\Model\GalleryItem::getMeta($item->id, 'demo', true);
}
```

#### Trang bài viết
Lấy hình ảnh và thông tin trang chi tiết bài viết với `object_type` là post type của bài viết
```php
//Lấy danh sách file của thư viện có id là 10
$items = \SkillDo\Model\GalleryItem::where('object_id', 10)->where('object_type', 'post_{post_type}')->get();

//Lấy danh sách thông tin kèm theo
foreach ($items as $item)
{
    $demo = \SkillDo\Model\GalleryItem::getMeta($item->id, 'demo', true);
}
```

#### Trang sản phẩm
Lấy hình ảnh và thông tin trang chi tiết sản phẩm
```php
//Lấy danh sách file của thư viện có id là 10
$items = \SkillDo\Model\GalleryItem::where('object_id', 10)->where('object_type', 'products')->get();

//Lấy danh sách thông tin kèm theo
foreach ($items as $item)
{
    $demo = \SkillDo\Model\GalleryItem::getMeta($item->id, 'demo', true);
}
```