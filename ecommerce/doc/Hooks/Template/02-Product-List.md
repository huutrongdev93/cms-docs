# 2. Template Hooks: Product List (Trang Danh Sách Sản Phẩm)

Trang danh sách sản phẩm (danh mục, thương hiệu, tìm kiếm) sử dụng class `\Ecommerce\Template\ProductsIndex`. Hooks được đăng ký trong `bootstrap/template-index.php`.

---

## Sơ Đồ Hook

```
content_products_index (priority 10)
  └── ProductsIndex::index()
        └── page_products_index_view
              ├── 10 → sort()        Thanh sắp xếp/lọc
              ├── 40 → products()    Lưới sản phẩm
              └── 50 → pagination()  Phân trang
```

---

## Danh Sách Hook Render (`page_products_index_view`)

Class `\Ecommerce\Template\ProductsIndex` chỉ có **bốn** method: `index`, `sort`, `products`, `pagination`. Ba trong số đó được gắn vào `page_products_index_view`:

| Hook Name | Priority | Handler mặc định | Mô Tả |
|:---|:---:|:---|:---|
| `page_products_index_view` | 10 | `ProductsIndex::sort` | Thanh Sort (giá tăng/giảm, mới nhất...) |
| `page_products_index_view` | 40 | `ProductsIndex::products` | Lưới sản phẩm chính |
| `page_products_index_view` | 50 | `ProductsIndex::pagination` | Thanh phân trang |

> [!NOTE]
> Các khoảng priority **20, 30, 60 đang trống** — không có handler mặc định nào. Đây là chỗ dành sẵn cho plugin/theme chèn nội dung (banner, tab danh mục con, text SEO cuối trang). Không tồn tại method `contentTop()`, `category()` hay `contentBottom()` trên `ProductsIndex`.

---

## Ví Dụ Thực Tế

### 💡 Thêm Banner Khuyến Mãi ngay dưới thanh Sort
```php
add_action('page_products_index_view', function() {
    $category = Cms::getData('category');
    if(!empty($category->image)) {
        echo '<div class="promo-banner">';
        echo Image::large($category->image, $category->name)->html();
        echo '</div>';
    }
}, 20); // sau sort (10), trước lưới sản phẩm (40)
```

### 💡 Thêm Bộ Lọc Theo Giá
```php
add_action('page_products_index_view', function() {
    echo '<div class="price-range-filter">';
    echo '<input type="range" name="price_min" min="0" max="10000000"/>';
    echo '</div>';
}, 11); // Ngay sau sort (10)
```

### 💡 Ẩn Thanh Sort Mặc Định
```php
remove_action('page_products_index_view', [\Ecommerce\Template\ProductsIndex::class, 'sort'], 10);
```

> Khi gỡ handler bằng `remove_action`, **priority truyền vào phải trùng** với priority lúc đăng ký, nếu không sẽ không gỡ được.

---

## Hooks Controller (Sửa Query Sản Phẩm)

Các filter này chạy trong helper dựng danh sách sản phẩm (`plugins/sicommerce/app/helpers/helpers.php`) trước khi render.

| Hook Name | Tham Số | Mô Tả |
|:---|:---|:---|
| `controllers_product_index_args` | `$query` | Sửa query builder ban đầu |
| `controllers_product_index_count` | `$count` | Override tổng số kết quả dùng để phân trang |
| `controllers_product_index_paging` | `$pagination` | Sửa object pagination |
| `controllers_product_index_query` | `$query, $request` | Sửa query cuối cùng (sau khi áp sort/limit) |
| `controllers_product_index_objects` | `$objects` | Sửa/lọc kết quả sản phẩm |
| `controllers_product_index_data` | `$data, $id` | Sửa mảng dữ liệu dựng khối danh sách sản phẩm |

> `controllers_product_index_objects` được dùng lại ở nhiều nơi: trang danh sách, **trang bộ sưu tập** (`ProductController::collection`) và **trang tìm kiếm** (`ProductSearch`). Hook vào đây là ảnh hưởng cả ba.

```php
// Chỉ lấy sản phẩm đang còn hàng
add_filter('controllers_product_index_args', function($query) {
    $query->where('in_stock', 1);
    return $query;
});

// Loại bỏ sản phẩm hết hạn khỏi kết quả
add_filter('controllers_product_index_objects', function($products) {
    return $products->filter(function($product) {
        $expiry = Product::getMeta($product->id, 'expiry_date', true);
        return empty($expiry) || strtotime($expiry) > time();
    });
});
```

---

## Hooks Template Breadcrumb & Layout

| Hook Name | Handler mặc định | Priority | Mô Tả |
|:---|:---|:---:|:---|
| `theme_breadcrumb_products_index_data` | `Breadcrumb::productsIndex` | 20 | Breadcrumb trang danh sách |
| `theme_breadcrumb_products_detail_data` | `Breadcrumb::productsDetail` | 20 | Breadcrumb trang chi tiết |
| `template_layout_products_index` | `Layout::getCategoryLayout` | 10 | Layout trang danh sách sản phẩm |
| `template_view_products_index` | `Layout::getCategoryView` | 10 | View trang danh sách sản phẩm |
| `template_layout_products_all` | `Layout::getCategoryLayout` | 10 | Layout trang tất cả sản phẩm |
| `template_view_products_all` | `Layout::getCategoryView` | 10 | View trang tất cả sản phẩm |
| `template_layout_products_detail` | `Layout::getProductLayout` | 10 | Layout trang chi tiết |
| `template_view_products_detail` | `Layout::getProductView` | 10 | View trang chi tiết |
| `template_layout_products_collection` | `Layout::getCollectionLayout` | 10 | Layout trang bộ sưu tập |
| `template_view_products_collection` | `Layout::getCollectionView` | 10 | View trang bộ sưu tập |

> Không có hook `template_layout_products_category` / `template_view_products_category` — tên đúng là `..._products_index` (hoặc `..._products_all`).

