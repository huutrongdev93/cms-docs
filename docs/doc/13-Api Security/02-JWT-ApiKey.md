# JWT Token & API Key

SkillDo CMS v8 được tích hợp sẵn hệ thống API Authentication với **2 phương thức xác thực** độc lập, an toàn và tối giản:

1. Xác thực bằng **JSON Web Token (JWT)** (Mô hình Mobile App / Web SPA Đăng Nhập).
2. Xác thực bằng **API Key** (Mô hình Server-to-Server, Đối Tác).

Hệ thống bảo mật này được cung cấp cốt lõi bởi `SkillDo\Api\ApiServiceProvider`.

---

## 1. Kiến Trúc

```
SkillDo\Api\
├── ApiServiceProvider              # Đăng ký config, middleware, migration
├── config/jwt.php                  # Cấu hình JWT + API Key
├── Database/database.php           # Migration (3 bảng)
├── Middlewares/
│   ├── JwtAuthenticate             # Middleware: chỉ JWT
│   ├── ApiKeyAuthenticate          # Middleware: chỉ API Key
│   └── ApiAuthenticate             # Middleware: JWT hoặc API Key
├── Models/
│   ├── AccessToken                 # oauth_access_tokens
│   ├── RefreshToken                # oauth_refresh_tokens
│   └── ApiKey                      # api_keys
└── Repository/
    ├── TokenRepository             # Quản lý access tokens
    ├── RefreshTokenRepository      # Quản lý refresh tokens
    └── ApiKeyRepository            # Quản lý API keys
```

## 2. Cài Đặt Ban Đầu

Hệ thống yêu cầu cài đặt gói mã hóa JWT và thiết lập môi trường hệ thống.

### Cấu hình Secret Key

SkillDo sử dụng thuật toán băm (Hmac) HS256 cho độ tối ưu tốc độ và an toàn cao. Trong file **`.env`**, hãy chuẩn bị bộ chìa khóa bí mật (Chìa khóa này không được cho ai biết).

```env
# Mật khẩu gốc tối thiểu 32 ký tự ngẫu nhiên
JWT_PRIVATE_KEY=your-secret-key-at-least-32-characters-long-random

# Hạn sử dụng Access Token tính bằng Phút (480 = 8 Tiếng)
JWT_TTL=480

# Hạn sử dụng Refresh Token tính bằng Phút (20160 = 2 Tuần)
JWT_REFRESH_TTL=20160
```
> Khi hệ thống Boot `ApiServiceProvider`, nó cũng sẽ tự động tạo bảng (Migration) 3 bảng lưu token: `oauth_access_tokens`, `oauth_refresh_tokens`, `api_keys`.

---

## 3. Cơ Chế JWT Bearer Token Đăng Nhập (App / Frontend)

Phương thức này dành riêng cho việc User dùng Tên và Mật Khẩu (form Login) để tạo vé thông hành. Phù hợp cho App (React/Vue/Mobile). 

SkillDo Middleware **`jwt`** chuyên giải quyết việc chặn/thoát của vé này.

### Trình tự vận hành thực tế

1. **[Quy Trình Login]**: Client App gửi POST chứa `{"username": "admin", "password": "123"}` vào `POST /api/auth/login`.  
   -> Hệ thống cấp Token `accessToken` + `refreshToken` + Thông tin User cho Client lưu (vào Storage của điện thoại).
2. **[Truy Cập API Bị Chặn]**: Bất cứ khi nào FrontEnd gọi các API nhạy cảm (VD: `GET /api/auth/current`), Framework yêu cầu phải ghép Token vào Header:
   ```html
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhb...
   ```
3. Middleware đọc Header, Verify bằng Khóa `JWT_PRIVATE_KEY` và gán Người Dùng thành công nếu Token hợp lệ và chưa Hết Hạn.

> [!TIP]
> **Token Rotation (Refresh Token):** Khi `accessToken` 8 tiếng hết hạn, Client bắn tiếp `refreshToken` cũ qua URL `POST /api/auth/refresh`. Hệ thống sẽ Cấp đổi lại 2 Token MỚI TOANH và Thu hồi thẻ cũ. App của bạn sẽ duy trì trạng thái Login không lo bắt User nhập pass!

---

## 3. Cơ Chế Xác Thực API Key (Server To Server)

API Key phù hợp khi bạn cho phép một **Hệ Thống của Đối Tác** (Ví dụ hệ thống ERP cập nhật Kho gọi qua CMS SkillDo). Đối tác đó không thể Login bằng Form Username mỗi 8 tiếng được. Bạn sẽ cấp cho họ một chìa khóa bằng chuỗi để họ gửi vĩnh viễn trong Code máy chủ của họ.

SkillDo Middleware **`api-key`** chuyên bảo vệ các dạng này.

### Cách quản lý API Key
SkillDo cung cấp Endpoint tích hợp để bạn tự sinh API Key: `POST /api/keys` (Endpoint sinh Key này cần bạn truyền kèm JWT Token đăng nhập).

*Hệ thống CMS sẽ trả về Key tĩnh MỘT LẦN DUY NHẤT*. (VD: `sk_a1b2c3d4e5...`). Sau đó API Key bị Hash thẳng vào bảng `api_keys`.

### Cách Đối Tác Gửi Request

Đối tác phải đóng Header: **`X-API-Key`** hoặc Request có tham số URL `?api_key=`.

```bash
# Lệnh gửi ví dụ bằng CURL
curl -X GET "https://domain-cms.com/api/products" \
     -H "Content-Type: application/json" \
     -H "X-API-Key: sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4"
```

Hệ thống sẽ băm ngược chuỗi này theo Khóa bí mật JWT, đối chiếu trong Database xem Key đã tự động hết hạn, hay bị chặn (Revoked) chưa.

---

## 4. Bảng Tóm Tắt Cách Cấu Hình Router Tự Chọn Middleware

Để bảo vệ các Route của bạn (Ví dụ route lấy Giỏ Hàng, Xóa Sản phẩm), bạn sẽ Gắn Middleware thích ứng vào Router Group hoặc đơn lẻ bằng 3 chuẩn Aliases của V8:

```php
// File: routes/api.php
use SkillDo\Facades\Route;

// CẤP 1 - MIDDLEWARE "jwt": Chỉ APP LOG-IN/WEB LOG-IN mới được gọi
Route::middleware('jwt')->group(function () {
    Route::get('gift/my-gifts', 'GiftController@myGifts');
    Route::post('/keys', 'ApiKeysController@store'); // Tạo API Key
});

// CẤP 2 - MIDDLEWARE "api-key": Chỉ MÁY CHỦ ĐỐI TÁC mới được gọi
Route::middleware('api-key')->group(function () {
    Route::get('/webhook', 'WebhookController@handle');
});

// CẤP 3 - TỔNG HỢP: MIDDLEWARE "api.auth": Cả APP LẪN ĐỐI TÁC ĐỀU ĐƯỢC THÔNG QUA
Route::middleware('api.auth')->group(function () {
    Route::post('gift/create-order', 'GiftController@createOrder');
});
```

*Nếu thiếu 1 trong 2 Token, Hệ thống SkillDo v8 sẽ tự động báo lỗi HTTP Status `401 Unauthorized` bằng định dạng JSON thống nhất của API Response.*
