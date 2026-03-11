# Xây Dựng RESTful API Trong SkillDo CMS

SkillDo CMS v8 hỗ trợ mạnh mẽ việc xây dựng API (Application Programming Interface), cho phép các ứng dụng Mobile App (React Native, Flutter) hoặc Frontend độc lập (SPA bằng Vue/React) có thể giao tiếp và lấy dữ liệu trực tiếp từ hệ thống.

Toàn bộ quá trình định tuyến và phản hồi API đã được chuẩn hóa để trả về định dạng JSON thống nhất.

---

## 1. Định Tuyến API (API Routes)

Tất cả các endpoint API phải được đăng ký trong file **`routes/api.php`**. 
Mặc định, các route đăng ký trong file này sẽ tự động được hệ thống gắn:
- **Prefix URL**: `/api/` 
- **Middleware**: Các logic bảo vệ định dạng request và Middleware API riêng biệt (như JWT token, kiểm tra CSRF ngoại lệ).

### Ví dụ Tạo Một Endpoint API Mới

Mở tệp `routes/api.php` và thêm đường dẫn lấy danh sách sản phẩm:

```php
use SkillDo\Facades\Route;
use App\Controllers\Api\ProductApiController;

// Route công khai (Public) lấy danh sách không cần đăng nhập
// Endpoint: GET /api/products
Route::get('api/products', [ProductApiController::class, 'index']);

// Route yêu cầu xác thực API Key hoặc Token mới được dùng (POST để tạo Data Mới)
// Endpoint: POST /api/products
Route::post('api/products', [ProductApiController::class, 'store'])->middleware('api.auth');
```

---

## 2. Controller API & Chuẩn Hóa Response

Khác với Controller trả về giao diện View (`view('...')`), Controller API sẽ chỉ trả về Mảng (Array), Dữ liệu (Object) rỗng thông qua hệ thống **Response Factory** dưới định dạng JSON.

SkillDo quy định một cấu trúc (Standard Response) để đảm bảo đồng nhất cho lập trình viên Front-End đọc.

Cấu trúc chuẩn của API Response trong SkillDo luôn chứa 2 hoặc 3 trường:
- `status`: Bắt buộc. Nhận giá trị `error` hoặc `success`. Báo hiệu thành công hay thất bại.
- `message`: Câu thông báo giải thích. Dùng để Alert trên App.
- `data`: (Tùy chọn) Mã mảng dữ liệu trả về nếu là `success`. Chứa chuỗi Token, danh sách bản ghi, ...

### Ví Dụ Viết Một API Controller

Tạo file `app/Controllers/Api/ProductApiController.php`:

```php
namespace App\Controllers\Api;

use SkillDo\Http\Request;
use SkillDo\Validate\Rule;
use App\Models\ProductModel;

class ProductApiController {

    // 1. GET Dữ liệu Thành Công
    public function index(Request $request) {
         // Lọc lấy 10 sản phẩm mới nhất
         $products = ProductModel::orderBy('id', 'desc')->limit(10)->get();
         
         // Trả về định dạng JSON Success kèm Message
         response()->success('Lấy dữ liệu 10 sản phẩm mới nhất thành công', $products);
    }

    // 2. Tạo Mới Với Validate Dữ Liệu
    public function store(Request $request) {
         
         // Hệ thống SkillDo Validator xử lý chuỗi tham số qua class Rule
         $validate = $request->validate([
             'name'  => Rule::make('Tên sản phẩm')->notEmpty()->max(255),
             'price' => Rule::make('Giá bán')->notEmpty()->numeric()
         ]);
         
         // Nếu Validation Thất bải: Hệ thống sẽ ngắt (break) và tự động trả về JSON chuẩn chứa thông báo lỗi.
         if ($validate->fails()) 
         {
             response()->error($validate->errors());
         }

         // Lưu Database...
         $product = ProductModel::create([
             'name'  => $request->input('name'),
             'price' => $request->input('price')
         ]);

         // Thành công tạo Mới trả về Data
         response()->success('Tạo sản phẩm thành công', $product);
    }
}
```

---

## 3. Quản Lý Middleware API Trọng Yếu Tích Hợp Sẵn

Bên cạnh bảo mật xác thực (Sẽ đề cập ở bài Access Token), Framework API có những cơ chế ngầm:

1. **`HandleCors`**: Đảm bảo rằng ứng dụng Mobile App hay Website (Khác tên miền `domain.com`) có thể thực hiện gọi AJAX POST thẳng vào tên miền của bạn mà không bị rào chặn CORS Error (Cross-Origin Resource Sharing) Policy. *(Có thể đổi Origin ở `config/cors.php`)*.
2. **Loại bỏ CSRF**: Toàn bộ Endpoint có gắn `/api/*` sẽ được Bypass (Bỏ qua) không cần kiểm tra CSRF Token. (Vì môi trường API Stateless, không xài Session). Thay vì cookie, bảo mật sẽ dùng Token Headers.
3. **`RequestSanitizer`**: Bảo vệ API Endpoint của bạn tự động chống lại SQL Injection và XSS bằng cách lọc sạch thẻ `<script>` ra khỏi input khi App Client bắn request POST lên tạo Sản phẩm.
