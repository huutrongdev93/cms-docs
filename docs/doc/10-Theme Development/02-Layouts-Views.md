# Template, Layouts và Views

Trong SkillDo CMS v8, giao diện được xây dựng bằng Blade Templating language. **Tuy nhiên, bạn TUYỆT ĐỐI KHÔNG SỬ DỤNG** các cú pháp mặc định của Laravel như `@yield`, `@section`, hay `@extends`.

Hệ thống cung cấp một kiến trúc linh hoạt hơn thông qua các class `Theme`, kết hợp với `ThemeLayoutView` để hỗ trợ tối đa việc tái sử dụng, kế thừa thư mục cho khái niệm **Theme Child**. 

Cấu trúc giao diện sẽ chia thành 2 khái niệm là **Layouts** (Sườn bên ngoài) và **Views** (Ruột chức năng bên trong được nạp vào sườn).

---

## 1. Hệ Thống Layouts (Khung Sườn Bên Ngoài)

Tất cả Layout bắt buộc nằm trong thư mục: `views/<theme>/layouts/` (số nhiều).
`Template::setLayout()` tự ghép tiền tố `layouts/` vào tên layout, nên khi khai báo bạn chỉ ghi tên file, không kèm thư mục.

### Danh Sách Layout Mặc Định (theme-store)

| File | Mô tả |
|---|---|
| `template-home.blade.php` | Khung layout trang chủ |
| `template-home-3.blade.php` | Khung trang chủ biến thể 3 (có sidebar phải) |
| `template-full-width.blade.php` | Khung tràn viền (không sidebar) |
| `template-full-width-banner.blade.php` | Tràn viền + banner |
| `template-sidebar.blade.php` | Khung có sidebar (hai bên) |
| `template-sidebar-left.blade.php` | Sidebar trái |
| `template-sidebar-right.blade.php` | Sidebar phải |
| `template-sidebar-banner-content.blade.php` | Sidebar hai bên + banner trong khối nội dung |
| `template-sidebar-banner-full.blade.php` | Sidebar hai bên + banner tràn viền |
| `template-sidebar-left-banner-content.blade.php` | Sidebar trái + banner trong khối nội dung |
| `template-sidebar-left-banner-full.blade.php` | Sidebar trái + banner tràn viền |
| `template-sidebar-right-banner-content.blade.php` | Sidebar phải + banner trong khối nội dung |
| `template-sidebar-right-banner-full.blade.php` | Sidebar phải + banner tràn viền |
| `template-user.blade.php` | Khu vực trang tài khoản (Dashboard thành viên) |
| `template-empty.blade.php` | Layout rỗng — cũng là layout **mặc định dự phòng** |

### Cách Khởi Tạo Một Layout Tuỳ Chỉnh

Tạo một file Layout bất kì trong `layouts/` (VD: `template-demo.blade.php`) và nhúng các khối Header/Footer bằng `Theme::resources()`. Nội dung của View sẽ đổ vào Layout qua `{!! Theme::content() !!}`.

```blade
{{--
Layout-name: Template Tùy Chỉnh
--}}
<!DOCTYPE html>
<html lang="{{ Language::current() }}" @do_action('in_tag_html')>
    {!! Theme::resources('common/head') !!}
    <body @do_action('in_tag_body')>
        {{-- views/<theme>/resources/layout/header.blade.php --}}
        {!! Theme::resources('layout/header') !!}

        <div class="container my-layout">
            {{-- KHU VỰC TỰ ĐỘNG ĐỔ VIEW VÀO LAYOUT --}}
            {!! Theme::content() !!}
        </div>

        @do_action('template_wrapper_after')
        {!! Theme::resources('layout/footer') !!}
    </body>
</html>
```

> [!IMPORTANT]
> Comment `{{-- Layout-name: ... --}}` ở đầu file **chỉ là chú thích cho lập trình viên** — không có bộ phân tích nào đọc nó. Danh sách layout hiển thị cho quản trị viên được khai **cứng trong mảng PHP** `ThemeLayout::layouts()` tại `views/theme-store/app/Supports/ThemeLayout.php`. Muốn layout mới xuất hiện trong màn hình chọn giao diện, phải thêm một mục vào mảng đó:
>
> ```php
> 'layout-demo' => [
>     'label'    => 'Demo',
>     'image'    => 'layout/layout-demo.png',
>     'template' => 'template-demo',   // tên file trong layouts/
>     'type'     => 'page',            // home | page | ...
>     'banner'   => false,
> ],
> ```

---

## 2. Hệ Thống Views (Giao Diện Nội Dung Chi Tiết)

Views là phần giao diện lõi sẽ được nạp động vào thẻ `{!! Theme::content() !!}` của Layout. Các file Views chính nằm thẳng ở thư mục gốc của Theme: `views/<theme>/`.

### Danh Sách Views Mặc Định (theme-store)

| File | Chức Năng |
|---|---|
| `home-index.blade.php` | Trang chủ |
| `page-detail.blade.php` | Chi tiết trang tĩnh (Page) |
| `page-lien-he.blade.php` | View riêng cho trang có slug `lien-he` (ví dụ override theo slug) |
| `post-index.blade.php` | Danh sách bài viết (chuyên mục / blog) |
| `post-detail.blade.php` | Chi tiết một bài viết |
| `search-index.blade.php` | Trang kết quả tìm kiếm |
| `user-login.blade.php` | Form đăng nhập |
| `user-register.blade.php` | Form đăng ký |
| `user-forgot.blade.php` | Form quên mật khẩu |
| `user-reset.blade.php` | Form đặt lại mật khẩu |
| `user-password.blade.php` | Form đổi mật khẩu |
| `user-profile.blade.php` | Trang hồ sơ thành viên |
| `user-index.blade.php` | Trang tổng quan tài khoản |
| `user-dispatch.blade.php` | View điều hướng khu vực tài khoản |
| `404-error.blade.php` | Trang lỗi 404 |
| `empty.blade.php` | View rỗng |

> [!NOTE]
> Không có cơ chế `{{-- View-name: ... --}}` — comment này **không tồn tại** trong hệ thống. View được chọn tự động theo quy tắc fallback ở mục 3 bên dưới, hoặc gán cứng qua cột `theme_view` của từng bài viết/trang.

---

## 3. Kiến Trúc Kế Thừa Giao Diện Của `ThemeLayoutView`

Một trong những công cụ Controller mạnh nhất của V8 Web là sự hỗ trợ từ class `SkillDo\Cms\Support\ThemeLayoutView`. Nó điều khiển cách hệ thống nhận diện việc phải nạp file View và Layout nào tùy theo Đường link hoặc Dữ liệu Bài viết.

Ví dụ ở Controller front-end xử lý trang chi tiết bài viết (`App\Controllers\Web\PostController`):

```php
$template = new ThemeLayoutView('post_detail', $object);

return Cms::view(
    apply_filters('theme_post_detail_view', $template->view(), $object),
    apply_filters('theme_post_detail_layout', $template->layout(), $object)
);
```

**Tham số `$page`** phải là một trong các key mà class xử lý — không phải `'post'`:

| `$page` | Dùng cho |
|---|---|
| `post_detail` | Trang chi tiết bài viết |
| `post_index` | Trang danh sách bài viết / danh mục / thẻ |
| `page_detail` | Trang tĩnh (Page) |
| *key tuỳ ý* | Plugin tự đặt (vd `room_type_detail`); rơi vào nhánh `default` và dùng filter `template_layout_{page}` / `template_view_{page}` |

### Cách Quét View Cho 1 Bài Viết

Thứ tự ưu tiên (`viewPost()`):

1. Cột `theme_view` của chính bản ghi (nếu quản trị viên gán cứng view cho bài đó)
2. `post-{slug}.blade.php`
3. `post-{post_type}.blade.php` *(vd tạo `post-product.blade.php` là thành view riêng cho sản phẩm)*
4. Mặc định `post-detail.blade.php` (trang danh sách là `post-index.blade.php`)

Mỗi bước đều kiểm tra **theme con trước, theme cha sau**. Kết quả cuối chạy qua filter `post_detail_view`.

**Ví dụ:** bạn có post type `product`. Tạo file `views/theme-child/post-product.blade.php` là trang chi tiết sản phẩm dùng ngay view đó.

### Cách Quét Layout Cho 1 Bài Viết

Thứ tự ưu tiên (`layoutPost()`):

1. Cột `theme_layout` của chính bản ghi
2. Nếu bài viết có bố cục Page Builder (`builderKey`) → luôn dùng `template-empty`
3. `layout/template-post-{slug}`
4. `layout/template-post-{post_type}`
5. Cấu hình của quản trị viên: `Theme::config()->get('layouts', 'post.detail')`
6. Mặc định `template-empty`

> [!WARNING]
> **Bước 3 và 4 hiện không hoạt động.** `ThemeLayoutView` kiểm tra sự tồn tại của file theo đường dẫn `layout/template-post-…` (thư mục **số ít**), trong khi layout thật lại được render từ thư mục `layouts/` (`Template::setLayout()` ghép tiền tố `layouts/`). Không theme nào có thư mục `layout/`, nên hai bước override theo slug / post type luôn bị bỏ qua.
>
> Cho tới khi lõi sửa lại, hãy chọn layout riêng bằng **cột `theme_layout`** của bài viết, hoặc bằng cấu hình layout trong phần Giao diện của Admin.

---

## 4. Các Hàm Render Partials & Include (Bắt Buộc Dùng Cho Theme Child)

Để cắt component code của 1 View ra nhiều file cho sạch, **bạn không sử dụng `@include`**. Bạn gọi qua các dịch vụ của Theme vì chúng có khả năng hiểu được khi nào đang ở `Theme Mẹ`, khi nào đang được tùy chỉnh đè tại thư mục `Theme Child`.

#### 1. `Theme::partial(string $path, array $data = []): string`
Hàm nền tảng — **trả về** chuỗi HTML. Đường dẫn tính từ gốc theme; view được phân giải qua namespace `theme::` nên tự ưu tiên **theme con**, không có thì lấy **theme cha**.

Nếu không truyền `$data`, hàm tự lấy toàn bộ dữ liệu view đang có (`app('data')`).

```blade
{!! Theme::partial('resources/layout/footer') !!}
{!! Theme::partial('resources/post/item', ['post' => $post]) !!}
```

> Đường dẫn đã mang namespace riêng (element của plugin, vd `travel::elements/tour-box/views/view`) thì được giữ nguyên, không bị ghép thêm `theme::`.

#### 2. `Theme::view(string $path, array $data = []): void`
Giống `partial()` nhưng **echo thẳng** ra output thay vì trả về chuỗi (`return void`).

```php
Theme::view('resources/layout/header', ['title' => 'Trang chủ']);
```

#### 3. `Theme::resources(string $file, array $data = []): string`
Đường tắt của `partial('resources/' . $file)`. Đây là hàm **các layout của theme-store đang dùng**.

```blade
{!! Theme::resources('common/head') !!}
{!! Theme::resources('layout/header') !!}
{!! Theme::resources('layout/sidebar-right') !!}
```

#### 4. `Theme::include(string $file, array $data = []): string`
Đường tắt của `partial('include/' . $file)`.

> [!NOTE]
> theme-store **không có thư mục `include/`** — nó dùng `resources/`. Hàm này chỉ dùng được nếu theme của bạn tự tạo thư mục `include/`. Với theme mặc định, hãy dùng `Theme::resources()`.

#### 5. `theme_include(string $path = '', array $data = []): mixed`
Helper của theme (khai trong `views/theme-store/app/helpers/helper.php`) — `include` trực tiếp một file **PHP thuần** (chạy logic, trả về mảng config), ưu tiên theme con rồi mới đến theme cha. Trả về `null` nếu file không tồn tại.

```php
$config = theme_include('app/Options/header.php');
```

> Đường dẫn tính từ gốc theme. Muốn lấy đường dẫn tuyệt đối đã phân giải theo theme con/cha thì dùng `theme_include_path($path)`.
