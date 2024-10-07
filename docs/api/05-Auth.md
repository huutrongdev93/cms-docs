### Đăng ký
Call api để tạo thành viên  

**Service Endpoint**

<pre><span class="badge text-bg-yellow">POST</span> `{{BASE_URL}}`/api/auth/register</pre>

**Parameters**

|   Name    |  Type  | Required or not |      Description       |
|:---------:|:------:|:---------------:|:----------------------:|
| username  | string |       yes       |     Tên đăng nhập      |
| password  | string |       yes       |   mật khẩu đăng nhập   |
| firstname | string |       yes       |      Họ của user       |
| lastname  | string |       yes       |      Tên của user      |
|   email   | string |       yes       |     email của user     |
|   phone   | string |       yes       | Số điện thoại của user |

**Response**

```json
{
    "status": "success",
    "code": "200",
    "message": "Register successful"
}
```

### Đăng nhập
Lấy thông tin access token và refresh token

**Service Endpoint**

<pre><span class="badge text-bg-yellow">POST</span> `{{BASE_URL}}`/api/auth/login</pre>

**Parameters**

|   Name   |  Type  | Required or not |    Description     |
|:--------:|:------:|:---------------:|:------------------:|
| username | string |       yes       |   Tên đăng nhập    |
| password | string |       yes       | mật khẩu đăng nhập |

**Response**

```json
{
    "token_type": "Bearer",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires": 1728301612,
    "data": {
        "id": 2,
        "username": "admin",
        "firstname": "Quản Trị",
        "lastname": "Viên",
        "email": "kythuat.sikido@gmail.com",
        "phone": "01697093243"
    },
    "status": "success",
    "code": "200",
    "message": "Login successful"
}
```

### Refresh Token
Lấy access token bằng refresh token  

**Service Endpoint**

<pre><span class="badge text-bg-yellow">POST</span> `{{BASE_URL}}`/api/auth/refresh-token</pre>

**Parameters**

|     Name      |  Type  | Required or not |    Description     |
|:-------------:|:------:|:---------------:|:------------------:|
| refresh_token | string |       yes       |   refresh_token    |

**Response**

```json
{
    "token_type": "Bearer",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "expires": 1728301612,
    "status": "success",
    "code": "200",
    "message": "Login successful"
}
```

### Thông tin
Lấy thông tin user theo token

**Service Endpoint**

<pre><span class="badge text-bg-green">GET</span> `{{BASE_URL}}`/api/auth/profile</pre>

**Header**

|     Name      |  Type  | Required or not |                            Description                            |
|:-------------:|:------:|:---------------:|:-----------------------------------------------------------------:|
| Authorization | string |       yes       | Bearer tokens enable requests to authenticate using an access key |

**Response**

```json
{
    "data": {
        "id": 2,
        "username": "admin",
        "firstname": "Quản Trị",
        "lastname": "Viên",
        "email": "kythuat.sikido@gmail.com",
        "phone": "01697093243"
    },
    "status": "success",
    "code": "200",
    "message": "profile user"
}
```

### Cập nhật thông tin
Cập nhật thông tin user theo token

**Service Endpoint**

<pre><span class="badge text-bg-blue">PUT</span> `{{BASE_URL}}`/api/auth/profile</pre>

**Header**

|     Name      |  Type  | Required or not |                            Description                            |
|:-------------:|:------:|:---------------:|:-----------------------------------------------------------------:|
| Authorization | string |       yes       | Bearer tokens enable requests to authenticate using an access key |

**Parameters**

|   Name    |  Type  | Required or not |      Description       |
|:---------:|:------:|:---------------:|:----------------------:|
| firstname | string |       no        |      Họ của user       |
| lastname  | string |       no        |      Tên của user      |
|   email   | string |       no        |     email của user     |
|   phone   | string |       no        | Số điện thoại của user |

**Response**

```json
{
    "status": "success",
    "code": "200",
    "message": "update profile successful"
}
```

### Cập nhật mật khẩu
Cập nhật mật khẩu user theo token

**Service Endpoint**

<pre><span class="badge text-bg-blue">PUT</span> `{{BASE_URL}}`/api/auth/password</pre>

**Header**

|     Name      |  Type  | Required or not |                            Description                            |
|:-------------:|:------:|:---------------:|:-----------------------------------------------------------------:|
| Authorization | string |       yes       | Bearer tokens enable requests to authenticate using an access key |

**Parameters**

|     Name     |  Type  | Required or not |         Description         |
|:------------:|:------:|:---------------:|:---------------------------:|
| old_password | string |       yes       | mật khẩu đăng nhập hiện tại |
| new_password | string |       yes       |   mật khẩu đăng nhập mới    |

**Response**

```json
{
    "status": "success",
    "code": "200",
    "message": "change password successful"
}
```

### Đóng tài khoản
Đóng tài khoản theo token

**Service Endpoint**

<pre><span class="badge text-bg-yellow">POST</span> `{{BASE_URL}}`/api/auth/block</pre>

**Header**

|     Name      |  Type  | Required or not |                            Description                            |
|:-------------:|:------:|:---------------:|:-----------------------------------------------------------------:|
| Authorization | string |       yes       | Bearer tokens enable requests to authenticate using an access key |

**Response**

```json
{
    "status": "success",
    "code": "200",
    "message": "Block account successful"
}
```

### Đăng xuất
Thoát tài khoản theo token

**Service Endpoint**

<pre><span class="badge text-bg-yellow">POST</span> `{{BASE_URL}}`/api/auth/logout</pre>

**Header**

|     Name      |  Type  | Required or not |                            Description                            |
|:-------------:|:------:|:---------------:|:-----------------------------------------------------------------:|
| Authorization | string |       yes       | Bearer tokens enable requests to authenticate using an access key |

**Response**

```json
{
    "status": "success",
    "code": "200",
    "message": "logout account successful"
}
```