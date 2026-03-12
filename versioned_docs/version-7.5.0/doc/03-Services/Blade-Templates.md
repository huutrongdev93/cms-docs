# Blade Templates

Blade Templates là một hệ thống tạo mẫu (templating engine) được sử dụng rộng rãi trong framework Laravel của PHP. Nó cung cấp một cách đơn giản và hiệu quả để tạo ra các giao diện người dùng (UI) động và linh hoạt.
Một file Blade thường có phần mở rộng là `.blade.php`

### Hiển thị dữ liệu
Trong Blade Templates, cả `{{ }}` và `{!! !!}` đều được sử dụng để hiển thị dữ liệu trong view. Tuy nhiên, chúng có những khác biệt quan trọng về cách xử lý dữ liệu đầu vào.

#### `{{ }}`: Escape HTML

**Chức năng:** Khi sử dụng `{{ }}`, Blade sẽ tự động escape (làm vô hiệu hóa) các thẻ HTML và các ký tự đặc biệt khác trước khi hiển thị. Điều này giúp bảo vệ ứng dụng khỏi các cuộc tấn công XSS (Cross-Site Scripting). 
  
**Sử dụng:** Nên sử dụng `{{ }}` để hiển thị dữ liệu người dùng nhập vào hoặc bất kỳ dữ liệu nào có thể chứa các thẻ HTML không mong muốn.

```php
{{ $user->name }}
```

#### `{!! !!}`: Không Escape HTML

**Chức năng:** Khi sử dụng `{!! !!}`, Blade sẽ hiển thị dữ liệu nguyên bản, bao gồm cả các thẻ HTML. Điều này có nghĩa là nếu dữ liệu đầu vào chứa các thẻ HTML, chúng sẽ được hiển thị trực tiếp trên trang.  

**Sử dụng:** Chỉ nên sử dụng `{!! !!}` khi bạn hoàn toàn chắc chắn rằng dữ liệu đầu vào là tin cậy và không chứa bất kỳ mã độc hại nào. Ví dụ, khi hiển thị dữ liệu được định dạng sẵn bằng một trình soạn thảo WYSIWYG.

```php
{!! $content !!}
```

#### Điều kiện trong Blade
Trong Blade Templates, các chỉ thị `@if`, `@else` và `@elseif` được sử dụng để kiểm tra các điều kiện logic và hiển thị nội dung tương ứng. Cấu trúc của chúng tương tự như câu lệnh if trong PHP, giúp bạn tạo ra các giao diện động và linh hoạt.

```php
@if (điều_kiện)
    // Nếu điều kiện đúng, mã này sẽ được thực thi
@else
    // Nếu điều kiện sai, mã này sẽ được thực thi
@endif
```

#### Vòng lặp trong Blade
Trong Blade Templates, các chỉ thị vòng lặp `@for`, `@foreach`, `@while` giúp chúng ta lặp qua các mảng, đối tượng hoặc một dãy số để hiển thị dữ liệu một cách lặp đi lặp lại.

```php
@for ($i = 1; $i <= 10; $i++)
    Đây là lần lặp thứ {{ $i }}.
@endfor
```

```php

@foreach ($products as $product)
    <div class="product">
        <h2>{{ $product->name }}</h2>
        <p>{{ $product->description }}</p>
        <p>Giá: {{ $product->price }}</p>
    </div>
@endforeach
```

```php
@while ($i < 10)
    Đây là lần lặp thứ {{ $i }}.
    $i++;
@endwhile
```


#### break, continue
Blade Templates cung cấp hai chỉ thị `@break` và `@continue` để điều khiển luồng thực thi trong các vòng lặp.

```php
@foreach ($products as $product)
    @if ($product->price > 1000)
        @break
    @endif
    <li>{{ $product->name }}</li>
@endforeach
```

```php
@foreach ($products as $product)
    @if ($product->isOutOfStock())
        @continue
    @endif
    <li>{{ $product->name }}</li>
@endforeach
```


### Sử dụng
#### Theme
Để render một file Blade Templates trong theme bạn sử dụng method `Theme::view` hoặc `Theme::partial`  

Để hiển thị trực tiếp mã đã biên dịch từ file blade
```php
Theme::view($path, $args)
```

- path : đường dẫn đến file blade
Ví dụ:
```php
Theme::view('user/index')
//Đường dẫn ưu tiên views/<theme_current>/theme-child/user/login.blade.php
//Đường dẫn views/<theme_current>/user/login.blade.php
```
- args : mảng chứa các biến cần truyền vào file blade
ví dụ:
```php
Theme::view('user/index', ['users' => $users])
```
mảng `['users' => $users]` được tạo và truyền vào view `user/index`

Trong Blade: Bạn có thể truy cập biến $users như bình thường:
```php
@foreach ($users as $user)
    <p>{{ $user->name }}</p>
@endforeach
```

Để lấy mã biên dịch từ file blade bạn sử dụng `Theme::partial`
```php
$view = Theme::partial($path, $args)
```

#### Plugin

Để render một file Blade Templates trong plugin bạn sử dụng method `Plugin::view` hoặc `Plugin::partial`

Để hiển thị trực tiếp mã đã biên dịch từ file blade
```php
Plugin::view($plugin, $path, $args)
```
- plugin: tên thư mục plugin
- path : đường dẫn đến file blade
  Ví dụ:
```php
Plugin::view('my-plugin', 'user/index')
//Đường dẫn ưu tiên 1: views/<theme_current>/my-plugin/user/login.blade.php
//Đường dẫn ưu tiên 2: views/plugins/my-plugin/views/user/login.blade.php
//Đường dẫn ưu tiên 3: views/plugins/my-plugin/template/user/login.blade.php
```
- args : mảng chứa các biến cần truyền vào file blade

Để lấy mã biên dịch từ file blade bạn sử dụng `Plugin::partial`
```php
$view = Plugin::partial($plugin, $path, $args)
```
