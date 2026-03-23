# CSS Building (`ThemeCssBuild`)

Trong quá trình phát triển Giao diện hoặc Các Thành Phần Mở Rộng (Element), bạn thường xuyên lấy các giá trị Cấu hình (Config) như padding, margin, màu sắc từ Form builder mà người dùng thiết lập, sau đó chuyển tụi nó thành mã CSS Inline thực tế in ra màn hình.

SkillDo CMS v8 hỗ trợ mạnh mẽ class **`Theme\Supports\ThemeCssBuild`** để thực hiện việc chuyển đổi Dữ liệu mảng (Data input) thành Chuỗi CSS (String Styles) tự động quét đủ các giao diện (Desktop, Tablet, Mobile, Hover) một cách mượt mà nhất. 

---

## 1. Khởi Tạo Vùng Bao CSS (Wrapper)

Khi bạn muốn xuất CSS, bạn thường cần giới hạn CSS đó chỉ áp dụng vào một Khối mã (Class) cụ thể để tránh xung đột trên toàn hệ thống trang. Wrapper giúp tự động bọc tên Class mẹ ở trước rễ cây bộ chọn.

```php
use Theme\Supports\ThemeCssBuild;

// Cú pháp 1: Khởi tạo với Wrapper trực tiếp
$style = new ThemeCssBuild('.my-custom-box');

// Cú pháp 2: Hàm khai báo thiết lập sau
$style = new ThemeCssBuild();
$style->wrapper('#element-1234');
```

---

## 2. Truyền Biến CSS Variables (Root Vars)

Hàm `cssVariables` cho phép bạn tạo ra các biến CSS hiện đại (CSS Custom Properties). Hàm này sẽ gắn cứng biến vào Class Wrapper của bạn để các thành phần con thiết kế linh động thừa kế.

**Cú pháp:**
```php
$style->cssVariables(string $key, string $value);
```

**Ví dụ:**
```php
$style->cssVariables('--header-logo-height', '100px');
$style->cssVariables('--btn-color-primary', '#ff0000');
```
CSS Kết Quả:
```css
.my-custom-box {
   --header-logo-height:100px;
   --btn-color-primary:#ff0000;
}
```

---

## 3. Tạo CSS bằng `cssSelector()` (Khuyên Dùng Trong V8)

Đây là phương pháp Nhanh, Mạnh và Ngắn rọn nhất để Map (Kết nối) dữ liệu từ `Form Builder` vào Selectors. Phương thức này tự động ánh xạ Data Input gọi đến class `SkillDo\Cms\Template\Template` để render style theo nhiều khung hình khác nhau (Desktop, Mobile).

**Cú pháp:**
```php
$style->cssSelector(string|array $selectors, array ...$properties);
```

**Ví dụ thực tế:**
Bạn có một input `color`, `spacing` và `radius` từ Element. Bạn muốn nạp nó vào thẻ `<a>` nằm trong Box:

```php
// Chọn vùng cần CSS
$selectors = '.box-item a'; 

// Cũng có thể nạp mảng nâng cao nếu muốn thay class thẻ lúc hover:
// $selectors = ['normal' => '.box-item a', 'hover' => '.box-item a:hover', 'active' => '.box-item a.active'];

$style->cssSelector($selectors, 
    [
        'data'  => $buttonData, // Mảng Data trả ra từ Cấu hình Nút của Form 
        'style' => 'cssButton'  // Hàm Parser tương ứng của CMS
    ],
    [
        'data'  => $paddingData, // Mảng Data Padding/Margin sinh ra từ Option inputSpacing
        'style' => 'cssSpacing' 
    ]
);
```

### Danh Sách Hỗ Trợ Hàm Parser Của Input Tương Ứng (Biến `$properties['style']`)
Khi Framework lấy mảng từ Input (như `$paddingData`), CMS cần một hàm Dịch ra mã Cứng cho loại Input đó. Quy tắc tương xứng như sau:

| Tên Input Trong Form Builder             | Khai Báo 'style' Của Builder  |
|------------------------------------------|---------------|
| `inputBackground`                        | `cssBackground` |
| `textBuilding`                           | `cssText`       |
| `inputDimension`                         | `cssRadius`     |
| `inputDimension`, `inputDimensionResponsive`| `cssDimension`  |
| `boxShadow`                              | `cssBoxShadow`  |
| `inputBorder`                            | `cssBorder`     |
| `inputSpacing` (Margin, Padding)         | `cssSpacing`    |
| `buttonBuilding`                         | `cssButton`     |
| `boxBuilding`                            | `cssBox`        |
| `colorBuilding`                          | `cssColor`      |
| `colorBuilding`                          | `cssTextColor`  |

> *(Khung `cssSelector` của Version 8 sẽ tự động thông minh quét trạng thái `cssHover`, `cssMobile`, `cssTablet` được đẻ ra từ Data Input, không cần bạn khai báo lặp lại nhọc nhằn nhét thẻ).*

---

## 4. Tạo CSS Cổ Điển Nhắm Chi Tiết bằng `cssStyle()`

Nếu bạn cần Bơm dữ liệu hoặc Style tùy biến hoàn toàn không tuân theo Cấu trúc Builder, hãy gọi phương thức `cssStyle()`.

**Cú Pháp:**
```php
$style->cssStyle(string $path, array $args);
```

**Tham số:**
- `$path` : Hậu tố Class nằm phía trong của `$wrapper`.
- `$args` : Mảng Cấu hình hành vi.

### Cách 1: Nạp Giá Trị Text tĩnh bằng Closure
```php
$style->cssStyle('.title', [
    'style' => function() {
        return 'font-size: 20px; color: red;';
    }
]);
// Hoặc thiết kế riêng cho Mobile
$style->cssStyle('.title', [
    'options' => 'mobile',
    'style' => 'font-size: 14px;'
]);
```

### Cách 2: Gọi Auto Parser Render Option của Template

```php
$style->cssStyle('.title', [
    'data'  => $textData,
    'style' => 'cssText',  // Giống bảng phía trên
    'options' => [
        'desktop' => 'css',         // render desktop từ biến CSS của data
        'tablet'  => 'cssTablet',   
        'mobile'  => 'cssMobile',   
        'hover'   => 'cssHover',
    ]
]);
```

> **So Sánh Tối Ưu:** Nếu hệ thống View của bạn có quá nhiều cấp, bạn nên chuyển hướng sang sử dụng cơ chế `$style->cssSelector()` mới cập nhật ở **Mục 3**, thay vì gõ code cồng kềnh như `cssStyle()` ở bản v7 này.

---

## 5. Render Ra Kết Quả (Build)

Hoàn thành sau chuỗi Map dữ liệu (tất cả các hàm return `$this`), bạn buộc xuất chuỗi String cuối cùng để in vào thẻ `<style>` của Element/Blade view thông qua hàm `build()`. 

Hàm này thông minh gom tất cả Tablet vào trong `@media(max-width:1000px)` và Mobile vào `@media(max-width:600px)` cho bạn.

```php
// Render In màn hình bằng hàm Build
$cssOutput = $style->build();

// In vào File View Blade html
echo '<style>' . $cssOutput . '</style>';
```

> *Mẹo vặt*: Sau khi gọi `build()`, Hệ thống rớt biến và tự Clean Clear chuỗi `$cssBuilder`. Hoặc gọi `$style->reset();` để làm mới biến chứa cục bộ trước khi render thẻ Box khác.
