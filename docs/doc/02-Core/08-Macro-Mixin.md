# Macro và Mixin
### Macro
Macro là một cách để mở rộng chức năng của một lớp cụ thể bằng cách thêm các phương thức tùy chỉnh. 
Với Macro, bạn có thể dễ dàng bổ sung các phương thức mới cho các lớp hiện có mà không cần thay đổi mã nguồn của chúng.  

#### Tạo Macro mới
Để tạo macro hãy chạy lệnh command sau để tạo file macro mới:

```php
//create macro by theme
make:macro:theme Arr

//create macro by plugin
make:macro:plugin plugin_name Arr
```

Lệnh này sẽ tạo một tệp mới tại `core/Macro/ArrMixin.php`. Mở tệp này và thêm macro của bạn vào:

```php
// Định nghĩa Macro cho lớp Arr
Arr::macro('toUpper', function ($array) {
    $array =  array_map(function ($value) {
        return strtoupper($value);
    }, $array);
    
    return $array;
});
```

#### Sử dụng Macro
Với macro đã đăng ký, giờ đây bạn có thể sử dụng nó trong mã của mình. Đây là một ví dụ:
```php
// Sử dụng Macro
$upper = Arr::toUpper(['first', 'second', 'third']); // ['FIRST', 'SECOND', 'THIRD']
```

### Mixin
Mixin là một kỹ thuật cho phép bạn thêm các nhóm phương thức vào một lớp hiện có thông qua một trait hoặc một lớp khác. Điều này giúp chia sẻ các chức năng chung giữa các lớp khác nhau một cách linh hoạt.

#### Tạo Mixin mới
Để tạo mixin hãy chạy lệnh command sau để tạo file mixin mới:

```php
//create macro by theme
make:macro:theme Str

//create macro by plugin
make:macro:plugin plugin_name Str
```

Lệnh này sẽ tạo một tệp mới tại `core/Macro/ArrMixin.php`. Mở tệp này và thêm mixin của bạn vào:

```php
class StringHelpers {
    public function toSnake() {
        return function ($value) {
            return strtolower(preg_replace('/\s+/', '_', $value));
        };
    }

    public function toKebab() {
        return function ($value) {
            return strtolower(preg_replace('/\s+/', '-', $value));
        };
    }
}

// Áp dụng Mixin
Str::mixin(new StringHelpers);
```

#### Sử dụng Mixin
Với mixin đã đăng ký, giờ đây bạn có thể sử dụng nó trong mã của mình. Đây là một ví dụ:

```php
// Sử dụng các phương thức từ Mixin
echo Str::toSnake('Hello World'); // hello_world
echo Str::toKebab('Hello World'); // hello-world
```


### Danh sách hỗ trợ:

* Str
* Arr
* Admin
* Auth
* CacheHandler
* Cms
* Device
* Language
* Path
* Theme
* Url
* FileHandler
* Utils