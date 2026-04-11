# Phân Quyền

> **File Gốc:** `packages/skilldo/cms/src/Support/Role.php`  
> **Kế thừa Module (Collection):** `SkillDo\Cms\Roles\RoleCollection`  
> **Namespace (Core API):** `SkillDo\Cms\Support\Role`  

Hệ thống phân quyền trên SkillDo CMS v8 được xây dựng xoay quanh 2 khái niệm là Hành động cấp quyền (Capabilities) và Chức vụ chứa các quyền hạn (Roles). Mỗi người dùng có thể sở hữu 1 hay nhiều Chức Vụ khác nhau. 

## 1. Nhóm Chức Vụ (Roles)

Để liệt kê, lấy ra cụ thể thông tin, cập nhật, tạo mới hoặc xóa bỏ các chức vụ - ta có thể gọi lớp hỗ trợ (Facade) gốc `Role`. Bất kì thao tác thay đổi nào trên hệ thống này đều sẽ được tự động lưu vĩnh viễn vào trong Option (Cấu hình) Database.

### 1.1 Các Method Tương tác Cơ Bản

Bạn gọi các phương thức tĩnh toàn cục:

#### `Role::all()`
Trả về một mảng chứa toàn bộ các Đối tượng Chức vụ (`SkillDo\Cms\Roles\Role`). Do tính năng này có cấu trúc OOP, bạn có thể loop foreach để tiến hành thao tác gọi hàm `$role_obj->getName()`...
```php
use SkillDo\Cms\Support\Role;

$roles = Role::all();

foreach($roles as $key => $roleObject) 
{
    //Mã chức vụ (ID) thường là một chuỗi định danh duy nhất, ví dụ: 'administrator', 'editor', 'seller'...
    $roleObject->getKey();
    
    //Tên hiển thị của chức vụ, ví dụ: 'Quản trị viên', 'Biên tập viên', 'Người bán hàng'...
    $roleObject->getName();
    
    //Danh sách quyền (capabilities) của chức vụ này, trả về mảng key => true
    $roleObject->getCapabilities();
}
```

#### `Role::get($key)`
Request trực tiếp đến một khóa ID role cụ thể (Ví dụ: `administrator`, `subscriber`) và nhận đối tượng `Role` của ID đó.
```php
use SkillDo\Cms\Support\Role;

$adminRole = Role::get('administrator');

if ($adminRole) 
{
    echo $adminRole->getName(); // Ví dụ: "Quản trị viên"
    
    show_r($adminRole->getCapabilities()); // Ví dụ: ['login_admin' => true, 'edit_post' => true, ...]
} 
else 
{
    echo "Chức vụ không tồn tại.";
}
```
#### `Role::make()->getNames()`
Trả ra một mảng list array mapping giữa `ID Role` => `Tên Hiển Thị (Name)` để bạn dễ dàng làm form Dropdown/Select.
```php
use SkillDo\Cms\Support\Role;
$roleNames = Role::make()->getNames();
// Kết quả trả về sẽ là một mảng dạng:
// [
//     'administrator' => 'Quản trị viên',
//     'editor' => 'Biên tập viên',
//     'seller' => 'Người bán hàng',
//     ... 
// ]
```


### 1.2 Tạo / Sửa / Xóa Chức vụ
Khi plugin của bạn cần tạo ra một chức vụ `Seller` (Người bán) cho Marketplace. Hãy ưu tiên đăng ký vào Database thông qua hook sự kiện kích hoạt plugin.

```php
use SkillDo\Cms\Support\Role;

// Thêm mới chức vụ, cùng với bộ Array mảng chứa các khoá Quyền giới hạn là Value boolean = true
Role::add('seller', 'Người bán hàng', [
    'login_admin' => true,
    'add_product' => true,
    'edit_product' => true
]);

```

| Method                             | Mô tả & Cách dùng                                                                                                                                |
|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `Role::add($key, $name, $caps)`    | Tạo chức vụ mới nếu `key` chưa tồn tại. Gắn mảng Permission mặc định nếu có.                                                                     |
| `Role::update($key, $name, $caps)` | Cập nhật Tên (`name` hiển thị) của `key` và đè lại quyền (`caps`) hiện tại. Lưu ý: Mảng capabilities được cấp sẽ chép đè list Quyền mặc định cũ. |
| `Role::remove($key)`               | Xóa vĩnh viễn nhóm quyền này khỏi hệ thống. `Role::remove('seller');`                                                                            |

---

## 2. Capabilities / Permissions

Mỗi chức vụ hoặc trên từng cá nhân User có thể sở hữu một bộ danh sách Khả năng thao tác trong hệ thống (gọi tắt là Capability).
Các key thông thường bao gồm: `loggin_admin`, `edit_post`, `add_user`, .v.v...

Tương tự trên Class `Role`, bạn có thể lấy và thao tác riêng biệt các Quyền này gộp chung / hoặc tháo gỡ khỏi 1 chức vụ như sau:

| Method                             | Mô tả & Cách dùng                                                                                                      |
|------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `Role::addCap($role_key, $cap)`    | Gắn khả năng (quyền) `$cap` vào nhóm chức vụ `$role_key`. `Role::addCap('seller', 'delete_product');`              |
| `Role::removeCap($role_key, $cap)` | Tháo, Gỡ bỏ khả năng thao tác `$cap` khỏi nhóm chức vụ `$role_key`. `Role::removeCap('seller', 'delete_product');` |

Nếu bạn đã có thẳng 1 đối tượng Object `Role`, bạn cũng có thể tự gọi method trực tiếp thay vì chui qua Facade:

```php
$myRole = Role::get('administrator');

// Lấy danh sách Full quyền đang có của chức vụ dưới dạng mảng key => true
$allCaps = $myRole->getCapabilities();

// Kiểm tra chức vụ này có quyền cụ thể nào không
if ($myRole->has('edit_theme')) { 
    // Người này có khả năng Edit Theme
}

// Bổ sung hoặc tháo gỡ trực tiếp
$myRole->add('delete_theme');
$myRole->remove('delete_theme'); 
```

---

## 3. Cách thêm Nhóm Quyền và Danh Sách Quyền trong Plugin

Trên giao diện CMS UI Quản lý & cấu hình Role (Chức năng `Phân Quyền User`), các chức quyền thường được gom lại riêng biệt thành Từng Module Tab như: `Bài viết`, `Sản phẩm`, `Đơn hàng`. Lõi hệ thống dùng một trình Builder để render View quản lý thông qua hai sự kiện Hooks hệ thống là `user_role_editor_label` và `user_role_editor_group`.

Để code chuẩn mực, dễ bảo trì và làm việc theo hướng đối tượng (OOP), trong Plugin bạn nên tạo ra một file Service chuyên quản lý Label và Group phân quyền, thay vì tạo các function ẩn (Closure) trực tiếp vào Hook.

### Bước 1: Tạo Service Quản Lý Quyền (Role Service)
Ví dụ bạn đang làm Plugin `MyBooking`, hãy tạo file `app/Services/RoleService.php` như sau:

```php
<?php
namespace MyBooking\Services;

class RoleService
{
    // Cấu trúc khai báo Group (Tab hiển thị)
    static public function group($group)
    {
        $group['booking'] = [
            'label' => 'Quản lý Đặt lịch',
            // Hàm array_keys sẽ trích xuất ra array ['booking_list', 'booking_add',...]
            'capabilities' => array_keys(static::capabilities()) 
        ];

        return $group;
    }

    // Cấu trúc khai báo Label Mapping (Gán Tên cho Quyền)
    static function label($label): array
    {
        return array_merge($label, static::capabilities());
    }

    // Danh sách các khóa phân quyền (Capability keys)
    static function capabilities(): array
    {
        $label['booking_list']      = 'Quản lý Đặt lịch';
        $label['booking_add']       = 'Thêm Đặt lịch';
        $label['booking_edit']      = 'Cập nhật Đặt lịch';
        $label['booking_delete']    = 'Xóa Đặt lịch';
        
        return $label;
    }
}
```

*Bạn có thể tách hàm `capabilities()` ra nhiều hàm nhỏ hơn nếu plugin của bạn có cực kỳ nhiều Module (như: Đơn hàng, Sản phẩm, Khách hàng...) sau đó merge lại tại hàm `group` và `label`.*

### Bước 2: Kích hoạt Hooks trong Plugin Bootstrap
Trong file cấu hình boot của Plugin (thường đặt ở `bootstrap/config.php` hoặc trong `index.php`), tiến hành đăng ký Class phương thức Service của bạn vào hệ thống Event Filter.

```php
<?php
use MyBooking\Services\RoleService;

// Gắn Filter tạo Nhóm và Checkbox vào màn hình Phân Quyền
add_filter('user_role_editor_group', [RoleService::class, 'group']);

// Gắn Filter gán tên (Label) hiển thị cho các Key Capability vào CMS
add_filter('user_role_editor_label', [RoleService::class, 'label']);
```

Sau khi hoàn tất, mỗi khi khởi động, Hệ thống sẽ tự Build giao diện "Phân quyền User" gồm tab "Quản lý Đặt lịch" với các Checkbox tương ứng. Từng giá trị lưu hoặc update từ View sẽ tự động Map với logic Database Capabilities thông minh mà không cần bạn phải tự viết Controller Update Handler!
