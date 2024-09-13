Hook giúp chúng ta gắn một số chức năng để thực thi những hành động mà chúng ta muốn mà không phải đụng và bất cứ thứ gì ở trong core của CMS.
>
Có 2 kiểu Hook chính: **Action hook** và **Filter hook**.

### Action Hook
Action Hook chính là một điểm neo để chúng ta thực hiện một hành động gì đó tại một chu kỳ nhất định.

#### Add action hook
**Reference**: https://developer.wordpress.org/reference/functions/add_action
> **Tham số truyền vào bao gồm:**
```php
add_action(string $hook_name, callable $callback, int $priority = 10, int $accepted_args = 1)
```
| Params         |   Type   |                                                                                                                                                                                                                                           Description | Default |
|----------------|:--------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------:|
| $hook_name     |  string  |                                                                                                                                                                                                  Tên của bộ lọc để móc callback $function_to_add vào. |         |
| $callback      | callable |                                                                                                                                                                                                        Callback sẽ được chạy khi bộ lọc được áp dụng. |         |
| $priority      |   int    | Được sử dụng để chỉ định thứ tự mà các chức năng liên quan đến một hành động cụ thể được thực thi. Các số thấp hơn tương ứng với việc thực thi trước đó và các hàm có cùng mức độ ưu tiên được thực thi theo thứ tự mà chúng được thêm vào hành động. |   10    |
| $accepted_args |   int    |                                                                                                                                                                                                                     Số lượng đối số mà hàm chấp nhận. |    1    |



#### Do action hook
Hàm này chỉ đơn giản là khai báo một điểm neo ngay tại vị trí của nơi nó cần thực thi
**Reference**: https://developer.wordpress.org/reference/functions/do_action
> **Tham số truyền vào bao gồm:**
```php
do_action(string $hook_name, mixed $arg)
```

| Params     |  Type  |                                                                                                                                                                                                                                                                                 Description | Default |
|------------|:------:|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------:|
| $hook_name | string | Tên filter hook mà add_action sẽ móc vào                                                                                                                                                                                               Tên của bộ lọc để móc callback $function_to_add vào. |         |
| $arg       | mixed  |                                                                                                                                                                                                          Các đối số bổ sung được truyền cho các hàm được nối với hành động. Mặc định trống. |         |


#### Remove action hook
Hàm này loại bỏ một hàm được gắn vào filter hook được chỉ định. Phương pháp này có thể được sử dụng để loại bỏ các hàm mặc định được gắn vào một móc lọc cụ thể và có thể thay thế chúng bằng một hàm thay thế.
>
Để loại bỏ một hook, các đối số $callback và $priority phải khớp nhau khi hook được thêm vào. Điều này áp dụng cho cả filters và actions. Sẽ không có cảnh báo nào được đưa ra khi gỡ bỏ thất bại
> **Tham số truyền vào bao gồm:**
```php
remove_action(string $hook_name, callable|string|array $callback, int $priority = 10): bool
```

| Params     |         Type          |                                                     Description | Default |
|------------|:---------------------:|----------------------------------------------------------------:|:-------:|
| $hook_name |        string         |                               Tên hook mà $callback đã nối vào. |         |
| $callback  | callable,string,array |                                                  Tên hàm cần bỏ |         |                                                                                                                                                                                                        Callback sẽ được chạy khi bộ lọc được áp dụng. |         |
| $priority  |          int          | Mức độ ưu tiên chính xác được sử dụng khi thêm bằng add_action. |   10    |



### Filers Hook

Bên cạnh Action Hook, chúng ta còn một loại hook nữa cũng sử dụng rất thường xuyên và đóng vai trò quan trọng không kém khi lập trình trong CMS, đó là Filter Hook.

#### Add Filter hook
**Reference**: https://developer.wordpress.org/reference/functions/add_action
> **Tham số truyền vào bao gồm:**
```php
add_filter( string $hook_name, callable $callback, int $priority = 10, int $accepted_args = 1 ): true
```
| Params         |   Type   |                                                                                                                                                                                                                                           Description | Default |
|----------------|:--------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------:|
| $hook_name     |  string  |                                                                                                                                                                                                              Tên của filter để thêm lệnh callback vào |         |
| $callback      | callable |                                                                                                                                                                                                        Callback sẽ được chạy khi filter được áp dụng. |         |
| $priority      |   int    | Được sử dụng để chỉ định thứ tự mà các chức năng liên quan đến một hành động cụ thể được thực thi. Các số thấp hơn tương ứng với việc thực thi trước đó và các hàm có cùng mức độ ưu tiên được thực thi theo thứ tự mà chúng được thêm vào hành động. |   10    |
| $accepted_args |   int    |                                                                                                                                                                                                                     Số lượng đối số mà hàm chấp nhận. |    1    |



#### Apply Filter hook
Gọi các hàm callback đã được thêm vào hook Filter.
**Reference**: https://developer.wordpress.org/reference/functions/do_action
> **Tham số truyền vào bao gồm:**
```php
apply_filters( string $hook_name, mixed $value, mixed $args ): mixed
```

| Params     |  Type  |                                                                        Description | Default |
|------------|:------:|-----------------------------------------------------------------------------------:|:-------:|
| $hook_name | string |                                           Tên filter hook mà add_filter sẽ móc vào |         |
| $value     | mixed  |                                                         Giá trị filte cần thay đổi |         |
| $arg       | mixed  | Các đối số bổ sung được truyền cho các hàm được nối với hành động. Mặc định trống. |         |


#### Remove Filter hook
Hàm này loại bỏ một hàm được gắn vào filter hook được chỉ định. Phương pháp này có thể được sử dụng để loại bỏ các hàm mặc định được gắn vào một móc lọc cụ thể và có thể thay thế chúng bằng một hàm thay thế.
>
Để loại bỏ một hook, các đối số $callback và $priority phải khớp nhau khi hook được thêm vào. Sẽ không có cảnh báo nào được đưa ra khi gỡ bỏ thất bại
> **Tham số truyền vào bao gồm:**
```php
remove_filter( string $hook_name, callable|string|array $callback, int $priority = 10 ): bool
```

| Params     |         Type          |                                                     Description | Default |
|------------|:---------------------:|----------------------------------------------------------------:|:-------:|
| $hook_name |        string         |                               Tên hook mà $callback đã nối vào. |         |
| $callback  | callable,string,array |                                                  Tên hàm cần bỏ |         |                                                                                                                                                                                                        Callback sẽ được chạy khi bộ lọc được áp dụng. |         |
| $priority  |          int          | Mức độ ưu tiên chính xác được sử dụng khi thêm bằng add_action. |   10    |