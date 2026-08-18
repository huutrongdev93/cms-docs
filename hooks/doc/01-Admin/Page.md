### Trang danh sách page

> **Thay đổi ở v8:** ba hook `admin_page_controllers_index_args_before_count`, `admin_page_controllers_index_args` và `admin_page_controllers_index_objects` **đã bị gỡ bỏ**. Chúng nhận biến `Qr` — lớp này không còn tồn tại ở v8 (đã chuyển hoàn toàn sang Eloquent Query Builder).

Muốn can thiệp điều kiện lấy danh sách page, hãy override phương thức `queryFilter()` trong lớp Table của module:

```php
use SkillDo\Database\Eloquent\Builder;
use SkillDo\Http\Request;

public function queryFilter(Builder $query, Request $request): Builder
{
    return $query;
}
```

#### Table buttons bulk
Tạo ra danh sách buttons bulk, là những button khi người dùng chọn nhiều row trên table

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('table_page_bulk_action_buttons', array $buttons);
```
**Params**:
* _$buttons (array)_ : danh sách buttton

**Return**: $buttons

```php
function my_custom_admin_page_bulk_action_buttons($buttons): array
{
    $actionList['pageDelete'] = [
        'icon' => Admin::icon('delete'),
        'label' => trans('page.bulkAction.del.label'),
        'class' => 'js_btn_confirm',
        'attributes' => [
            'data-action' => 'delete',
            'data-ajax' => 'Cms_Ajax_Action::delete',
            'data-module' => 'page',
            'data-trash' => $trashEnable,
            'data-heading' => trans('page.bulkAction.del.heading'),
            'data-description' => trans('page.bulkAction.del.description'),
        ]
    ];
            
    return $buttons;
}
add_filter('table_page_bulk_action_buttons', 'my_custom_admin_page_bulk_action_buttons', 10);
```


#### Table header buttons
Tạo ra danh sách buttons trên table, là những button nằm ở header table phía tay phải

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('table_page_header_buttons', array $buttons);
```
**Params**:
* _$buttons (array)_ : danh sách buttton

**Return**: $buttons

```php
function my_custom_admin_page_table_header_buttons($buttons): array
{
    $buttons['reload'] = Admin::button('reload');
            
    return $buttons;
}
add_filter('table_page_header_buttons', 'my_custom_admin_page_table_header_buttons', 10);
```



#### Table columns
Chỉnh sữa danh sách table column của page

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$this->_column_headers = apply_filters("manage_pages_columns", array $columnHeaders);
```
**Params**:
* _$columnHeaders (array)_ : danh sách column

**Return**: $columnHeaders

```php
function my_custom_admin_page_table_columns($columnHeaders): array
{
    $columnHeaders['image'] = [
        'label'  => 'Hình ảnh',
        'column' => fn ($item, $args) => ColumnImage::make('image', $item, $args),
    ];
            
    return $columnHeaders;
}
add_filter('manage_pages_columns', 'my_custom_admin_page_table_columns');
```

#### Table columns action
Tạo ra danh sách buttons cho column action

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('admin_page_table_columns_action', array $buttons, $item);
```
**Params**:
* _$buttons (array)_ : danh sách buttton
* _$item (object)_ : đối tượng page của column hiện tại

**Return**: $buttons

```php
function my_custom_admin_page_table_column_action_buttons($buttons, $item): array
{
    return $buttons;
}
add_filter('admin_page_table_columns_action', 'my_custom_admin_page_table_column_action_buttons', 10, 2);
```

### Thêm & Câp nhật page

#### Form fields
Thay đổi các group, các field trong form `add` và `edit` page

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
$adminForm = apply_filters("manage_page_input", AdminFrom $adminForm);
```
**Params**:
* _$adminForm (AdminFrom)_ : một đối tượng AdminFrom

**Return**: $adminForm

```php
function my_custom_admin_page_form(AdminFrom $adminForm): array
{
    $adminForm->right
        ->group('seo')
        ->addField('meta', 'text', ['label' => 'Thẻ meta'])
                
    return $adminForm;
}
add_filter('manage_page_input', 'my_custom_admin_page_table_column_action_buttons', 10, 2);
```

#### Thêm page thành công
Giúp bạn thực hiện một hành động sau khi thêm page thành công

| **Loại Hook**                                    | **Platform** |                                   **Version** |
|--------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">do_action</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
do_action('save_page_object_add', $id, SkillDo\Http\Request $request);
```
**Params**:
* _$id (int)_ : id của page vừa thêm thành công
* _$request (Request)_ : đối tượng request

```php
function my_custom_admin_add_page_success($id, SkillDo\Http\Request $request) : void
{
    //to do...
}
add_action('save_page_object_add', 'my_custom_admin_add_page_success', 10, 2);
```


#### Cập nhật page thành công
Giúp bạn thực hiện một hành động sau khi cập nhật page thành công

| **Loại Hook**                                    | **Platform** |                                   **Version** |
|--------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">do_action</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
do_action('save_page_object_edit', $id, SkillDo\Http\Request $request);
```
**Params**:
* _$id (int)_ : id của page vừa cập nhật thành công
* _$request (Request)_ : đối tượng request

```php
function my_custom_admin_edit_page_success($id, SkillDo\Http\Request $request) : void
{
    //to do...
}
add_action('save_page_object_edit', 'my_custom_admin_edit_page_success', 10, 2);
```