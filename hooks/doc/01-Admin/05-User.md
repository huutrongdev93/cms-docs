### Danh sách user

#### Điều kiện lấy total

Thay đổi điều kiện lấy ra tổng số user dùng cho phân trang

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$args = apply_filters('admin_user_controllers_index_args_count', $args);
```
**Params**: biến Qr

**Return**: biến Qr

#### Điều kiện lấy danh sách user
Thay đổi điều kiện lấy ra danh sách user

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$args = apply_filters('admin_user_controllers_index_args', Qr $args)
```
**Params**: biến Qr

**Return**: biến Qr

```php
function my_custom_admin_user(Qr $args): void
{
    return $args;
}
add_filter('admin_user_controllers_index_args', 'my_custom_admin_user');
```


#### Thay đổi danh sách user đã lấy
Bạn muốn tùy chỉnh lại từng user đã lấy có thể dùng hook `admin_user_controllers_index_objects`

| **Loại Hook**                                         | **Platform** |                                   **Version** |
|-------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$objects = apply_filters('admin_user_controllers_index_objects', array $objects, Qr $args);
```
**Params**:
* _$objects (array)_ : danh sách user đã lấy được từ database
* _$args (Qr)_ : điều kiện lấy user từ database

**Return**: $objects

```php
function my_custom_admin_user_objects($objects, Qr $args): array
{
    return $objects;
}
add_filter('admin_user_controllers_index_objects', 'my_custom_admin_user_objects', 10, 2);
```


### Table user

#### Table buttons bulk
Tạo ra danh sách buttons bulk, là những button khi người dùng chọn nhiều row trên table

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('table_user_bulk_action_buttons', array $buttons);
```
**Params**:
* _$buttons (array)_ : danh sách buttton

**Return**: $buttons

#### Table header buttons
Tạo ra danh sách buttons trên table, là những button nằm ở header table phía tay phải

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('table_user_header_buttons', array $buttons);
```
**Params**:
* _$buttons (array)_ : danh sách buttton

**Return**: $buttons


#### Table columns
Chỉnh sữa danh sách table column của page

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$this->_column_headers = apply_filters("manage_user_columns", array $columnHeaders);
```
**Params**:
* _$columnHeaders (array)_ : danh sách column

**Return**: $columnHeaders

#### Table columns action
Tạo ra danh sách buttons cho column action

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('admin_user_table_columns_action', array $buttons, $item);
```
**Params**:
* _$buttons (array)_ : danh sách buttton
* _$item (object)_ : đối tượng page của column hiện tại

**Return**: $buttons

### Đổi thông tin

#### Kiểm tra data
Nếu bạn cần kiểm tra thông tin người dùng trước khi thay đổi có thể dùng hook `admin_user_profile_errors` , nếu hook trả về một `SKD_Error`
người dùng sẽ nhận được thông báo lỗi

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$error = apply_filters('admin_user_profile_errors', $error, $userUpdate, $userMetaData );
```
- $userUpdate: dữ liệu sẽ up vào table user

- $userMetaData: dữ liệu sẽ up vào table user_metadata

#### Tùy chỉnh data cập nhật vào user

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.3</span> |

```php
$userUpdate = apply_filters('admin_pre_user_update', $userUpdate, $request, $userEdit);
```

#### Tùy chỉnh data cập nhật vào user metadata

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.3</span> |

```php
$userMetaData = apply_filters('admin_pre_user_update_meta', $userMetaData, $request, $userEdit);
```

#### Cập nhật thành công

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">7.0.3</span> |

```php
do_action('admin_user_update_success', $error, $userUpdate, $userMetaData);
```

### Đổi mật khẩu

#### Kiểm tra mật khẩu
Nếu bạn cần kiểm tra mật khẩu người dùng trước khi thay đổi có thể dùng hook `admin_user_password_errors` , nếu hook trả về một `SKD_Error`
người dùng sẽ nhận được thông báo lỗi

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$error = apply_filters('admin_user_password_errors', [], $password, $userEdit );
```

#### Cập nhật thành công

Cập nhật thành công mật khẩu người dùng

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
do_action('admin_user_password_update', $password, $userEdit);
```
