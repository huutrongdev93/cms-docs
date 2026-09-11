#### Thay đổi ngôn ngữ admin

| Hook             | Loại Hook                                       | Platform |                                       Version |
|------------------|-------------------------------------------------|:--------:|----------------------------------------------:|
| `admin_language` | <span class="badge text-bg-green">filter</span> |   cms    | <span class="badge text-bg-cyan">7.0.0</span> |
```php
$local = apply_filters('admin_language', 'vi');
```

#### Chạy hành động sau khi nạp dữ liệu
Sau khi hoàn tất nạp dữ liệu từ theme và plugin ở admin hook sẽ thực thi các function gán vào hook này

| Hook         | **Loại Hook**                                 | **Platform** |                                   **Version** |
|--------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `admin_init` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |
```php
do_action('admin_init');
```

Sau khi hoàn tất nạp dữ liệu từ theme và plugin ở client hook sẽ thực thi các function gán vào hook này

| Hook          | **Loại Hook**                                 | **Platform** |                                   **Version** |
|---------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `client_init` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">7.1.2</span> |
```php
do_action('client_init');
```

Sau khi hoàn tất nạp dữ liệu từ theme và plugin hook sẽ thực thi các function gán vào hook này

| Hook   | **Loại Hook**                                 | **Platform** |                                   **Version** |
|--------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `init` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">2.0.0</span> |
```php
do_action('init');
```


#### Khai báo tác vụ định kỳ (cronjob)

Plugin nào đăng ký lịch chạy bằng `Schedule::call()` đều phải khai báo qua hook này. Danh sách hiện thành bảng ở **Cấu hình hệ thống → Cronjob** để người bàn giao website biết site cần cài cronjob và hỏng gì nếu thiếu. Xem thêm trang tài liệu *Cron & Schedule*.

| Hook                | **Loại Hook**                                   | **Platform** |                                   **Version** |
|---------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `cms_cronjob_tasks` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.2.4</span> |
```php
$tasks = apply_filters('cms_cronjob_tasks', []);
```

Mỗi phần tử là một tác vụ. Khóa mảng nên đặt dạng `{id-plugin}:{ten-tac-vu}` để hai lần đăng ký không nhân đôi dòng. Chỉ `label` là bắt buộc, mục thiếu `label` bị bỏ qua.

```php
add_filter('cms_cronjob_tasks', function ($tasks) {

    $tasks['hotel-booking:release-expired-hold'] = [
        'label'       => 'Trả phòng của đơn giữ chỗ quá hạn',
        'description' => 'Thiếu cron thì phòng bị khoá vĩnh viễn, website báo hết phòng trong khi thực tế còn trống.',
        'source'      => 'Plugin Đặt phòng khách sạn',
        'interval'    => 'Mỗi 5 phút',
    ];

    return $tasks;
});
```
