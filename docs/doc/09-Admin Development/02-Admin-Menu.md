# Admin Navigation

**Hệ thống Menu Sidebar** của Admin SkillDo CMS cho phép bạn thêm các Mục Điều Hướng (Navigation Items) vô cùng dễ dàng mà không cần phải can thiệp sửa trực tiếp vào file View HTML Layout của Core CMS. Bạn chỉ việc gọi hàm cấu hình bằng Hook Action, CMS sẽ tự động đọc mảng và in Menu trên giao diện Quản Trị của bạn.

---

## 1. Cơ Khí Hoạt Động Của Menu Admin

Admin Sidebar trong SkillDo được tạo lên từ class thư viện `SkillDo\Cms\Menu\AdminMenu`. Hệ thống nhận yêu cầu tạo menu thông qua **Hook Action `admin_navigation`** (mượn triết lý của WordPress).

Luồng chạy:
1. Khi có request duyệt `domain.com/admin`.
2. Hệ thống gọi Action `admin_navigation` để cho phép TẤT CẢ các Plugin/Theme/Packages đăng ký Menu ảo vào bộ nhớ.
3. Sau đó `AdminMenu->render()` gọi view và đổ giao diện ra màn hình HTML Sidebar tối sẫm.

---

## 2. Việc sử dụng Hook Để Thêm Menu Gốc (Top-Level Menu)

Hàm dùng để thêm một menu lớn bên ngoài Sidebar (Menu cấp 1) là **`AdminMenu::add($id, $title, $url, $capabilities, $icon)`** hoặc Gọi động cấu trúc Mảng.

Để gọi nó an toàn, bạn nên sử dụng Hook đăng ký ở **Service Provider của Plugin/Module** hoặc `app/helpers.php` (Đừng đăng ký quá sớm lúc Container chưa Boot xong).

### Ví dụ Tạo Menu "Quản Lý Quà Tặng" 

```php
use SkillDo\Cms\Menu\AdminMenu;

// Bám vào Hook sinh Menu Quản Trị
add_action('admin_navigation', 'register_my_gift_menu');

function register_my_gift_menu() {
    
    // Thêm Menu mẹ cấp 1.
    // Lưu ý: Chỉ user có Role có khóa 'manage_gifts' mới thấy Menu này
    AdminMenu::add(
        'gift-manager',                          // ID (Slug) DUY NHẤT của menu
        'Quà Tặng Khách Hàng',                   // Tên hiển thị
        Url::admin('gifts'),                     // Đường dẫn URL (/admin/gifts)
        [
            'position'   => 30,                              // Vị trí độ cao tĩnh (càng thấp càng đứng trên đầu)
            'icon'       => '<i class="fa-solid fa-gift"></i>', // Icon FontAwesome
            'callback'   => 'manage_gifts_cap'               // Tên phân quyền hoặc callback check true/false
        ]
    );

}
```

---

## 3. Quản Lý Menu Con (Sub-Menu)

Phía trong "Quà Tặng", bạn có thể cần danh sách "Tất cả Món quà" (Danh sách) và "Thêm Quà Mới" (Cấu hình). Để gộp các Sub-Menu này vào đúng menu mẹ, bạn dùng **`AdminMenu::addSub($parent_id, $id, $title, $url, $capabilities)`**.

### Ví dụ Tạo Menu Thêm Nhóm Sản Phẩm (Sub-Menu)

```php
use SkillDo\Cms\Menu\AdminMenu;

add_action('admin_navigation', 'register_my_gift_menus');

function register_my_gift_menus() {
    
    // 1. Menu Mẹ (Sẽ thành dạng Dropdown Accordion)
    AdminMenu::add('gift-manager', 'Quà Tặng', Url::admin('gifts'), [
        'position' => 30, 'icon' => '<i class="fa fa-gift"></i>'
    ]);

    // 2. Menu Con 1: Danh sách 
    AdminMenu::addSub(
        'gift-manager',             // $parent_id: Phải trùng với ID mẹ
        'all-gifts',                // ID Con
        'Tất cả quà tặng',        // Tên
        Url::admin('gifts'),        // Đường dẫn
        ['callback' => 'manage_gifts_cap'] 
    );
     
    // 3. Menu Con 2: Thêm mới
    AdminMenu::addSub(
        'gift-manager',             // Vào cùng nhóm mẹ 'gift-manager'
        'add-gift', 
        'Thêm quà hệ thống', 
        Url::admin('gifts/add'), 
        ['callback' => 'manage_gifts_cap'] 
    );
}

```

---

## 4. Gắn Counter (Số Lượng Đỏ) Cảnh Báo Trên Menu

Hệ thống cho phép gắn hình bong bóng màu đỏ (Badge) thông báo số lượng dữ liệu chờ lên thẳng Menu (như tính năng báo có đơn hàng/quà tặng mới).
Thay vì có hàm hỗ trợ tĩnh riêng lẻ, CMS bọc cấu hình này ngầm bên trong thuộc tính `count` lúc Thêm Menu hoặc thông qua tính năng **Filter** của Framework.

### Cách 1: Cung cấp khi khai báo gốc

Bạn có thể truyền trực tiếp một hằng số vào key `count` trong biến mảng `$args`:

```php
AdminMenu::add(
    'gift-manager',
    'Quà Tặng',
    Url::admin('gifts'),
    [
        'position' => 30,
        'count'    => 5 // Hiển thị số 5 màu đỏ
    ]
);
```

### Cách 2: Cập nhật động từ CSDL bằng Filter Hook (Khuyên dùng)

Vì AdminMenu tự động áp dụng filter là `admin_nav_{$key}_count` và `admin_subnav_{$key}_count`, bạn hãy viết hàm bám theo nó để đếm dữ liệu chờ duyệt:

```php
// Ở ServiceProvider (vd: app/Providers/AppServiceProvider.php)
// 'all-gifts' thay thế bằng Key cấu hình khi tạo Menu hoặc Menu Con
add_filter('admin_subnav_all-gifts_count', function($count) {
    // Truy vấn dữ liệu pending từ DB
    $pending_gifts = \App\Models\GiftModel::where('status', 'pending')->count();
    
    return $count + $pending_gifts;
});
```

*(Lưu ý: Bạn không nên lạm quyền thực thi hàm `count()` phức tạp nặng nề, vì tiến trình này quét ở mọi lượt tải trang cấu hình của Admin).*

---

## 5. Danh Sách ID Menu Của Framework Core CMS Thường Bị Ẩn Sâu

Nếu bạn muốn nhét thêm Menu (AddSub) vào cấu hình sẵn của CMS, bạn cần có ID (`$parent_id`) của hãng. 

Một số ID Hệ Thống Của SkillDo Core:
- `dashboard` : Bảng Điều Khiển
- `post` : Bài Viết (Tất cả, Thêm mới, Danh mục)
- `page` : Trang nội dung (Pages)
- `users` : Thành viên và Quyền.
- `theme` : Giao diện (Theme, Widget, Chỉnh sửa).
- `system` : Cấu Hình. 
- `plugins` : Plugin.

**Ví dụ:** Nhét 1 trang Cài Đặt Quà Tặng vào Cấu Hình (`system`):

```php
AdminMenu::addSub(
    'system',             // Parent CMS Core
    'gift-settings', 
    'Thiết lập Quà Tặng', 
    Url::admin('system/gifts')
);
```
