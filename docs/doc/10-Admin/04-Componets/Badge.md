# Badge
Hiển thị tag badge, Để sử dụng component badge bạn sử dụng

```php
Admin::badge($template, $message, $attributes)
```

Các loại template badge

- <span class="badge text-bg-gray">gray</span>
- <span class="badge text-bg-red">red</span>
- <span class="badge text-bg-pink">pink</span>
- <span class="badge text-bg-yellow">yellow</span>
- <span class="badge text-bg-warning">warning</span>
- <span class="badge text-bg-cyan">cyan</span>
- <span class="badge text-bg-success">success</span>
- <span class="badge text-bg-info">info</span>
- <span class="badge text-bg-purple">purple</span>

Danh sách attributes:

| Key     |     Type     |                                            Description |
|---------|:------------:|-------------------------------------------------------:|
| class   | string/array |     tên class hoặc danh sách class muốn thêm vào badge |
| modal   |    string    | id của modal (boostrap) khi click vào badge sẽ gọi đến |
| tooltip |    string    |                                      thông tin tooltip |
| href    |    string    |              nếu có href thẻ đóng mở tag badge sẽ là a |
| style   | string/array |                                                  style |

```php
echo Admin::badge('warning', 'Chú ý', [
    'tooltip' => 'Warning'
]);
```