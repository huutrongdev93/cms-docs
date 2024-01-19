Một số tác vụ truy xuất hoặc xử lý dữ liệu do ứng dụng của bạn thực hiện có thể tốn nhiều CPU hoặc mất vài giây để hoàn thành. Trong trường hợp này, người ta thường lưu trữ dữ liệu đã truy xuất trong một thời gian để có thể truy xuất nhanh chóng theo các yêu cầu tiếp theo cho cùng một dữ liệu. Dữ liệu được lưu trong bộ nhớ cache thường được lưu trữ trong một kho dữ liệu rất nhanh như Memcached hoặc Redis.
CMS cung cấp một API thống nhất, biểu cảm cho các phụ trợ bộ nhớ cache khác nhau, cho phép bạn tận dụng khả năng truy xuất dữ liệu cực nhanh của chúng và tăng tốc ứng dụng web của bạn.

#### <code>CacheHandler::get</code>
Method <code>CacheHandler::get</code> được sử dụng để lấy các items từ bộ nhớ cache. Nếu item không tồn tại trong bộ nhớ cache, sẽ được trả lại là null. Nếu bạn muốn, bạn có thể sử dụng đối số thứ hai để method chỉ định giá trị Default bạn muốn được trả lại nếu cache không tồn tại
> **Tham số bao gồm:**

```php
CacheHandler::get(string $key, mixed $default)
```

| Params   |  Type  |                         Description | Default  |
|----------|:------:|------------------------------------:|:--------:|
| $key     | string |      Tên của cache phải là duy nhất | bắt buộc |
| $default | mixed  | Giá trị thay thế khi không có cache |          |

> Example

```php
$value = CacheHandler::get('key', function () {
    return get_post();
});
```



#### <code>CacheHandler::has</code>
Method <code>Option::get</code> này được sử dụng để xác định nếu một cache tồn tại trong bộ nhớ đệm. Method này sẽ trả lại nếu giá trị là true ngược lại là false
> **Tham số bao gồm:**

```php
CacheHandler::has(string $key): boolean
```

| Params |  Type  |                Description | Default  |
|--------|:------:|---------------------------:|:--------:|
| $key   | string | Tên của cache cần kiểm tra | bắt buộc |

> Example

```php
if (CacheHandler::has('key')) {
    //
}
```

#### <code>CacheHandler::save</code>
Method <code>CacheHandler::save</code> lưu trữ items trong bộ nhớ cache. Khi bạn thực hiện items trong bộ nhớ cache, bạn sẽ cần phải xác định số phút mà giá trị sẽ được lưu trữ
> **Tham số bao gồm:**

```php
CacheHandler::save(string $key, mixed $value, int $time): boolean
```

| Params |  Type  |                                Description | Default  |
|--------|:------:|-------------------------------------------:|:--------:|
| $key   | string |             Tên của cache phải là duy nhất | bắt buộc |
| $value | mixed  |                   Giá trị của cache sẽ lưu | bắt buộc |
| $time  |  int   | Thời gian cache được lưu trữ (millisecond) | 30 ngày  |


#### <code>CacheHandler::delete</code>
Method <code>CacheHandler::delete</code> xóa một hoặc nhiều item khỏi bộ nhớ đệm bằng cách sử dụng phương pháp delete.
> **Tham số bao gồm:**

```php
CacheHandler::delete(string $key, boolean $prefix)
```

| Params       |  Type  |                                           Description | Default  |
|--------------|:------:|------------------------------------------------------:|:--------:|
| $key   | string |                        Tên của cache phải là duy nhất | bắt buộc |
| $prefix | boolean  | Nếu true sẽ xóa tất cả cache có tên bắt đầu bằng $key |  false   |

> Example

```php
CacheHandler::delete('cache_key'); // Xóa cache có key là "cache_key"
CacheHandler::delete('cache_', true); // Xóa tất cả cache có key bắt đầu bằng "cache_"
```

#### <code>CacheHandler::flush</code>

Method <code>CacheHandler::flush</code> Xóa toàn bộ cache