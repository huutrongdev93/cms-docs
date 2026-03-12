# Theme
Từ phiên bản 7 trở đi khi làm việc với Skilldo, layout hay view template thường được viết bằng cách sử dụng `Blade templating language` của laravel.
## Layout
Danh sách layout được chứa trong thư mục layouts
### Tạo Layout
Khởi tạo layout tạo file `/views/<current-theme>/layouts/template-demo.blade.php` và Sau đó tùy chỉnh nó như bạn muốn
```php
{{--
Layout-name: Template Mẫu
--}}
{!! Theme::partial('include/header') !!}
{!! Theme::content() !!}
{!! Theme::partial('include/footer') !!}
```

### Layout post category
Tạo layout cho trang danh mục bài viết theo cate type bạn tạo file có đuôi là cate type của danh mục
<pre>
template-post-<b>cate_type</b>.blade.php
</pre>

### Layout post
Tạo layout cho trang chi tiết bài viết theo post type bạn tạo file có đuôi là post type của bài viết
<pre>
template-post-<b>post_type</b>.blade.php
</pre>

### Layout slug
Tạo layout cho trang danh mục bài viết hoặc trang chi tiết bài viết bằng slug
<pre>
template-post-<b>slug</b>.blade.php
</pre>

Tạo layout cho trang nội dung bằng slug

<pre>
template-page-<b>slug</b>.blade.php
</pre>

## Views
View là giao diện thay đổi riêng cho từng đối tượng của cùng một layout.
View có thể chọn trong admin để làm được điều đó bạn cần tạo file view trong thư mục theme hiện tại và khai báo đoạn sau vào view vừa tạo:
```php
{{--
View-name: View contact
--}}
```
### View default
Các view mặc định
- home-index.blade.php : view cho trang chủ
- page-detail.blade.php : view cho chi tiết trang nội dung  (page)
- post-index.blade.php : view cho danh sách bài viết (post category)
- post-detail.blade.php : view cho chi tiết bài viết (post)
- post-detail.blade.php : view cho chi tiết bài viết (post)
- user-login.blade.php : view cho trang đăng nhập thành viên
- user-register.blade.php : view cho trang đăng ký thành viên
- user-forgot.blade.php : view cho trang quên mật khẩu
- 
### View post category
Tạo view cho trang danh mục bài viết theo cate type bạn tạo file có đuôi là cate type của danh mục bài viết
<pre>
post-<b>cate_type</b>.blade.php
</pre>

### View post
Tạo view cho trang chi tiết bài viết theo post type bạn tạo file có đuôi là post type của bài viết
<pre>
post-<b>post_type</b>.blade.php
</pre>

### View slug
Tạo view cho trang danh mục bài viết hoặc trang chi tiết bài viết bằng slug
<pre>
post-<b>slug</b>.blade.php
</pre>

Tạo layout cho trang nội dung bằng slug

<pre>
page-<b>slug</b>.blade.php
</pre>

## Helper
### Xử lý view
#### view
Để hiển thị một file blade bạn có thể sử dụng method `view`

```php
Theme::view('include/header', $data)
```
method `Theme::view` nhận vào 2 tham số
- Đường dẫn đến file blade với thư mục góc là thư mục **theme hiện tại**
- mãng data truyền vào file blade
method `Theme::view` sẽ xử lý và **hiển thị** giao diện từ file blade

#### partial
Để lấy nội dung hiển thị một file blade bạn có thể sử dụng method `partial`

```php
$view = Theme::partial('include/header', $data)
```
method `Theme::partial` nhận vào 2 tham số
- Đường dẫn đến file blade với thư mục góc là thư mục **theme hiện tại**
- mãng data truyền vào file blade
method `Theme::partial` sẽ xử lý và **trả về** giao diện từ file blade

#### include
Để lấy nội dung hiển thị một file blade trong thư mục include bạn có thể sử dụng method `include`

```php
$view = Theme::include('header', $data)
```
method `Theme::include` nhận vào 2 tham số
- Đường dẫn đến file blade với thư mục góc là thư mục **include** trong thư mục theme
- mãng data truyền vào file blade
method `Theme::include` sẽ xử lý và **trả về** giao diện từ file blade

### Kiểm tra vị trí

#### isHome(): boolean
Xác định xem truy vấn có dành cho trang chủ hay không.

```php
Theme::isHome()
```

#### isPage(string $page): boolean
Kiểm tra truy vấn đúng với trang cần kiểm tra hay không

```php
Theme::isPage('post_index')
```

#### isSingle(): boolean
Kiểm tra truy vấn đúng với trang nội dung (page) hay không

```php
Theme::isSingle()
```

#### isCategory(): boolean
Kiểm tra truy vấn đúng với trang danh mục bài viết hay không

```php
Theme::isCategory()
```

#### isPost(): boolean
Kiểm tra truy vấn đúng với trang chi tiết bài viết hay không

```php
Theme::isPost()
```

#### getPage(): boolean|string
Trả về id trang hiện đang truy vấn nếu là trang admin sẽ trả về false

```php
Theme::getPage()
```