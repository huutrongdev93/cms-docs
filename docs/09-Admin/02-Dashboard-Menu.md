# Dashboard Menu
### Thêm Menu
Để thêm một Menu Item vào Dashboard menu trong Admin thì bạn sử dụng `AdminMenu::add`

```php
AdminMenu::add($key, $title, $slug, $args);
```
| Key    |  Type  |                     Description |
|--------|:------:|--------------------------------:|
| $id    | string | id của menu, id này là duy nhất |
| $title | string |                Tiêu đề của menu |
| $slug  | string |                  Đường dẫn menu |
| $args  | array  |        Mãng các tham số mở rộng |

$args chứa các thông tin

| Key      |  Type  |                                            Description | Mặc định |
|----------|:------:|-------------------------------------------------------:|:---------|
| callback | string |        Tên function hoặc static method sẽ render trang | null     |
| hidden   |  bool  | Nếu true menu sẽ bị ẩn hiển thị những vẫn được đăng ký | false    |
| icon     | string |                                              icon menu | null     |
| position | string |                     id của menu mà menu này sẽ nằm sau | null     |
| count    | number |                                        số notification | 0        |

```php
class CustomMenu {
    static function register() {
        $args = [
            'icon'  => '<img src="icon-post.png">',
            'callback' => 'CustomMenu::render',
            'position' => 'theme'
        ];
        AdminMenu::add('plugin_demo', 'Plugin Demo', 'plugins?page=plugin_demo', $args);
    }
    
    static function render() {
        echo '<h1>Plugin demo callback</h1>';
    }
}

add_action('admin_init', 'CustomMenu::register');
```

### Thêm Menu con
Để thêm một Menu item con vào Dashboard menu trong Admin thì bạn sử dụng `AdminMenu::addSub`

```php
AdminMenu::addSub($parentId , $id, $title, $slug, $args);
```

| Key       |  Type  |                     Description |
|-----------|:------:|--------------------------------:|
| $parentId | string |                 id của menu cha |
| $id       | string | id của menu, id này là duy nhất |
| $title    | string |                Tiêu đề của menu |
| $slug     | string |                  Đường dẫn menu |
| $args     | array  |        Mãng các tham số mở rộng |

$args chứa các thông tin

| Key      |  Type  |                                            Description | Mặc định |
|----------|:------:|-------------------------------------------------------:|:---------|
| callback | string |        Tên function hoặc static method sẽ render trang | null     |
| hidden   |  bool  | Nếu true menu sẽ bị ẩn hiển thị những vẫn được đăng ký | false    |
| position | string |                     id của menu mà menu này sẽ nằm sau | null     |
| count    | number |                                        số notification | 0        |

### Xóa Menu

Để xóa một menu ra khỏi hệ thống thì bạn sử dụng hàm `AdminMenu::remove`

```php
AdminMenu::remove($id);
```