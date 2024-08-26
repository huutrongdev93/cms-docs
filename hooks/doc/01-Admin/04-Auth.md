### Đăng nhập & đăng xuất

#### Login thất bại

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
do_action('skd_login_failed', $username);
```

#### Login thành công

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
do_action('skd_login', $username, $user);
```

#### Login thành công ở admin

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">4.0.0</span> |

```php
do_action('skd_admin_login', $user);
```

#### Đăng xuất

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
do_action('user_logout');
```