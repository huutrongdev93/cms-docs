# Phân Quyền
### Lấy danh sách chức vụ
Để lấy tất cả các chức vụ trong cms bạn sử dụng method `all` của class SKD_Roles
```php
Role::make()->all()
//hoặc
$role = Role::make();
$role->all();
```
Mặt định cms skilldo cung cấp các role
- administrator
- subscriber : chức vụ mặc định của khách hàng đăng ký khi website không có thương mại
- customer: chức vụ mặc định của khách hàng đăng ký khi website có mua bán

### Thêm chức vụ
Để thêm một chức vụ mới trong cms bạn sử dụng method `add` của class SKD_Roles
```php
Role::add($roleKey1, $roleName1);
Role::add($roleKey2, $roleName2);
//hoặc
$role = Role::make();
$role->add($roleKey1, $roleName1);
$role->add($roleKey2, $roleName2);
```
method nhận vào 2 tham số, role key là id của chức vụ và role name là tên hiển thị của chức vụ

### Cập nhật chức vụ
Để cập nhật thông tin một chức vụ trong cms bạn sử dụng method `update` của class SKD_Roles
```php
Role::update($roleKey, $roleName, $capabilities);
//hoặc
$role = Role::make();
$role->update($roleKey, $roleName, $capabilities);
```
method nhận vào 3 tham số, 
- $roleKey là id của chức vụ muốn cập nhật
- $roleName là tên hiển thị mới của chức vụ
- $capabilities là danh sách quyền hạn của chức vụ

### Xóa chức vụ
Để xóa một chức vụ trong cms bạn sử dụng method `remove` của class SKD_Roles
```php
Role::remove($roleKey1);
Role::remove($roleKey2);
//hoặc
$role = Role::make();
$role->remove($roleKey1);
$role->remove($roleKey2);
```
method nhận vào role key là id của chức vụ muốn xóa


### Thao tác với chức vụ
#### Lấy chức vụ
Để thao tác với chức vụ bạn cần lấy chức vụ đó bằng method `get`
```php
$role = Role::get('customer');
```

#### Kiểm tra quyền
Để kiểm tra một chức vụ có một quyền nào đó chưa bạn sử dụng method `has`
```php
if(Role::get('customer')->has('loggin_admin')) {
    //
}
```

#### Lấy danh sách quyền
Để lấy danh sách quyền của một chức vụ bạn sử dụng method `getCapabilities`
```php
$capabilities = Role::get('customer')->getCapabilities();
```

#### Thêm quyền vào chức vụ
Để thêm quyền của một chức vụ bạn sử dụng method `add`
```php
Role::get('customer')->add('loggin_admin');
```

#### Xóa quyền của chức vụ
Để xóa quyền của một chức vụ bạn sử dụng method `remove`
```php
Role::get('customer')->remove('loggin_admin');
```