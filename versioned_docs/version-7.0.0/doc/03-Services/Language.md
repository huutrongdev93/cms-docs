# Language
Bản dịch được lưu trữ bằng các file php trong thư mục language của ứng dụng. Trong thư mục này, có thể có các thư mục con cho từng ngôn ngữ được ứng dụng hỗ trợ. chẳng hạn như:
```php
/language
    /en
        messages.php
    /es
        messages.php
```
## Trans
### Truy xuất chuổi dịch
Bạn có thể truy xuất chuỗi dịch từ tệp ngôn ngữ của mình bằng method `trans`.
Ví dụ: hãy truy xuất chuỗi dịch chào mừng từ tệp ngôn ngữ language/en/messages.php:
```php
echo trans('messages.welcome');
```
Nếu chuỗi dịch được chỉ định không tồn tại, hàm `trans` sẽ trả về key chuỗi dịch.
Vì vậy, theo ví dụ trên, hàm trans sẽ trả về `messages.welcome` nếu chuỗi dịch không tồn tại.

Nếu bạn đang sử dụng `Blade` template engine, bạn có thể sử dụng cú pháp `{{ }}` để hiển thị chuỗi dịch:
```php
{{ trans('messages.welcome') }}
```

### Tham số trong chuỗi dịch
Nếu muốn, bạn có thể thêm tham số trong chuỗi dịch của mình. Tất cả các tham số đều có tiền tố :.
Ví dụ: bạn có thể xác định thông báo chào mừng bằng biến name:
```php
'messages.welcome' => 'Welcome, :name',
```

Để thay thế tham số khi truy xuất chuỗi dịch, bạn có thể thêm array làm đối số thứ hai cho hàm `trans`
```php
echo trans('messages.welcome', ['name' => 'dayle']);
```

Nếu tham số của bạn chứa tất cả các chữ cái viết hoa hoặc chỉ viết hoa chữ cái đầu tiên thì giá trị được dịch sẽ được viết hoa tương ứng:
```php
'welcome' => 'Welcome, :NAME', // Welcome, DAYLE
'goodbye' => 'Goodbye, :Name', // Goodbye, Dayle
```

## Helpers
Danh sách các method hỗ trợ việc triển khai ngôn ngữ
### has() : boolean
Kiểm tra ngôn ngữ có trong website hay không, nếu có trả về true
```php
Language::has('vi')
//true
```

### isMulti() : boolean
Kiểm tra ngôn ngữ có trong website hay không, nếu có trả về true

```php
Language::isMulti()
```
> Phiên bản từ 6.x trở xuống method có tên là hasMulti

### list() : array
Trả lại danh sách ngôn ngữ website đang sử dụng
```php
Language::list();
/* 
[
    'vi' => ['label' => 'Tiếng Việt', 'flag' => 'vi'],
    'en' => ['label' => 'Tiếng Anh', 'flag' => 'en'],
]
*/
Language::list('vi');
/* 
['label' => 'Tiếng Việt', 'flag' => 'vi']
*/
```

### listKey() : array
Trả lại danh sách key ngôn ngữ website đang sử dụng
```php
Language::list();
/* 
[
    0 => 'vi',
    1 => 'en',
]
*/
```
### current(): string
Hàm Language::current trả lại key của ngôn ngữ hiện được cms sử dụng để hiển thị

### default(): string
Hàm Language::default trả lại key ngôn ngữ mặc đinh khi người dùng lần đầu truy cập

### isDefault(): boolean
Hàm Language::isDefault trả về True nếu website đang ở ngôn ngữ mặc định