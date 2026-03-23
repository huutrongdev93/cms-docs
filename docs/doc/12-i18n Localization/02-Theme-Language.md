# Đa Ngôn Ngữ Trong Theme

Đối với phát triển **Giao Diện (Theme)**, việc cho phép người dùng chuyển đổi ngôn ngữ Website mà nút bấm, tiêu đề (Footer, Header, Tin Tức Liên Quan...) tự động thay đổi theo là yếu tố tối thiểu của dự án Enterprise.

SkillDo Theme System quy định rạch ròi: Ngôn ngữ của Theme A chỉ phục vụ nội bộ mảng hiển thị của Theme A. Tuyệt đối không đem sửa thẳng ngôn ngữ Core hay viết lộn với Plugin. Thay vào đó, bạn phải sử dụng namespace được chỉ định sẵn cho Theme là `theme::`.

---

## 1. Cấu trúc thư mục Theme Language

Bạn hãy đặt toàn bộ các file mảng trả về (giống hệ thống CMS Core Language) bên trong thư mục `language/` NẰM TRONG thư mục của Theme bạn.

Ví dụ Theme bạn làm là `theme-store`.

```text
sourcev8/views/
└── theme-store/
    ├── app/
    ├── views/
    ├── language/              <-- Nơi chứa ngôn ngữ cho theme này
    │   ├── vi/
    │   │   ├── header.php
    │   │   ├── footer.php
    │   │   └── button.php
    │   └── en/
    │       ├── header.php
    │       └── ...
```

Nội dung file `views/theme-store/language/vi/button.php`:
```php
<?php
return [
    'read_more' => 'Đọc tiếp',
    'buy_now'   => 'Mua ngay',
    'cart'      => 'Giỏ hàng',
];
```

---

## 2. Cách Sử Dụng Dịch Thuật Trong Theme/Blade

Làm thế nào để Blade View biết được nên tìm chữ `button.read_more` tại không gian của Theme thay vì tìm lộn ở CMS Core?
Đó là sử dụng Cú pháp: **`trans('theme::tên-file.từ-khóa')`**. 

**BẮT BUỘC PHẢI KHAI BÁO TIỀN TỐ `theme::`**

Ví dụ ở file `theme-store/views/home-index.blade.php`:

```blade
<!-- Blade Template -->

<div class="product-item">
    <h3>Cà phê Robusta</h3>
    
    <!-- Lấy chữ "Mua ngay" từ mảng theme -->
    <a href="#" class="btn btn-primary">{{ trans('theme::button.buy_now') }}</a>
    
    <!-- Phân cấp mảng sâu -->
    <p class="summary">{{ trans('theme::home.welcome_message', ['store' => 'Sikido']) }}</p>

    <!-- Fallback nếu khóa không tồn tại, in nguyên dạng -->
    <button>{{ trans('theme::button.non_exist_key') }}</button>
</div>
```

---

## 3. Khai báo Ngôn Ngữ Frontend Ra File JavaScript (Cho Vue/React/jQuery)

Rất nhiều lúc, bạn làm hàm AJAX Bỏ Giỏ Hàng (Code ở file `.js` độc lập). Nhưng file JS thì không thể nào gọi hàm PHP `trans()` được. 

SkillDo Framework xử lý việc này thông qua một thư viện Frontend hỗ trợ là `lang.js`.
Tuy nhiên, để đẩy toàn bộ mảng PHP thành JSON cho Javascript đọc, bạn cần sử dụng một lệnh Export đặc biệt trong Header của Layout Theme.

**Bước 1:** Dùng Facade `SkillDo\Facades\Language` (hoặc biến Blade `$lang`) để đẩy các Nhóm ngữ cảnh ra cửa sổ HTML Window Object.

Trong `theme-store/include/head.blade.php`:
```blade
<!-- Nạp cấu trúc JS Core (trong đó có khai báo biến Skd.languages) -->
{!! Skd::head() !!}

<script>
    // Thêm các chuỗi đa ngôn ngữ (file button.php và alert.php của Theme) cho JS.
    // Lưu ý: Chỉ export đúng không gian của Theme
    window.Skd_Langs = {
       "button": @json(trans('theme::button')),
       "alert": @json(trans('theme::alert'))
    };
</script>
```

**Bước 2:** Sử dụng trong JS Frontend.
SkillDo đã cài sẵn thư viện cho phép bạn dịch ở mọi file JS thông qua biến khởi tạo tự động của CMS.

```javascript
/* file assets/js/app.js */

// Cách gọi 1: Sử dụng thư viện Translator 
alert( Skd.lang.get('alert.success_add_cart') );

// Cách gọi 2: Có kèm tham số
let msg = Skd.lang.get('alert.error_auth', { name: "Nguyễn Văn A" });
console.log(msg); // Lỗi đăng nhập cho tài khoản Nguyễn Văn A.
```
