# ProductCategory & Các Model Phụ Trợ

---

## ProductCategory (Danh mục sản phẩm)

**Class**: `\Ecommerce\Models\ProductCategory`  
**Alias**: `ProductCategory`  
**Table**: `products_categories`

### Cột chính

| Tên Cột | Kiểu | Mô tả |
|:---|:---|:---|
| `name` | string | Tên danh mục |
| `slug` | string | URL |
| `content` | wysiwyg | Nội dung mô tả |
| `excerpt` | wysiwyg | Mô tả ngắn |
| `seo_title` | string | SEO title |
| `seo_description` | string | SEO description |
| `image` | image | Ảnh danh mục |
| `status` | int | Trạng thái (0/1) |
| `parent_id` | int | ID cha (nested set) |
| `level` | int | Cấp độ trong cây |
| `lft` / `rgt` | int | Left/Right cho nested set |
| `public` | int | Hiển thị công khai |
| `order` | int | Thứ tự sắp xếp |

### Truy Vấn

```php
// Lấy tất cả danh mục theo dạng cây (nested tree)
$tree = ProductCategory::tree()->get();

// Lấy danh mục đa cấp (multilevel)
$tree = ProductCategory::multilevel()->get();

// Select options (dạng array cho dropdown)
$options = ProductCategory::options()->get();
// [['id' => 1, 'name' => '── Áo', 'level' => 0], ['id' => 2, 'name' => '  ── Áo nam', 'level' => 1], ...]

// Danh mục của một sản phẩm
$categories = ProductCategory::byProduct($productId)->get();

// Lấy tất cả ID con (bao gồm chính nó)
$ids = ProductCategory::children(['andParent' => true, 'id' => 5]);
// Trả về: [5, 8, 11, 22] (ID danh mục cha + tất cả con/cháu)

// Tìm theo slug
$category = ProductCategory::where('slug', 'ao-nam')->first();
```

### Scope Hữu Ích

```php
// Chỉ lấy danh mục cấp 1 (root)
ProductCategory::where('parent_id', 0)->get();

// Danh mục con trực tiếp
ProductCategory::where('parent_id', $parentId)->orderBy('order')->get();
```

---

## Brands (Thương hiệu)

**Class**: `\Ecommerce\Models\Brands`  
**Alias**: `Brands`  
**Table**: `brands`

### Cột chính

| Tên Cột | Kiểu | Mô tả |
|:---|:---|:---|
| `name` | string | Tên thương hiệu |
| `slug` | string | URL |
| `image` | image | Logo thương hiệu |
| `excerpt` | wysiwyg | Mô tả |
| `seo_title` | string | SEO title |
| `seo_description` | string | SEO description |
| `order` | int | Thứ tự sắp xếp |

### Truy Vấn

```php
// Tất cả thương hiệu
$brands = Brands::orderBy('order')->get();

// Tìm theo slug
$brand = Brands::where('slug', 'nike')->first();

// Sản phẩm của thương hiệu
$products = Product::where('brand_id', $brand->id)->get();
```

---

## Currencies (Tiền tệ)

**Class**: `\Ecommerce\Models\Currencies`  
**Alias**: `Currencies`  
**Table**: `currencies`

| Tên Cột | Kiểu | Mô tả |
|:---|:---|:---|
| `currency` | string | Mã tiền tệ (VD: `VND`, `USD`) |
| `symbol` | string | Ký hiệu (VD: `đ`, `$`) |
| `position` | string | Vị trí ký hiệu (`left`/`right`) |
| `rate` | float | Tỉ giá nhân (so với tiền tệ mặc định) |
| `rateFixed` | float | Tỉ giá cộng thêm cố định |
| `decimals` | int | Số chữ số thập phân |
| `isDefault` | int | Tiền tệ mặc định (1/0) |
| `order` | int | Thứ tự sắp xếp |

```php
// Lấy tiền tệ mặc định
$default = Currencies::where('isDefault', 1)->first();

// Lấy tiền tệ đang được user chọn (qua cookie)
$current = Prd::currency();
echo $current->symbol;   // 'đ'
echo $current->position; // 'right'

// Định dạng giá theo tiền tệ
echo Prd::price(150000); // '150.000đ'
echo Prd::price(150000, $current); // Truyền object currency tùy chỉnh
```

---

## Attributes & AttributesItem (Thuộc tính biến thể)

### Attributes

**Class**: `\Ecommerce\Models\Attributes`  
**Alias**: `Attributes`  
**Table**: `attribute`

| Tên Cột | Kiểu | Mô tả |
|:---|:---|:---|
| `title` | string | Tên thuộc tính (VD: Màu sắc, Kích thước) |
| `slug` | string | Slug |
| `option_type` | string | Loại hiển thị: `label`, `color`, `image` |

### AttributesItem

**Class**: `\Ecommerce\Models\AttributesItem`  
**Alias**: `AttributesItem`  
**Table**: `attribute_item`

| Tên Cột | Kiểu | Mô tả |
|:---|:---|:---|
| `title` | string | Giá trị (VD: Đỏ, XL, S) |
| `option_id` | int | ID của Attributes cha |
| `value` | string | Giá trị màu (hex) hoặc ảnh |
| `type` | string | Loại: `label`/`color`/`image` |
| `image` | image | Ảnh (nếu type = image) |

```php
// Tất cả nhóm thuộc tính
$attributes = Attributes::all();

// Thuộc tính của sản phẩm
$attrIds = DB::table('products_attribute')
    ->where('product_id', $productId)
    ->pluck('attribute_id');
$attributes = Attributes::whereIn('id', $attrIds)->get();

// Giá trị của thuộc tính
$items = AttributesItem::where('option_id', $attributeId)->get();

// Loại hiển thị tuỳ chỉnh
$displayType = PrdCartHelper::attributeDisplay($attributeId, 'color');
// 'circle' | 'rectangle-radius' | ''

// Lấy danh sách loại thuộc tính
$types = getAttributesType(); // ['label' => [...], 'color' => [...], 'image' => [...]]

// Thêm loại thuộc tính tùy chỉnh
add_filter('attribute_type', function($types) {
    $types['button'] = ['label' => 'Nút bấm (Button)'];
    return $types;
});
```

---

## Variation (Biến thể sản phẩm)

**Class**: `\Ecommerce\Models\Variation`  
**Alias**: `Variation`  
**Table**: `products` (dùng chung, filter `type = 'variations'`)

Model `Variation` dùng chung bảng với `Product` nhưng luôn filter `type = 'variations'`. Mỗi biến thể có `parent_id` trỏ đến sản phẩm cha.

```php
// Biến thể của sản phẩm cha
$variations = Variation::where('parent_id', $productId)
    ->orderBy('order')
    ->get();

foreach ($variations as $v) {
    echo $v->price;           // Giá riêng của biến thể
    echo $v->price_sale;      // Giá KM
    echo $v->code;            // Mã SKU biến thể
    echo $v->attribute_label; // Label tổng hợp: "Đỏ - XL"
    echo $v->weight;          // Cân nặng riêng
    echo $v->stock;           // Số lượng tồn kho (nếu có plugin stock)
}

// Lấy thuộc tính-giá trị của một biến thể
$attrItems = DB::table('products_attribute_item')
    ->where('variation_id', $variation->id)
    ->get();
```

---

## Collection (Bộ sưu tập)

**Class**: `\Ecommerce\Models\Collection`  
**Table**: `products_collections`

Bộ sưu tập là nhóm sản phẩm được quản trị viên tạo thủ công (khác với `status1/2/3` là flag tự động).

```php
// Tất cả bộ sưu tập
$collections = \Ecommerce\Models\Collection::all();

// Sản phẩm trong bộ sưu tập
$products = Product::whereIn('id', function($q) use ($collectionId) {
    $q->select('product_id')
      ->from('products_collections_relationships')
      ->where('collection_id', $collectionId);
})->get();
```

---

## Session (Phiên làm việc / Xem gần đây)

**Class**: `\Ecommerce\Models\Session`  
**Table**: `products_session` (lưu sản phẩm đã xem)

Được dùng nội bộ bởi `ProductsDetail::setViewedSession()`. Bạn thường không cần tương tác trực tiếp.

