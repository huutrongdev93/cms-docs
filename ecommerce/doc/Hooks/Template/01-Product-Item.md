# 1. Template Hooks: Product Item (Khối Sản Phẩm)

Product Item là khối UI hiển thị một sản phẩm thu gọn trong Grid hoặc Carousel. Các hooks được đăng ký trong `bootstrap/template-object.php`, chỉ được thêm nếu config Admin cho phép hiển thị tiêu đề/giá.

---

## Sơ Đồ Hooks

```
product_object           (hook cha - chứa toàn bộ product item card)
├── product_object_image (vùng ảnh đại diện)
└── product_object_info  (vùng thông tin: tiêu đề, giá)
    ├── priority = product.object.title.position → Title
    └── priority = product.object.price.position → Price
```

---

## Danh Sách Hook

| Hook Name              | Priority Mặc Định | Class::Method          | Vị Trí                     | Tham Số             |
|:-----------------------|:-----------------:|:-----------------------|:---------------------------|:--------------------|
| `product_object_image` |        10         | `ProductObject::image` | Vùng ảnh đại diện sản phẩm | `$product` (Object) |
| `product_object_info`  |      config*      | `ProductObject::title` | Tên sản phẩm               | `$product` (Object) |
| `product_object_info`  |      config*      | `ProductObject::price` | Giá sản phẩm               | `$product` (Object) |

> **(*) Priority** của `title` và `price` được lấy từ config Admin:  
> - `Config::get('product.object.title.position')` (thường = 10)  
> - `Config::get('product.object.price.position')` (thường = 20)  
> Admin có thể hoán đổi vị trí giá và tên từ trang cài đặt Commerce.

---

## Ví Dụ Thực Tế

### 💡 Thêm Badge Giảm Giá vào vùng ảnh
```php
add_action('product_object_image', function($product) {
    if($product->price_sale > 0 && $product->price_sale < $product->price) {
        $percent = round((($product->price - $product->price_sale) / $product->price) * 100);
        echo '<span class="badge-sale">-'.$percent.'%</span>';
    }
}, 5); // Trước ảnh (priority 10) → hiện lên trên ảnh
```

### 💡 Thêm Button "Thêm Vào Giỏ Nhanh"
```php
add_action('product_object_info', function($product) {
    if(!$product->hasVariation) {
        echo '<button class="btn-quick-add" data-id="'.$product->id.'" data-price="'.$product->price.'">';
        echo '🛒 Thêm vào giỏ';
        echo '</button>';
    }
}, 30); // Sau giá (priority 20)
```

### 💡 Thêm Đánh Giá Sao (Rating)
```php
// Plugin rating-star hook vào đây
add_action('product_object_info', function($product) {
    $rating = DB::table('ratings')->where('product_id', $product->id)->avg('score');
    if($rating) {
        $stars = round($rating);
        echo '<div class="star-rating" data-score="'.$rating.'">';
        echo str_repeat('⭐', $stars);
        echo '</div>';
    }
}, 15); // Giữa title(10) và price(20)
```

### 💡 Thêm Nhãn "Hết hàng"
```php
add_action('product_object_image', function($product) {
    $stock = DB::table('stocks')->where('product_id', $product->id)->value('quantity');
    if($stock !== null && $stock <= 0) {
        echo '<div class="out-of-stock-overlay">Hết hàng</div>';
    }
}, 15);
```

---

## Filters Liên Quan

### `products_model_retrieved`
Thêm field tính toán vào mỗi Product khi lấy từ DB:
```php
add_filter('products_model_retrieved', function($product) {
    $product->discount_percent = 0;
    if($product->price > 0 && $product->price_sale > 0) {
        $product->discount_percent = round(
            (($product->price - $product->price_sale) / $product->price) * 100
        );
    }
    return $product;
});
```
