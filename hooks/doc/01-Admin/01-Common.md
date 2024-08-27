#### Thay đổi ngôn ngữ admin

| Hook             | Loại Hook                                       | Platform |                                       Version |
|------------------|-------------------------------------------------|:--------:|----------------------------------------------:|
| `admin_language` | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">7.0.0</span> |
```php
$local = apply_filters('admin_language', 'vi');
```

#### Chạy hành động sau khi nạp dữ liệu
Sau khi hoàn tất nạp dữ liệu từ theme và plugin hook sẽ thực thi các function gán vào hook này

| Hook         | **Loại Hook**                                   | **Platform** |                                   **Version** |
|--------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_init` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |
```php
do_action('admin_init');
```

