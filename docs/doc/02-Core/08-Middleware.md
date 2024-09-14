Middleware cung cấp một giải pháp khá tiện ích cho việc filtering HTTP các requests trong ứng dụng của bạn.
Ví dụ, CMS có chứa một middleware xác thực user đăng nhập vào ứng dụng của bạn được chứng thực  

### Khởi Tạo Middleware

Để tạo một middleware mới, bạn sử dụng lệnh make:middleware Devtool command:
```php
make:middleware TokenIsValid
```
command này sẽ tạo một class `TokenIsValid` mới trong thư mục `middleware` của bạn. Trong middleware này, chúng tôi sẽ chỉ cho phép truy cập nếu `token` được cung cấp khớp với một giá trị được chỉ định. Nếu không, chúng tôi sẽ chuyển hướng người dùng quay lại URI `/home`:

```php
<?php
 
namespace SkillDo\Middleware;
 
use Closure;
use SkillDo\Http\Request;
 
class TokenIsValid
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request)
    {
        if ($request->input('token') !== 'my-secret-token') {
            return redirect('/');
        }
    }
}
```
### Global Middleware
Nếu bạn muốn gán Middleware cho toàn bộ route:
```php
use SkillDo\Middleware\TokenIsValid;
 
Route::middleware(TokenIsValid::class);
Route::middleware(TokenIsValid::class, 'pre_controller'); // chạy trước khi controller được tạo
Route::middleware(TokenIsValid::class, 'controller'); // chạy sau khi controller được tạo
```

### Gán Middleware cho Routes

Nếu bạn muốn gán Middleware cho các route cụ thể, bạn có thể gọi phương thức middleware:
```php
use SkillDo\Middleware\TokenIsValid;
 
Route::get('/profile', function () {
    // ...
})->middleware(TokenIsValid::class);
```
Nếu bạn muốn gán Middleware cho một nhóm route:

```php
use SkillDo\Middleware\TokenIsValid;
 
Route::middleware(TokenIsValid::class)->group(function () {
    //...
});

Route::middleware(TokenIsValid::class)->prefix('admin')->group(function () {
    //...
});
```
