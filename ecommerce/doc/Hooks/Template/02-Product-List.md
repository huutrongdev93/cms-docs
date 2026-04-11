# 2. Template Hooks: Product List (Trang Danh Sách Sản Phẩm)

Trang danh sách sản phẩm (danh mục, thương hiệu, tìm kiếm) sử dụng class `\Ecommerce\Template\ProductsIndex`. Hooks được đăng ký trong `bootstrap/template-index.php`.

---

## Sơ Đồ Hook

```
content_products_index (priority 10)
  └── ProductsIndex::index()
        └── page_products_index_view
              ├── 10 → sort()        Thanh sắp xếp/lọc
              ├── 20 → contentTop()  Vùng trên danh sách
              ├── 30 → category()    Tab danh mục con
              ├── 40 → products()    Lưới sản phẩm
              ├── 50 → pagination()  Phân trang
              └── 60 → contentBottom() Vùng dưới danh sách
```

---

## Danh Sách Hook Render (`page_products_index_view`)

| Hook Name | Priority | Class::Method | Mô Tả | Tham Số |
|:---|:---:|:---|:---|:---|
| `page_products_index_view` | 10 | `ProductsIndex::sort` | Thanh Sort (giá tăng/giảm, mới nhất...) | View Data |
| `page_products_index_view` | 20 | `ProductsIndex::contentTop` | Vùng tuỳ chỉnh trên danh sách (Banner, Breadcrumb) | View Data |
| `page_products_index_view` | 30 | `ProductsIndex::category` | Tab danh mục con | View Data |
| `page_products_index_view` | 40 | `ProductsIndex::products` | Lưới sản phẩm chính | View Data |
| `page_products_index_view` | 50 | `ProductsIndex::pagination` | Thanh phân trang | View Data |
| `page_products_index_view` | 60 | `ProductsIndex::contentBottom` | Vùng dưới (text SEO, ghi chú) | View Data |

---

## Ví Dụ Thực Tế

### 💡 Thêm Banner Khuyến Mãi giữa Sort và contentTop
```php
add_action('page_products_index_view', function() {
    $category = Cms::getData('category');
    if(!empty($category->image)) {
        echo '<div class="promo-banner">';
        echo '<img src="'.asset($category->image).'" alt="'.$category->name.'"/>';
        echo '</div>';
    }
}, 15); // >10 (sort) và <20 (contentTop)
```

### 💡 Thêm Bộ Lọc Theo Giá
```php
add_action('page_products_index_view', function() {
    echo '<div class="price-range-filter">';
    echo '<input type="range" name="price_min" min="0" max="10000000"/>';
    echo '</div>';
}, 11); // Ngay sau sort (10)
```

### 💡 Ẩn Thanh Danh Mục Con
```php
remove_action('page_products_index_view', [\Ecommerce\Template\ProductsIndex::class, 'category'], 30);
```

---

## Hooks Controller (Sửa Query Sản Phẩm)

Các hooks này chạy trong `productControllerIndex()` trước khi render.

| Hook Name | Tham Số | Mô Tả |
|:---|:---|:---|
| `controllers_product_index_args` | `$query` | Sửa query builder ban đầu |
| `controllers_product_index_count` | `$count` | Override tổng số kết quả |
| `controllers_product_index_paging` | `$pagination` | Sửa object pagination |
| `controllers_product_index_query` | `$query, $request` | Sửa query cuối cùng (sau sort) |
| `controllers_product_index_objects` | `$objects` | Sửa/filter kết quả sản phẩm |

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

| Hook Name | Class::Method | Mô Tả |
|:---|:---|:---|
| `theme_breadcrumb_products_index_data` | `Breadcrumb::productsIndex` | Breadcrumb trang danh sách |
| `template_layout_products_category` | `Layout::getCategoryLayout` | Layout của trang danh mục |
| `template_view_products_category` | `Layout::getCategoryView` | View của trang danh mục |

