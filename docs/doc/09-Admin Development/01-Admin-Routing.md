# Admin Routing

Mọi trang chức năng dành cho người quản trị trong SkillDo CMS v8 đều được bảo vệ nghiêm ngặt. Hệ thống yêu cầu người dùng phải đăng nhập và sở hữu quyền hạn cấp Quản Trị (Admin Role) thì mới có thể truy cập vào vùng không gian đằng sau `/admin/...`.

Cơ chế điều phối các đường dẫn URL này được thực hiện thông qua **Hệ thống Routing**.

---

## 1. File Đăng Ký Admin Routes

Toàn bộ các URL dành riêng cho Quản trị viên nằm trong tệp tin chuyên biệt:
**`routes/admin.php`**

Trong tập tin `routes/admin.php`, các đường dẫn không tự dưng có thuộc tính bảo mật hay tiền tố `/admin`. Thay vào đó, lập trình viên (hoặc mã nguồn gốc của CMS) phải **khai báo tường minh** nhóm (group) định tuyến cùng với các middleware tương ứng.

Ví dụ, nếu mở file `routes/admin.php`, bạn sẽ thấy 2 khối mã chính được phân tách rõ ràng bởi Middleware:

1. **Khối không yêu cầu đăng nhập (Guest)**: Chỉ áp dụng cho trang Login.
2. **Khối bắt buộc đăng nhập (Auth)**: Áp dụng cho toàn bộ các chức năng quản trị bên trong.

Việc khai báo công khai này giúp hệ thống rõ ràng và linh hoạt, cho phép lập trình viên nắm quyền kiểm soát trên từng URL thay vì giấu kín dưới hệ thống nền lõi.

---

## 2. Cách Tạo Route Cơ Bản Cho Admin

Đây là mô phỏng cấu trúc thực tế của file `routes/admin.php` do hệ thống xây dựng. Bạn tiến hành khai báo `Prefix` và `Middleware` ghép chuỗi trước khi đi vào nhóm chức năng:

```php
// File: routes/admin.php

use SkillDo\Facades\Route;

// 1. NHÓM CHO PHÉP TRUY CẬP KHI CHƯA ĐĂNG NHẬP (VD: Form Login Admin)
Route::namespace('App\Controllers\Admin')
    ->prefix('admin')
    ->group(function () {
        
        // Gắn Middleware Guest (Ngăn user đã login vào lại trang login)
        Route::middleware('guest:admin')
            ->get('login', 'AuthController@login')
            ->name('admin.auth.login');
            
    });

// 2. NHÓM BẮT BUỘC ĐĂNG NHẬP VÀ CÓ QUYỀN QUẢN TRỊ
Route::namespace('App\Controllers\Admin')
    ->prefix('admin')                   // Tiền tố /admin
    ->middleware('auth:admin')          // Bức tường lửa bảo mật
    ->group(function () {
        
        // Các routes bên trong tự động mang URL /admin/...
        // Và bắt buộc Role Admin mới được thấy
        
        Route::get('/', 'HomeController@index')->name('admin.home.index');
        
        // Ví dụ trang cài đặt
        Route::get('/system', 'SystemController@index')->name('admin.system.index');

    });
```

---

## 3. Tạo Route Cho Các Plugin/Module Mới

Bạn KHÔNG NÊN nhét code xử lý Route của một Plugin riêng biệt vào thẳng trong `routes/admin.php` (Đó là file chung của toàn hệ thống). 
Ví dụ Plugin của bạn có một thư mục quản lý Quà Tặng riêng, bạn hãy đăng ký thông qua **Bootstrapper/Plugin Service Provider**.

*SkillDo cung cấp một Helper hàm Route Group cho phép bọc Middleware `auth:admin` kể cả bên ngoài file `admin.php`.*

Ví dụ, bạn viết code tại class `App\Providers\PluginServiceProvider` của Plugin bạn:

```php
namespace App\Providers;

use SkillDo\Support\ServiceProvider;
use SkillDo\Facades\Route;

class GiftPluginServiceProvider extends ServiceProvider {

    public function boot() {
        
        // Tạo một Group để Bắt đầu chữ "/admin/" và Bật Bảo Mật
        Route::group([
            'prefix'     => 'admin', 
            'middleware' => 'auth:admin'
        ], function () {

            // Bây giờ bên trong này được bảo vệ tương tự. 
            // Sẽ xử lý URL: /admin/gifts/add
            Route::get('gifts/add', [GiftAdminController::class, 'create']);
            
            // Xử lý URL: /admin/gifts/edit/5
            Route::get('gifts/edit/{id}', [GiftAdminController::class, 'edit']);

            Route::post('gifts/save', [GiftAdminController::class, 'store']);
        });

    }
}
```

---

## 4. Xử Lý Request Trong Controller Quản Trị

Khi Request được chấp nhận và đưa vào `GiftAdminController`, Framework đưa toàn bộ công cụ tạo giao diện (View) để nạp trang Admin (khung Navbar/Sidebar) bọc quanh thân trang (Content) của bạn.

Để làm được, hệ thống sử dụng class Admin Controller gốc (`SkillDo\Cms\Controllers\AdminController` hoặc Helper). 

```php
namespace App\Controllers\Admin;

// Mặc định class SkillDo cung cấp Base để load View hệ thống
use SkillDo\Http\Request;

class GiftAdminController {

    public function create() {
        // Thay vì return View() thông thường, bạn cần load Blade Template
        // Dữ liệu truyền sang view
        $data = [
             'title' => 'Thêm Gói Quà Mới'
        ];
        
        // Plugin.BladeView là tên file nằm trong /plugins/gift/views/admin/gifts.blade.php
        return view('gift::admin.gifts', $data);
    }

    public function edit(Request $request, $id) {
         // Biến $id tự lấy từ Route {id}
         $gift = GiftModel::find($id);
         
         if(!$gift) {
             // Hàm Helper lỗi 404 trang Admin (Có sẵn Navbar màu đỏ)
             return abort(404, 'Không tìm thấy quà tặng.');
         }
         
         return view('gift::admin.edit', compact('gift'));
    }

}
```

**TỔNG KẾT**: Chỉ cần đóng gói Logic Routing vào hàm `Route::group(['middleware' => 'auth:admin'])` và để Route xử lý mọi chức năng đăng nhập trước tiên.
