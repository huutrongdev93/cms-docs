### Trang danh sách post

#### điều kiện lấy total
Thay đổi điều kiện lấy ra tổng số post dùng cho phân trang

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$args = apply_filters('admin_post_<postType>_controllers_index_args_before_count', Qr $args)
```
**Params**: biến Qr

**Return**: biến Qr

```php
function my_custom_admin_post_count(Qr $args): void
{
    return $args;
}
add_filter('admin_post_post_controllers_index_args_before_count', 'my_custom_admin_post_count');
```


#### điều kiện lấy list
Thay đổi điều kiện lấy ra danh sách post

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$args = apply_filters('admin_post_<postType>_controllers_index_args', Qr $args)
```
**Params**: biến Qr

**Return**: biến Qr

```php
function my_custom_admin_post(Qr $args): void
{
    return $args;
}
add_filter('admin_post_post_controllers_index_args', 'my_custom_admin_post');
```



#### danh sách post
Thay danh sách post đã lấy ra

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$objects = apply_filters('admin_post_<postType>_controllers_index_objects', array $objects, Qr $args);
```
**Params**:
* _$objects (array)_ : danh sách post đã lấy được từ database
* _$args (Qr)_ : điều kiện lấy post từ database

**Return**: $objects

```php
function my_custom_admin_post_objects($objects, Qr $args): array
{
    return $objects;
}
add_filter('admin_post_post_controllers_index_objects', 'my_custom_admin_post_objects', 10, 2);
```

#### table buttons bulk
Tạo ra danh sách buttons bulk, là những button khi người dùng chọn nhiều row trên table

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('table_post_bulk_action_buttons', array $buttons);
```
**Params**:
* _$buttons (array)_ : danh sách buttton

**Return**: $buttons

```php
function my_custom_admin_post_bulk_action_buttons($buttons): array
{
    $actionList['postDelete'] = [
        'icon' => Admin::icon('delete'),
        'label' => trans('post.bulkAction.del.label'),
        'class' => 'js_btn_confirm',
        'attributes' => [
            'data-action' => 'delete',
            'data-ajax' => 'Cms_Ajax_Action::delete',
            'data-module' => 'post',
            'data-trash' => $trashEnable,
            'data-heading' => trans('post.bulkAction.del.heading'),
            'data-description' => trans('post.bulkAction.del.description'),
        ]
    ];
            
    return $buttons;
}
add_filter('table_post_bulk_action_buttons', 'my_custom_admin_post_bulk_action_buttons', 10);
```


#### table header buttons
Tạo ra danh sách buttons trên table, là những button nằm ở header table phía tay phải

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('table_post_header_buttons', array $buttons);
```
**Params**:
* _$buttons (array)_ : danh sách buttton

**Return**: $buttons

```php
function my_custom_admin_post_table_header_buttons($buttons): array
{
    $buttons['reload'] = Admin::button('reload');
            
    return $buttons;
}
add_filter('table_post_header_buttons', 'my_custom_admin_post_table_header_buttons', 10);
```

#### table columns
Chỉnh sữa danh sách table column của post

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$this->_column_headers = apply_filters("manage_post_<postType>_columns", array $columnHeaders);
```
**Params**:
* _$columnHeaders (array)_ : danh sách column

**Return**: $columnHeaders

```php
function my_custom_admin_post_table_columns($columnHeaders): array
{
    $columnHeaders['image'] = [
        'label'  => 'Hình ảnh',
        'column' => fn ($item, $args) => ColumnImage::make('image', $item, $args),
    ];
            
    return $columnHeaders;
}
add_filter('manage_post_posts_columns', 'my_custom_admin_post_table_columns');
```

#### table columns action
Tạo ra danh sách buttons cho column action

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('admin_post_table_columns_action', array $buttons, $item);
```
**Params**:
* _$buttons (array)_ : danh sách buttton
* _$item (object)_ : đối tượng post của column hiện tại

**Return**: $buttons

```php
function my_custom_admin_post_table_column_action_buttons($buttons, $item): array
{
    return $buttons;
}
add_filter('admin_post_table_columns_action', 'my_custom_admin_post_table_column_action_buttons', 10, 2);
```

### Thêm & Câp nhật post

#### Form fields
Thay đổi các group, các field trong form `add` và `edit` post

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
$adminForm = apply_filters("manage_post_<postType>_input", AdminFrom $adminForm);
```
**Params**:
* _$adminForm (AdminFrom)_ : một đối tượng AdminFrom

**Return**: $adminForm

```php
function my_custom_admin_post_form(AdminFrom $adminForm): array
{
    $adminForm->right
        ->group('seo')
        ->addField('meta', 'text', ['label' => 'Thẻ meta'])
                
    return $adminForm;
}
add_filter('manage_post_post_input', 'my_custom_admin_post_table_column_action_buttons', 10, 2);
```

#### Thêm post thành công
Giúp bạn thực hiện một hành động sau khi thêm post thành công

| **Loại Hook**                                    | **Platform** |                                   **Version** |
|--------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">do_action</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
do_action('save_post_object_add', $id, SkillDo\Http\Request $request);
```
**Params**:
* _$id (int)_ : id của post vừa thêm thành công
* _$request (Request)_ : đối tượng request

```php
function my_custom_admin_add_post_success($id, SkillDo\Http\Request $request) : void
{
    //to do...
}
add_action('save_post_object_add', 'my_custom_admin_add_post_success', 10, 2);
```


#### Cập nhật post thành công
Giúp bạn thực hiện một hành động sau khi cập nhật post thành công

| **Loại Hook**                                    | **Platform** |                                   **Version** |
|--------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">do_action</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
do_action('save_post_object_edit', $id, SkillDo\Http\Request $request);
```
**Params**:
* _$id (int)_ : id của post vừa cập nhật thành công
* _$request (Request)_ : đối tượng request

```php
function my_custom_admin_edit_post_success($id, SkillDo\Http\Request $request) : void
{
    //to do...
}
add_action('save_post_object_edit', 'my_custom_admin_edit_post_success', 10, 2);
```