# 04. Quản Lý Assets (CSS & JS) Trong Plugin

Trong thư mục plugin bên trong hệ thống CMS V8, Framework hỗ trợ các hook hữu ích để giúp quản lý việc nạp các tệp tĩnh (CSS/JS) vào Frontend (Web), Backend (Admin), đồng thời cho phép tích hợp linh hoạt các biến CSS toàn cục (CSS Variables).

Dưới đây là một bộ tài liệu hướng dẫn cách tạo và quản lý phần Asset của Plugin.

---

## 1. Cấu trúc thư mục chứa Assets

Để thư viện có thể hỗ trợ đường dẫn tối ưu, các asset (file js, css, image, v.v) cần phải nằm ở thư mục `assets` ở thư mục gốc của Plugin. Các tập tin này có thể được triệu gọi thông qua Helper Function: `asset()`.

Cấu trúc tham khảo khi khởi tạo Plugin:
```bash
ten-plugin/
│
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
```

Để lấy đường dẫn hoàn thiện của file trên trình duyệt, lập trình viên sử dụng cú pháp: `ten-plugin::duong-dan`.
Ví dụ:
```php
$url = asset('ten-plugin::css/style.css'); 
// URL trả về dạng https://domain.com/plugins/ten-plugin/assets/css/style.css
```

---

## 2. Cách nạp File CSS và JS Trong Trang Admin (Backend)

CMS cung cấp Action Hook có tên là `admin_assets` dùng riêng cho các file phục vụ bảng điều khiển (Dashboard) của Admin. Sau khi hook được bắt, hệ thống chuyển giao quyền add file thông qua facade tĩnh là `SkillDo\Cms\Support\Admin`.

**Đăng Ký Hook (Thường nằm trong `bootstrap/admin.php` hoặc `bootstrap/config.php`):**

```php
use MyPlugin\Services\AssetsService;

add_action('admin_assets', [AssetsService::class, 'admin']);
```

**Thực thi Thêm File tại Class AssetsService:**

```php
namespace MyPlugin\Services;

use SkillDo\Cms\Support\Admin;

class AssetsService
{
    /**
     * Nạp CSS/JS vào giao diện Admin Backend
     */
    static function admin(): void
    {
        // 1. Chèn file CSS vào thư mục Head của trang quản trị
        Admin::asset()->location('header')
             ->add('my-plugin-admin-style', asset('my-plugin::css/style.admin.css'));

        // 2. Chèn file JS vào cuối Footer của trang quản trị
        Admin::asset()->location('footer')
             ->add('my-plugin-admin-script', asset('my-plugin::js/script.admin.js'));
    }
}
```

---

## 3. Cách nạp File CSS và JS Trong FrontEnd (Web Site)

Khác với admin, ở giao diện người dùng bên ngoài, CMS cung cấp Action Hook có tên là `theme_custom_assets` để hỗ trợ nạp CSS/JS mà không làm ảnh hưởng đến hiệu suất và có thông số xử lý minify mã nguồn. 

**Đăng Ký Hook (Thường nằm trong `bootstrap/web.php` hoặc `bootstrap/config.php`):**

```php
use MyPlugin\Services\AssetsService;

// Hook có độ ưu tiên 10, nhận về số lượng tham số là 2.
add_action('theme_custom_assets', [AssetsService::class, 'web'], 10, 2);
```

**Thực thi Thêm File tại Class AssetsService:**

Class này được nhận hai Object `$header` và `$footer` riêng biệt từ framework để thêm file dễ dàng với phương thức `add()`. 

```php
namespace MyPlugin\Services;

use SkillDo\Cms\Template\Assets\AssetPosition;

class AssetsService
{
    /**
     * Tham số đầu tiên đại diện cho thẻ <head> 
     * Tham số thứ hai đại diện cho trước phần đóng <body>
     * 
     * @param AssetPosition $header
     * @param AssetPosition $footer
     */
    static function web(AssetPosition $header, AssetPosition $footer): void
    {
        // 1. Chèn file CSS vào khu vực Header (The head)
        $header->add('my-plugin-style', asset('my-plugin::css/style.css'));

        // 2. Chèn file Custom css/js và sử dụng hàm ->minify() để nén file
        $header->add('my-plugin-custom', asset('my-plugin::css/custom.css'))->minify();

        // 3. Chèn file file JS vào khu vực Footer (gần thẻ đóng body)
        $footer->add('my-plugin-script', asset('my-plugin::js/script.js'));
        
        // Hoặc quy định mảng config thay cho minify() dạng chain object
        $footer->add('my-plugin-micro', asset('my-plugin::js/micro.min.js'), ['minify' => false]);
    }
}
```

---

## 4. Bổ sung Biến Tùy Chỉnh (CSS Variables) Toàn Cục

Rất nhiều lúc, Plugin cần tùy chỉnh màu sắc theo ý của người quản trị, lúc này chúng ta có thể sử dụng biến `:root` hoặc CSS Variables. CMS cho phép sử dụng Filter Hook có tên là  `theme_head_style_variable`. 

Từ đây hệ thống sẽ tự sinh ra một Block Style tự động gán ở mục `<head>` với các biến dạng CSS Variables hợp quy chuẩn.

**Đăng Ký Filter (Thường nằm trong `bootstrap/web.php` hoặc `bootstrap/config.php`):**

```php
// Thông thường hook này có độ trễ lớn (đại diện độ ưu tiên - 30) để nó nạp cuối cùng
add_filter('theme_head_style_variable', [AssetsService::class, 'webVariable'], 30);
```

**Thực thi Filter:**

```php
namespace MyPlugin\Services;

class AssetsService
{
    /**
     * @param array $variables (Danh sách các biến hệ thống css tồn tại hiện thời)
     * @return array
     */
    static function webVariable($variables): array
    {
        // Khai báo một style variable có tên --my-plugin-main-color có thể được load từ database.
        $variables['--my-plugin-main-color'] = config('my-plugin::theme.main_color', '#ff0000');
        
        // Khai báo thuộc tính align
        $variables['--my-plugin-align'] = config('my-plugin::theme.align', 'center');

        // Phải đảm bảo luôn luôn return lại array Variables
        return $variables;
    }
}
```

Ở file `style.css` của plugin, bạn có thể gọi biến dạng Variable bình thường mà không cần quan tâm nó được load ở đâu:

```css
.my-plugin-container {
    color: var(--my-plugin-main-color);       /* Dùng biến từ CMS */
    text-align: var(--my-plugin-align);
}
```

---

Thông qua các System API này, bạn không cần phải nhúng file bằng HTML chay ở các vị trí khác nhau mà hoàn toàn nắm được quyền lợi Quản Lý Asset tập trung.
