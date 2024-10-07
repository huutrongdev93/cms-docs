### Tạo refresh token
Tạo refresh token cho một user
```php
$user = User::find(1);
$tokenInfo = $user->createRefreshToken($accessToken);
/*
 * ['token' => ..., 'expires_at' => ...]
 */
```

### Decode refresh token
Decode refresh token ra thông tin, kiểm tra token hợp lệ hay không
```php
$token = request()->bearerToken();

$tokenInfo = JWTAuth::refreshToken()->decode($token);
/*
 * ['id' => ..., ...]
 */
```

### Find refresh token
Tìm một token trong hệ thống và còn được phép sử dụng

```php
$token = request()->bearerToken();

$tokenInfo = JWTAuth::refreshToken()->find($token);
```

### Revoke refresh token
Tắt token không cho sử dụng token này nữa bằng id

```php
$token = request()->bearerToken();

$tokenInfo = JWTAuth::refreshToken()->revokeToken($token);
```

Tắt token không cho sử dụng token này nữa bằng access token

```php
$token = request()->bearerToken();

$tokenInfo = JWTAuth::refreshToken()->revokeTokenByAccessToken($token);
```