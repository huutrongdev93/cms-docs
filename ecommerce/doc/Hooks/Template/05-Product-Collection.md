# 5. Template Hooks: Product Collection (Bộ Sưu Tập)

Trang **Bộ Sưu Tập** (`products_collection`) liệt kê các sản phẩm được Admin gán vào một Collection thủ công. Hooks được đăng ký trong `bootstrap/template-collection.php` và chỉ được kích hoạt khi CMS phát hiện đây là trang `products_collection`.

---

## Cách Hoạt Động

Collection hooks được đăng ký trong callback `Theme::config()->booted('products-collection', ...)`:
```php
Theme::config()->booted('products-collection', function() {
    if(Theme::isPage('products_collection')) {
        // Các hooks dưới đây được đăng ký
    }
});
```

---

## Danh Sách Hook

### Hooks SEO
| Hook | Class::Method | Mô tả |
|:---|:---|:---|
| `seo_title` (filter) | `ProductCollectionSeo::title` | Tiêu đề SEO của trang collection |
| `seo_description` (filter) | `ProductCollectionSeo::description` | Mô tả SEO |
| `seo_keyword` (filter) | `ProductCollectionSeo::keyword` | Từ khóa SEO |

### Hooks Nội Dung (`page_products_collections_view`)

| Hook Name | Priority | Class::Method | Mô tả | Tham số |
|:---|:---:|:---|:---|:---|
| `page_products_collections_view` | 10 | `ProductCollection::view` | Render lưới sản phẩm chính | — |
| `page_products_collections_view_before` | 20 | `ProductCollection::title` | Tiêu đề collection (nếu layout không có banner) | — |
| `page_products_collections_view_after` | 40 | `ProductCollection::pagination` | Thanh phân trang | `$collection, $objects, $pagination` |

---

## Ví Dụ Mở Rộng

### 💡 Thêm Bộ Lọc Giá Cho Trang Collection
```php
add_action('page_products_collections_view', function() {
    echo '<div class="price-filter">';
    echo '<label>Giá từ:</label>';
    echo '<input type="range" name="price_min" min="0" max="5000000" step="50000"/>';
    echo '</div>';
}, 5); // Trước khi render lưới (priority 10)
```

### 💡 Can Thiệp Query Sản Phẩm Trong Collection
```php
add_filter('product_collection_query', function($query, $collection) {
    // Ví dụ: chỉ lấy sản phẩm đang còn hàng (nếu có plugin stock)
    $query->where('in_stock', 1);
    return $query;
}, 10, 2);
```

### 💡 Thêm Tiêu Đề Tuỳ Chỉnh Trước Lưới Sản Phẩm
```php
// Chỉ hoạt động khi trang collections đang active
add_action('page_products_collections_view_before', function() {
    $collection = Cms::getData('collection');
    if(!empty($collection->excerpt)) {
        echo '<div class="collection-description">' . $collection->excerpt . '</div>';
    }
}, 25);
```

---

## Kiểm Tra Xem Có Đang Ở Trang Collection Không

```php
use SkillDo\Cms\Support\Theme;

if(Theme::isPage('products_collection')) {
    // Code chỉ chạy trên trang collection
}
```

> **Lưu ý**: Collection hooks được đăng ký **lazy** (chỉ khi vào đúng trang), không ảnh hưởng hiệu suất ở trang khác.

