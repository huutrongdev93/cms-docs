# Các Hàm Tiện Ích

Quá trình xây dựng một Theme Blade, việc lấy dữ liệu User, In Ảnh hoặc Gọi Link Thống Nhất là những cực hình khi băm PHP thủ công.
Dưới đây là một Kho Thuốc Lõi các Thư Viện Hàm Cung cấp sẵn từ Core CMS v8 gọi bằng Method Static.

## 1. Hệ URL Navigation & Routing (`SkillDo\Cms\Support\Url`)

Lấy nhanh Cấu Trúc Link mà Domain hiện hành tự Setup. Sạch Sẽ, bảo mật.
```blade
<!-- Lấy Link Cấu hình Hệ thống về Trang Chủ Gốc -->
<a href="{{ Url::base() }}">Home</a>

<!-- In Cấu hình tuyệt đối ra 1 thư mục Image -->
<img src="{{ Url::base('assets/logo.png') }}" />

<!-- In Link Trỏ Vào Backend Phân Hệ Admin Panel Hệ Thống -->
<a href="{{ Url::admin('users/edit/5') }}">Sửa Người Dùng Này Ở Admin</a>

<!-- In Cấu hình Router Tuyệt Đối Route Name có trong Laravel Core Domain (VD: detail, page, router tùy biến) -->
<a href="{{ Url::permalink($object->slug) }}">Xem Cụ Thể Sản Phẩm Này</a> 
<!-- Note: permalink tự rà Cấu hình SEO slug Url friendly của Module! -->
```

## 2. Các Lệnh Gọi Meta & Khung Session Page Hiện Tại ( `SkillDo\Cms\Support\Cms` )

Bạn thường ở Master Main Blade Layout (`main.blade.php`), làm thế nào Blade Khung Cha biết Cục Thân Page Con đang đổ Data Sản phẩm Tên gì mà Echo ra Menu Cấu hình tương ứng?

Gán data ở Controller bằng `Cms::setData()` thì gọi ra ở Blade Component con cực sạch như sau:

```blade
<!-- Khung Cha main.blade.php -->
<?php 
   // Lôi Metadata của Khung Cha View CMS hiện thời ra đĩa 
   $module_active = Cms::getData('module');  
?>
@if ($module_active == 'products') 
     <!--  Mất màu đỏ vì Tôi Chặn Đèn Check Code Riêng chỉ kích Hoạt Khi CMS render Module Products Controller!! -->
@endif

<!-- Hoặc lấy cấu trúc Global Object Module Mảng Dữ Liệu Truy Vấn -->
<?php $object = Cms::getData('object'); ?>
<h2>{{ $object->title ?? 'Rỗng' }}</h2>
```

## 3. Ảnh Upload Xử Lý Image Storage Base (`SkillDo\Cms\Support\Image`)
Thủ thuật In link CDN hoặc Tên Ảnh Không gãy ảnh Error Empty Source.
```blade
<!-- Thụt lùi / Tự Lấy Cache Của một Link Ảnh.  -->
<img src="{{ Image::url($object->image, 'medium') }}" /> 
<!-- => Nếu không có ảnh, hệ thống lấy link ảnh Defaut Cấu Hình Base (Empty Thumbnail). Size resize trung bình ('medium') Tối ưu Băng thông -->
```

## 4. Auth Giai Đoạn Nhanh Hệ Thống Thành Viên Frontend (`SkillDo\Support\Auth`)

Cho biết Khách Guest Ẩn Danh, Hay Một CMS Account Đã Sign-in Trùng IP Local session Browser.

```blade
@if(Auth::check()) 
    <p>Chào Mừng {{ Auth::user()->fullname }} - (Role Hệ Thống: {{ Auth::user()->username }}) !</p>
    <a href="{{ Url::base('logout') }}">Đăng Xuất</a>
@else
    <p>Quý Khách Nên Đăng Nhập Website CMS Cửa Hàng Trước Khi Check Form Giỏ.</p>
@endif
```

*Các Helper Class Static này luôn sẵn sàng Autoload Namespace tại mọi Layer Component View Core. Thỏa Sức Vẽ View Tĩnh Bơm Dữ Liệu Đông Backend PHP Xịn Sò Nhất.*
