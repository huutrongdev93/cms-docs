# Quản Lý Template, Layouts và Views

Trong SkillDo CMS v8, giao diện được xây dựng bằng Blade Templating language. **Tuy nhiên, bạn TUYỆT ĐỐI KHÔNG SỬ DỤNG** các cú pháp mặc định của Laravel như `@yield`, `@section`, hay `@extends`.

Hệ thống cung cấp một kiến trúc linh hoạt hơn thông qua các class `Theme`, kết hợp với `ThemeLayoutView` để hỗ trợ tối đa việc tái sử dụng, kế thừa thư mục cho khái niệm **Theme Child**. 

Cấu trúc giao diện sẽ chia thành 2 khái niệm là **Layouts** (Sườn bên ngoài) và **Views** (Ruột chức năng bên trong được nạp vào sườn).

---

## 1. Hệ Thống Layouts (Khung Sườn Bên Ngoài)

Tất cả Layout bắt buộc nằm trong thư mục: `views/ten-theme/layouts/`. 
Mỗi layout là một file HTML đầy đủ cấu trúc khung trang.

### Danh Sách Layout Mặc Định

| File | Mô tả |
|---|---|
| `template-home.blade.php` | Khung layout riêng của trang chủ |
| `template-full-width.blade.php` | Khung tràn viền (Không có sidebar) |
| `template-sidebar-right.blade.php` | Khung có sidebar phải |
| `template-sidebar-left.blade.php` | Khung có sidebar trái |
| `template-user.blade.php` | Layout khu vực hiển thị trang tài khoản Dashboard |
| `template-empty.blade.php` | Layout rỗng (Không có header/footer) |

### Cách Khởi Tạo Một Layout Tuỳ Chỉnh
Bạn có thể tạo một file Layout bất kì (VD: `template-demo.blade.php`) và nhúng các khối Header/Footer bằng hàm `Theme::partial()`. Nội dung tự động của View sẽ đổ vào Layout thông qua hàm `{!! Theme::content() !!}`.

```blade
{{--
Layout-name: Template Tùy Chỉnh 
--}}
<!DOCTYPE html>
<html lang="{{ Language::current() }}" @do_action('in_tag_html')>
    {!! Theme::partial('include/head') !!}
    <body @do_action('in_tag_body')>
        <!-- Nhúng Gọi file header nằm ở views/my-theme/include/header.blade.php -->
        {!! Theme::partial('include/header') !!}

        <div class="container my-layout">
            <!-- ĐÂY LÀ KHU VỰC TỰ ĐỘNG ĐỔ VIEW VÀO LAYOUT -->
            {!! Theme::content() !!}
        </div>

        @do_action('template_wrapper_after')
        {!! Theme::partial('include/footer') !!}
    </body>
</html>
```

*(Ghi chú: Comment `{{-- Layout-name: ... --}}` trên đầu giúp Quản trị viên nhìn thấy Layout của bạn trong Menu chọn Giao Diện ở Admin Panel).*

---

## 2. Hệ Thống Views (Giao Diện Nội Dung Chi Tiết)

Views là phần giao diện lõi sẽ được nạp động vào thẻ `{!! Theme::content() !!}` của Layout. Các file Views chính nằm thẳng ở thư mục Root của Theme: `views/ten-theme/`.

### Danh Sách Views Mặc Định

| Hệ Thống Tự Quét File | Chức Năng |
|---|---|
| `home-index.blade.php` | View dành cho Trang Chủ |
| `page-detail.blade.php` | Giao diện nội dung Chi tiết Trang tĩnh (Pages) |
| `post-index.blade.php` | Danh sách bài viết (Chuyên mục / Blog / Danh mục Sp) |
| `post-detail.blade.php` | Chi tiết nội dung 1 Bài viết (Hoặc 1 Sản phẩm) |
| `user-login.blade.php` | Form Auth: Đăng nhập |
| `user-register.blade.php`| Form Auth: Đăng ký |
| `user-forgot.blade.php` | Form Auth: Quên mật khẩu |
| `user-profile.blade.php` | Giao diện Dashboard Thành Viên |
| `404-error.blade.php` | Giao diện Lỗi 404 Not Found |

Tương tự Layout, bạn có thể tạo lựa chọn View cho người dùng Admin bằng Comment.
```blade
{{--
View-name: List Bài Viết Template Dạng Gạch Khối
--}}
<div class="post-grid"> 
   <!-- html vòng lặp item --> 
</div>
```

---

## 3. Kiến Trúc Kế Thừa Giao Diện Của `ThemeLayoutView`

Một trong những công cụ Controller mạnh nhất của V8 Web là sự hỗ trợ từ class `SkillDo\Cms\Support\ThemeLayoutView`. Nó điều khiển cách hệ thống nhận diện việc phải nạp file View và Layout nào tùy theo Đường link hoặc Dữ liệu Bài viết.

Ví dụ ở Controller ngoài Front-end xử lý hiển thị Bài Viết Chi Tiết (`PostController`):
```php
$layout = new ThemeLayoutView('post', $object);

return Cms::view($layout->view(), $layout->layout());
```
Nhờ class `ThemeLayoutView`, V8 cung cấp tính năng **Nghĩ Ngầm Ưu Tiên Mức (Fallback Override)** hoàn toàn tự động, nghĩa là nó sẽ quét các file trong Theme theo thứ tự để chọn Giao Diện:

### Cách Quét Layout Cho 1 Bài Viết (Category / Post / Page)
Thứ tự Ưu Tiên Tìm Kiếm Layout:
1. `layout/template-post-{slug}.blade.php` *(Nếu file này có tồn tại, ưu tiên dùng layout riêng cho URL này)*
2. `layout/template-post-{post_type}.blade.php` *(Nếu File này tồn tại, áp dụng cho toàn bộ model post_type)*
3. Trở về Layout mà Admin đã Cấu Hình Tùy Chọn trong Menu Theme Setting.
4. Trở về Layout mặc định là `template-empty` nếu chả có gì.

### Cách Quét View Cho 1 Bài Viết (Category / Post / Page)
Thứ tự Ưu Tiên Tìm Kiếm View (Ruột):
1. `post-{slug}.blade.php` *(Áp dụng cấu trúc view riêng biệt cho URL cứng)*
2. `post-{post_type}.blade.php` *(Ví dụ: tạo file `post-product.blade.php` là nó thành view riêng cho sản phẩm!)*
3. Trở về View Mặc định chung như `post-index.blade.php` hoặc `post-detail.blade.php`.

**Ví dụ:** Bạn có kiểu bài viết tên là `product`. Để giao diện trang chi tiết Sản phẩm tách biệt khỏi trang chi tiết Bài Viết Tin Tức thông thường: 
👉 Bạn chỉ cần tạo file `views/theme-store/post-product.blade.php`. Ngay lập tức `ThemeLayoutView` sẽ bốc file đó lên vẽ trang!

---

## 4. Các Hàm Render Partials & Include (Bắt Buộc Dùng Cho Theme Child)

Để cắt component code của 1 View ra nhiều file cho sạch, **bạn không sử dụng `@include`**. Bạn gọi qua các dịch vụ của Theme vì chúng có khả năng hiểu được khi nào đang ở `Theme Mẹ`, khi nào đang được tùy chỉnh đè tại thư mục `Theme Child`.

#### 1. `Theme::view(string $path, array $data = [])`
Render và xuất hiện thẳng (In) file Blade. (Đường dẫn gốc tính từ thư mục Theme đang Active).

```php
Theme::view('include/header', ['title' => 'Trang chủ']);
```

#### 2. `Theme::partial(string $path, array $data = []): string`
Trả về HTML string dạng Component con, ưu ái lớn cho Khái Niệm Theme Child. Nếu ở Theme-Child có file đè tên tương tự, nó ngắt lấy Theme Child. 

```blade
{!! Theme::partial('include/footer') !!}
{!! Theme::partial('loop/post-item', ['post' => $post]) !!}
```

#### 3. `Theme::include(string $path, array $data = []): string`
Tương tự Partial, nhưng Hàm này mặc định chui thẳng vào trong thư mục con `include/` để tìm file cho ngắn gọn.

```blade
<!-- Thay vì gọi 'include/header' dài dòng qua partial, dùng include luôn: -->
{!! Theme::include('header', $data) !!}
```

#### 4. `theme_include(string $file)`
Sử dụng khi bạn muốn Import trực tiếp 1 File Lõi `.php` (Chạy logic backend, mảng config) ở thư mục Theme vào (ưu tiên Theme Child).
```php
theme_include('app/theme-setting/theme-setting.php');
```
