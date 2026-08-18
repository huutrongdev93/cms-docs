# Các Hàm Tiện Ích Trong Theme

Khi dựng giao diện Blade, bốn nhóm helper dưới đây thay thế toàn bộ việc ghép chuỗi PHP thủ công. Tất cả đều gọi bằng static method và có alias toàn cục nên **không cần `use`** trong Blade.

---

## 1. URL & Điều Hướng — `SkillDo\Cms\Support\Url` (alias `Url`)

```blade
{{-- Trang chủ --}}
<a href="{{ Url::base() }}">Home</a>

{{-- Ghép đường dẫn vào gốc site --}}
<img src="{{ Url::base('views/theme-store/assets/images/logo.png') }}" />

{{-- Link vào khu vực admin --}}
<a href="{{ Url::admin('users/edit/5') }}">Sửa người dùng</a>

{{-- Đường dẫn bài viết / danh mục: tự thêm tiền tố ngôn ngữ khi chạy đa ngữ --}}
<a href="{{ Url::permalink($object->slug) }}">{{ $object->title }}</a>

{{-- Các trang tài khoản dựng sẵn --}}
<a href="{{ Url::login() }}">Đăng nhập</a>
<a href="{{ Url::register() }}">Đăng ký</a>
<a href="{{ Url::forgot() }}">Quên mật khẩu</a>
<a href="{{ Url::account() }}">Tài khoản</a>
<a href="{{ Url::logout() }}">Đăng xuất</a>

{{-- Trang lưu trữ theo thẻ & trang tìm kiếm --}}
<a href="{{ Url::tag($tag->slug) }}">{{ $tag->name }}</a>
<form action="{{ Url::search() }}" method="get">…</form>
```

> Danh sách đầy đủ: xem [Url](../07-Supports/03-Url.md).

---

## 2. Dữ Liệu View — `SkillDo\Cms\Support\Cms` (alias `Cms`)

Controller đẩy dữ liệu vào kho chung bằng `Cms::setData()`; mọi Blade — kể cả layout cha và partial lồng sâu — đọc lại bằng `Cms::getData()`. Nhờ vậy layout không cần nhận biến truyền tay qua từng cấp.

```blade
@php
    $module = Cms::getData('module');
    $object = Cms::getData('object');
@endphp

@if($module == 'products')
    {{-- Chỉ chạy khi controller sản phẩm đang render --}}
@endif

<h2>{{ $object->title ?? '' }}</h2>
```

Các key thường có: `object` (bản ghi đang xem), `objects` (danh sách), `category`, `pagination`, `module`.

> Trong Blade của theme, các biến này cũng đã được đẩy sẵn vào view scope, nên phần lớn trường hợp bạn dùng thẳng `$object`, `$objects` mà không cần gọi `Cms::getData()`.

---

## 3. Ảnh — `SkillDo\Cms\Support\Image` (alias `Image`)

Mỗi kích thước là **một static method riêng**, nhận `($path, $alt = null)` và trả về **đối tượng `Image`** (không phải chuỗi):

| Method | Kích thước |
|---|---|
| `Image::source($path, $alt)` | Ảnh gốc |
| `Image::large($path, $alt)` | Lớn |
| `Image::medium($path, $alt)` | Trung bình |
| `Image::thumb($path, $alt)` | Thumbnail |
| `Image::url($path, $alt)` | Kiểu `link` (dùng cho ảnh ngoài / link trực tiếp) |

Từ đối tượng đó, gọi tiếp một trong hai:

| Method | Trả về |
|---|---|
| `->html($alt = null)` | Chuỗi thẻ `<img …>` hoàn chỉnh |
| `->link()` | Chỉ URL của ảnh |

```blade
{{-- In cả thẻ img (khuyên dùng) --}}
{!! Image::medium($object->image, $object->title)->html() !!}

{{-- Chỉ lấy URL để tự đặt vào thuộc tính --}}
<div style="background-image: url('{{ Image::large($object->image)->link() }}')"></div>

{{-- Thêm thuộc tính trước khi render --}}
{!! Image::medium($object->image, $object->title)->attribute('lazy', 'default')->html() !!}

{{-- Kích thước động --}}
{!! Image::{$options->size}($options->img ?? '', $options->alt ?? '')->html() !!}
```

> [!WARNING]
> Tham số thứ hai là **`$alt`**, không phải kích thước. `Image::url($path, 'medium')` không đổi kích thước — nó gán chữ `"medium"` làm alt.
>
> Ảnh rỗng vẫn cho ra thẻ hợp lệ (dùng ảnh mặc định của hệ thống), nên không cần tự kiểm tra `empty()`.

Nếu bỏ trống `$alt`, `html()` tự lấy `title` hoặc `name` của `Cms::getData('object')` làm alt.

---

## 4. Xác Thực — `SkillDo\Support\Auth` (alias `Auth`)

```blade
@if(Auth::check())
    <p>Chào {{ Auth::user()->fullname }}</p>
    <a href="{{ Url::account() }}">Tài khoản</a>
    <a href="{{ Url::logout() }}">Đăng xuất</a>
@else
    <a href="{{ Url::login() }}">Đăng nhập</a>
    <a href="{{ Url::register() }}">Đăng ký</a>
@endif
```

| Method | Mô tả |
|---|---|
| `Auth::check()` | Đã đăng nhập chưa |
| `Auth::user()` | Đối tượng người dùng hiện tại |
| `Auth::id()` / `Auth::userID()` | Id người dùng |
| `Auth::getRole()` / `Auth::getRoleName()` | Key / tên nhóm quyền |
| `Auth::hasCap($cap)` | Kiểm tra một quyền cụ thể |
| `Auth::isSupper()` | Có phải tài khoản quyền cao nhất |

> `username` là **tên đăng nhập**, không phải nhóm quyền. Muốn hiển thị nhóm quyền dùng `Auth::getRoleName()`. Chi tiết phân quyền: xem [Role & Permission](../06-Cms/04-Auth%20Role/02-Role-Permission.md).
