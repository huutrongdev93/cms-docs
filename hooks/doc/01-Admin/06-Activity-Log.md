### Nhật ký hoạt động

Các hook do nhật ký hoạt động (8.6.0) dùng hoặc thêm vào. Cách ghi / đọc nhật ký xem **CMS → Nhật ký hoạt động**.

#### Sửa hoặc bỏ một dòng trước khi ghi
Trả `false` để không ghi dòng này (ví dụ tắt bớt sự kiện ồn). `$row` là mảng cột sắp chèn vào bảng `activity_logs`.

| Hook                  | Loại Hook                                       | Platform |                                       Version |
|-----------------------|-------------------------------------------------|:--------:|----------------------------------------------:|
| `activity_log_record` | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">8.6.0</span> |
```php
add_filter('activity_log_record', function ($row, $data) {
    if ($row['event'] === 'update' && $row['module'] === 'widget') return false;
    return $row;
}, 10, 2);
```

#### Sau khi ghi một dòng
Điểm móc để gửi cảnh báo (email, Telegram…).

| Hook                    | Loại Hook                                     | Platform |                                       Version |
|-------------------------|-----------------------------------------------|:--------:|----------------------------------------------:|
| `activity_log_recorded` | <span class="badge text-bg-red">action</span> |   cms    | <span class="badge text-bg-cyan">8.6.0</span> |
```php
add_action('activity_log_recorded', function ($row, $id) {
    if ($row['event'] === 'login_failed') { /* ... */ }
}, 10, 2);
```

#### Nhãn hiển thị của module

| Hook                   | Loại Hook                                       | Platform |                                       Version |
|------------------------|-------------------------------------------------|:--------:|----------------------------------------------:|
| `activity_log_modules` | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">8.6.0</span> |
```php
add_filter('activity_log_modules', fn($modules) => $modules + ['products' => 'sản phẩm']);
```

#### Bảng nhật ký: cột, ô lọc, điều kiện truy vấn

| Hook                                    | Loại Hook                                       | Platform |                                       Version |
|-----------------------------------------|-------------------------------------------------|:--------:|----------------------------------------------:|
| `manage_activity_logs_columns`          | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">8.6.0</span> |
| `admin_activity_logs_table_form_filter` | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">8.6.0</span> |
| `admin_activity_logs_table_query`       | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">8.6.0</span> |
```php
$columns = apply_filters('manage_activity_logs_columns', $columns);
$form    = apply_filters('admin_activity_logs_table_form_filter', $form, $request);
$query   = apply_filters('admin_activity_logs_table_query', $query, $request);
```

#### Câu mô tả kiểu cũ (trước 8.6.0, vẫn chạy)
Nhận câu mô tả dựng sẵn (rỗng khi không tìm được tiêu đề). Trả rỗng = bỏ ghi, trả câu khác = ghi câu đó thay câu dựng sẵn.

| Hook                                                  | Loại Hook                                       | Platform |                                       Version |
|-------------------------------------------------------|-------------------------------------------------|:--------:|----------------------------------------------:|
| `admin_activity_logger_create_message`                | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">7.0.0</span> |
| `admin_activity_logger_update_message`                | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">7.0.0</span> |
| `admin_activity_logger_{trash,restore,delete}_message` | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">7.0.0</span> |
| `admin_activity_logger_{trash,restore,delete}_objects` | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">7.0.0</span> |
```php
$message = apply_filters('admin_activity_logger_create_message', $message, $id, $module, $request);
$message = apply_filters('admin_activity_logger_delete_message', $message, $object, $module);
$objects = apply_filters('admin_activity_logger_delete_objects', Collection::empty(), $ids, $module);
```

---

### Hook mới / thêm tham số ở 8.6.0

Thêm để nhật ký nghe được, plugin cũng dùng được. Tham số mới luôn nằm **cuối**, listener cũ khai ít tham số hơn vẫn chạy.

> `add_action` mặc định nhận **1 tham số**: listener nhiều tham số phải khai số tham số ở đối số thứ 4, ví dụ `add_action('admin_system_save', $cb, 10, 2)`.

| Hook | Loại | Phát ở | Tham số |
|---|---|---|---|
| `skd_login_failed` | action | `Auth::login`, `Auth::setCurrent`, `AuthAjax` | `$username`, **`$code`** (mới): `empty_credentials`, `authenticate_filter`, `invalid_user_login`, `incorrect_password`, `authentication_failed`, `status_{status}`, `no_admin_role`, `crm_member` |
| `skd_admin_logout` | action | `AuthController::logout`, **trước** khi xoá phiên | `$user` |
| `admin_user_login_as` | action | `UserAjax::loginAs`, trước khi đổi phiên | `$user` (người được đăng nhập thay), `$by` (root) |
| `admin_user_login_as_back` | action | `UserAjax::loginAsBackRoot`, trước khi trả phiên | `$user` (người đang được đăng nhập thay) |
| `admin_user_profile_saved` | action | `UserAjax::saveProfile` | `$user`, `$changedFields` |
| `admin_user_status_success` | action | `UserAjax::status`, `bulkStatus` | `array $users`, `$status` |
| `admin_user_trash_success` | action | `UserAjax::moveTrash`, `bulkDelete` | `array $users` |
| `save_object_edit_before` | action | `FormAdminHelper::update`, **trước** khi ghi | `$id`, `$module`, `$model`, `$insertData` |
| `up_boolean_success` | action | `TableAjax::saveInputBoolean` | `$module`, `$id`, `$model`, **`$row`**, **`$value`** (mới) |
| `admin_system_save` | action | `ActionAjax::saveSystem` (mọi tab) | `$tabKey`, `$request` |
| `ajax_menu_create_success` | action | `MenuAjax::add` | `$menu` |
| `ajax_menu_del_success` | action | `MenuAjax::delete` | `$id`, **`$menu`** (mới, lấy trước khi xoá) |
| `ajax_menu_item_save_success` / `ajax_menu_item_del_success` | action | `MenuAjax` | `$menuId`, **`$item`** (mới) |
| `plugin_install` | action | `PluginsAjax::install` | `$folder` |
| `cms_update_success` / `cms_update_failed` | action | `UpdateAjax::update` | `$version` / `$version`, `$reason` |
| `builder_save_success` | action | `BuilderAjax::save` (xuất bản, không phải nháp tự lưu) | `$page`, `$sectionKeys` |
| `builder_delete_success` | action | `BuilderAjax::delete` | `$key` |
| `admin_oauth_revoked` | action | `OAuthAjax::revokeFamily` | `$family`, `$owner` |

:::warning cms_update_success / cms_update_failed
Trình cập nhật chạy trong tiến trình đã nạp **mã cũ**, nên hai action này chỉ phát từ lần cập nhật **sau** bản đầu tiên có chúng (cập nhật lên 8.6.0 thì chưa phát, 8.6.0 lên bản kế tiếp mới phát).
:::
