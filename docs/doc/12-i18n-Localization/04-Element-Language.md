# Thêm Đa Ngôn Ngữ Cho Page Builder Element (Element Language)

SkillDo CMS v8 sở hữu một trình dựng trang (Page Builder) vô cùng linh hoạt được xây dựng xoay quanh các khối hình gọi là **Elements**. Khi người dùng nhấp vào một Element, CMS sẽ hiển thị ra một Bảng Điều Khiển (Form Fields) để người dùng có thể nhập cấu hình (Ví dụ chọn Font, Điều màu nút bấm...).

Vấn đề đặt ra là: Nếu người dùng chuyển CMS sang Tiếng Anh, làm sao để Bảng Điều Khiển của cái khối hình (Element) đó hiển thị Label Tiếng Anh chứ không bị cứng chữ "Đổi Màu Chữ" ở phần Field?

---

## 1. Cơ chế hoạt động của Element Field & Ngôn Ngữ

Mỗi Element của bạn là một class thừa kế từ `Namespace\Cms\Element\Element`. 
Trong đó, phương thức trả về danh sách các Fields sẽ sử dụng thư viện **Form Builder** (Tạo form) gọi ở `input` hoặc mảng Controls.

Và thay vì điền chuỗi tĩnh (Ví dụ `'label' => 'Màu sắc'`), bộ Form Field của Element hỗ trợ hàm `trans()` để tự động render dịch dựa vào file ngôn ngữ. Lợi thế là Element có thể gọi lại ngôn ngữ của **Bất cứ hệ thống nào** (Lõi Hệ Thống, Từ Theme hay Từ Plugin).

### Cách gọi ngôn ngữ phổ biến nhất

- Các Element gốc nằm trong Core Framework sử dụng Namespace Global: `trans('system.color')` (Màu sắc) hoặc `trans('system.font_size')` (Kích cỡ chữ).
- Các Element do Theme phát triển sử dụng tệp trong Theme: `trans('theme::element.custom_button.color')`
- Các Element do Plugin cấp lấy Prefix: `trans('skd-seo::admin.keywords')`
- **ĐẶC BIỆT (Element Namespace riêng):** Nếu bạn làm những Builder Element lớn, phức tạp và tách file language độc lập cho từng Element (chứ không viết tập trung vào 1 file `theme.php`), CMS cung cấp Namespace theo Tên Element. VD Tên class Widget là `AuthButton` -> Element id là `auth-button` -> gọi: `trans('auth-button::style.color')`.

---

## 2. Cách Khai Báo Ngôn Ngữ Phổ Biến Trong 1 Class Element (Ví Cụ Cụ Thể)

Đây là ví dụ điển hình khi bạn là Deverloper viết Theme và tạo một Element "Giới Thiệu Banner" dạng kéo thả. Ban đầu tên Label Tiếng Việt, giờ biến nó thành biến linh động Tiếng Anh/Việt.

**Bước 1:** Chuẩn bị 2 file ngôn ngữ ở Theme `theme-store/language/`. 
```php
// File vi/element.php
return [
    'banner' => [
        'title' => 'Khối Banner Giới Thiệu',
        'heading_label' => 'Tiêu đề lớn',
        'desc_label'    => 'Mô tả tóm tắt ngắn gọn',
    ]
];

// File en/element.php
return [
    'banner' => [
        'title' => 'Intro Banner Block',
        'heading_label' => 'Main Heading',
        'desc_label'    => 'Short Summary Description',
    ]
];
```

**Bước 2:** Cấu trúc Class Element và Inject Hàm `trans()`

Vào file class Element của Theme bạn, gọi hàm này cho hàm khởi tạo, nhãn trường và các tuỳ chỉnh.

```php
namespace Theme\ThemeStore\Elements;

use SkillDo\Cms\Element\Element;      // Cơ sở Class Element
use SkillDo\Cms\Form\Form;    // Class Form tạo input

class IntroBanner extends Element {

    // Đây là Tiêu Đề của Khối hình bên cột kéo thả Trái
    public function name() {
        return trans('theme::element.banner.title'); 
    }

    // Các Thiết Lập Nằm Ở Panel (Khi Click Vào Vùng Không Gian Builder)
    public function controls() {
        return [
            // Khung Nhập Tiêu Đề
            [
                'field' => 'heading',
                // Hàm trans() dùng làm lable dịch để hiển thị người dùng (tiếng việt/anh tùy hệ thống)
                'label' => trans('theme::element.banner.heading_label'),
                'type' => 'text',
                'value' => 'SkillDo Framework'
            ],

            // Khung Nhập Tóm Tắt
            [
                'field' => 'description',
                'label' => trans('theme::element.banner.desc_label'),
                'type' => 'textarea',
            ]
        ];
    }

    // Nơi Render ra Màn Hình (Tất Nhiên Nội Dung Data do Admin Nhập là Tĩnh - Nhưng Class Wrapper Tĩnh)
    public function render() {
         
         // In Data Ra Thôi
         echo "<div class='banner'>";
         echo "<h2>". $this->val('heading') ."</h2>";
         echo "<p>". $this->val('description') ."</p>";

         // Hoặc Nếu Cần Gắn Label "Read More" cứng
         echo "<a href='#'>". trans('theme::button.read_more') ."</a>";
         echo "</div>";
    }
}
```

---

## 3. Tận dụng Ngôn Ngữ Nhúng Sẵn Trong Framework (Core Fields)

Việc dịch từng chút một các từ căn bản ('margin', 'padding', 'color', 'background-color') là RẤT vô ích. 
Do vậy bộ Framework đã cấu hình một gói Language rất lớn tại `language/vi/system.php` chỉ dùng cho CMS Element & Widget. 

Vì thế thay vì tự bịa thêm file `element.color`, bạn có thể lấy `trans('system.color')`. Tất cả những biến số cơ bản nhất của Website Design đã được xây dựng tại Core, bạn chỉ cần mở các file Language hệ thống bên trong `sourcev8/language` để tham khảo trước khi tự rẽ một file riêng.
