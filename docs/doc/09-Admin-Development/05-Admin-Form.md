# Hệ Thống FormAdmin & FormAdminHelper

Trong trang Quản trị, ngoài màn hình Danh sách dạng Table, màn hình **Thêm Mới / Cập Nhật** (Ví dụ: Thêm Sản phẩm, Sửa Bài viết) là cực kỳ quan trọng. 

Thay vì phải tự viết các thẻ `<form>`, `<input>`, `<label>` thủ công bằng HTML, SkillDo CMS v8 trang bị hệ thống **`FormAdmin`** (Builder sinh Form) kết hợp với **`FormAdminHelper`** để quản lý cực kỳ nhàn rỗi. CMS tự động xử lý chia cột, dàn layout HTML, nạp dữ liệu cũ (nếu đang Edit) và thiết lập cơ chế Submit Form qua AJAX mà không cần bạn ngó ngàng tới Backend.

---

## 1. Khởi Tạo Form Bằng Lớp Độc Lập (Form Class) & Hook

Trong phiên bản v8, để tạo một Form cho module (Ví dụ: `products` hoặc `brands`), chuẩn mực nhất là bạn tạo một Class tên `Form` ở thư mục Module, khai báo 2 hàm tĩnh `fields` và `buttons`. Bằng cách này, CMS xây dựng Form dựa qua hệ thống Filter Hook `manage_{module}_input`.

Ví dụ file `Ecommerce\Modules\Admin\Brands\Form.php`:
```php
namespace Ecommerce\Modules\Admin\Brands;

use Ecommerce\Models\Brands;
use SkillDo\Cms\FormAdmin\FormAdmin;
use SkillDo\Cms\Support\Admin;

class Form {
    
    // Khai báo các cột và Input ở đây
    static function fields(FormAdmin $form): FormAdmin {
        
        // Gắn Model liên kết (Để hệ thống tự biết Insert/Update vào Bảng Nào)
        $form->setModel(Brands::class);

        // ... Thêm cấu trúc Cột, Input vào biến $form (xem phần 2)

        return $form;
    }

    // Cấu hình các nút Hành Động (Lưu, Trở Về)
    static function buttons(FormAdmin $form): FormAdmin {
        $buttons = [];
        
        // Nút Lưu
        $buttons[] = Admin::button('save');
        // Nút quay lại trang danh sách
        $buttons[] = Admin::button('back', ['href' => \Url::admin('products/brands')]);

        $form->setButtons($buttons);
        return $form;
    }
}
```

Và ở file Bootstrap của Plugin/App (Tự động nạp khi khởi động hệ thống), bạn móc hàm đó vào Hook tương ứng với tên module (ví dụ module tên `brands`):

```php
// Nạp Form::fields và Form::buttons đổ vào FormAdmin core khi CMS bắt đầu gọi Form 'brands'
add_filter('manage_brands_input', [\Ecommerce\Modules\Admin\Brands\Form::class, 'fields']);
add_filter('manage_brands_input', [\Ecommerce\Modules\Admin\Brands\Form::class, 'buttons']);
```

> **Ghi chú về Nơi đặt Hook:** 
> - Nếu viết trong **Plugin**, bạn nên tạo file quản lý Form ở `plugins/{plugin-name}/app/` và móc Hook (`add_filter` / `add_action`) ở thư mục `plugins/{plugin-name}/bootstrap/`.
> - Nếu viết trong **Theme**, cấu trúc cũng hoàn toàn tương tự, bạn nên tạo class quản lý Form ở `views/{theme-name}/app/` và móc Hook ở thư mục `views/{theme-name}/bootstrap/`.

Tại **Controller**, thay vì lo lắng về View giao diện, bạn yêu cầu hệ thống Render Form (`FormAdminHelper::getForm()`) và in ra Giao diện Template tĩnh là đủ:
```php
public function add(Request $request) {
    // Kích hoạt việc khởi tạo Form cho Module 'brands'
    Cms::setData('form', \Admin\Supports\FormAdminHelper::getForm('brands'));

    return Cms::view('admin.brands.save', [
        'module' => 'brands'
    ]); 
}

public function edit(Request $request, $id) {
    // Query Lấy Dữ liệu Object Cũ
    $object = Brands::find($id);

    Cms::setData('object', $object);

    // Truyền $object vào getForm để Cập nhật các Ô input có dữ liệu sẵn
    Cms::setData('form', \Admin\Supports\FormAdminHelper::getForm('brands', $object));

    return Cms::view('admin.brands.save', [
        'module' => 'brands',
        'object' => $object
    ]); 
}
```

---

## 2. Tổ Chức Form (Locations & Groups)

Giao diện Admin quy chuẩn chia Form thành 2 cột: Trái (To) và Phải (Nhỏ hơn). `FormAdmin` thiết kế các Object "Vị trí" (Locations) và "Nhóm Ô Nhập" (Groups) để bạn đẩy Field vào dễ dàng.

Các Vị trí (Locations) có sẵn:
- `$form->leftTop()`: Nằm cột bên trái, trên cùng. 
- `$form->leftBottom()`: Nằm cột trái, dưới cùng (Thường dùng cho Custom Meta).
- `$form->right()`: Cột nhỏ bên tay Phải màn hình (Thường chứa Ảnh đại diện, SEO, Trạng thái).
- `$form->lang()`: *Khu vực đặc biệt.* Các field bỏ vào đây sẽ Tự Động sinh ra nhiều Tabs Nhập liệu Nếu hệ thống bật Chế độ Web Đa Ngôn Ngữ (Tiếng Việt, Tiếng Anh).

### Cách gọi và đẻ ô Input (Field)

Mỗi vị trí, bạn vẽ một Khối Trắng (Group) và truyền tham số trực tiếp bằng **Magic Methods** dựa theo loại Input: `text`, `image`, `wysiwyg`...

```php
use SkillDo\Validate\Rule;

// 1. Thêm Khối "Thông tin" vào Cột Trái
$form->leftTop()
     ->addGroup('customer_info', 'Thông Tin Khách Hàng') // Tạo Box Trắng tiêu đề
     ->text('fullname', [
         'label'       => 'Họ và tên',
         'placeholder' => 'Nhập tên...',
         'validations' => Rule::make()->notEmpty() // Bắt buộc nhập (Báo đỏ nếu bỏ trống)
     ])
     ->email('email', [
         'label' => 'Địa chỉ Email'
     ])
     ->tel('phone', [
         'label' => 'Số điện thoại'
     ])
     ->wysiwyg('note', [
         'label' => 'Ghi chú (Trình soạn thảo văn bản)'
     ]);

// 2. Thêm Khối "Ảnh & Trạng Thái" vào Cột Phải
$form->right()
     ->addGroup('customer_status', 'Bảo Mật & Ảnh')
     ->image('avatar', [
         'label' => 'Ảnh đại diện'
     ])
     ->select2('status', [1 => 'Đang hoạt động', 0 => 'Tạm khóa'], [
         'label' => 'Trạng thái'
     ]);
```

> **Gợi ý các Magic Method Input Phổ biến:**
> `text()`, `textarea()`, `wysiwyg()` (Trình soạn thảo TinyMCE), `image()` (Mở Quản lý File), `number()`, `email()`, `radio()`, `checkbox()`, `select2()`, `color()`, `datetime()`.

---

## 3. Render Form Ra HTML UI (Blade)

Tại file Giao diện View `admin/brands/save.blade.php`: Thay vì phải code hàng chục `<div class="row">`, `LeftTop`, `Right` và lặp form mất thời gian. Core CMS cung cấp sẵn cấu trúc template Component Partial thần kỳ: `resources/components/page-default/page-save`.

Bạn KHÔNG CẦN viết HTML ngổn ngang, chỉ một dòng Include gọi Partial là Toàn bộ giao diện Form 2 cột, Nút Lưu AJAX, Ngôn ngữ tự động Render ra đầy đủ:

```blade
{!! Admin::partial('resources/components/page-default/page-save', [
    'module'  => $module,                      // Bắt buộc: Chìa khóa để Component tự tìm tới Filter Hook
    'model'   => \Ecommerce\Models\Brands::class, // (Tuỳ chọn: Nếu Class Form chưa dùng setModel)
    'object'  => $object ?? []                 // Bắt buộc: Truyền Data cũ (Hoặc Rỗng nếu là Thêm Mới)
]) !!}
```

---

## 4. Xử Lý Submit CMS (AJAX Save Flow)

Chức năng **Khủng nhất** của System v8 Form Admin là: **Bạn GẦN NHƯ KHÔNG CẦN viết Route POST & Controller Method để nhận dữ liệu Form khi Admin bấm Lưu.** 

CMS v8 giải quyết qua Ajax chung! Trên thanh Top-bar của trang `save.blade.php`, bạn in Nút Lưu dạng AJAX như sau (thường file Blade Header Admin sẽ gom dùm bạn nhưng cơ lý là vậy):

1. File Blade có Nút submit:
```html
<button class="btn btn-green js_btn_save" data-action="save" data-form="#js_customer_form">
    Lưu Khách Hàng
</button>
```
CMS v8 giải quyết tự động việc Lưu/Cập nhật qua chuỗi sự kiện nội bộ `Admin\Ajax\FormAjax::save`. Hệ thống sẽ xác thực Validation tự động và Lưu vào Database theo Model bạn đã set (`$form->setModel()`).

### Tuỳ Biến Form Admin Qua Bảng Event Hooks (Filter / Action)
Nếu Form của bạn cần Validation logic khó (VD: Kiểm tra Biến thể Giá trùng), Mở rộng dữ liệu ngoài Model (VD: Lưu Mảng Pivot Nhóm Danh Mục), CMS v8 cung cấp vô vàn điểm chặn nội bộ tại chu kì AJAX Lưu:

#### 1. Hooks Giai Đoạn Đăng Ký Form Cấu Trúc
| Tên Hook | Loại (Type) | Chức năng (Ý nghĩa) |
|---|---|---|
| `manage_{module}_input` | `Filter` | Đăng ký Class File quản lý form của bạn vào lõi hệ thống. Bắt buộc có khi code thêm plugin Form mới. |
| `admin_form_{module}` | `Filter` | Ghi đè chèn lén/loại bỏ Input Field của Form sinh bởi một Core/Plugin khác. |
| `admin_form_{module}_action_button`| `Filter` | Chuyên biệt chặn lại cái Mảng Nút bấm (Buttons: Save, Back, Trash) lúc gọi Render. |

#### 2. Hooks Giai Đoạn Nhận Data (Trước khi Lưu xuống CSDL)

| Tên Hook | Loại (Type) | Chức năng (Ý nghĩa) |
|---|---|---|
| `admin_form_validation_{add/edit}`| `Filter` | Chặn lại và viết Custom Code check dữ liệu Post. Nếu gán đối tượng Error nó sẽ xuất đỏ và dừng chương trình (Xảy ra trước khi lọc data). |
| `skd_form_process_data` | `Filter` | Cho phép trích xuất hoặc dọn dẹp biến Post, lọc dữ liệu tách ra `$dataOutside` thay đổi cấu trúc Insert Form ngầm. |
| `save_object_before` | `Filter` | Chặn toàn bộ giá trị mảng `$insertData` trước lúc gán `$insertData['language']` (Bắt ngang Model). |
| `check_save_{module}_before` | `Filter` | Kiểm tra logic sau khi đã phân tích `$insertData` xong. Trả về string báo lỗi (thường đặt custom Validator khó ở đây). |

#### 3. Hooks Giai Đoạn LƯU THÀNH CÔNG (Sau CSDL)
Đây là các `add_action` thường dùng nhất để ghi lại Lịch sử log, cập nhật Metavới ID có sẵn, tạo Bảng Pivot con.

| Tên Hook | Loại (Type) | Chức năng (Ý nghĩa) |
|---|---|---|
| `save_object_{add/edit}` | `Action` | Phát tín hiệu lưu Model chung cho tất cả các Module thành công. Sinh tham số: `($id, $module, $request, $insertData, $dataOutside)` |
| `save_{module}_object`| `Action` | Chỉ kích hoạt khi cái module `{module}` thực hiện Add hoặc Edit thành công. Ví dụ `save_brands_object` |
| `save_{module}_object_add`| `Action` | Ngòi nổ đặc biệt riêng rẻ lúc Lần đầu Tạo mới. |
| `save_{module}_object_edit`| `Action`| Ngòi nổ đặc biệt riêng rẽ lúc Bấm nút Cập nhật (Sửa data cũ). |

**Ví dụ Code minh hoạ chèn Hook thêm xử lý sau khi lưu Brand thành công:**
Chỉ việc đặt vào `bootstrap.php` của plugin

```php
// Hook này nổ ngay sau khi row được Insert vào table Brands bằng AJAX Backend.
add_action('save_brands_object', function($inserted_id, $request, $insertData, $dataOutside) {
    if ($request->has('brand_manager_user')) {
        // Viết Custom Code ghi lại quyền User chuyên quản lý Brand với giá trị "$inserted_id"
    }
}, 10, 4);

// Một tuỳ chỉnh validation chặn lúc Save Data sản phẩm (Giống Sicommerce Products)
add_filter('check_save_products_before', function($error, $request, $insertData) {
     if($request->input('price') > $request->input('price_sale')) {
          return new SKD_Error('error', 'Giá bán phải lớn hơn Giá khuyến mãi');
     }
     return $error;
}, 10, 3);
```
