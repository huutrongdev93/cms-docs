# Bảng Dữ Liệu Quản Trị (Data Tables / SKDObjectTable)

Trong trang quản trị, tác vụ phổ biến nhất là hiển thị danh sách dữ liệu dưới dạng một Bảng (Table). Bảng này đòi hỏi phải có các tính năng phức tạp như:
- Phân trang (Pagination)
- Tìm kiếm (Search)
- Sắp xếp (Sort)
- Hành động hàng loạt (Bulk Actions: Xóa nhiều, Đổi trạng thái nhiều)
- Filter dữ liệu theo danh mục/ngày tháng.

Thay vì phải tự viết HTML `<table>` lặp đi lặp lại hàng trăm lần, SkillDo CMS v8 cung cấp **Module `SkillDo\Cms\Table\SKDObjectTable`**. Kế thừa class này cho phép tạo ra một bảng dữ liệu quản trị chuẩn theo format chung cực kỳ hiện đại.

---

## 1. Cấu Trúc Cơ Bản Của Một Table Class

Để tạo một bảng dữ liệu, bạn tạo ra một file class kế thừa `SKDObjectTable` (thường đặt trong thư mục `Tables/` của Plugin hoặc module).

Ví dụ tạo Bảng quản lý Danh sách Khách Hàng:

```php
namespace App\Tables;

use SkillDo\Cms\Table\SKDObjectTable;
use App\Models\Customer;
use SkillDo\Cms\Table\Columns\ColumnText;
use SkillDo\Cms\Table\Columns\ColumnBadge;

class CustomerTable extends SKDObjectTable {

    // 1. Tên module (Dùng cho URL định tuyến và phân quyền cơ bản)
    protected string $module = 'customers';
    
    // 2. Class Model tương tác csdl
    protected mixed $model = Customer::class;

    // 3. Khai báo các Cột (Columns) sẽ hiển thị ở hàm getColumns
    public function getColumns() {
        return [
            'cb'     => 'cb',        // Checkbox để chọn dòng (Bắt buộc nếu có Bulk Action)
            'name'   => [
                'label'  => 'Họ và Tên',
                'column' => fn($item, $args) => ColumnText::make('name', $item, $args)->title()
            ],
            'email'  => [
                'label'  => 'Email',
                'column' => fn($item, $args) => ColumnText::make('email', $item, $args)
            ],
            'status' => [
                'label'  => 'Trạng thái',
                // Tùy biến hiển thị Badge màu theo trạng thái
                'column' => fn($item, $args) => ColumnBadge::make('status', $item, $args)
                                ->color(fn($status) => $status == 1 ? 'success' : 'secondary')
                                ->label(fn($status) => $status == 1 ? 'Đang hoạt động' : 'Bị khóa')
            ],
            'action' => 'Hành động', // Cột chứa các nút Sửa/Xóa. Nó sẽ tự gọi hàm actionButton() của bạn.
        ];
    }
}
```
*CMS v8 sử dụng các Class Component hiển thị Cột mạnh mẽ như: `ColumnText`, `ColumnBadge`, `ColumnImage`, `ColumnView`*

---

## 2. Các Lớp Cột Tiêu Chuẩn (Column Components)

SkillDo CMS v8 quản lý từng ô dữ liệu bằng các Object Column chuyên biệt (trong thư mục `SkillDo\Cms\Table\Columns`). Tất cả Cột đều kế thừa `SKDColumn` và khởi tạo bằng cú pháp tĩnh `make($name, $item, $args)`.

### 1. `ColumnText`
Dùng để hiển thị văn bản thuần, tiêu đề hoặc định dạng ngày tháng, số lượng.
```php
use SkillDo\Cms\Table\Columns\ColumnText;

// 1. Văn bản thông thường
'email' => [
    'label'  => 'Email',
    'column' => fn($item, $args) => ColumnText::make('email', $item, $args)
                 ->value(fn($item) => $item->email) // Thay đổi giá trị tùy chọn (Nếu cột khác name)
]

// 2. Định dạng ngày tháng
'created' => [
    'label'  => 'Ngày tạo',
    'column' => fn($item, $args) => ColumnText::make('created', $item, $args)
                 ->datetime('d/m/Y H:i') // Tự động format Timestamp/Datetime string
                 ->color('primary')      // Màu chữ theo System Color
]

// 3. Làm tiêu đề chính (Có xử lý giao diện lớn hơn)
'name' => [
    'label'  => 'Tiêu đề',
    'column' => fn($item, $args) => ColumnText::make('name', $item, $args)
                 ->title() 
                 ->description(fn($item) => 'ID: ' . $item->id) // Dòng mô tả nhỏ ở dưới chữ
]

// 4. Số học 
'price' => [
    'label'  => 'Giá Tiền',
    'column' => fn($item, $args) => ColumnText::make('price', $item, $args)->number()
]
```

### 2. `ColumnBadge`
Dùng để in ra nhãn trạng thái có màu sắc phân biệt. Trả về thẻ `<span class="badge">`.
```php
use SkillDo\Cms\Table\Columns\ColumnBadge;

'status' => [
    'label'  => 'Trạng thái',
    'column' => fn($item, $args) => ColumnBadge::make('status', $item, $args)
                 ->color(fn($status) => $status == 1 ? 'success' : 'danger') // Lấy màu Bootstrap (bg-success)
                 ->label(fn($status) => $status == 1 ? 'Hiển thị' : 'Khóa')
                 ->attributes(['data-id' => $item->id]) // Thêm Attr bất kỳ vào thẻ HTML
]
```

### 3. `ColumnImage`
Dùng để hiển thị hình ảnh đại diện (Thumbnails) từ File Manager.
```php
use SkillDo\Cms\Table\Columns\ColumnImage;

'image' => [
    'label'  => 'Ảnh đại diện',
    'column' => fn($item, $args) => ColumnImage::make('image', $item, $args)
                 ->size(40)     // Đặt fix kích thước (width = 40px, height = 40px)
                 ->circular()   // Đổi ảnh thành hình tròn (Bo viền)
                 // ->width(40)->height(40) // Hoặc set chiều cao rộng riêng biệt
                 // ->link('https://domain.com') // Chỉ định tạo thẻ a bọc ngoài
]
```

### 4. `ColumnCheckbox`
Dùng để tạo ô Checkbox thay đổi Trạng Thái tắt/bật (Toggle/Boolean) trực tiếp. 
```php
use SkillDo\Cms\Table\Columns\ColumnCheckbox;

'public' => [
    'label'  => 'Kích hoạt',
    'column' => fn($item, $args) => ColumnCheckbox::make('public', $item, $args)
]
```
*(Lưu ý cốt lõi: Khi bạn in bằng ColumnCheckbox, mã JS mặc định của CMS tự động áp thẻ `<input class="up-boolean">` và sẽ gửi AJAX lưu trực tiếp xuống Database vào field `'public'` cho Module tương ứng mà bạn không cần Code tay API).*

### 5. `ColumnEdit`
Phục vụ tính năng Quick Edit/In-Place Editing. Cho phép Click chữ biến thành Ô Input nhỏ để thay đổi cực nhanh cấu hình bằng AJAX. Thường dùng nhất cho cột `order` (Số thứ tự sắp xếp).
```php
use SkillDo\Cms\Table\Columns\ColumnEdit;

'order' => [
    'label'  => 'Thứ tự',
    'column' => fn($item, $args) => ColumnEdit::make('order', $item, $args)
                 ->class('edittable-dl-text') // Lớp CSS ngầm chỉ định X-editable 
                 ->isEdit(fn() => \SkillDo\Support\Auth::hasCap('product_edit')) // Kiểm tra Quyền user trước khi bật cho Sửa
]
```

### 6. `ColumnView`
Cột phức tạp, hỗ trợ tuỳ ý viết mã sinh HTML tùy tiện vì các Cột trên không phù hợp logic của bạn. Rất hữu khi cần in mảng Dữ Liệu có Quan Hệ (Relation).
```php
use SkillDo\Cms\Table\Columns\ColumnView;
use SkillDo\Cms\Support\Url;

'categories' => [
    'label'  => 'Chuyên mục',
    'column' => fn($item, $args) => ColumnView::make('categories', $item, $args)
                ->html(function(ColumnView $column) {
                    // $column->item là Object Model dòng hiện tại
                    $str = '';
                    foreach ($column->item->categories as $value) {
                         $str .= sprintf('<a href="%s">%s</a>, ', Url::admin('category/edit/'.$value->id), $value->name);
                    }
                    echo rtrim($str, ', '); // In thẳng ra buffer
                })
]
```

---

## 3. Xử Lý Truy Vấn Dữ Liệu (Query)

SKDObjectTable cung cấp 2 phương thức rõ ràng cho vòng đời lấy dữ liệu từ Model:
- `queryFilter` (Chuyên đón Request để gắn lệnh Filter Lọc theo mong muốn).
- `queryDisplay` (Chuyên đón kết quả để sắp xếp, chọn data).

```php
use SkillDo\Database\Eloquent\Builder;
use SkillDo\Http\Request;

class CustomerTable extends SKDObjectTable {
    // ...

    // Hàm xử lý việc lọc dữ liệu theo Request (Search, bộ lọc)
    public function queryFilter(Builder $query, Request $request): Builder {
        $keyword = $request->input('keyword');
        $status  = $request->input('status');

        if (!empty($keyword)) {
            $query->where('name', 'like', '%' . $keyword . '%');
        }
        
        if (is_numeric($status)) {
            $query->where('status', $status);
        }

        return $query;
    }

    // Hàm format Query để chọn field và sắp xếp cuối cùng
    public function queryDisplay(Builder $query, Request $request, $data = []): Builder {
        $query = parent::queryDisplay($query, $request, $data);
        
        $query->orderBy('created', 'desc');

        return $query;
    }
}
```

---

## 4. Custom Hành Động Từng Row (Action Buttons)

Thay vì ghi đè hàm `column_{name}` nguyên khối HTML thô sơ, CMS v8 có method `actionButton` chuyên dụng trả về mảng Các Nút Bấm thao tác ở hàng. Class Helper `Admin` có sẵn các component hỗ trợ nhúng dễ dàng.

```php
use SkillDo\Cms\Support\Admin;

public function actionButton($item, $module, $table): array
{
    $urlEdit = \SkillDo\Cms\Support\Url::admin($module . '/edit/' . $item->id);
    
    $buttons = [];
    
    // Nút Edit Update
    $buttons['edit'] = Admin::button('blue', [
        'href'    => $urlEdit,
        'icon'    => Admin::icon('edit'),
        'tooltip' => 'Cập nhật'
    ]);
    
    // Nút Xóa Record
    $buttons['delete'] = Admin::btnDelete([
        'id'          => $item->id,
        'model'       => $this->model,
        'module'      => $this->module,
        'description' => 'Xóa tài khoản ' . html_escape($item->name)
    ]);

    return $buttons;
}
```

---

## 5. Thêm Bộ Lọc Dữ Liệu (Filters Data) & Nút Tiện Ích Ở Header

Góc phải bảng có Box Tìm Kiếm, và tiện ích chọn (Dropdown Filter). Ở v8, bạn dùng đối tượng `SkillDo\Cms\Form\Form` để vẽ các thẻ Input/Select. Các nút như: Tải lại, Trở Lại cũng được tùy biến với `headerButton()`.

```php
use SkillDo\Cms\Form\Form;
use SkillDo\Http\Request;

// Hàm in các nút Select Lọc tùy chỉnh cạnh thanh Tìm kiếm
public function headerFilter(Form $form, Request $request) {
    
    $form->select('status', [
        ''   => '-- Tất cả trạng thái --', 
        '1'  => 'Đang hoạt động', 
        '0'  => 'Bị khóa'
    ], $request->input('status'));
    
    return $form;
}

// Thay đổi Box Search văn bản (Nếu thích placeholder khác)
public function headerSearch(Form $form, Request $request): Form {
    $form->text('keyword', ['placeholder' => 'Tìm theo Họ Tên...'], $request->input('keyword'));
    return $form;
}

// Chỉnh các Nút góc trên bảng (Add New, Reload)
public function headerButton(): array {
    return [
       'add'    => Admin::button('add', ['href' => \SkillDo\Cms\Support\Url::admin('customers/add')]),
       'reload' => Admin::button('reload')
    ];
}
```

---

## 6. Hành Động Hàng Loạt (Bulk Actions)

Khi bạn chọn cùng lúc nhiều checkbox và muốn chạy lệnh chung "Xóa tất cả", hệ thống đã hỗ trợ hàm `bulkAction()` nhận một mảng cấu trúc các hành động:

```php
public function bulkAction(): array {
    $actionList = [];

    // CMS sẽ tự gọi class `js_btn_confirm` để bật popup, gởi Ajax với Data tới `data-ajax`
    $actionList['delete'] = [
        'icon'  => Admin::icon('delete'),
        'label' => 'Bỏ vào thùng rác',
        'class' => 'js_btn_confirm',
        'attributes' => [
            'data-action'      => 'delete',
            'data-ajax'        => 'Ajax_Admin_Action::delete', // Server-side function xử lý
            'data-module'      => $this->module,
            'data-model'       => $this->model,
            'data-heading'     => 'Xóa dữ liệu',
            'data-description' => 'Bạn chắc chắn muốn xóa tất cả?'
        ]
    ];

    return $actionList;
}
```

---

## 7. Đổ Dữ Liệu Bảng Ra Giao Diện View (Blade)

Sau khi thiết kế xong class Table, ở **Controller Của Bạn**, thực hiện việc khởi tạo Table và gọi qua view `Blade`.

File `CustomerController.php`:
```php
namespace App\Controllers\Admin;

use App\Tables\CustomerTable;

class CustomerController {

    public function index() {
        
        $table = new CustomerTable();
        
        // Trả Đối tượng Table ra view
        return view('admin.customers.index', [
             'table' => $table
        ]);
    }
}
```

Tại Blade View Admin `admin/customers/index.blade.php`:

```html
<div class="col-md-12">
    <div class="box">
        <div class="box-content">
            <!-- Sử dụng phương thức chuyên dụng display() -->
            {!! $table->display() !!}
        </div>
    </div>
</div>
```

**Hoàn tất!** Phiên bản SkillDo CMS v8 sử dụng các Column Classes như `ColumnText`, `ColumnBadge`, kết hợp Class `Admin::button()`, và phân rẽ mạch lạc các method `queryFilter`, `headerFilter`, giúp code của Bảng sạch sẽ và chuẩn hóa hướng đối tượng hơn bao giờ hết. Trang quản lý cũng mượt mà, nhiều option tự động.
