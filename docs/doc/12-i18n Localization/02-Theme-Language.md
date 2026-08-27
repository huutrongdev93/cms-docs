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

## 3. Theme con ghi đè ngôn ngữ theme cha (Merge)

Dự án thực tế gần như luôn chạy theo cặp **theme cha** (`views/theme-store` — bản gốc, sẽ bị bản cập nhật ghi đè) và **theme con** (`views/theme-child` — nơi chứa mọi tuỳ biến của riêng dự án).

Ngôn ngữ cũng theo đúng nguyên tắc đó. Cả hai thư mục cùng được đăng ký vào namespace `theme::`, **theme con đăng ký sau nên có ưu tiên cao hơn**. Khi hai bên có file trùng tên, hai mảng được **trộn theo từng key** chứ không thay cả file (xem [cơ chế Merge](./01-Core-Language.md#4-một-namespace-nhiều-thư-mục--cơ-chế-merge)).

```text
sourcev8/views/
├── theme-store/
│   └── language/vi/contact.php     <-- bản gốc của theme
└── theme-child/
    └── language/vi/contact.php     <-- CHỈ khai key muốn sửa / thêm
```

**Đây là điểm quan trọng nhất:** file bên theme con **không cần chép lại toàn bộ** file của theme cha. Chỉ khai đúng những chuỗi muốn đổi hoặc muốn thêm.

`views/theme-store/language/vi/contact.php` (theme cha):
```php
<?php
return [
    'heading'      => 'Thông tin liên hệ',
    'us'           => 'Liên hệ với chúng tôi',
    'form.name'    => 'Họ tên của bạn',
    'form.email'   => 'Email của bạn',
    'ajax.success' => 'Gửi thông tin liên hệ thành công',
];
```

`views/theme-child/language/vi/contact.php` (theme con):
```php
<?php
return [
    // Sửa lại 1 chuỗi của theme cha
    'form.name'  => 'Tên đầy đủ của quý khách',

    // Thêm chuỗi hoàn toàn mới cho phần tuỳ biến của dự án
    'form.file'        => 'File đính kèm',
    'form.file_choose' => 'Chọn file',
    'file.max_files'   => 'Chỉ được đính kèm tối đa :max file',
];
```

Kết quả khi gọi trong Blade:
```blade
{{ trans('theme::contact.heading') }}      {{-- 'Thông tin liên hệ'          — giữ của theme cha --}}
{{ trans('theme::contact.form.name') }}    {{-- 'Tên đầy đủ của quý khách'   — theme con thắng --}}
{{ trans('theme::contact.form.file') }}    {{-- 'File đính kèm'              — key mới của theme con --}}
```

### Vì sao nên đặt ở theme con

- Bản cập nhật CMS ghi đè `theme-store` nhưng **không đụng** `theme-child` — chuỗi tuỳ biến của dự án không bị mất khi update.
- Không phải sửa file của theme gốc, nên `git diff` của theme gốc luôn sạch.
- Chỉ cần khai vài key, không phải bảo trì một bản chép của cả file gốc.

:::warning Tạo file mới phải xoá cache
Danh sách file ngôn ngữ được cache. Lần **đầu tiên** tạo `views/theme-child/language/vi/<file>.php` phải bấm xoá cache ở admin thì hệ thống mới quét lại và nhận file. Những lần sửa nội dung sau đó thì thấy ngay, không cần xoá.
:::

---

## 4. Khai báo Ngôn Ngữ Frontend Ra File JavaScript (Cho Vue/React/jQuery)

Rất nhiều lúc, bạn làm hàm AJAX Bỏ Giỏ Hàng (Code ở file `.js` độc lập). Nhưng file JS thì không thể nào gọi hàm PHP `trans()` được. 

SkillDo Framework xử lý việc này thông qua một thư viện Frontend hỗ trợ là `lang.js`.
Tuy nhiên, để đẩy toàn bộ mảng PHP thành JSON cho Javascript đọc, bạn cần sử dụng một lệnh Export đặc biệt trong Header của Layout Theme.

**Bước 1:** Dùng Facade `SkillDo\Cms\Support\Language` (hoặc biến Blade `$lang`) để đẩy các Nhóm ngữ cảnh ra cửa sổ HTML Window Object.

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


### File `lang-js.php` của theme con

Bộ chuỗi đẩy xuống JavaScript được `SkillDo\Cms\Support\Language::buildJs()` gom từ file `lang-js.php` của từng tầng: lõi → admin → **theme cha → theme con** → các plugin đang bật, rồi ghi ra JSON trong `storage/cms/json/lang/`.

Theme con dùng **chung tiền tố** `theme.` với theme cha, nên quy tắc y hệt các file ngôn ngữ khác: key trùng thì bản của theme con thắng, key mới thì được bổ sung.

```text
views/theme-store/language/vi/lang-js.php    <-- chuỗi JS gốc của theme
views/theme-child/language/vi/lang-js.php    <-- chỉ khai key muốn sửa / thêm
```

File JSON chỉ được dựng lại khi xoá cache (`cmsClearCache()` gọi `Language::buildJs()`), nên sửa `lang-js.php` xong phải xoá cache mới thấy ở phía JS.

---

## 5. Đường dẫn (slug) trong theme đa ngôn ngữ

Từ **8.2.0** mỗi ngôn ngữ có thể mang một slug riêng (`/gioi-thieu` ↔ `/en/about-us`). Với theme,
điều đó gói gọn trong ba quy tắc:

**1. Link trong trang: viết y như cũ.** Cột `slug` được thay theo ngôn ngữ đang xem giống hệt
`title`/`content`, nên mọi lời gọi sẵn có vẫn đúng và **không phải sửa**:

```blade
<a href="{{ Url::permalink($post->slug) }}">{{ $post->title }}</a>
```

**2. Link sang ngôn ngữ khác: phải dùng hàm riêng.** `Url::permalink()` luôn dựng theo ngôn ngữ
*đang xem*, nên đưa vào vòng lặp qua các ngôn ngữ sẽ ra cùng một URL cho tất cả:

```blade
{{-- ❌ Bộ chuyển ngôn ngữ viết thế này sẽ trỏ mọi ngôn ngữ về cùng một trang --}}
@foreach (Language::listKey() as $lang)
    <a href="{{ Url::permalink($post->slug) }}">{{ $lang }}</a>
@endforeach

{{-- ✅ --}}
@foreach (Language::list() as $lang => $info)
    <a href="{{ Url::language($lang) }}">{{ $info['label'] }}</a>
@endforeach
```

**3. Tên file template tra bằng `slug_default`, không phải `slug`.** Nếu tra bằng `slug` (đã
dịch), trang tiếng Anh sẽ tìm `page-about-us.blade.php` và lặng lẽ rơi về template mặc định
trong khi trang tiếng Việt vẫn đúng:

```php
$slug = $object->slug_default ?? $object->slug;
```

Toàn bộ cơ chế, cách bật/tắt và công cụ sinh đường dẫn cho nội dung đã dịch từ trước:
[Đường dẫn riêng cho từng ngôn ngữ](./05-Slug-Per-Language.md).
