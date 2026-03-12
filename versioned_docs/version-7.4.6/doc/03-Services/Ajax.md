Ajax là một công nghệ dựa trên JavaScript cho phép một trang web tìm nạp thông tin mới và tự trình bày mà không cần làm mới trang. Ý tưởng đằng sau Ajax là làm cho trang web phản hồi nhanh hơn và tương tác hơn theo quan điểm của người dùng.
>
### Frontend
SkillDo nhận diện ajax callback của bạn thông qua params action
> Sử dụng Ajax của Jquery để gọi:
```jsx
$(document).on('click', '.element', function(event) {
    let data = {
        action: 'TestAjax::actionName',
    };
    $.post(ajax, data, function(data) {}, 'json').done(function(response) {
        SkilldoMessage.response(response)
    });
});
```
> Trong version 7 cms có tích hợp thêm [axios](https://axios-http.com/docs/intro) để gọi ajax hay các cuộc gọi api

```jsx
$(document).on('click', '.element', function(event) {
    let data = {
        action: 'TestAjax::actionName',
    };
    request.post(ajax, data).then(function(response) {
        SkilldoMessage.response(response)
    })
});
```
Trong 2 ví dụ trên bạn thấy :
* biến `ajax` là url gọi ajax chung của cms
* `TestAjax::actionName` là callback ở backend sẽ xử lý dữ liệu và trả data về với dạng **json**
* biến `request` là axios đã được cms cấu hình để khi sử dụng sẽ tự động gửi thêm **csrf token** nếu bạn không muốn sử dụng cấu hình mặc định của cms bạn có thể tạo 1 cấu hình khác và gọi với cấu hình của bạn, bạn có thể xem cấu hình mặc định ở file `http.js`

Trong một số trường hợp ngôn ngữ giữa `admin` và `client` sẽ không giống nhau ví dụ như admin đang sử dụng ngôn ngữ tiếng việt và client đang sử dụng tiếng anh.
Để gọi chính xác ngôn ngữ bạn cần bạn có thể thêm params "`_is_lang`" vào data với giá trị là theme nếu muốn lấy ngôn ngữ theo `client` và `admin` nếu lấy theo admin

```jsx
$(document).on('click', '.element', function(event) {
    let data = {
        action: 'TestAjax::actionName',
        _is_lang: 'theme'
    };
    request.post(ajax, data).then(function(response) {
        SkilldoMessage.response(response)
    })
});
```


### Backend

#### Function callback
Ở Backend bạn cần tạo function callback mà bạn đã gán vào action ở phía frontend
> Example
```php
use SkillDo\Http\Request
class TestAjax {
    #[NoReturn]
    static function actionName(Request $request, $model): void
    {
        if($request->all()) 
        {
            response()->success('thành công!');
        }
        
        response()->error('không thành công');
    }
}
```


#### Registration ajax
Sau khi tạo function callback bạn phải đăng ký với cms đây là function callback của ajax

##### <code>Ajax::client</code>
Method <code>Ajax::client</code> nhận vào hai tham số  
- **action**: (string) tên callback sẽ thực thi ajax
- **methods**: (string|array) danh sách phương thức request (get, post, put, path, delete)

```php
Ajax::client('TestAjax::actionName', 'post');
Ajax::client('TestAjax::actionName', ['put', 'post']);
```

##### <code>Ajax::login</code>
Method đăng ký những ajax chỉ được thực thi khi người dùng đã đăng nhập  
Method <code>Ajax::login</code> nhận vào hai tham số
- **action**: (string) tên callback sẽ thực thi ajax
- **methods**: (string|array) danh sách phương thức request (get, post, put, path, delete)

```php
Ajax::login('TestAjax::actionName', 'post');
Ajax::login('TestAjax::actionName', ['put', 'post']);
```

##### <code>Ajax::admin</code>
Method đăng ký những ajax chỉ được thực thi khi người dùng đã đăng nhập và có quyền truy cập vào admin
Method <code>Ajax::admin</code> nhận vào hai tham số
- **action**: (string) tên callback sẽ thực thi ajax
- **methods**: (string|array) danh sách phương thức request (get, post, put, path, delete)

```php
Ajax::admin('TestAjax::actionName', 'post');
Ajax::admin('TestAjax::actionName', ['put', 'post']);
```
