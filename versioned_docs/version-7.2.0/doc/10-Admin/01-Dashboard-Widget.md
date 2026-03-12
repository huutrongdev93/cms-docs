# Dashboard Widgets
### Thêm widget
Để thêm một widget mới vào dashboard admin bạn sử dụng `Dashboard::add`

```php
Dashboard::add($id, $title, $args)
```

| Key    |  Type  |      Description |
|--------|:------:|-----------------:|
| $id    | string |    id của widget |
| $title | string |   Tên của widget |
| $args  | array  | mãng các tham số |

$args chứa các thông tin

| Key      |  Type  |                                      Description |
|----------|:------:|-------------------------------------------------:|
| callback | string | Tên function hoặc static method sẽ render widget |
| col      | number |                   Độ rộng của widget từ 1 đến 12 |
| icon     | string |                                      icon widget |

```php
Dashboard::add('quick_access','Quick access', [
    'callback' => 'dashboard_quick_access', 
    'col' => 12, 
    'icon' => '<i class="fad fa-sitemap"></i>'
]);

function dashboard_quick_access() {
    //render
}
```

### Has
Kiểm tra widget đã được đăng ký hay chưa

```php
Dashboard::has('quick_access');
```

### Xóa widget
```php
Dashboard::remove($id)
```