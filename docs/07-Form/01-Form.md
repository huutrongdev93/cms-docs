SkillDo cung cấp thư viện mạnh mẽ để làm việc với Form

### Tạo Form
Để tạo một Form bạn cần khởi tạo một đối tượng từ class Form

```php
$form = new Form();
```

Để set id cho Form bạn dùng phương thức `setFormId`:
```php
$form = new Form();
$form->setFormId('my_form_id');
```

Form SkillDo có cung cấp cơ chế tự động `Validation` field bằng `JS` ở frontend, 
để kích hoạt cơ chế này bạn có thể sử dụng phương thức `setIsValid` với biến là nhận vào là true

```php
$form = new Form();
$form->setFormId('my_form_id');
$form->setIsValid(true);
```
Khi kích hoạt Validation bắt buộc form phải có id nếu bạn không setFormId hệ thống sẽ tự sinh ra Id duy nhất cho Form
>
Để kích hoạt JS Validation form phải được `submit` bằng `button` có `type là submit` và name khác submit

Sau khi form Validation thành công bạn không muốn send submit cho backend mà sẽ thực hiện một thao tác js nào đó ví dụ như gửi data form đến ajax thì có thể sử dụng phương thức `setCallbackValidJs`:

```php
$form = new Form();
$form->setFormId('my_form_id');
$form->setIsValid(true);
$form->setCallbackValidJs('myFormSubmitHandler');
```
Js

```jsx
function myFormSubmitHandler(form) {
    let data = form.serializeJSON();
    return false;
}
```


### Thêm Field Vào Form

Sau khi khởi tạo được form bạn cần thêm các Field cần thiết vào form, 
để thêm Field vào form bạn có thể sử dụng một trong hai cách sau:

sử dụng phương thức add để thêm Field:

```php
$form->add(string $name, string $type, array $args, mixed $value);
```
| Column Name |  Type  |                                      Description |
|-------------|:------:|-------------------------------------------------:|
| $name       | string |                                    Tên của Field |
| $type       | string | Loại field ví dụ như (text, select, checkbox...) |
| $args       | array  |               Các attributes hoặc cấu hình field |
| $value      | mixed  |                          Giá trị value của field |

hoặc sử dụng thuộc tính động của Form ví dụ như thêm field text:

```php
$form->text('myField', ['label' => 'My Field'], 'value');
```

### Hiển Thị Form

Để hiển thị Form bạn sử dụng ba phương thức `open`, `html` và `close`

```php
echo $form->open();
echo $form->html();
echo $form->close();
```

Với phương thức `open` nhận vào hai đối số:

| Params      |  Type  |                       Description | Mặc định |
|-------------|:------:|----------------------------------:|---------:|
| $method     | string |             Loại form (get, post) |     post |
| $attributes | array  | Các attributes hoặc cấu hình form |          |

Tham số `$attributes` chứa một số cấu hình form:

| Params     |     Type      |                                          Description | Mặc định |
|------------|:-------------:|-----------------------------------------------------:|---------:|
| validation |     bool      |         Nếu là true tương đương với setIsValid(true) |          |
| callback   |    string     |       Tương đương với phương thức setCallbackValidJs |          |
| class      |     array     |               Danh sách các class chèn thêm vào form |     null |
| style      | string, array |                         chèn css inline vào thẻ form |     null |
| file       |    string     | Nếu true sẽ chèn thêm `multipart/form-data` vào form |    false |

Ngoài ra bạn còn có thể chèn các attribute khác với các cập key/value

```php
$form->open('post', [
    'validation' => true,
    'callback' => 'myFormSubmitHandler',
    'class' => ['my-class'],
    'style' => ['font-size' => '18px'],
    'data-id' => 'myForm'
]);
```

Ngoài ra khi method của bạn là `POST`, `PUT` or `DELETE` thì CSRF token sẽ được tự động thêm vào form với 1 trường ẩn dạng hidden

