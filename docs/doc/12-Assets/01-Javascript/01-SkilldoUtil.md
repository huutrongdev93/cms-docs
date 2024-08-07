class cung cấp một số method thường hay sử dụng

### buttonLoading
Tạo đối tượng loading cho button. Tham số nhận vào là đối tượng muốn tạo loading
```javascript
let button = document.getElementById('buttonLoading')

let loading = SkilldoUtil.buttonLoading(button)

//bắt đầu hiển thị loading
button.loading()

//kết thúc loading
button.success()
```

### uniqId
Tạo một chuổi string duy nhất
```javascript
let id = SkilldoUtil.uniqId()
```

### setCookie
method tạo mới một cookie, tham số nhận vào bao gồm
* name: tên cookie
* value: giá trị của cookie
* time: thời gian tồn tại của cookie tính bằng phút
* path
```javascript
SkilldoUtil.setCookie('login', true, 30)
```

### getCookie
method tạo lấy một cookie đã tạo trước đó
```javascript
let isLogin = SkilldoUtil.getCookie('login')
```

### delCookie
method xóa một cookie đã tạo trước đó
```javascript
SkilldoUtil.delCookie('login')
```

### formatNumber
method định dạng một số theo hàng ngìn 
```javascript
SkilldoUtil.formatNumber(10000000) // 10,000,000
```

### isset
method kiểm tra một element có tồn tại hay không
```javascript
SkilldoUtil.isset('.btn-login') //true or false
```

### debounce
Tạo một debounce để trì hoãn việc gọi func cho đến khi hết một phần nghìn giây chờ đợi kể từ lần cuối cùng debounce được gọi.

```javascript
$(document).on('keyup', '.js_input_search', SkilldoUtil.debounce(function () {
    searchObject() //function search
}, 500));
```
