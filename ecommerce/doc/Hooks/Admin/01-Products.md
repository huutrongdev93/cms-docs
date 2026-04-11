# 1. Admin Hooks: Dữ Liệu Sản Phẩm (Products)

Sicommerce khai báo nhiều Hook liên quan đến CRUD sản phẩm trong Giao diện CMS Quản Trị. Các hooks được đăng ký trong `bootstrap/products.php`.

---

## 1.1 Hooks Form Thêm/Sửa Sản Phẩm

### Filter `manage_products_input` – Thêm Field

```php
add_filter('manage_products_input', function($fields) {
    // $fields là mảng các nhóm field (left, right, bottom...)
    
    // Thêm field vào cột trái
    $fields['left']['lo_hang_code'] = [
        'field' => 'lo_hang_code',
        'label' => 'Mã Lô Hàng',
        'type'  => 'text',
    ];
    
    return $fields;
});
```

> **Lưu ý**: Dùng cùng tên filter `manage_products_input` nhưng với `$buttons` (tham số thứ 2 của callback) để thêm nút action tùy chỉnh.

### Action `admin_products_controller_save_init` – Đăng Ký Metabox

Được gọi trong quá trình init của ProductController. Dùng để đăng ký các Metabox tùy chỉnh:

```php
add_action('admin_products_controller_save_init', function() {
    // Đăng ký Metabox tab Thông tin bổ sung
});
```

---

## 1.2 Hooks Lưu Dữ Liệu Sản Phẩm

| Hook Type | Hook Name | Priority | Tham Số | Mô Tả |
|:---:|:---|:---:|:---|:---|
| **Filter** | `check_save_products_before` | 10 | `($error, $data, $id)` | Validate trước khi INSERT/UPDATE. Return `$error` (SkdError hoặc null) |
| **Filter** | `save_products_object_add` | 10 | `($id, $pType, $args)` | Sau khi INSERT sản phẩm mới |
| **Filter** | `save_products_object_edit` | 10 | `($id, $pType, $args)` | Sau khi UPDATE sản phẩm |
| **Filter** | `save_products_object` | 10 | `($id, $pType, $args)` | Sau cả Add và Update |

```php
// Validate tùy chỉnh trước khi lưu
add_filter('check_save_products_before', function($error, $data, $id) {
    if(empty($data['custom_barcode'])) {
        return skd_error('Vui lòng nhập mã barcode!');
    }
    return $error;
}, 10, 3);

// Lưu metadata sau khi thêm sản phẩm
add_filter('save_products_object_add', function($id, $pType, $args) {
    $barcode = request()->input('custom_barcode');
    if(!empty($barcode)) {
        Product::updateMeta($id, 'barcode', $barcode);
    }
    return $id;
}, 10, 3);

// Chạy cho cả Add và Edit
add_filter('save_products_object', function($id, $pType, $args) {
    // Sync sản phẩm lên Shopee...
    return $id;
}, 20, 3);
```

> **Tham số `$pType`**: Loại sản phẩm (`'product'` hoặc `'variations'`).  
> **Tham số `$args`**: Mảng data đầy đủ của request.

---

## 1.3 Hooks Giao Diện Danh Sách (Table View)

| Hook Type | Hook Name | Mô Tả |
|:---:|:---|:---|
| **Filter** | `manage_products_input` | Thêm/sửa field trong form Add/Edit |
| **Action** | `admin_after_products_table_view` | Thêm Popup/Modal ẩn trong trang Danh sách SP |
| **Action** | `admin_page_after_products_save` | Thêm Popup/Modal trong trang Add/Edit SP (VD: Variations Modal) |

```php
// Thêm modal "Cập nhật giá hàng loạt" vào trang danh sách
add_action('admin_after_products_table_view', function() {
    echo '<div id="modal-bulk-price" class="modal">';
    echo '<!-- Form cập nhật giá -->';
    echo '</div>';
});
```

---

## 1.4 Hooks Ajax Trash/Restore/Delete

| Hook Type | Hook Name | Priority | Tham Số | Mô Tả |
|:---:|:---|:---:|:---|:---|
| **Action** | `ajax_trash_products_success` | 2 | `($response, $idList)` | Sau khi chuyển SP vào Thùng Rác |
| **Action** | `ajax_restore_products_success` | 2 | `($response, $idList)` | Sau khi phục hồi SP từ Thùng Rác |
| **Action** | `ajax_delete_products_after_success` | 2 | `($response, $idList)` | Sau khi xóa vĩnh viễn SP |

```php
// Ghi log khi xóa sản phẩm
add_action('ajax_trash_products_success', function($response, $idList) {
    foreach ($idList as $id) {
        \Log::info('Product trashed', ['id' => $id]);
    }
}, 5, 2);

// Xóa dữ liệu plugin liên quan khi SP bị xóa vĩnh viễn
add_action('ajax_delete_products_after_success', function($response, $idList) {
    DB::table('your_plugin_stock')->whereIn('product_id', $idList)->delete();
}, 10, 2);
```

---

## 1.5 Hook Xóa Sản Phẩm (Model Event)

```php
// Chạy sau khi xóa vĩnh viễn 1 sản phẩm (từ Model event)
add_action('delete_product_success', function($productId) {
    DB::table('your_plugin_data')->where('product_id', $productId)->delete();
});
```

---

## 1.6 Hooks Collection (Gắn Flag Bán Chạy / Hot / Yêu Thích)

Khi Admin click icon flag (yêu thích/bán chạy/hot) trong bảng danh sách:

| Hook Name | Tham Số | Mô Tả |
|:---|:---|:---|
| `ajax_save_products_collection_success` | `($productId, $column, $value)` | Sau khi toggle flag collection thành công |

```php
add_action('ajax_save_products_collection_success', function($productId, $column, $value) {
    // $column: 'status1', 'status2', 'status3'
    // $value: 0 hoặc 1
    if($column == 'status2' && $value == 1) {
        // Sản phẩm vừa được đánh dấu "Bán chạy"
        // Sync lên Elasticsearch index...
    }
}, 10, 3);
```
