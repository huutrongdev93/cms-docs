# Product (Sản phẩm)

**Class**: `\Ecommerce\Models\Product`  
**Alias**: `Product` (đã đăng ký toàn cục)  
**Table**: `products`  
**Namespace**: `Ecommerce\Models`

---

## Cấu trúc Cột (Columns)

| Tên Cột | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `title` | string | — | Tên sản phẩm |
| `attribute_label` | string | — | Label biến thể đã chọn (tổng hợp) |
| `slug` | string | — | Đường dẫn URL |
| `code` | string | — | Mã SKU (tự sinh: `SP000012`) |
| `content` | wysiwyg | — | Nội dung mô tả dài |
| `excerpt` | wysiwyg | — | Mô tả ngắn |
| `seo_title` | string | — | Tiêu đề SEO |
| `seo_description` | string | — | Mô tả SEO |
| `seo_keywords` | string | — | Từ khoá SEO |
| `price` | price | `0` | Giá gốc (VND) |
| `price_sale` | price | `0` | Giá khuyến mãi (0 = không KM) |
| `status` | string | `public` | Trạng thái (public/draft/private) |
| `status1` | int | `0` | Collection: Yêu thích (1=có) |
| `status2` | int | `0` | Collection: Bán chạy (1=có) |
| `status3` | int | `0` | Collection: Hot (1=có) |
| `image` | image | — | Ảnh đại diện |
| `public` | int | `1` | Hiển thị công khai (1/0) |
| `trash` | int | `0` | Đã xóa mềm (1/0) |
| `order` | int | `0` | Thứ tự sắp xếp |
| `parent_id` | int | `0` | ID sản phẩm cha (cho biến thể) |
| `brand_id` | int | `0` | ID thương hiệu |
| `weight` | int | `0` | Cân nặng (gram) |
| `long` | int | `0` | Chiều dài (mm) |
| `width` | int | `0` | Chiều rộng (mm) |
| `height` | int | `0` | Chiều cao (mm) |
| `hasVariation` | int | `0` | Có biến thể không (1=có) |
| `type` | string | `product` | Loại: `product` hoặc `variations` |

> **Lưu ý**: Mỗi sản phẩm còn có thể có metadata mở rộng trong bảng `products_metadata` (truy cập qua `Product::getMeta($id, $key, true)`)

---

## Truy Vấn Cơ Bản

```php
// Tất cả sản phẩm đang hiển thị (public=1 được áp tự động trên Frontend)
$products = Product::get();

// Tìm theo ID
$product = Product::find(12);

// Tìm theo slug
$product = Product::where('slug', 'ao-phong-nam')->first();

// Sản phẩm trong danh mục (bao gồm danh mục con)
$products = Product::whereByCategory($categoryId)->get();
$products = Product::whereByCategory($categoryObject)->get();

// Sản phẩm bán chạy
$products = Product::where('status2', 1)->limit(8)->get();

// Sản phẩm có biến thể (loại trừ record variations)
$products = Product::widthVariation()->get();
// tương đương: whereIn('type', ['product', 'variations'])
```

---

## Query Scopes (Tùy chỉnh Truy vấn)

### `scopeWidthVariation()`
Lọc chỉ lấy sản phẩm thuộc type `product` và `variations` (loại trừ các record là biến thể con).

```php
Product::widthVariation()->get();
```

### `scopeOnlyVariation()`
Chỉ lấy các bản ghi có type là `variations`.

```php
Product::onlyVariation()->where('parent_id', 10)->get();
```

### `scopeWhereByCategory($idOrObject)`
Lọc sản phẩm theo danh mục, tự động bao gồm danh mục con (nested set).

```php
// Theo ID
Product::whereByCategory(5)->get();

// Theo Object danh mục
$category = ProductCategory::find(5);
Product::whereByCategory($category)->get();

// Theo mảng nhiều danh mục
Product::whereByCategory([5, 7, 9])->get();
```

### `scopeRelated($idOrObject)` – Sản phẩm liên quan
Lấy sản phẩm cùng danh mục, loại trừ bản thân.

```php
$related = Product::related($product)->limit(6)->get();
```

---

## Sự kiện Model (Model Events)

| Event | Trigger | Hành động mặc định |
|:---|:---|:---|
| `retrieved` | Sau khi lấy từ DB | Gọi filter `products_model_retrieved` |
| `saving` | Trước khi lưu | Tự điền `seo_title`, `seo_description` nếu trống |
| `saved` (add) | Sau khi thêm mới | Tự sinh mã `code` (SP000012), lưu categories |
| `saved` (update) | Sau khi cập nhật | Sync categories, xóa cache |
| `trashed` | Sau khi xóa mềm | Xóa cache, remove menu items |
| `deleted` | Sau khi xóa vĩnh viễn | Xóa variations, attributes, gallery, categories, menu |

---

## Hooks Liên Quan đến Model

### Filter `products_model_retrieved`
Được gọi mỗi khi một Product được lấy từ database. Dùng để thêm data tùy chỉnh:
```php
add_filter('products_model_retrieved', function(Product $product) {
    // Thêm field tính toán
    $product->discount_percent = 0;
    if($product->price > 0 && $product->price_sale > 0) {
        $product->discount_percent = round(
            (($product->price - $product->price_sale) / $product->price) * 100
        );
    }
    return $product;
});
```

### Action `delete_product_success`
Được gọi sau khi xóa vĩnh viễn một sản phẩm:
```php
add_action('delete_product_success', function($productId) {
    // Dọn dẹp dữ liệu liên quan trong plugin của bạn
    DB::table('your_plugin_product_data')->where('product_id', $productId)->delete();
});
```

---

## Làm việc với Metadata

Sicommerce sử dụng bảng `products_metadata` để lưu thêm dữ liệu cho sản phẩm:

```php
// Lấy một meta value (single = true trả về giá trị trực tiếp)
$defaultVariationId = Product::getMeta($product->id, 'default', true);

// Lấy tất cả meta của sản phẩm
$allMeta = Product::getMeta($product->id, '', false);

// Lưu meta
Product::updateMeta($product->id, 'custom_field', 'value');
```

---

## Xử lý Biến Thể (Variations)

Khi sản phẩm có `hasVariation = 1`, các biến thể được lưu trong cùng bảng `products` với `type = 'variations'` và `parent_id = {product_id}`. Dùng Model `Variation` để truy vấn:

```php
use Ecommerce\Models\Variation;

// Lấy tất cả biến thể của sản phẩm
$variations = Variation::where('parent_id', $product->id)->get();

// Mỗi variation có đầy đủ price, price_sale, weight, code...
foreach ($variations as $variation) {
    echo $variation->price;
    echo $variation->code;
    echo $variation->attribute_label; // VD: "Đỏ - XL"
}
```

Xem thêm: [04-Other-Models.md](04-Other-Models.md) - phần Variation.

