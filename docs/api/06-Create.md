# Create Api
Để tạo một api mới bạn tạo một plugin mới ví dụ `api-blogs`  
Trong plugin `api-blogs` bạn sẽ tạo các file và thư mục có cấu trúc:
- <span class="badge text-bg-blue">folder</span> **controllers** - chứa danh sách các controller
- <span class="badge text-bg-green">file</span> **routes/api.php** - chứa danh sách route của plugin
- <span class="badge text-bg-blue">folder</span> **middleware** - chứa danh sách middleware của plugin
- <span class="badge text-bg-green">file</span> **api.php** - file main nhúng các file cần thiết
- <span class="badge text-bg-green">file</span> **plugin.json** - file khai báo thông tin plugin
### Thêm routes
Mở file `routes/api.php` và thêm vào các route:
```php
Route::prefix('api/blog')->name('api.blogs.')->middleware(AuthApi::class)->group(function () {
    Route::get('/', 'BlogApi@index', ['namespace' => 'views/plugins/api-blogs/controllers'])->name('index');
    Route::post('/{id}', 'BlogApi@show', ['namespace' => 'views/plugins/api-blogs/controllers'])->name('show');
    Route::put('/{id}', 'BlogApi@update', ['namespace' => 'views/plugins/api-blogs/controllers'])->name('update');
    Route::delete('/{id}', 'BlogApi@delete', ['namespace' => 'views/plugins/api-blogs/controllers'])->name('delete');
});
```
Bạn thấy route đang dùng một middleware có tên là `AuthApi::class`, middleware này có nhiệm vụ kiểm tra xem
khi user gửi dữ liệu từ client lên server có đáng ứng authentication không, đối với các các api không cần kiểm tra authentication bạn cần gở middleware này khỏi route đó.

### Tạo Controller

Tạo một controller `controllers/BlogApi.php` để xây dựng các logic.

```php
<?php
use SkillDo\Http\Rest;
use SkillDo\Http\Request;

class BlogApi extends Rest
{
    public function __construct() 
    {
        parent::__construct();
    }
    
    /*
    * Lấy danh sách blog
    */
    public function index(Request $request)
    {
        return response()->success('success message');
    }
       
    /*
    * Lấy thông tin chi tiết của blog
    */
    public function show(Request $request, $id)
    {
        return response()->success('success message');
    }
    
    /*
    * Cập nhật một blog
    */
    public function update(Request $request, $id)
    {
        return response()->success('success message');
    }
    
    /*
    * Xóa một blog
    */
    public function delete(Request $request, $id)
    {
        return response()->success('success message');
    }
}

```