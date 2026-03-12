class cung cấp một số method thường hay sử dụng

### buttonLoading
Tạo đối tượng loading cho button. Tham số nhận vào là đối tượng muốn tạo loading
```javascript
let button = document.getElementById('buttonLoading')

let loading = SkilldoUtil.buttonLoading(button)

//bắt đầu hiển thị loading
button.start()

//kết thúc loading
button.stop()
```

### uniqId
Hàm SkilldoUtil.uniqId được sử dụng để tạo ra một chuỗi ID duy nhất mỗi khi nó được gọi. 
Chuỗi ID này được tạo ra bằng cách kết hợp timestamp hiện tại, một chuỗi ngẫu nhiên, và một bộ đếm nội bộ. Hàm đảm bảo rằng mỗi lần được gọi sẽ trả về một ID khác nhau, ngay cả khi được gọi liên tiếp trong thời gian ngắn.

```javascript
let id = SkilldoUtil.uniqId()
```

### setCookie
Hàm SkilldoUtil.setCookie được sử dụng để tạo hoặc cập nhật một cookie trên trình duyệt. Cookie này sẽ lưu trữ một giá trị cụ thể cho một khoảng thời gian nhất định và có thể được áp dụng cho một đường dẫn nhất định trong trang web.
* name: tên cookie
* value: giá trị của cookie
* time: thời gian tồn tại của cookie tính bằng phút
* path
```javascript
SkilldoUtil.setCookie('login', true, 30)
```

### getCookie
Hàm SkilldoUtil.getCookie được sử dụng để lấy giá trị của một cookie dựa trên tên của nó. Nếu cookie tồn tại, hàm sẽ trả về giá trị của nó, ngược lại sẽ trả về một chuỗi rỗng.
```javascript
let isLogin = SkilldoUtil.getCookie('login')
```

### delCookie
Hàm SkilldoUtil.delCookie được sử dụng để xóa một cookie khỏi trình duyệt bằng cách thiết lập thời gian hết hạn của cookie về một ngày trong quá khứ.
```javascript
SkilldoUtil.delCookie('login')
```

### formatNumber
method định dạng một số theo hàng ngìn 
```javascript
SkilldoUtil.formatNumber(10000000) // 10,000,000
```

### isset
Hàm SkilldoUtil.isset được sử dụng để kiểm tra xem một phần tử HTML có tồn tại và hợp lệ hay không. Hàm này có thể xử lý đầu vào là một chuỗi (string) đại diện cho một CSS selector hoặc là một đối tượng jQuery. 
Hàm sẽ trả về giá trị `true` nếu phần tử tồn tại và có thuộc tính innerHTML, ngược lại, sẽ trả về `false`.
```javascript
SkilldoUtil.isset('.btn-login') //true or false
SkilldoUtil.isset($('.btn-login')) //true or false
```

### debounce
Tạo một debounce để trì hoãn việc gọi func cho đến khi hết một phần nghìn giây chờ đợi kể từ lần cuối cùng debounce được gọi.

```javascript
$(document).on('keyup', '.js_input_search', SkilldoUtil.debounce(function () {
    searchObject() //function search
}, 500));
```
