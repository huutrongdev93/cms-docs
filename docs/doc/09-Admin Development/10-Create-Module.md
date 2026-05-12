# Tạo Một Module Mới Hoàn Chỉnh

Bài viết này sẽ hướng dẫn bạn từ đầu đến cuối quy trình để tạo thêm một module chức năng (Ví dụ: **Quản Lý Dự Án - Projects**) vào màn hình Admin thông qua Plugin hoặc Theme trong CMS v8.

Quy trình bao gồm các bước cốt lõi:
1. Tạo Model (CSDL)
2. Cấu hình Route
3. Tạo Class Form
4. Tạo Class Table
5. Đăng Ký Menu Admin
6. Tạo Controller
7. Tạo File View (Template Blade)
8. Đăng ký Hooks (Bootstrap)

Ví dụ này minh họa bằng cách viết trong **Plugin**. Nếu bạn code trong **Theme (app/)**, các bước hoàn toàn tương đương cấu trúc.

---

## 1. Tạo Model

Model giúp tương tác với cơ sở dữ liệu (`skilldo_projects`).

*Đường dẫn: `plugins/my-plugin/app/Models/Project.php`*

```php
namespace MyPlugin\Models;

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
<?php
use SkillDo\Support\Facades\Route;

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
use SkillDo\Cms\Support\Language;
use SkillDo\Cms\Support\Url;
use SkillDo\Validate\Rule;

class Form {
    static function fields(FormAdmin $form): FormAdmin {
        $form->setModel(Project::class);

        $form->lang()
             ->addGroup('info', 'Thông Tin Dự Án')
             ->text('title', [
                 'label'       => 'Tên Dự Án',
                 'validations' => [
                     Language::default() => Rule::make()->notEmpty()
                 ]
             ])
             ->wysiwyg('content', ['label' => 'Mô tả']);

        $form->right()
             ->addGroup('media', 'Ảnh đại diện')
             ->image('image', ['label' => 'Upload Hình']);

        return $form;
    }

    static function buttons(FormAdmin $form): FormAdmin {
        $buttons = [];

        if(Admin::isPage('projects_add'))
        {
            $buttons[] = Admin::button('save');
            $buttons[] = Admin::button('back', ['href' => Url::admin('projects')]);
        }

        if(Admin::isPage('projects_edit'))
        {
            $buttons[] = Admin::button('save');
            $buttons[] = Admin::button('add', [
                'href'    => Url::admin('projects/add'),
                'text'    => '',
                'tooltip' => trans('button.add')
            ]);
            $buttons[] = Admin::button('back', [
                'href'    => Url::admin('projects'),
                'text'    => '',
                'tooltip' => trans('button.back')
            ]);
        }

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

// 'manage_projects_input' là tên quy ước chuẩn gồm chữ "manage_" + tên module.
add_filter('manage_projects_input', [Form::class, 'fields']);
add_filter('manage_projects_input', [Form::class, 'buttons']);
```

---

## 4. Khởi Tạo Data Table (Bảng Liệt Kê)

*Đường dẫn: `plugins/my-plugin/app/Modules/Admin/Project/Table.php`*

```php
namespace MyPlugin\Modules\Admin\Project;

use MyPlugin\Models\Project;
use SkillDo\Cms\Form\Form;
use SkillDo\Cms\Support\Admin;
use SkillDo\Cms\Support\Url;
use SkillDo\Cms\Table\Columns\ColumnEdit;
use SkillDo\Cms\Table\Columns\ColumnImage;
use SkillDo\Cms\Table\Columns\ColumnText;
use SkillDo\Cms\Table\SKDObjectTable;
use SkillDo\Database\Eloquent\Builder;
use SkillDo\Http\Request;

class Table extends SKDObjectTable 
{
    protected string $module = 'projects';
    
    protected mixed $model = Project::class;

    function getColumns()
    {
        $this->_column_headers = [];

        $this->_column_headers['cb'] = 'cb';

        $this->_column_headers['image'] = [
            'label'  => 'Ảnh',
            'column' => fn($item, $args) => ColumnImage::make('image', $item, $args)->size(50)
        ];

        $this->_column_headers['title'] = [
            'label'  => 'Tên Dự Án',
            'column' => fn($item, $args) => ColumnText::make('title', $item, $args)->title()
        ];

        $this->_column_headers['order'] = [
            'label'  => trans('table.order'),
            'column' => fn($item, $args) => ColumnEdit::make('order', $item, $args)
        ];

        $this->_column_headers['created'] = [
            'label'  => 'Ngày tạo',
            'column' => fn($item, $args) => ColumnText::make('created', $item, $args)->datetime('d/m/Y')
        ];

        $this->_column_headers['action'] = trans('table.action');

        return apply_filters("manage_projects_columns", $this->_column_headers);
    }

    function actionButton($item, $module, $table): array
    {
        $listButton = [];

        $listButton[] = Admin::button('blue', [
            'href' => Url::admin('projects/edit/'.$item->id),
            'icon' => Admin::icon('edit')
        ]);

        $listButton[] = Admin::btnDelete([
            'id'          => $item->id,
            'model'       => $this->model,
            'module'      => $this->module,
            'description' => trans('admin::message.page.confirmDelete', [
                'title' => html_escape($item->title)
            ])
        ]);

        return apply_filters('admin_projects_table_columns_action', $listButton);
    }

    function headerButton(): array
    {
        $buttons = [];
        $buttons[] = Admin::button('add', ['href' => Url::admin('projects/add')]);
        $buttons[] = Admin::button('reload');
        return $buttons;
    }

    function headerSearch(Form $form, Request $request): Form
    {
        $form->text('keyword', [
            'placeholder' => trans('table.search.keyword').'...'
        ], $request->input('keyword'));

        return $form;
    }

    public function queryFilter(Builder $query, Request $request): Builder
    {
        $keyword = $request->input('keyword');

        if (!empty($keyword))
        {
            $query->where('title', 'like', '%'.$keyword.'%');
        }

        return $query;
    }
    
    public function queryDisplay(Builder $query, Request $request, $data = []): Builder
    {
        $query = parent::queryDisplay($query, $request, $data);

        $query->orderBy('order')->orderBy('created', 'desc');

        return $query;
    }
}
```

### Các loại Column có sẵn

| Column Class | Mô tả | Ví dụ |
|-------------|--------|-------|
| `ColumnText` | Hiển thị text, có hỗ trợ title, datetime, number | `->title()`, `->datetime('d/m/Y')`, `->number()` |
| `ColumnImage` | Hiển thị ảnh thumbnail | `->size(50)`, `->circular()` |
| `ColumnEdit` | Trường editable inline (click để sửa trực tiếp) | `ColumnEdit::make('order', ...)` |
| `ColumnBadge` | Badge trạng thái có màu | `->color($cb)->label($cb)` |
| `ColumnView` | Render custom HTML bằng callback | `->html(function($col) { ... })` |

---

## 5. Đăng Ký Admin Menu

Tạo class chứa logic đăng ký menu:

*Đường dẫn: `plugins/my-plugin/app/Services/AdminService.php`*

```php
namespace MyPlugin\Services;

use SkillDo\Cms\Menu\AdminMenu;

class AdminService
{
    static public function navigation(): void
    {
        AdminMenu::add('projects', 'Quản lý Dự Án', 'projects', [
            'icon'     => '<i class="fa-solid fa-briefcase"></i>',
            'position' => 30
        ]);

        // Submenu (tùy chọn)
        AdminMenu::addSub('projects', 'projects', 'Danh sách', 'projects');
        AdminMenu::addSub('projects', 'projects-add', 'Thêm mới', 'projects/add');
    }
}
```

Đăng ký hook trong bootstrap:
*Đường dẫn: `plugins/my-plugin/bootstrap/projects.php`*

```php
use MyPlugin\Services\AdminService;

add_action('admin_navigation', [AdminService::class, 'navigation']);
```

---

## 6. Khởi Tạo Controller

Lúc này, Mọi logic nặng nề đã được Form và Table gánh vác. Controller chỉ giữ vai trò Giao Bóng (nạp data gán vào CMS).

*Đường dẫn: `plugins/my-plugin/app/Controllers/Admin/ProjectController.php`*

```php
namespace MyPlugin\Controllers\Admin;

use SkillDo\Cms\Controller;
use SkillDo\Cms\Support\Admin;
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

        if(noItems($object)) return Admin::pageNotFound();

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
{!! Admin::partial('resources/page-default/page-index', [
    'name'   => 'Quản lý Dự Án',
    'module' => $module,
    'model'  => \MyPlugin\Models\Project::class,
    'table'  => $table,
]) !!}
```

2. **Trang Thêm/Sửa Form thông tin:**
   *Đường dẫn: `plugins/my-plugin/views/admin/projects/save.blade.php`*
```blade
{!! Admin::partial('resources/page-default/page-save', [
    'module' => $module,
    'model'  => \MyPlugin\Models\Project::class,
    'object' => (isset($object)) ? $object : []
]) !!}
```

---

## 8. Đăng Ký Hooks (Bootstrap)

*Đường dẫn: `plugins/my-plugin/bootstrap/projects.php`*

```php
<?php
use MyPlugin\Modules\Admin\Project\Form;

// Hook Form - 'manage_{module}_input'
add_filter('manage_projects_input', [Form::class, 'fields']);
add_filter('manage_projects_input', [Form::class, 'buttons']);
```

### Các Hooks có sẵn cho Module

| Hook                                 | Type   | Mô tả                          |
|--------------------------------------|--------|--------------------------------|
| `manage_{module}_input`              | filter | Thêm field/button vào form     |
| `insert_data_{module}_before_save`   | filter | Thay đổi data trước khi lưu DB |
| `check_save_{module}_before`         | filter | Validate trước khi save        |
| `save_{module}_object_add`           | action | Sau khi thêm mới thành công    |
| `save_{module}_object_edit`          | action | Sau khi cập nhật thành công    |
| `ajax_trash_{module}_success`        | action | Sau khi chuyển vào thùng rác   |
| `ajax_restore_{module}_success`      | action | Sau khi khôi phục              |
| `ajax_delete_{module}_after_success` | action | Sau khi xóa vĩnh viễn          |
| `manage_{module}_columns`            | filter | Custom cột table               |

🎉 **Xong!**
Bây giờ khi bạn vào Trang quản trị, bấm vào Menu `Quản lý Dự Án`. Table List, Validation Thêm Sửa, Update xuống Cơ Sở Dữ Liệu đều chạy trơn tru mượt mà với những tính năng AJAX tự động của CMS v8. Bảng sẽ tự hiển thị, form tự load dữ liệu ra!
