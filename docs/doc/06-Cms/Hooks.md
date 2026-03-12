# Hook System

Hệ thống Hook của SkillDo CMS v8 được thiết kế theo mô hình **WordPress Hook** (Event-driven). Đây là cơ chế cốt lõi cho phép Plugin và Theme **mở rộng hoặc thay đổi hành vi** của CMS mà không cần sửa code gốc.

---

## 1. Hai Loại Hook

| Loại       | Khi nào dùng                                    | Trả về              |
|------------|-------------------------------------------------|---------------------|
| **Action** | Thực hiện một hành động tại thời điểm nhất định | Không (void)        |
| **Filter** | Biến đổi/lọc một giá trị trước khi dùng         | Giá trị đã được lọc |

> **Quy tắc đơn giản:**
> - Cần **làm gì đó** (gửi mail, thêm class, xóa cache...) → dùng **Action**
> - Cần **thay đổi dữ liệu** (sửa nội dung, thêm HTML, lọc mảng...) → dùng **Filter**

---

## 2. Action Hooks

### `add_action()` — Đăng Ký Callback Cho Action

```php
add_action(string $tag, callable $callback, int $priority = 10, int $accepted_args = 1): bool
```

| Tham số | Mô tả | Mặc định |
|---|---|---|
| `$tag` | Tên event/hook | bắt buộc |
| `$callback` | Hàm sẽ được gọi | bắt buộc |
| `$priority` | Thứ tự thực thi (càng nhỏ càng chạy trước) | `10` |
| `$accepted_args` | Số tham số mà callback nhận | `1` |

```php
// Dạng function đơn giản
add_action('init', function () {
    // Chạy khi CMS khởi tạo
});

// Dạng static method
add_action('init', [MyPlugin\Services\TaxonomyService::class, 'register']);

// Dạng instance method
$service = new MyService();
add_action('save_post', [$service, 'onPostSaved']);

// Với priority tùy chỉnh (chạy sau các hook priority 10)
add_action('init', function () {
    // Chạy sau các handler có priority 10
}, 20);

// Nhận nhiều tham số từ do_action
add_action('user_created', function ($userId, $userData) {
    // xử lý
}, 10, 2);  // accepted_args = 2
```

### `do_action()` — Phát Ra Action Event

Dùng trong **code core/plugin** để thông báo một sự kiện đã xảy ra:

```php
do_action(string $tag, mixed ...$args): void
```

```php
// Phát event đơn giản
do_action('my_plugin_loaded');

// Phát event kèm dữ liệu
do_action('order_completed', $orderId);

// Phát event với nhiều dữ liệu
do_action('user_created', $userId, $userData);
```

### `has_action()` & `did_action()` — Kiểm Tra Action

```php
// Kiểm tra xem có callback nào đăng ký cho hook chưa
if (has_action('my_plugin_loaded')) {
    // có ít nhất 1 callback đăng ký
}

// Kiểm tra action đã được chạy bao nhiêu lần
$count = did_action('init');
if ($count > 0) {
    // 'init' đã chạy rồi
}
```

### `remove_action()` — Hủy Đăng Ký Callback

```php
// Hủy một callback cụ thể (phải đúng priority ban đầu)
remove_action('init', [TaxonomyService::class, 'register'], 10);

// Hủy tất cả callbacks của một action
remove_all_actions('init');
```

---

## 3. Filter Hooks

### `add_filter()` — Đăng Ký Callback Lọc Giá Trị

```php
add_filter(string $tag, callable $callback, int $priority = 10, int $accepted_args = 1): true
```

```php
// Filter đơn giản — nhận giá trị, trả về giá trị đã sửa
add_filter('the_title', function ($title) {
    return strtoupper($title);
});

// Filter với nhiều tham số
add_filter('get_post_thumbnail', function ($imgHtml, $postId, $size) {
    // Thêm class vào ảnh
    return str_replace('<img', '<img class="post-thumb"', $imgHtml);
}, 10, 3);  // accepted_args = 3

// Filter trong Plugin
add_filter('products_list_query', function ($query) {
    $query->where('status', 'active');
    return $query;
});
```

### `apply_filters()` — Áp Dụng Filter Lên Giá Trị

Dùng trong **code core/plugin** để cho phép bên ngoài lọc một giá trị:

```php
apply_filters(string $tag, mixed $value, mixed ...$args): mixed
```

```php
// Cơ bản
$title = apply_filters('the_title', $post->title);

// Truyền thêm tham số để filter có thể dùng
$imgHtml = apply_filters('get_post_thumbnail', $imgHtml, $post->id, 'medium');

// Trong Model hoặc Service
$items = apply_filters('my_plugin_product_list', $products, $categoryId);
```

### `has_filter()` — Kiểm Tra Filter

```php
if (has_filter('the_title')) {
    // Có filter nào đó đang lọc the_title
}
```

### `remove_filter()` — Hủy Đăng Ký Filter

```php
remove_filter('the_title', 'my_custom_title_function', 10);
remove_all_filters('the_title');
```

---

## 4. Tạo Hook Riêng Trong Plugin

Nếu Plugin của bạn muốn **cho phép các Plugin/Theme khác mở rộng**, bạn cần tự tạo hook ở những điểm thích hợp:

```php
<?php
namespace MyPlugin\Services;

class ProductService
{
    public function getProducts(array $filters = []): array
    {
        // Cho phép các plugin khác sửa đổi $filters trước khi query
        $filters = apply_filters('my_plugin_product_filters', $filters);

        $products = Product::where($filters)->get();

        // Cho phép các plugin khác sửa đổi kết quả sau khi query
        $products = apply_filters('my_plugin_products_result', $products, $filters);

        return $products;
    }

    public function createProduct(array $data): int
    {
        // Action hook trước khi tạo
        do_action('my_plugin_before_create_product', $data);

        $id = Product::create($data);

        // Action hook sau khi tạo (truyền id luôn)
        do_action('my_plugin_after_create_product', $id, $data);

        return $id;
    }
}
```

**Plugin khác có thể hook vào:**

```php
// Thêm điều kiện lọc sản phẩm
add_filter('my_plugin_product_filters', function ($filters) {
    $filters['featured'] = 1;
    return $filters;
});

// Gửi notification sau khi tạo sản phẩm
add_action('my_plugin_after_create_product', function ($productId, $data) {
    // Gửi email notification
    \Mail::send('admin@site.com', 'Sản phẩm mới: ' . $data['title']);
}, 10, 2);
```

---

## 5. Priority — Thứ Tự Thực Hiện

- Priority mặc định là **10**
- Số **nhỏ hơn** → chạy **trước**
- Số **lớn hơn** → chạy **sau**
- Nhiều callback cùng priority → chạy theo thứ tự đăng ký

```php
add_action('init', function () {
    echo 'Chạy thứ 2';   // priority 10 (mặc định)
});

add_action('init', function () {
    echo 'Chạy đầu tiên'; // priority 1
}, 1);

add_action('init', function () {
    echo 'Chạy cuối';     // priority 99
}, 99);
```

---

## 6. Các Hook Quan Trọng CMS Cung Cấp Sẵn

### Action Hooks Hệ Thống

| Hook | Khi nào phát ra | Tham số |
|---|---|---|
| `cms_loaded` | CMS Loader đã load xong các thành phần cơ bản. | — |
| `plugins_loaded` | Tất cả Plugin đang active đã load xong `ServiceProvider`. | — |
| `init` | CMS Controller khởi tạo xong (lúc bắt đầu vòng đời request). | — |
| `admin_init` | Hệ thống khởi tạo riêng cho khu vực Admin backend. | — |
| `theme_init` / `client_init` | Hệ thống khởi tạo riêng cho Theme frontend. | — |
| `ready` | CMS Controller đã sẵn sàng thực thi logic trang hiện tại. | — |
| `user_register` | Khi một User mới đăng ký/tạo thành công. | `$userId` |
| `profile_update` | Khi thông tin User được cập nhật. | `$userId` |
| `deleted_user` | Khi User bị xóa khỏi hệ thống. | `$user` |
| `set_user_role` | Khi User được gán một role mới. | `$userId, $role, $userRole` |
| `update_{$name}_option` | Cập nhật một Option vào bảng system (`$name` là key option). | `$option, $name, $value` |
| `admin_{$module}_table_column_{$name}` | Dùng trong quản trị admin để in thêm HTML ra 1 cột trong bảng. | `$item` |

### Filter Hooks Hệ Thống

| Hook | Mô tả | Tham số |
|---|---|---|
| `the_content` | Lọc nội dung bài viết trước khi xuất ra view (VD: replace shortcode). | `$content` |
| `get_url` | Lọc URL (dùng cho đa ngôn ngữ hoặc rewrite rule). | `$slug` |
| `get_img` | Lọc HTML thẻ `<img>` của helper `SkillDo\Cms\Support\Image`. | `$html, $params` |
| `get_img_link` | Lọc URL ảnh của helper Image. | `$link, $params` |
| `cms_logo` | Lọc/đổi logo của CMS Admin. | `$logoPath` |
| `user_has_cap` / `role_has_cap`| Lọc/thay đổi kết quả check quyền capability. | `$capabilities, $cap, $role` |
| `post_detail_view` / `post_index_view`| Lọc/đổi template view render cho trang chi tiết/danh sách bài viết. | `$view, $object` |
| `admin_table_object_form_search`| Thêm/Sửa các input trên thanh filter/search của bảng Admin. | `$form` |

---

## 7. Hook Trong Plugin — Ví Dụ Khởi Động

```php
<?php
namespace MyPlugin\Providers;

use SkillDo\ServiceProvider;
use MyPlugin\Services\MyTaxonomyService;

class MyPluginServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Đăng ký Taxonomy ở hook 'init'
        add_action('init', [MyTaxonomyService::class, 'register']);

        // Ghi log sau khi CMS tải xong plugin
        add_action('plugins_loaded', function () {
            \Log::info('MyPlugin đã sẵn sàng chạy');
        });

        // Lọc nội dung bài viết để thêm text
        add_filter('the_content', function ($content) {
            $text = '<p class="my-plugin-copyright">Nội dung đã được đăng ký bản quyền</p>';
            return $content . $text;
        });

        // Đổi logo ở Admin backend
        add_filter('cms_logo', function ($logo) {
            return asset('my-plugin::images/my-custom-logo.png');
        });
    }
}
```
