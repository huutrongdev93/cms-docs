# Assets & Head

Hệ thống cung cấp cơ chế quản lý thẻ Meta, biến JavaScript toàn cục, biến CSS Root và các tệp tin tĩnh (CSS/JS) rất mạch lạc thông qua hai class lõi `ThemeAssetService` và `ThemeHeadService`. 

Tuy nhiên, với tư cách là người phát triển Theme hoặc Plugin, bạn **KHÔNG CẦN CHỈNH SỬA VÀO CÁC CLASS NÀY**. Thay vào đó, bạn chỉ cần dùng các **Action Hook / Filter Hook** tại file Bootstrap (hoặc plugin active) để chèn tự động mọi thứ bạn muốn vào.

Dưới đây là các Hướng dẫn Thực Hành chi tiết cho mọi nhu cầu chèn Assets / Biến Môi Trường tại vùng Head & Body.

---

## 1. Thêm File CSS và JS (Assets)

Tuyệt đối không nhúng cứng thẻ `<link>` hay `<script src>` vào HTML Blade.
Sử dụng **Action Hook: `theme_custom_assets`** hoặc chèn trực tiếp vào Class Config ThemeAsset ở folder `theme_store`. CMS sẽ tự động gộp file và đưa lệnh minify lúc tải.

```php
use SkillDo\Cms\Support\Theme;

add_action('theme_custom_assets', function() {
    
    $header = Theme::asset()->location('header');
    $footer = Theme::asset()->location('footer');

    // 1. Thêm File CSS vào phần <head>
    // Tham số 3: Tùy ý cấm Minify nếu file gốc đã là đuôi .min.css
    $header->add('my-plugin-style', 'assets/css/plugin-style.css')->minify();

    // 2. Thêm File JavaScript xuống vị trí <body> dưới cùng (Tránh kẹt UI)
    $footer->add('my-plugin-script', 'assets/js/plugin-script.js')->minify();

});
```

*(Lưu ý: Mọi đường dẫn url sẽ được tính rễ `Base` nằm từ thư mục của Theme Đang Cài. Nếu viết Plugin, hãy cung cấp mã Absolute URL tuyệt đối).*

---

## 2. Thêm Một Thẻ HTML Meta Mới (SEO/Thuộc tính)

`ThemeHeadService` tự động sinh các thẻ như ChartSet hay CSRF Token. Để **Bơm thêm** một thẻ Meta mới (Ví dụ thêm Meta OpenGraph Facebook, Thẻ Tác Giả, ...), hãy dùng **Filter Hook: `theme_head_meta_tags`**.

```php
add_filter('theme_head_meta_tags', function($metas) {
    
    // Thẻ quy định tác giả: <meta name="author" content="Skilldo CMS">
    $metas['author'] = [
        'name'    => 'author',
        'content' => 'Skilldo CMS'
    ];

    // Thẻ Graph Facebook: <meta property="og:title" content="Hướng dẫn V8">
    $metas['og_title'] = [
        'property' => 'og:title',
        'content'  => 'Hướng dẫn V8'
    ];

    return $metas;
});
```

---

## 3. Thêm Một Biến Script Mới (Bơm Biến PHP Xuống Javascript)

Đôi khi Frontend logic Ajax cần các biến PHP, đường dẫn URL hoặc tham số Đăng nhập. Bạn có thể ép biến JavaScript tự động in ra màn hình dạng `const`.
Dùng **Filter Hook: `theme_head_script_variable`** (Filter này tác động trực tiếp vào phương thức `scriptVariable` của `ThemeHeadService`).

```php
use SkillDo\Support\Auth;

add_filter('theme_head_script_variable', function($variables) {
    
    // Tạo thêm biến const current_user_id = 5; (nếu chưa đăng nhập = 0)
    $userId = Auth::check() ? Auth::id() : 0;
    
    // LƯU Ý: Những dữ liệu chuỗi (String) bạn BẮT BUỘC PHẢI BỌC NÓ VÀO CẶP NHÁY ĐƠN "'"
    // Nếu là Number/Boolean/Object JSON thì không bọc nháy.
    $variables['current_user_id'] = $userId;
    $variables['my_api_key']      = "'SECRET-V8-KEY'";

    return $variables;
});
```
Phía Javascript Client bạn gọi thẳng hằng số này để làm tính năng cho UI:
`console.log("Mã API là: ", my_api_key);`

---

## 4. Thêm Một Biến Môi Trường CSS Mới (Màu sắc, Font Custom)

Trong v8, hệ thống có thể gán Động từ Backend (Theme Option) xuống biến `:root CSS` để Frontend tuỳ ý gọi var() tô màu giao diện dựa theo quyết định của khách hàng.
Dùng **Filter Hook: `theme_head_style_variable`** (Filter này chạy ở mục `styleVariable()` trong `ThemeHeadService`).

```php
use SkillDo\Cms\Support\Option;

add_filter('theme_head_style_variable', function($variables) {
    
    // Kéo cấu hình màu khách đang chọn từ Setting CMS
    // Ví dụ Option là custom_box_bgcolor (Sẽ tạo qua FormAdmin Option)
    $boxColor = Option::get('custom_box_bgcolor', '#ff0000'); 

    // Gán mã Tên Biến CSS. (Nhớ có 2 dấu gạch nối phía trước)
    $variables['--custom-box-bg'] = $boxColor;

    return $variables;
});
```

Thế là xong! Bây giờ ở File `*.css` thiết kế riêng của Theme, bạn được phép khai báo lệnh sau mạnh mẽ mượt mà vô đối:

```css
.my-custom-box {
    /* Khối Box tự lấy màu động của Admin Option mà không dùng thủ thuật xấu inline CSS*/
    background-color: var(--custom-box-bg);
}
```
