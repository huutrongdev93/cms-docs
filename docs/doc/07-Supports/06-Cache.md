# Cache

> **File:** `packages/skilldo/framework/src/Cache/Cache.php`  
> **Namespace:** `SkillDo\Cache\Cache` 
> **Alias ngắn:** `\Cache`

Cache giúp lưu trữ dữ liệu tốn nhiều thời gian truy vấn vào bộ nhớ đệm để truy xuất nhanh hơn ở các request tiếp theo.

SkillDo CMS v8 hỗ trợ 3 cache driver (cấu hình trong `bootstrap/config/cache.php`):
- **`file`** (mặc định): lưu cache vào file trên disk
- **`redis`**: lưu cache vào Redis server
- **`memcached`**: lưu cache vào Memcached server

---

### Cấu Hình

File `config/cache.php`:

```php
return [
    'default' => env('CACHE_DRIVER', 'file'),
    'stores' => [
        'file' => [
            'driver' => 'file',
            'path'   => 'storage/cache',
        ],
    ],
];
```

### `Cache::get()`
Lấy giá trị từ bộ nhớ cache. Trả về `null` nếu không tồn tại.

```php
Cache::get(string $key, mixed $default = null): mixed
```

```php
$posts = Cache::get('latest_posts');

// Với Closure làm default
$posts = Cache::get('latest_posts', function () {
    return \Post::orderBy('created', 'desc')->limit(10)->get();
});
```

---

### `Cache::has()`
Kiểm tra xem một cache có tồn tại không.

```php
Cache::has(string $key): bool
```

```php
if (Cache::has('latest_posts')) {
    $posts = Cache::get('latest_posts');
}
```

---

### `Cache::save()`
Lưu trữ giá trị vào bộ nhớ cache.

```php
Cache::save(string $key, mixed $value, int $time = 0): bool
```

| Param    | Type   | Mô tả                              | Default         |
|----------|--------|------------------------------------|-----------------|
| `$key`   | string | Tên cache (phải là duy nhất)       | bắt buộc        |
| `$value` | mixed  | Giá trị cần lưu                    | bắt buộc        |
| `$time`  | int    | Thời gian lưu cache (đơn vị: **phút**) | `0` = vĩnh viễn |

```php
// Lưu vĩnh viễn
Cache::save('site_config', $config);

// Lưu trong 60 phút
Cache::save('latest_posts', $posts, 60);
```

---

### `Cache::remember()`
Lấy từ cache. Nếu không có, chạy `$callback`, lưu kết quả vào cache rồi trả về.

```php
Cache::remember(string $key, int $minutes, Closure $callback): mixed
```

```php
$posts = Cache::remember('latest_posts', 60, function () {
    return \Post::orderBy('created', 'desc')->limit(10)->get();
});
```

---

### `Cache::delete()`
Xóa cache. Nếu `$prefix = true`, xóa tất cả cache có key bắt đầu bằng `$key`.

```php
Cache::delete(string $key, bool $prefix = false): void
```

```php
// Xóa đúng 1 cache
Cache::delete('post_detail_' . md5(123));

// Xóa theo nhóm (prefix)
Cache::delete('post_detail_', true);
Cache::delete('products_', true);
```

---

### `Cache::flush()`
Xóa **toàn bộ** cache trong hệ thống.

```php
Cache::flush(): void
```

> ⚠️ **Cẩn thận:** `flush()` xóa tất cả cache kể cả cache hệ thống (routes, config, language...). Dùng `Cache::delete('prefix_', true)` để xóa theo nhóm sẽ an toàn hơn.

---

### Ví Dụ Thực Tế Trong Plugin

```php
use SkillDo\Cache\Cache;

// Lấy hoặc tạo cache
$items = Cache::remember('my_plugin_items', 60, function () {
    return \MyPlugin\Models\Item::where('status', 1)->get();
});

// Xóa cache khi data thay đổi (trong Model Event saved/deleted)
Cache::delete('my_plugin_items');

// Xóa nhóm cache
Cache::delete('my_plugin_', true);
```

## Drivers

### File Driver (mặc định)
Lưu cache dưới dạng file trong `storage/cache/`. Phù hợp mọi hosting.

### Memcached Driver
Cần cài extension `memcached`. Cấu hình trong `config/cache.php`.

### Redis Driver
Cần cài extension `redis` hoặc `predis`. Cấu hình trong `config/cache.php`.