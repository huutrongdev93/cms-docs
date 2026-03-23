# Bảo Mật API (CORS, CSP, XSS, CSRF)

Bảo mật là ưu tiên hàng đầu trong SkillDo CMS v8. Bất kể một yêu cầu (Request) nào đi vào Website hay App API của bạn đều phải vượt qua một lá chắn "Tầng Lớp Middleware (Global Middleware Pipeline)" trước khi có thể chạm tới Code Controllers. 

Dưới đây là các cơ chế cốt lõi chịu trách nhiệm lọc và bảo vệ hệ thống. Cấu hình để tắt/mở tuỳ mục đích nằm ở mục `config/`.

---

## 1. CORS (Cross-Origin Resource Sharing)

Nếu API của bạn nằm ở `api.domain.com` và bạn build một React App chạy ở `shop.domain.com` gửi lệnh đăng nhập đến API, trình duyệt sẽ tự động CHẶN lệnh này vì rủi ro rò rỉ (Chặn Khác Tên Miền - Đuôi Trình Duyệt).
Để cho phép React App lấy được dữ liệu, bạn phải khai báo bật CORS.

**SkillDo có Middleware `HandleCors`** tự chạy trước. Lấy thông tin cấp phép từ tệp `config/cors.php`:

```php
// config/cors.php
return [
    /*
    | Cho phép các trang khác đọc được Header URL Này. 
    | Hệ thống thêm Header mặc định là 'api/*'. 
    | Các trang có đường dẫn web bình thường như /san-pham không thuộc cơ chế CORS của API.
    */
    'paths' => ['api/*'],

    // Giới hạn HTTP Method từ Client: GET, POST
    'allowed_methods' => ['*'], // Cho phép tất cả (*) GET, POST, PUT, DELETE...

    // Web nào mới được khai phá vào API (Origins)? 
    // Tránh để * nều bạn không muốn mọi trang Web trên Internet ăn trộm Data API của bạn tự do.
    'allowed_origins' => ['https://shop.domain.com'],

    // Thời gian cache CORS (Pre-flight OPTIONS request)
    'max_age' => 0,

    'supports_credentials' => false,
];
```

---

## 2. Request Sanitizer (Lọc Kịch Bản Chéo XSS - XSS Injection)

Khi người dùng đánh giá Sản phẩm: `"Hàng tốt quá <script>alert('Hack!');</script>"` ở ô Bình luận. Khung Bình Luận đó lưu vào DB và hiển thị cho Quản Trị Viên đọc sẽ gây thực thi mã nguy hiểm trên Server/Browser.

**SkillDo bảo vệ bằng Middleware `RequestSanitizer`** dựa trên HTMLPurifier. Nó Quét TẤT CẢ mọi dữ liệu đầu vào `$_POST`, `$_GET`, từ Web Form cho đến JSON gửi qua API.

Cài đặt (Được cung cấp sẵn với chuẩn Strict):
```php
// config/request-sanitizer.php
return [
    // Tự động Lọc toàn bộ 
    'enabled' => env('SANITIZER_ENABLED', true),

    // Các Route Đặc biệt không bị dính Lọc Chặn Tag Script (Như Lưu Bài Viết Dùng TinyMCE Của Admin)
    'except' => [
        'admin/post/save',
        'admin/theme-options/save'
    ],
    
    // Whitelist: Chỉ giữ nguyên mã các Tag nếu họ nhập in đậm, italic
    'allowed_tags' => '<a><b><strong><i><em><u><ul><li><ol><p><br>',
];
```

---

## 3. CSP (Content Security Policy) và Security Headers

Không chỉ bảo vệ máy chủ (Server), Framework còn bảo vệ **Trình Duyệt (Browser)** của người đọc. 
Middleware `SecurityHeaders` sẽ đính kèm thông tin trên Đầu Phản Hồi Website. Nó quy định Browser ĐƯỢC CHẠY CHÍNH XÁC File Ảnh/File Script JS từ đâu, chặn Nhúng Iframe giả mạo.

```php
// config/security-headers.php
return [
    // Chống Load Ảnh, Load Video bừa bãi không rõ máy chủ
    'csp' => [
        'connect-src' => ["'self'", "https://www.google-analytics.com"], 
        'script-src'  => ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://connect.facebook.net"],
        'style-src'   => ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        // Quy định thêm Font, Image CDN...
    ],

    // Không cho phép Hacker dùng Iframe <iframe> nhét web bạn vào trang của Hacker làm Phishing (Nhử mồi)
    'x_frame_options' => 'SAMEORIGIN',
...
```

---

## 4. Bảo Vệ CSRF (Cross-Site Request Forgery)

Giả sử quản trị viên đang đăng nhập CMS. Một kẻ lạ gửi link ảnh `http://domain.com/admin/delete/user/1`.
Chỉ cần trình duyệt Mở Load ảnh này, Hành động XÓA User 1 của CMS vẫn tự chạy. Đây là lỗ hổng Lừa Đảo Chéo Trang (CSRF).

**SkillDo sử dụng Middleware `VerifyCsrfToken`**. 
- Hệ thống ghi mã bảo mật Token ngẫu nhiên (Lưu thành biến Session tên `_token`).
- Mỗi Form Bắt Buộc sinh ra một Lỗ Khóa `<input type="hidden" name="_token">`.
- Nếu POST request từ Form không gửi kèm Cùng Chuỗi Token đang khớp tại DB => Hệ Thống Từ Chối 419 (Báo Lỗi `Page Expired`).

Cấu Trúc Tự Động Xử Lý ở Form:
```html
<form action="/login" method="POST">
    <!-- Sinh mã bằng Blade Engine -->
    {!! csrf_field() !!}
    <input type="text">
</form>
```

Khác với Website, **API (Lấy Data Từ App/Postman) Tuyệt đối TẮT CSRF**. Lý do là App không duy trì Bộ Nhớ Session (Stateless), nên token không hoạt động. Hãy xem phần Header loại trừ `api/*` được bảo vệ ngoại lệ tại `config/csrf.php`.
