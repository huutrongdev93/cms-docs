### Đăng nhập & đăng xuất

#### Login thất bại

| Hook               | **Loại Hook**                                 | **Platform** |                                   **Version** |
|--------------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `skd_login_failed` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

Từ 8.6.0 có thêm tham số thứ 2 là mã lý do: `empty_credentials`, `authenticate_filter`, `invalid_user_login`, `incorrect_password`, `authentication_failed`, `status_{status}`, `no_admin_role` (đúng mật khẩu nhưng không có quyền vào admin), `crm_member`. Listener cũ khai 1 tham số vẫn chạy.

```php
do_action('skd_login_failed', $username, $code);

add_action('skd_login_failed', function ($username, $code = '') { /* ... */ }, 10, 2);
```

#### Login thành công

| Hook        | **Loại Hook**                                 | **Platform** |                                   **Version** |
|-------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `skd_login` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
do_action('skd_login', $username, $user);
```

#### Login thành công ở admin

| Hook              | **Loại Hook**                                 | **Platform** |                                   **Version** |
|-------------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `skd_admin_login` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
do_action('skd_admin_login', $user);
```

#### Đăng xuất

| Hook          | **Loại Hook**                                 | **Platform** |                                   **Version** |
|---------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `user_logout` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
do_action('user_logout');
```

#### Đăng xuất khỏi admin
Phát ở `AuthController::logout` **trước** khi xoá phiên, nên listener còn biết ai đăng xuất (`user_logout` phát sau khi phiên đã xoá).

| Hook               | **Loại Hook**                                 | **Platform** |                                   **Version** |
|--------------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `skd_admin_logout` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">8.6.0</span> |

```php
do_action('skd_admin_logout', $user);
```