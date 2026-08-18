# CSS Building

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
//
// Truyền chuỗi thì hệ thống TỰ SINH hai trạng thái còn lại:
//   hover  -> '.box-item a:hover'   (tự thêm ':hover' nếu chưa có)
//   active -> '.box-item a.active'  (tự thêm '.active')
// Truyền mảng mà thiếu 'hover'/'active' cũng được suy ra từ 'normal' theo cùng quy tắc.

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

Tên hàm parser là **method của `SkillDo\Cms\Template\Template`** (thực chất nằm trong trait `TemplateCss`), được gọi động: `Template::{$property['style']}($property['data'])`.

> [!TIP]
> Trong `cssSelector()`, tên nào **không bắt đầu bằng `css`** sẽ được tự ghép: `'text'` → `cssText`, `'box'` → `cssBox`, `'backgroundColor'` → `cssBackgroundColor`. Vì vậy code thật của theme hay viết dạng ngắn. Cả hai cách đều đúng.
>
> Nếu tên sau khi ghép **không tồn tại** trên `Template`, thuộc tính đó bị **bỏ qua âm thầm** — không có cảnh báo. Gõ sai tên parser nghĩa là CSS biến mất mà không báo lỗi.
>
> Riêng `cssColor` được gọi với tham số đầu cố định: `Template::cssColor('color', $data)`.

| Tên field trong Form Builder                 | Khai báo `'style'` |
|----------------------------------------------|--------------------|
| `background`                                 | `cssBackground`    |
| `background` (chỉ lấy phần nền)              | `cssBg`            |
| `color`                                      | `cssBackgroundColor` |
| `textBuilding`                               | `cssText`          |
| `inputDimension`                             | `cssRadius`        |
| `inputDimension`, `inputDimensionResponsive` | `cssDimension`     |
| `boxShadow`                                  | `cssBoxShadow`     |
| `border`                                     | `cssBorder`        |
| `border` (chỉ lấy màu viền)                  | `cssBorderColor`   |
| `spacing` (margin, padding)                  | `cssSpacing`       |
| `buttonBuilding`                             | `cssButton`        |
| `boxBuilding`                                | `cssBox`           |
| `colorBuilding`                              | `cssColor`         |
| `colorBuilding` (chỉ màu chữ)                | `cssTextColor`     |
| `textShadow`                                 | `cssTextShadow`    |
| `textStroke`                                 | `cssTextStroke`    |
| `typography`                                 | `cssTypography`    |

Mỗi parser trả về một mảng nhiều khoá; `cssSelector()` tự bốc đúng khoá theo cặp **thiết bị × trạng thái**:

| | normal | hover | active |
|---|---|---|---|
| **desktop** | `css` | `cssHover` | `cssActive` |
| **tablet** | `cssTablet` | `cssHoverTablet` | `cssActiveTablet` |
| **mobile** | `cssMobile` | `cssHoverMobile` | `cssActiveMobile` |

Nhờ vậy bạn chỉ khai một lần, không phải lặp lại cho từng breakpoint.

---

## 4. Tạo CSS Cổ Điển Nhắm Chi Tiết bằng `cssStyle()`

Nếu bạn cần Bơm dữ liệu hoặc Style tùy biến hoàn toàn không tuân theo Cấu trúc Builder, hãy gọi phương thức `cssStyle()`.

**Cú Pháp:**
```php
$style->cssStyle(string $path, array $args);
```

**Tham số:**
- `$path` : Hậu tố Class nằm phía trong của `$wrapper`. Truyền chuỗi rỗng `''` để CSS áp thẳng lên chính wrapper.
- `$args` : Mảng cấu hình hành vi.

| Khoá trong `$args` | Ý nghĩa |
|---|---|
| `style` | **Bắt buộc.** Closure trả CSS, chuỗi CSS thuần, hoặc **tên đầy đủ** method của `Template` (vd `cssText`) |
| `data` | Mảng dữ liệu từ Form Builder — bắt buộc khi `style` là tên method |
| `options` | Chuỗi tên thiết bị (`desktop`/`tablet`/`mobile`/`hover`), **hoặc** mảng ánh xạ `thiết-bị => khoá-css` |
| `device` | Bí danh cũ của `options` (dạng mảng) |
| `key` | Khoá css dùng cho desktop khi không khai `options` |
| `hover` | Tên khoá css lấy làm trạng thái hover |

> [!WARNING]
> Khác với `cssSelector()`, `cssStyle()` **không tự ghép tiền tố `css`**. Phải viết đầy đủ `cssText`, `cssBox`… Viết `'text'` sẽ bị hiểu là **chuỗi CSS thuần** và in nguyên văn ra file.

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

**Cú pháp:** `build(string $wrapper = ''): string`

Có thể truyền wrapper ngay lúc build. Lưu ý **wrapper đã đặt trong constructor / `wrapper()` sẽ thắng** tham số này — nếu `$this->wrapper` khác rỗng thì tham số `$wrapper` bị bỏ qua.

Thứ tự chuỗi trả về: `variables` → CSS desktop → khối `@media(max-width:1000px)` (tablet) → khối `@media(max-width:600px)` (mobile).

> [!WARNING]
> `build()` **không tự xoá** dữ liệu đã tích luỹ — `$cssBuilder` vẫn còn nguyên sau khi build. Muốn dùng lại cùng một đối tượng cho khối khác, phải gọi `$style->reset()` thủ công, nếu không CSS của khối trước sẽ bị lặp lại:
>
> ```php
> echo '<style>'.$style->build().'</style>';
>
> $style->reset()->wrapper('.another-box');
> ```
