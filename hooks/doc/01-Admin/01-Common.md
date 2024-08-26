#### Thay đổi ngôn ngữ admin

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |
```php
$local = apply_filters('admin_language', 'vi');
```

#### Chạy hành động sau khi nạp dữ liệu
Sau khi hoàn tất nạp dữ liệu từ theme và plugin hook sẽ thực thi các function gán vào hook này

| **Loại Hook**                                          | **Platform** |                                   **Version** |
|--------------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">apply_filters</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |
```php
do_action('admin_init');
```

