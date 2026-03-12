# Kiến Trúc Của Một Plugin

**Plugin** là linh hồn của hệ thống SkillDo CMS v8, cho phép bạn thay đổi toàn bộ chức năng, can thiệp luồng dữ liệu, tạo bảng Cơ Sở Dữ Liệu mới và giao diện riêng biệt mà **KHÔNG CẦN CHẠM VÀO MÃ NGUỒN CỐT LÕI (CORE)**.

Cơ cấu tự động tìm kiếm (Auto-loading) và chạy nền (Bootstrapping) của CMS giúp việc kích hoạt/vô hiệu hóa Plugin chỉ tốn đúng một cú Click chuột trong Admin.

---

## 1. Cấu Trúc Khuyến Nghị Của Một Plugin (Standard Architecture)

Mọi plugin đều nằm trong thư mục gốc `plugins/`. Hãy đặt **ID (Tên Thư Mục) của Plugin bằng chữ thường, dạng kebab-case** (VD: `skd-seo`, `shipping-manager`).

Dưới đây là cây thư mục (File Tree) chuẩn nhất dành cho lập trình viên phát triển 1 Plugin hoàn chỉnh:

```
plugins/my-plugin/
│
├── plugin.json                    # ① MANIFEST: Cấu hình meta, alias, controllers
├── index.php                      # ② MAIN CLASS (ID-Plugin.php): Entry chứa hàm active() & uninstall()
│
├── bootstrap/                     # ③ BOOTSTRAP: auto-loaded mỗi request
│   └── ajax.php                   #    Đăng ký Ajax handlers
│
├── app/                           # ④ SOURCE CODE PHP (namespace: MyPlugin\*)
│   ├── Ajax/
│   │   ├── Admin/                 #    Ajax::admin(...)
│   │   │   └── ProductAjax.php
│   │   └── Web/                   #    Ajax::client(...) / Ajax::login(...)
│   │       └── PublicAjax.php
│   ├── Controllers/
│   │   ├── Admin/                 #    Admin HTTP Controllers
│   │   └── Web/                   #    Frontend HTTP Controllers
│   ├── Models/                    #    Eloquent Models
│   ├── Providers/
│   │   └── MyPluginServiceProvider.php
│   ├── Services/
│   │   ├── ActivatorService.php   #    Chạy khi kích hoạt
│   │   └── DeactivatorService.php #    Chạy khi gỡ cài đặt
│   ├── Supports/                  #    Helper classes
│   ├── Modules/                   #    Feature modules (Tables, Forms...)
│   ├── Notifications/             #    Notification classes
│   └── Status/                    #    Status/Enum constants
│
├── routes/                        # ⑤ ROUTES
│   ├── admin.php
│   ├── web.php
│   └── api.php
│
├── views/                         # ⑥ BLADE VIEWS
│   ├── admin/
│   └── web/
│
├── config/                        # ⑦ CONFIG
│   └── config.php
│
├── language/                      # ⑧ TRANSLATIONS
│   ├── vi/messages.php
│   └── en/messages.php
│
└── assets/                        # ⑨ STATIC ASSETS (CSS, JS, images)
```

---

## 2. File Manifest (plugin.json)

Thành phần tối quan trọng nhất để Framework nhận diện thư mục của bạn là một Plugin: file **`plugin.json`**. Nó báo cho CMS hệ thống nạp (Auto-Loader) biết phải đăng ký những Lớp Class gì trước.

```json
{
  "name": "My Plugin Nam",
  "version": "1.0.0",
  "description": "Thêm tính năng giỏ hàng cho Website.",
  "author": "Sikido Dev",
  
  "providers": [
    "MyPlugin\\Providers\\RouteServiceProvider",
    "MyPlugin\\Providers\\EventServiceProvider"
  ],
  
  "autoload": {
    "psr-4": {
      "MyPlugin\\": "app/"
    },
    "files": [
      "bootstrap/common.php"
    ]
  }
}
```

### Giải Thích Cấu Trúc autoload

**1. `psr-4`**: Cho phép bạn tạo Namespace. 
SkillDo tích hợp chuẩn Tự động Tải Tệp (Autoloader PSR-4). Theo file JSON mẫu, bất kỳ khi nào bạn chạy lệnh gọi `new \MyPlugin\Models\Product()`, Framework sẽ tự lần tìm vào file `plugins/my-plugin/app/Models/Product.php` để lấy (Include) tự động mà bạn không cần `require_once(...)`.

**2. `files`**: Danh sách một vài Tệp chứa `function` hoặc Hook lẻ tẻ mà bạn muốn CMS `require` luôn khi bật Plugin.
*(Có thể không xài nếu bạn làm chuẩn Hướng đối tượng OOP).*

**3. `providers`**: Nếu Plugin của bạn cần Khởi Động Route, Móc Hook, Nghe Sự Kiện... Chỉ việc tạo Lớp Kế Thừa `ServiceProvider` và ghi đường dẫn Namespace vào đây. Khi CMS Boot, nó sẽ gọi hàm vòng lặp Boot TẤT CẢ Service của Plugin.

---

## 3. Namespace Tự Động Định Danh Cho View, Ngôn Ngữ (Prefix ID)

SkillDo cung cấp các tiện ích nạp tự động không gian (Filesystem Loader) cho Thư Mục Tương Ứng trong mã Plugin của bạn. 
Key đăng ký chính là tên Thư Mục Plugin của bạn! `my-plugin`

- **Để gọi View (`views/`)**:  `view('my-plugin::admin.my_page')`
- **Để gọi Ngôn Ngữ (`language/`)**:  `trans('my-plugin::messages.hello')`
- **Để gọi File Tĩnh (Assets URL)**: CMS sẽ tự sao chép (hoặc tạo Simlink) thư mục `assets/` ra Public nếu cấu hình, hỗ trợ nạp qua Helper tự thân Plugin của bạn.

---

## 4. Hook Vào Hệ Thống Bằng Plugin

Nguyên tắc bất thành văn: Các Modul Core của SkillDo như Quản lý Bài Viết, Quản Lý Cài Đặt... không bao giờ thiết kế cứng nhắc. Bạn luôn có thể gắn "Bổ sung chức năng" thông qua Hook `add_action` hoặc `add_filter`.

Một Plugin tốt không tạo ra 1 trang riêng để quản lý "SEO Cho Bài Viết" ở Menu Sidebar. Thay vào đó, nó Móc (Hook) vào khung quản lý Sửa Bài Viết Mặc Định của CMS để chèn ô (Metabox).

**Ví dụ Gắn Thêm Nút ở Menu CMS bằng Bootstrap Plugin:**

Tạo file `bootstrap/common.php`:

```php
use SkillDo\Cms\Menu\AdminMenu;

// Action admin_menu là vị trí rớt Menu của Core CMS.
add_action('admin_menu', 'my_plugin_register_admin_menu');

function my_plugin_register_admin_menu() {
    AdminMenu::add(
       'my-plugin-id', 
       'Quản Lý Giỏ Hàng', 
       Url::admin('my-cart')
    );
}

```

Với cấu trúc hoàn chỉnh trên, thư mục Plugin có đầy đủ tư cách của một "Ứng dụng Con" (Micro-App) nằm gọn bên trong hệ sinh thái SkillDo CMS. 
Việc Xóa Hoặc Gỡ Plugin chỉ đơn giản là Click Disable trên Admin, hoặc Xóa đi folder này! Hoàn toàn không ảnh hưởng tới Cơ sở dữ liệu hay mã nguồn của Hãng.

---

## 5. Các Bước Thực Hành Thiết Kế Plugin (Quickstart)

Bây giờ bạn sẽ áp dụng kiến thức để thực hành trực tiếp tạo một Plugin từ A đến Z. 

Giả sử chúng ta sẽ tạo một Plugin tên là **"Hello World"** (ID: `skd-hello-world`). Chức năng của nó rất đơn giản:
1. Đăng ký một URL giao diện tĩnh nằm ở `/admin/hello`.
2. Truy cập URL đó trả về dòng HTML "Hello SkillDo CMS v8!".

### BƯỚC 1: Khởi Tạo Cấu Trúc File Cơ Bản (plugin.json)

Vào thư mục `plugins/` của dự án, tạo một thư mục trống tên là `skd-hello-world`.
Tạo file thiết lập cốt lõi đầu tiên `plugins/skd-hello-world/plugin.json`:

```json
{
  "name": "Hello World CMS",
  "class": "SkdHelloWorld",
  "version": "1.0.0",
  "description": "Hướng dẫn khởi tạo Plugin đơn giản đầu tay.",
  "author": "Sikido Developer",
  
  "providers": [
    "SkdHelloWorld\\Providers\\PluginServiceProvider"
  ],
  
  "autoload": {
    "psr-4": {
      "SkdHelloWorld\\": "app/"
    }
  }
}
```

> **Giảng giải**: 
> - Namespace chuẩn cho code PHP ở thư mục `app/` của plugin là `SkdHelloWorld\`.
> - Biến `"class": "SkdHelloWorld"` báo cho CMS biết Tên Lớp (Class) Chính sẽ chịu trách nhiệm bật/tắt (active/uninstall) plugin.

### BƯỚC 2: Tạo Lớp Chính Định Danh Plugin (Main Class / Entry Point)

Mỗi plugin bắt buộc phải có một tệp thực thi chính mang tên trùng với ID Thư mục Plugin.
Tạo tệp: `plugins/skd-hello-world/skd-hello-world.php`

```php
<?php

class SkdHelloWorld 
{
    private string $name = 'skd_hello_world';

    // Hàm thực thi MỘT LẦN DUY NHẤT khi User bấm Nút BẬT (Active) trên giao diện Admin.
    public function active(): void
    {
        // Thường gọi file cài đặt Bảng Database (Schema::create) hoặc Option.
    }

    // Hàm thực thi MỘT LẦN DUY NHẤT khi User bấm Nút GỠ CÀI ĐẶT (Uninstall)
    public function uninstall(): void
    {
        // Lệnh Droptable, Dọn dẹp Database khi người dùng xóa Plugin.
    }
}
```

### BƯỚC 3: Tạo Controller Chứa Logic PHP

Tạo tệp: `plugins/skd-hello-world/app/Controllers/Admin/HelloController.php`

```php
<?php
namespace SkdHelloWorld\Controllers\Admin;

use SkillDo\Http\Request;
use SkillDo\Facades\Response;

class HelloController 
{
    public function index(Request $request) {
        $html = "<div style='padding:50px; text-align:center;'>";
        $html .= "<h1>Hello SkillDo CMS v8!</h1>";
        $html .= "<p>Plugin đầu tiên của bạn đã chạy.</p>";
        $html .= "</div>";
        return view('admin.index', ['content' => $html]);
    }
}
```

### BƯỚC 4: Tạo Định Tuyến Tự Động (Route)

Hệ thống SkillDo CMS v8 vô cùng thông minh. Nó sẽ TỰ ĐỘNG quét thư mục `routes/` bên trong Plugin của bạn để thu thập URL mà bạn không cần phải khai báo Provider rườm rà.

Tất cả những gì bạn cần làm là tạo thư mục `routes/` và tạo file Route theo đúng ngữ cảnh hệ thống (nếu là route web thì tạo file `routes/web.php`): 
Tạo tệp: `plugins/skd-hello-world/routes/admin.php`

```php
<?php
use SkillDo\Facades\Route;       
use SkdHelloWorld\Controllers\Admin\HelloController; 

// Đăng Ký Định Tuyến (Route) Admin
Route::group([
    'prefix'     => 'admin', 
    'middleware' => 'auth:admin'
], function () {
    // URL sẽ trở thành: domain.com/admin/hello
    Route::get('hello', [HelloController::class, 'index']);
});
```

### BƯỚC 5: Đăng Ký Menu Admin (PluginServiceProvider)

Tạo file Boot cuối cùng để Đính kèm menu con vào Sidebar Admin.
Tạo tệp: `plugins/skd-hello-world/app/Providers/PluginServiceProvider.php`

```php
<?php
namespace SkdHelloWorld\Providers;

use SkillDo\Support\ServiceProvider;
use SkillDo\Cms\Menu\AdminMenu;   
use SkillDo\Facades\Url;          

class PluginServiceProvider extends ServiceProvider 
{
    public function boot() {
        add_action('admin_menu', [$this, 'addCustomMenu']);
    }

    public function addCustomMenu() {
        AdminMenu::add(
            'menu-hello', 
            'App Hello', 
            Url::admin('hello'),
            ['position' => 15, 'icon' => '<i class="fa-solid fa-code"></i>']
        );
    }
}
```

### Bước 6: Bật Plugin Và Xem Thành Quả

1. Mở Admin Control Panel (`/admin`), vào phần "**Plugins**".
2. Hệ thống đã nhận danh sách Plugin "**Hello World CMS**". Bấm **BẬT (Activate)**.
3. Framework tiến trình gọi `active()` trong file `skd-hello-world.php`, sau đó khởi chạy `PluginServiceProvider`.
4. Reset màn hình! Bạn sẽ thấy Tab Sidebar "App Hello".
5. Click vào bạn nhận được Dòng chữ "Hello SkillDo CMS v8!".
