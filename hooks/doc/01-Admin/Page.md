### Trang danh sách page

#### Điều kiện lấy total
Thay đổi điều kiện lấy ra tổng số page dùng cho phân trang

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$args = apply_filters('admin_page_controllers_index_args_before_count', Qr $args)
```
**Params**: biến Qr

**Return**: biến Qr

```php
function my_custom_admin_page_count(Qr $args): void
{
    return $args;
}
add_filter('admin_page_controllers_index_args_before_count', 'my_custom_admin_page_count');
```


#### Điều kiện lấy list
Thay đổi điều kiện lấy ra danh sách page

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$args = apply_filters('admin_page_controllers_index_args', Qr $args)
```
**Params**: biến Qr

**Return**: biến Qr

```php
function my_custom_admin_page(Qr $args): void
{
    return $args;
}
add_filter('admin_page_controllers_index_args', 'my_custom_admin_page');
```



#### Danh sách page
Thay danh sách page đã lấy ra

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$objects = apply_filters('admin_page_controllers_index_objects', array $objects, Qr $args);
```
**Params**: 
* _$objects (array)_ : danh sách page đã lấy được từ database
* _$args (Qr)_ : điều kiện lấy page từ database

**Return**: $objects

```php
function my_custom_admin_page_objects($objects, Qr $args): array
{
    return $objects;
}
add_filter('admin_page_controllers_index_objects', 'my_custom_admin_page_objects', 10, 2);
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