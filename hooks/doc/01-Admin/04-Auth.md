### Đăng nhập & đăng xuất

#### Login thất bại

| Hook               | **Loại Hook**                                 | **Platform** |                                   **Version** |
|--------------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `skd_login_failed` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
do_action('skd_login_failed', $username);
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