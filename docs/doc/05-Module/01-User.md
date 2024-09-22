import TOCInline from "@theme/TOCInline"

Class <b>User</b> cung cấp cho bạn các method thao tác với data của người dùng
### Thao tác với user

#### <code>User::get</code>
Method <code>User::get</code> trả thông tin user theo điều kiện Query Builder, Nếu truy vấn của bạn có nhiều hơn một user, method chỉ trả về hàng đầu tiên. Kết quả được trả về như một đối tượng.
```php
$user = User::whereKey($id)->select('id', 'username')->first();
```

#### <code>User::gets</code>
Method <code>User::gets</code> trả về danh sách user theo điều kiện Query Builder
```php
$users = User::where('status', 'public')->select('id', 'username')->fetch();
```

#### <code>User::count</code>
Method <code>User::count</code> trả về số lượng user theo điều kiện Query Builder

```php
$usersNumber = User::where('status', 'public')->amount();
```

#### <code>User::insert</code>
Method <code>User::insert</code> thêm or cập nhật thông tin user

| Column Name |     Type      |                                                           Description |
|-------------|:-------------:|----------------------------------------------------------------------:|
| username    |    string     |                                                         Tên đăng nhập |
| password    |    string     |                                                              Mật khẩu |
| salt        |    string     |                         Mã bảo mật (nếu không truyền sẽ tự động sinh) |
| firstname   |    string     |                                                       Họ chữ đệm user |
| lastname    |    string     |                                                          Tên của user |
| email       |    string     |                                  Email của user (yêu cầu là duy nhất) |
| phone       |    string     |                          Số điện thoại của user (yêu cầu là duy nhất) |
| status      |    string     |                                        Trạng thái user [public,block] |
| role        |    string     | Nhòm (chức vụ) mặc định lấy từ <pre>Option::get('default_role')</pre> |

Khi bạn truyền thêm column id thì method sẽ tiến hành cập nhật user
<p>Lưu ý khi cập nhật password cần mã hóa trước bằng <code>Auth::generatePassword</code>.</p>
Kết quả sau khi thực thi:

| Kết quả     |     Type     |                                        Description |
|-------------|:------------:|---------------------------------------------------:|
| Thành công  |  number      | Id của user vừa ược thêm mới hoặc id user cập nhật |
| Thất bại    |  SKD_Error   |                                 Object SKD_Error   |

```php
$user = [
    'username' => 'example_username',
    'password' => 'example_password',
    'firstname' => 'Elon',
    'lastname' => 'HeHe',
    'email' => 'example@example.com',
    'phone' => '000.000.000',
    'status' => 'public'
]
User::insert($user);
```

#### <code>User::delete</code>
Method <code>User::delete</code> xóa toàn bộ thông tin user khỏi database,
> Kết quả sau khi thực thi là true nếu thành công và false khi xóa thất bại
```php
User::delete($id);
```


### User MetaData
Bảng <code>users</code> của SkillDo được thiết kế để chỉ chứa thông tin cần thiết về người dùng.
Do đó, để lưu trữ dữ liệu bổ sung, bảng user_metadata đã được giới thiệu, có thể lưu trữ bất kỳ lượng dữ liệu tùy ý nào về người dùng

#### <code>User::getMeta</code>
Method <code>User::getMeta</code> lấy metadata của user

| Params   |  Type  |                  Description |
|----------|:------:|-----------------------------:|
| $userId  |  int   | Id của user cần lấy metadata |
| $metaKey | string |     key của metadata cần lấy |

```php
User::getMeta($userId, 'address');
```


#### <code>User::updateMeta</code>
Method <code>User::updateMeta</code> thêm mới (nếu metaKey chưa có) hoặc cập nhật metadata của user

| Params     |  Type  |                              Description |
|------------|:------:|-----------------------------------------:|
| $userId    |  int   | Id của user cần thêm (cập nhật) metadata |
| $metaKey   | string |     key của metadata cần thêm (cập nhật) |
| $metaValue |  mix   | giá trị của metadata cần thêm (cập nhật) |

```php
User::updateMeta($userId, 'address', '36 Đường D5, Phường 25');
```

#### <code>User::deleteMeta</code>
Method <code>User::deleteMeta</code> xóa metadata của user khỏi database

| Params     |  Type  |                              Description |
|------------|:------:|-----------------------------------------:|
| $userId    |  int   |             Id của user cần xóa metadata |
| $metaKey   | string |                 key của metadata cần xóa |

```php
User::deleteMeta($userId, 'address');
```
