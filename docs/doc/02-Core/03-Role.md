# Phân Quyền
### Lấy danh sách chức vụ
Để lấy tất cả các cấu hình chức vụ trong cms bạn sử dụng method `all` của class SKD_Roles
```php
Role::make()->all();
//hoặc
$role = Role::make();
$role->all();

//Kết quả
[
    "root" => SKD_Role {
        #key: "root"
        #name: "Root"
        #capabilities: [
            "loggin_admin" => true
            "switch_themes" => true
            "edit_themes" => true
            ...
        ]
        #roles: SKD_Roles {
            roles: array:4 [▶]
            roleObjects: array:4 [▶]
            roleNames: array:4 [▶]
            roleKey: "user_roles"
            useDb: true
        }
    }
    "administrator" => SKD_Role {
        ...
    }
    "subscriber" => SKD_Role {
        ...
    }
]

```
Mặt định cms skilldo cung cấp các role
- administrator
- subscriber : chức vụ mặc định của khách hàng đăng ký khi website không có thương mại
- customer: chức vụ mặc định của khách hàng đăng ký khi website có mua bán

Để lấy tất cả tên chức vụ trong cms bạn sử dụng method `getNames` của class SKD_Roles

```php
Role::make()->getNames();

//Kết quả
[
    "root" => "Root"
    "administrator" => "Administrator"
    "subscriber" => "Subscriber"
    "customer" => "Khách hàng"
]
```

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


### Quyền hạn thành viên

#### <code>UserRole::hasCap</code>
Method <code>UserRole::hasCap</code> kiểm tra user có quyền sử dụng chức năng không, nếu có quyền trả về true ngược lại là false
```php
if(UserRole::hasCap($userId, 'edit_post')) {
    //permission successfully
}
```
#### <code>UserRole::getCap</code>
Method <code>UserRole::getCap</code> trả về các quyền user có thể sử dụng
```php
dd(UserRole::getCap($userId))
/**
    "loggin_admin" => true
    "switch_themes" => true
    "edit_themes" => true
   ...
 */
```

#### <code>UserRole::get</code>
Method <code>UserRole::get</code> trả về key nhóm (chức vụ) của user
```php
dd(UserRole::get($userId))
//["customer"]
```

#### <code>UserRole::getName</code>
Method <code>UserRole::getName</code> trả về tên nhóm (chức vụ) của user
```php
dd(UserRole::getName($userId))
//Khách hàng
```

#### <code>UserRole::add</code>
Method <code>UserRole::add</code> set user vào nhóm (chức vụ) mới
```php
dd(UserRole::add($userId, 'administrator'))
```

#### <code>UserRole::remove</code>
Method <code>UserRole::remove</code> xóa nhóm (chức vụ) khỏi user
```php
dd(UserRole::remove($userId, 'administrator'))
```