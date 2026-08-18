# Cache

> **File:** `packages/skilldo/framework/src/Cache/Cache.php`  
> **Namespace:** `SkillDo\Cache\Cache`  
> **Alias ngắn:** `\Cache`

Cache giúp lưu trữ dữ liệu tốn nhiều thời gian truy vấn vào bộ nhớ đệm để truy xuất nhanh hơn ở các request tiếp theo.

SkillDo CMS v8 hỗ trợ 3 cache driver:
- **`file`** (mặc định): lưu cache vào file trong `storage/framework/cache/`
- **`redis`**: lưu cache vào Redis server (class `CacheRedis`)
- **`memcached`**: lưu cache vào Memcached server (class `CacheMemcached`)

---

### Cấu Hình

Class `Cache` đọc trực tiếp file `config/cache.php` ở **gốc project** (qua `Path::config('cache.php')`). Nếu file không tồn tại, driver mặc định là `file`. File cấu hình mẫu (tham khảo defaults tại `packages/skilldo/framework/src/config/cache.php`):

```php
return [
    'default' => env('CACHE_DRIVER', 'file'),
    'stores' => [
        'file' => [
            'driver' => 'file',
        ],
        'redis' => [
            'driver'   => 'redis',
            'host'     => env('REDIS_HOST', '127.0.0.1'),
            'port'     => env('REDIS_PORT', 6379),
            'password' => env('REDIS_PASSWORD', null),
            'database' => env('REDIS_CACHE_DB', 0),
            'prefix'   => env('REDIS_PREFIX', 'cache:'),
        ],
        'memcached' => [
            'driver'  => 'memcached',
            'servers' => [
                ['host' => env('MEMCACHED_HOST', '127.0.0.1'), 'port' => env('MEMCACHED_PORT', 11211), 'weight' => 100],
            ],
            'prefix'  => env('MEMCACHED_PREFIX', 'cache:'),
        ],
    ],
    'prefix' => env('CACHE_PREFIX', 'skilldo_cache'),
];
```

### `Cache::get()`
Lấy giá trị từ bộ nhớ cache. Trả về `$default` (mặc định `null`) nếu không tồn tại hoặc đã hết hạn.

```php
Cache::get(string $key, mixed $default = null): mixed
```

```php
$posts = Cache::get('latest_posts');

// Với Closure làm default: được thực thi và trả về kết quả khi cache miss
// (lưu ý: kết quả KHÔNG được lưu vào cache — muốn lưu thì dùng Cache::remember)
$posts = Cache::get('latest_posts', function () {
    return \Post::orderBy('created', 'desc')->limit(10)->get();
});
```

> **Per-request memo (mới):** Với driver `file`, mỗi cache key chỉ đọc + unserialize từ disk **một lần mỗi request**; kết quả được giữ trong bộ nhớ (memoization) cho các lần gọi `get`/`has` tiếp theo, nên gọi lặp lại không tốn I/O.

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
Cache::delete(string $key, bool $prefix = false): bool
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
Xóa **toàn bộ** cache trong hệ thống (riêng file cache của root user — `md5('root_user')` — được giữ lại). Alias: `Cache::clear()`.

```php
Cache::flush(): bool
```

> ⚠️ **Cẩn thận:** `flush()` xóa tất cả cache kể cả cache hệ thống (routes, config, language...). Dùng `Cache::delete('prefix_', true)` để xóa theo nhóm sẽ an toàn hơn.

---

### Các Method Khác

Driver cache còn cung cấp các method tiện ích sau (gọi qua `Cache::` như bình thường):

```php
// Lưu cache — alias của save()
Cache::set($key, $value, $minutes = 0);
Cache::put($key, $value, $minutes = 0);

// Lấy giá trị rồi xóa luôn cache đó
$value = Cache::pull($key, $default = null);

// Chỉ lưu nếu key CHƯA tồn tại (trả về false nếu đã có)
Cache::add($key, $value, $minutes = null);

// Lưu vĩnh viễn
Cache::forever($key, $value);

// remember không thời hạn
Cache::rememberForever($key, fn () => ...);

// Xóa 1 key — alias của delete()
Cache::forget($key);

// Thao tác nhiều key cùng lúc
Cache::getMultiple(['key1', 'key2'], $default = null);
Cache::setMultiple(['key1' => 'a', 'key2' => 'b'], $minutes = null);
Cache::deleteMultiple(['key1', 'key2']);
```

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
Lưu cache dưới dạng file serialized trong `storage/framework/cache/`. Phù hợp mọi hosting. Có memoization theo request (xem `Cache::get`).

### Memcached Driver
Cần cài extension `memcached`. Cấu hình trong `config/cache.php`.

### Redis Driver
Cần cài extension `redis` hoặc `predis`. Cấu hình trong `config/cache.php`.