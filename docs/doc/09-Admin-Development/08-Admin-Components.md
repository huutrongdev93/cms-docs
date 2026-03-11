# Giao Diện Cấu Phần Kèm Theo Quản Trị Hệ Thống (Admin UI Components)

Trong môi trường quản trị của SkillDo CMS (Admin Panel), Framework cung cấp rất nhiều lớp (Class Component) để sinh ra nhanh các mã HTML (Nút bấm, Icon, Badge, Bảng điều khiển, Tab) đồng nhất và hiện đại. Việc sử dụng các Component tích hợp trong Core giúp Code của bạn bớt cồng kềnh, chuẩn Responsive và có ngay hiệu ứng xử lý AJAX được làm sẵn.

Dưới đây là tài liệu chi tiết phương pháp sử dụng các UI Components này.

---

## 1. Thành Phần Cơ Bản (Core Admin Helpers)

Tất cả các Helper siêu nhỏ nhưng tần suất sử dụng nhiều nhất đều được đặt trong Object **`SkillDo\Cms\Support\Admin`**.

### 1.1 `Admin::icon(string $action)`
Lấy Icon dạng SVG/Font sắc nét hệ thống đăng ký sẵn theo tên hành động. Đồng đều mọi giao diện.

**Cú pháp:**
```php
$iconAdd = Admin::icon('add');
$iconEdit = Admin::icon('edit');
```
**Các Action tích hợp sẵn:**
- `add`, `add-multiple`: Nút cộng thêm.
- `edit`, `save`: Nút lưu/sửa.
- `delete`, `trash`: Xóa / Thùng rác.
- `back`, `undo`, `reload`, `cancel`, `close`: Các thao tác hủy lùi.
- `search`, `download`, `install`: Tìm kiếm tải về.
- `active`, `off`: Mở tắt chế độ.

### 1.2 `Admin::button(string $template, array $attributes = [])`
Render thẻ Button / Link siêu đẹp, hỗ trợ cả tự động đính Modal và Tooltip (Chú thích khi rê chuột qua).

**Cú pháp:**
```php
echo Admin::button('add', [
    'text' => 'Thêm Sinh Viên',
    'href' => 'admin/add-student', // Sẽ biến thẻ button thành thẻ <a>
]);
```
**Các giá trị Template hỗ trợ:**
Framework sẽ tự bôi màu và đẩy Icon chuẩn vào theo từ khóa:
- `'add'`: Bôi màu xanh lá, kèm Icon Plus.
- `'save'`: Màu xanh dương, class form submit Ajax.
- `'edit'`, `'back'`, `'undo'`: Nút xanh dương nhạt.
- `'trash'`, `'delete'`: Nút đỏ, Cảnh báo xóa.
- `'reload'`: Nút làm mới bảng trắng.

**Hỗ trợ tiện ích nâng cao trong `$attributes`:**
```php
echo Admin::button('custom-color', [
    'text' => 'Mở Form',
    'iconLeft' => Admin::icon('save'),
    'modal' => 'myModalId', // Tự sinh data-bs-toggle="modal"
    'tooltip' => 'Nhấn vào đây để tiếp tục', // Tự nạp Tooltip Bootstrap
    'class' => ['btn-gradient', 'my-3']
]);
```

### 1.3 `Admin::badge(string $template, string $text, array $attributes = [])`
Tạo nhãn Huy hiệu (Badge) để bo tròn trên các bảng dữ liệu (Table) hoặc đánh dấu trạng thái nổi bật.

**Cú pháp:**
```php
// Render Nhãn cảnh báo màu đỏ
echo Admin::badge('danger', 'Chưa thanh toán');

// Nhãn thành công, có Tooltip
echo Admin::badge('success', 'Đã duyệt', [
    'tooltip' => 'Duyệt lúc 12:00PM'
]);
```
**Danh sách màu template tương thích Bootstrap V5**: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`.

### 1.4 `Admin::alert(string $template, string $message, array $args = [])`
Render các bảng cảnh báo/chú ý màu mè (Alert Box). 

**Cú pháp:**
```php
echo Admin::alert('warning', 'Hệ thống đang bảo trì, vui lòng lưu lại công việc!');
```
**Các Template:** `error` (hoặc `danger`), `warning`, `info`, `success`. 
(Framework luôn tự động nhét Icon chấm than, dấu check tương ứng vào Alert để làm nó sinh động).

---

## 2. Thành Phần Khối Cấu Trúc (Module Components)

Nằm ở `\Admin\Supports\Component`, đây là các cấu phần giao diện LỚN, thường được Render để bọc các form dữ liệu, hoặc bảng dữ liệu do Plugin/Theme của bạn phát triển.

### 2.1 Khối Bao Bọc Hệ Thống (`Component::blockSystem`)
Component này đẻ ra Giao diện cài đặt gồm 2 phần: Trái là Khối Tiêu Đề/Chú thích nhỏ. Phải là thẻ Card chứa Form Element bên trong. (Đây chính là UI chuẩn của phần Cấu hình System Hệ Thống).

**Cú pháp:**
```php
use Admin\Supports\Component;
use Admin\Supports\Components\BlockSystem;

echo Component::blockSystem(function (BlockSystem $block) use ($form)
{
    // Cột bên trên/Trái hiển thị thông tin chung
    $block->header('Cấu Hình Nâng Cao')->description('Vui lòng cài đặt thông số cẩn thận');
    
    // Cột Form Dữ Liệu
    $block->content($form); 
    // Mẹo: $form bản chất là object của \SkillDo\Cms\Form\Form, block sẽ tự chạy hàm $form->html() giúp bạn!
});
```

### 2.2 Bảng Dữ Liệu (`Component::table`)
Nhét Dữ Liệu Model List vào để tự sinh bảng table phân trang. (Chủ yếu gọi trong Controllers Index của module).

**Cú pháp:**
```php
// Trả về thẳng Partial View HTML index chuẩn.
return \Admin\Supports\Component::table([
    'data'   => $danhSachSinhVien,
    'module' => 'student',
    'view'   => 'my-plugin::admin.table_body_view' // Đường dẫn vào body plugin
]);
```

### 2.3 Phân Tab Dữ Liệu (`Component::tabs`)
Xây dựng một Thanh Tab Điều hướng trang phụ qua lại (Bootstrap Nav Tabs) có nhớ vị trí trạng thái Active cực dễ sử dụng.
 
**Cú pháp:**
```php
$tabs = [
    'general' => [
        'label'   => 'Cấu hình chung',
        'content' => 'Nội dung HTML 1...',
        'icon'    => '<i class="fa fa-home"></i>'
    ],
    'seo' => [
        'label'   => 'Cấu hình SEO',
        'content' => 'Nội dung HTML 2...',
    ]
];

$activeTab = 'general';

echo \Admin\Supports\Component::tabs($tabs, $activeTab);
```

> **Ghi chú lợi ích Tabs:** Khung Tabs Component của Hệ thống sẽ tự quét Cấu trúc mảng `$tabs` để móc ngoéo `nav-link` tương ứng, và găm Class `active` đúng bằng key tab truyền ở biến `$activeTab`. Rất linh hoạt trong các Module đòi hỏi nhiều form nhập liệu phức tạp.
