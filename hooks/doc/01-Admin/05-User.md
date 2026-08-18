### Danh sách user

> **Thay đổi ở v8:** ba hook `admin_user_controllers_index_args`, `admin_user_controllers_index_args_count` và `admin_user_controllers_index_objects` **đã bị gỡ bỏ**. Chúng nhận biến `Qr` — lớp này không còn tồn tại ở v8 (đã chuyển hoàn toàn sang Eloquent Query Builder).

Muốn can thiệp điều kiện lấy danh sách user, hãy override phương thức `queryFilter()` trong lớp Table của module:

```php
use SkillDo\Database\Eloquent\Builder;
use SkillDo\Http\Request;

function queryFilter(Builder $query, Request $request): Builder
{
    if($request->input('vip')) {
        $query->where('vip', 1);
    }

    return $query;
}
```

Hai hook sau vẫn dùng được để bổ sung field vào form lọc / tìm kiếm của bảng user:

| Hooks                          | **Loại Hook**                                   | **Platform** |                                   **Version** |
|--------------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_user_table_form_filter` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.0.0</span> |
| `admin_user_table_form_search` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.0.0</span> |

```php
$form = apply_filters('admin_user_table_form_filter', $form);
$form = apply_filters('admin_user_table_form_search', $form);
```

**Params**: `$form` — đối tượng Form của bảng

**Return**: `$form`

### Table user

#### Table buttons bulk
Tạo ra danh sách buttons bulk, là những button khi người dùng chọn nhiều row trên table

| Hooks                            | **Loại Hook**                                   | **Platform** |                                   **Version** |
|----------------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `table_user_bulk_action_buttons` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('table_user_bulk_action_buttons', array $buttons);
```
**Params**:
* _$buttons (array)_ : danh sách buttton

**Return**: $buttons

#### Table header buttons
Tạo ra danh sách buttons trên table, là những button nằm ở header table phía tay phải

| Hooks                       | **Loại Hook**                                   | **Platform** |                                   **Version** |
|-----------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `table_user_header_buttons` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
$buttons = apply_filters('table_user_header_buttons', array $buttons);
```
**Params**:
* _$buttons (array)_ : danh sách buttton

**Return**: $buttons


#### Table columns
Chỉnh sữa danh sách table column của page

| Hooks                 | **Loại Hook**                                   | **Platform** |                                   **Version** |
|-----------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `manage_user_columns` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$this->_column_headers = apply_filters("manage_user_columns", array $columnHeaders);
```
**Params**:
* _$columnHeaders (array)_ : danh sách column

**Return**: $columnHeaders

#### Table columns action
Tạo ra danh sách buttons cho column action

| Hooks                             | **Loại Hook**                                   | **Platform** |                                   **Version** |
|-----------------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_user_table_columns_action` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

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

| Hooks                       | **Loại Hook**                                   | **Platform** |                                   **Version** |
|-----------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_user_profile_errors` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$error = apply_filters('admin_user_profile_errors', $error, $userUpdate, $userMetaData );
```
- $userUpdate: dữ liệu sẽ up vào table user

- $userMetaData: dữ liệu sẽ up vào table user_metadata

#### Tùy chỉnh data cập nhật vào user

| Hooks                   | **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_pre_user_update` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.3</span> |

```php
$userUpdate = apply_filters('admin_pre_user_update', $userUpdate, $request, $userEdit);
```

#### Tùy chỉnh data cập nhật vào user metadata

| Hooks                        | **Loại Hook**                                   | **Platform** |                                   **Version** |
|------------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_pre_user_update_meta` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">7.0.3</span> |

```php
$userMetaData = apply_filters('admin_pre_user_update_meta', $userMetaData, $request, $userEdit);
```

#### Cập nhật thành công

| Hooks                       | **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `admin_user_update_success` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">7.0.3</span> |

```php
do_action('admin_user_update_success', $error, $userUpdate, $userMetaData);
```

### Đổi mật khẩu

#### Kiểm tra mật khẩu
Nếu bạn cần kiểm tra mật khẩu người dùng trước khi thay đổi có thể dùng hook `admin_user_password_errors` , nếu hook trả về một `SKD_Error`
người dùng sẽ nhận được thông báo lỗi

| Hooks                        | **Loại Hook**                                   | **Platform** |                                   **Version** |
|------------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_user_password_errors` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
$error = apply_filters('admin_user_password_errors', [], $password, $userEdit );
```

#### Cập nhật thành công

Cập nhật thành công mật khẩu người dùng

| Hooks                        | **Loại Hook**                                   | **Platform** |                                   **Version** |
|------------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_user_password_update` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
do_action('admin_user_password_update', $password, $userEdit);
```
