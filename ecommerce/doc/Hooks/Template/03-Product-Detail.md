# 3. Template Hooks: Product Detail (Chi Tiết Sản Phẩm)

Trang chi tiết sản phẩm được render thông qua class `\Ecommerce\Template\ProductsDetail`. Kiến trúc hook được chia làm hai khu vực chính: **layout (view)** và **controller (data)**, đăng ký trong `bootstrap/template-detail.php`.

---

## Sơ đồ Hook Tổng Quan

```
content_products_detail (priority 10)
  └── ProductsDetail::layout()  →  render view product_detail.blade.php
        ├── product_detail_slider     (hooks ảnh + share)
        ├── product_detail_info       (hooks tiêu đề, giá, biến thể, nút mua)
        ├── product_detail_tabs       (hooks tab mô tả, thông số, review)
        └── product_detail_support    (hooks sidebar hỗ trợ)

controllers_products_detail           (hooks xử lý data phần dưới trang)
  ├── sellingPosition   (sản phẩm bán chạy)
  ├── relatedPosition   (sản phẩm liên quan)
  ├── setViewedSession  (ghi nhớ đã xem)
  └── viewedPosition    (sản phẩm đã xem)
```

---

## 1. Hook Layout Chính

| Hook Name                 | Priority | Mô tả                                                  |
|:--------------------------|:--------:|:-------------------------------------------------------|
| `content_products_detail` |    10    | Load toàn bộ layout trang. Truyền `$object` (Product). |

```php
// Override toàn bộ layout trang chi tiết
add_action('content_products_detail', function() {
    // render custom layout của bạn
}, 5); // priority < 10 để thay thế hoặc > 10 để thêm sau
```

---

## 2. Hooks Cột Slider Ảnh (`product_detail_slider`)

| Hook Name | Priority Mặc Định | Mô tả | Tham số |
|:---|:---:|:---|:---|
| `product_detail_slider` | 10 | Slide ảnh / gallery sản phẩm | `$object` (Product) |
| `product_detail_slider` | 30 | Nút share mạng xã hội (Facebook, Zalo...) | `$object` (Product) |

```php
// Thêm badge "Yêu thích" vào vùng slider
add_action('product_detail_slider', function($product) {
    echo '<button class="btn-wishlist" data-id="'.$product->id.'">❤</button>';
}, 25);
```

---

## 3. Hooks Cột Thông Tin (`product_detail_info`)

Đây là hook trung tâm chứa tất cả các thành phần thông tin bên phải (hoặc bên dưới ảnh tuỳ layout).

| Hook Name | Priority Mặc Định | Class::Method | Mô tả | Tham số |
|:---|:---:|:---|:---|:---|
| `product_detail_info` | 3 | `ProductsDetail::brand` | Thương hiệu (Brand) | `$object` |
| `product_detail_info` | 5 | `ProductsDetail::title` | Tên sản phẩm `<h1>` | `$object` |
| `product_detail_info` | 8 | `ProductsDetail::code` | Mã SKU sản phẩm | `$object` |
| `product_detail_info` | 10 | `ProductsDetail::price` | Giá bán + giá gạch | `$object` |
| `product_detail_info` | 45 | `ProductsDetail::variations` | Chọn biến thể (Color/Size) | `$object` |
| `product_detail_info` | 50 | `ProductsDetail::cartButtons` | Nút Thêm Giỏ / Mua Ngay + Qty | `$object` |
| `product_detail_info` | 60 | `ProductsDetail::description` | Mô tả ngắn (excerpt) | `$object` |

> **Lưu ý**: Các method trên nhận `$object` là đối tượng Product đã được gắn thêm data (variations, attributes...).

### 💡 Ví dụ: Chèn cam kết chất lượng bên dưới nút Mua
```php
add_action('product_detail_info', function($product) {
    echo '<div class="quality-badge mt-3 p-2 border rounded">';
    echo '🛡️ Cam kết đổi trả 30 ngày – Miễn phí vận chuyển đơn trên 500k';
    echo '</div>';
}, 55); // sau cartButtons (50), trước description (60)
```

### 💡 Ví dụ: Ẩn mã SKU
```php
remove_action('product_detail_info', [\Ecommerce\Template\ProductsDetail::class, 'code'], 8);
```

---

## 4. Hooks Khu Vực Tab Nội Dung (`product_detail_tabs`)

| Hook Name | Priority Mặc Định | Mô tả | Tham số |
|:---|:---:|:---|:---|
| `product_detail_tabs` | 10 | Render toàn bộ Tab (Mô tả, Thông số, Đánh giá) | `$object` |

Để thêm một tab tùy chỉnh, hãy dùng filter `product_detail_tabs_data`:
```php
add_filter('product_detail_tabs_data', function($tabs, $product) {
    $tabs['chinh-sach'] = [
        'label'   => 'Chính sách',
        'content' => '<p>Chính sách đổi trả của chúng tôi...</p>',
    ];
    return $tabs;
}, 10, 2);
```

---

## 5. Hooks Sidebar (`product_detail_sidebar` / `product_detail_support`)

| Hook Name | Priority Mặc Định | Mô tả |
|:---|:---:|:---|
| `product_detail_support` | 1 | Render sidebar hỗ trợ phía trên (floating box) |
| `product_detail_sidebar` | 1 | Render sidebar chính bên phải (nếu layout hỗ trợ) |
| `product_detail_sidebar` | 10 | `ProductsDetail::postSidebar` – Render widget của sidebar |

---

## 6. Hooks Controller – Sections Dưới Trang (`controllers_products_detail`)

Được gọi từ Controller trước khi render view, dùng để set data cho khu vực phía dưới trang:

| Hook Name | Priority | Method | Mô tả |
|:---|:---:|:---|:---|
| `controllers_products_detail` | 10 | `sellingPosition` | Vị trí hiển thị "Sản phẩm bán chạy" |
| `controllers_products_detail` | 10 | `relatedPosition` | Vị trí hiển thị "Sản phẩm liên quan" |
| `controllers_products_detail` | 10 | `setViewedSession` | Lưu sản phẩm vào session "đã xem" |
| `controllers_products_detail` | 10 | `viewedPosition` | Vị trí hiển thị "Sản phẩm đã xem" |

### 💡 Ví dụ: Thêm block "Sản phẩm cùng thương hiệu" phía dưới trang
```php
add_action('controllers_products_detail', function() use ($object) {
    if(!empty($object->brand_id)) {
        $sameBrand = Product::where('brand_id', $object->brand_id)
            ->where('id', '<>', $object->id)
            ->limit(8)->get();
        Cms::setData('sameBrandProducts', $sameBrand);
    }
}, 20);
```
