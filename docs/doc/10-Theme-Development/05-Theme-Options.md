# Thiết Kế Theme Options (Cấu Hình Giao Diện Quản Trị)

Trong v8, CMS đã cung cấp sẵn một hệ thống Theme Options mạnh mẽ tại đường dẫn `Admin → Giao diện → Cấu hình`. Hệ thống này được xây dựng trên Class **`SkillDo\Cms\Support\ThemeOption`**.

Theme Options cho phép admin tùy chỉnh giao diện website qua form UI. Dữ liệu lưu vào database qua `Option::get/update`, dùng trong theme để build CSS/layout.

---

## 1. Thêm Nhóm Cấu Hình Chính (Group)

Một **Group** đại diện cho một Tab bấm lớn bên trái màn hình Cấu hình Theme. 
Bạn sử dụng hàm tĩnh `ThemeOption::addGroup()` kết hợp với Hook `theme_custom_options` để đăng ký Tab này.

Ví dụ tạo file `bootstrap/theme-options.php`:

```php
use SkillDo\Cms\Support\ThemeOption;
use SkillDo\Form\Form;

add_action('theme_custom_options', function () {
    
    // Tạo 1 Tab mới tên ID là 'general'
    ThemeOption::addGroup('general', [
        'position' => 10,  // Thứ tự sắp xếp (số nhỏ xếp lên trên)
        'label'    => 'Cấu hình chung',
        'icon'     => '<i class="fa-light fa-screwdriver-wrench"></i>',
        'root'     => false, // Set true nếu chỉ cấp quyền Super Admin mới thấy Tab
        
        // Khai báo giao diện các Input trong Panel
        'form'     => function(Form $form) {
            $form->text('general_label', ['label' => 'Tên website (shop)']);
            $form->color('theme_color',  ['label' => 'Màu chủ đề']);
            $form->background('bodyBg',  ['label' => 'Nền website']);
        }
    ]);

});
```


| Param `$args` | Type | Mô tả | Default |
|---|---|---|---|
| `position` | int | Thứ tự sắp xếp (thấp = trước) | `0` |
| `label` | string | Tên nhóm hiển thị trong tab | bắt buộc |
| `icon` | string | HTML icon đại diện | `''` |
| `form` | `Form\|callable` | Form object hoặc closure trả về Form | `null` |
| `root` | bool | Chỉ hiển thị với tài khoản root | `false` |

---

## 2. Thêm Nhóm Con (Group Sub)

Nếu trong 1 Tab lớn `general` có quá nhiều chức năng, bạn có thể phân rã thành nhóm Sub (các Box nhỏ xếp trong lưới màn hình bên phải). 
Sử dụng hàm **`ThemeOption::addGroupSub()`**.

```php
add_action('theme_custom_options', function () {

    // Thêm nhóm Sub 'FOOTER BOTTOM' chui vào bên trong TAB Tên 'general'
    ThemeOption::addGroupSub('general', 'general-bottom', [
        'label' => 'Cấu Hình Footer Dưới Cùng',
        'form'  => function(Form $form) {
            
            // Hàm switch() tạo ra Nút Bật/Tắt công tắc
            $form->switch('footer_bottom_public', [
                'label'   => 'Bật hiển thị footer',
                'start'   => 4,
            ]);

            // Hàm color() tạo ô chọn màu
            $form->color('footer_bottom_bg_color',   ['label' => 'Màu Nền footer v8',  'start' => 4]);
            $form->color('footer_bottom_text_color', ['label' => 'Màu chữ footer', 'start' => 4]);
        }
    ]);

});
```

---

## 3. Thêm Một Trường Lẻ Mới (Add Field) Vào Nhóm Đã Có

Trường hợp bạn không muốn tạo thêm Tab, mà chỉ muốn Bơm thêm 1 vài Ô nhập liệu con vào sẵn các Tab Mặc Định đã thiết kế bởi Core CMS/Theme, hãy sử dụng hàm **`ThemeOption::addField()`**.

```php
// Bơm thêm ô 'Màu khung logo' vào Tab ID là 'header'
ThemeOption::addField('header', 'logo_bg', 'color', [
    'label' => 'Màu khung logo',
    'start' => 4,
]);

// Bơm thêm ô text 'Số lượng Cột' vảo Tab Gốc 'general'
ThemeOption::addField('general', 'column_limit', 'number', [
    'label' => 'Số lượng Cột lưới',
    'default' => 4
]);
```

---

## 4. Ví Dụ Thực Tế — Thêm Option Trong Plugin

Plugin có thể thêm tab option vào Theme Options từ `ServiceProvider::boot()`:

```php
public function boot(): void
{
    add_action('theme_custom_options', function () {

        ThemeOption::addGroup('my-plugin', [
            'position' => 50,
            'label'    => 'My Plugin',
            'icon'     => '<i class="fa-light fa-box"></i>',
            'form'     => function(\SkillDo\Form\Form $form) {
                $form->switch('my_plugin_enabled', [
                    'label' => 'Bật plugin',
                ]);
                $form->number('my_plugin_limit', [
                    'label'   => 'Số sản phẩm/trang',
                    'default' => 12,
                ]);
                $form->color('my_plugin_color', [
                    'label' => 'Màu chủ đạo',
                ]);
            }
        ]);

        ThemeOption::addGroupSub('my-plugin', 'my-plugin-advanced', [
            'label' => 'Nâng cao',
            'form'  => function(\SkillDo\Form\Form $form) {
                $form->textarea('my_plugin_custom_css', [
                    'label' => 'CSS tùy chỉnh',
                ]);
            }
        ]);
    });
}
```

---

## 5. Các Hook Sửa Khung Options Của Core (Dành Cho Viết Plugin)

CMS V8 tạo điều kiện rất lớn cho các Theme Child hoặc các Plugin ghi đè Options Form mà không cần gọi API Code rườm rà, bạn có thể sửa trực tiếp Form Obj thông qua Filter Hooks.

## Hooks Theme Options

| Hook | Type | Mô tả |
|---|---|---|
| `theme_custom_options` | action | Thêm/sửa theme options |
| `theme_option_save` | filter | Chỉnh data trước khi lưu |
| `theme_options_general_form` | filter | Sửa form tab "Cấu hình chung" |
| `theme_options_header_form` | filter | Sửa form tab "Header" |
| `theme_options_footer_form` | filter | Sửa form tab "Footer" |
| `theme_options_footer_bottom_form` | filter | Sửa form tab "Footer Bottom" |
| `theme_options_post_form` | filter | Sửa form tab "Bài viết" |
| `theme_options_post_category_form` | filter | Sửa form tab "Danh mục bài viết" |
| `theme_options_fonts_form` | filter | Sửa form tab "Font style" |
| `theme_option_setup` | action | Sau khi tất cả options đã load |

**Ví dụ ứng dụng Filter Hook sửa Option Header:**

```php
use SkillDo\Form\Form;

add_filter('theme_options_header_form', function(Form $form) {
    // Ép thêm ô chọn logo phụ vào Giao diện Option có sẵn
    $form->image('header_logo_mobile', ['label' => 'Logo hiển thị riêng di động']);
    
    return $form;
});
```

---

## 5. Gọi Data Đã Lưu Dưới Frontend (Views)

Một khi Admin cấu hình và Bấm Nút **"Lưu thay đổi"** ở màn hình Backend Cấu Hình Theme, mọi dữ liệu File, Văn bản, Màu sắc sẽ tự động ghi vào Table `options`.
Để móc lấy Data ra hiển thị ở Front-end Layouts Blade, bạn sử dụng **`Option::get($key, $default)`**.

Ví dụ In cấu hình Màu Theme Color vào Menu thẻ `<style>`:
```php
use SkillDo\Cms\Support\Option;

// Lấy tham số 'theme_color', nếu hệ thống chưa lưu thì lấy mặc định '#000000'
$color = Option::get('theme_color', '#000000');
```

In ra View Blade:
```blade
<div class="footer-area">
    <!-- Gọi trực tiếp Option từ Frontend -->
    <h3>Bản quyền: {{ Option::get('general_label', 'CMS V8') }}</h3>
</div>
```
