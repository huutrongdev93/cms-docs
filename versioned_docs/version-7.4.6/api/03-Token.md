### Tạo token
Tạo access token cho một user
```php
$user = User::find(1);
$tokenInfo = $user->createToken();
/*
 * ['token' => ..., 'expires_at' => ...]
 */
```

### Decode Token
Decode access token ra thông tin, kiểm tra token hợp lệ hay không
```php
$token = request()->bearerToken();

$tokenInfo = JWTAuth::token()->decode($token);
/*
 * ['id' => ..., ...]
 */
```

### Find token
Tìm một token trong hệ thống và còn được phép sử dụng

```php
$token = request()->bearerToken();

$tokenInfo = JWTAuth::token()->find($token);
```

### Revoke token
Tắt token không cho sử dụng token này nữa

```php
$token = request()->bearerToken();

$tokenInfo = JWTAuth::token()->revokeToken($token);
```