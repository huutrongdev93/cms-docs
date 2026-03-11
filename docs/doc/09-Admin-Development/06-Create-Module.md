# Hướng Dẫn Kéo Sợi: Tạo Một Module Mới Hoàn Chỉnh (Plugin / Theme)

Bài viết này sẽ hướng dẫn bạn từ đầu đến cuối quy trình để tạo thêm một module chức năng (Ví dụ: **Quản Lý Dự Án - Projects**) vào màn hình Admin thông qua Plugin hoặc Theme trong CMS v8.

Quy trình bao gồm các bước cốt lõi:
1. Tạo Model (CSDL)
2. Cấu hình Route
3. Tạo Class Form
4. Tạo Class Table
5. Tạo Controller
6. Tạo File View (Template Blade)
7. Đăng ký Menu Admin

Ví dụ này minh họa bằng cách viết trong **Plugin**. Nếu bạn code trong **Theme (app/)**, các bước hoàn toàn tương đương cấu trúc.

---

## 1. Tạo Model

Model giúp tương tác với cơ sở dữ liệu (`skilldo_projects`).

*Đường dẫn: `plugins/my-plugin/app/Models/Project.php`*

```php
namespace MyPlugin\Models;

use SkillDo\Database\DB;
use SkillDo\Database\Eloquent\Builder;

class Project extends \SkillDo\Cms\Models\Model
{
    protected string $table = 'projects';

    protected string $primaryKey = 'id';
}
```

---

## 2. Tạo File Routing cho Admin

Bạn khai báo Route riêng trỏ vào Controller chuẩn của module.

*Đường dẫn: `plugins/my-plugin/routes/admin.php`*

```php
Route::middleware('auth:admin')->prefix('admin/projects')->group(function() {
    $controller = \MyPlugin\Controllers\Admin\ProjectController::class;
    
    // Trang danh sách Table
    Route::match(['get','post'], '/', $controller.'@index')->name('admin.projects.index');
    
    // Trang thêm mới Form
    Route::match(['get','post'], '/add', $controller.'@add')->name('admin.projects.add');
    
    // Trang sửa Form
    Route::match(['get','post'], '/edit/{id}', $controller.'@edit')->where('id', '[0-9]+')->name('admin.projects.edit');
});
```

*(Lưu ý: CMS v8 tự động quét file `routes/admin.php` trong thư mục `routes` của từng plugin).*

---

## 3. Khởi Tạo Form (Form & Hook)

CMS v8 cần bạn tách việc Định Nghĩa Các Cột của form Update/Save ra class riêng.

*Đường dẫn: `plugins/my-plugin/app/Modules/Admin/Project/Form.php`*

```php
namespace MyPlugin\Modules\Admin\Project;

use MyPlugin\Models\Project;
use SkillDo\Cms\FormAdmin\FormAdmin;
use SkillDo\Cms\Support\Admin;
use SkillDo\Cms\Support\Url;

class Form {
    static function fields(FormAdmin $form): FormAdmin {
        $form->setModel(Project::class);

        $form->lang()
             ->addGroup('info', 'Thông Tin Dự Án')
             ->text('title', [
                 'label'       => 'Tên Dự Án',
                 'validations' => \SkillDo\Validate\Rule::make()->notEmpty()
             ])
             ->wysiwyg('content', ['label' => 'Mô tả']);

        $form->right()
             ->addGroup('media', 'Ảnh đại diện')
             ->image('image', ['label' => 'Upload Hình']);

        return $form;
    }

    static function buttons(FormAdmin $form): FormAdmin {
        $buttons = [];
        $buttons[] = Admin::button('save');
        $buttons[] = Admin::button('back', ['href' => Url::admin('projects')]);
        
        $form->setButtons($buttons);
        return $form;
    }
}
```

**Đăng ký Hook kích hoạt Form:**
*Đường dẫn: `plugins/my-plugin/bootstrap.php` (hoặc `bootstrap/projects.php`)*
```php
<?php
use MyPlugin\Modules\Admin\Project\Form;

// 'manage_projects_input' là tên quy ước chuẩn gồm chữ "manage_" + tên folder đăng ký Form.
add_filter('manage_projects_input', [Form::class, 'fields']);
add_filter('manage_projects_input', [Form::class, 'buttons']);
```

---

## 4. Khởi Tạo Data Table (Bảng Liệt Kê)

*Đường dẫn: `plugins/my-plugin/app/Modules/Admin/Project/Table.php`*

```php
namespace MyPlugin\Modules\Admin\Project;

use SkillDo\Cms\Table\SKDObjectTable;
use SkillDo\Cms\Table\Columns\ColumnText;
use SkillDo\Cms\Table\Columns\ColumnImage;

class Table extends SKDObjectTable {
    protected string $module = 'projects';

    protected function get_columns(): array {
        return [
            'image' => [
                'label'  => 'Ảnh',
                'column' => fn($item, $args) => ColumnImage::make('image', $item, $args)->size(50)->circular()
            ],
            'title' => [
                'label'  => 'Tên Dự Án',
                'column' => fn($item, $args) => ColumnText::make('title', $item, $args)->title()
            ],
            'created' => [
                'label'  => 'Ngày tạo',
                'column' => fn($item, $args) => ColumnText::make('created', $item, $args)->datetime('d/m/Y')
            ],
        ];
    }
    
    public function queryDisplay(\SkillDo\Database\Eloquent\Builder $query): \SkillDo\Database\Eloquent\Builder {
        return $query->orderBy('created', 'desc');
    }
}
```

---

## 5. Đăng Ký Admin Menu 

Để Menu trỏ vào đúng Controller của Bảng Vừa tạo. Viết logic móc ở Bootstrap:
*Có thể viết ở `plugins/my-plugin/bootstrap.php`*

```php
use SkillDo\Cms\Menu\AdminMenu;

add_action('admin_menu_add_menu', function () {
    AdminMenu::add('projects', 'Quản lý Dự Án', 'projects', [
        'callback' => 'MyPlugin\Controllers\Admin\ProjectController',
        'icon'     => '<i class="fa-solid fa-briefcase"></i>',
        'position' => 3
    ]);
});
```

---

## 6. Khởi Tạo Controller

Lúc này, Mọi logic nặng nề đã được Form và Table gánh vác. Controller chỉ giữ vai trò Giao Bóng (nạp data gán vào CMS).

*Đường dẫn: `plugins/my-plugin/app/Controllers/Admin/ProjectController.php`*

```php
namespace MyPlugin\Controllers\Admin;

use SkillDo\Cms\Controller;
use SkillDo\Cms\Support\Cms;
use SkillDo\Http\Request;
use MyPlugin\Modules\Admin\Project\Table;
use Admin\Supports\FormAdminHelper;
use MyPlugin\Models\Project;

class ProjectController extends Controller {

    function __construct() {
        parent::__construct();
        Cms::setData('module', 'projects'); // Thiết lập tên module chuẩn hóa
    }

    public function index(Request $request) {
        // Render Bảng Danh Sách
        Cms::setData('table', new Table());
        return Cms::view('my-plugin::admin/projects/index');
    }

    public function add(Request $request) {
        // Nạp Object Form "trống" khi Tạo Mới
        Cms::setData('form', FormAdminHelper::getForm('projects'));
        return Cms::view('my-plugin::admin/projects/save');
    }

    public function edit(Request $request, $id = '') {
        // Truy vấn dữ liệu Object cũ và đẩy vào FormAdminHelper
        $object = Project::find($id);

        if(noItems($object)) return \SkillDo\Cms\Support\Admin::pageNotFound();

        Cms::setData('object', $object);
        Cms::setData('form', FormAdminHelper::getForm('projects', $object));

        return Cms::view('my-plugin::admin/projects/save');
    }
}
```

---

## 7. Khởi Tạo File Views

Cuối cùng, Render mọi thứ bằng Layout View siêu tinh gọn:

1. **Trang index bảng danh sách:**
*Đường dẫn: `plugins/my-plugin/views/admin/projects/index.blade.php`*
```blade
{!! Admin::partial('resources/components/page-default/page-index', [
    'module'  => $module,
]) !!}
```

2. **Trang Thêm/Sửa Form thông tin:**
*Đường dẫn: `plugins/my-plugin/views/admin/projects/save.blade.php`*
```blade
{!! Admin::partial('resources/components/page-default/page-save', [
    'module'  => $module,
    'model'   => \MyPlugin\Models\Project::class,
    'object'  => $object ?? []
]) !!}
```

🎉 **Xong!** 
Bây giờ khi bạn vào Trang quản trị, bấm vào Menu `Quản lý Dự Án`. Table List, Validation Thêm Sửa, Update xuống Cơ Sở Dữ Liệu đều chạy trơn tru mượt mà với những tính năng AJAX tự động của CMS v8. Bảng sẽ tự hiển thị, form tự load dữ liệu ra!
