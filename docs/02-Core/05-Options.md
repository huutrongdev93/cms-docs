Trong Skilldo bạn sẽ thấy một khái niệm option, option này sẽ chứa các thông tin cấu hình của hệ thống. Ngoài các thông tin cấu hình của hệ thống ra thì bạn có thể thêm các thông tin cho riêng bạn, điều này rất hay thường làm khi xây dựng plugin. Ví dụ khi bạn xây dựng một theme thì bạn sẽ phải viết chức năng quản lý cấu hình cho theme đó, lúc này bạn sẽ phải sử dụng options này để lưu trữ.

#### <code>Option::add</code>
Method <code>Option::add</code> thêm một option vào database
> **Tham số bao gồm:**

```php
Option::add(string $optionKey, mixed $optionValue)
```

| Params       |  Type  |                     Description | Default  |
|--------------|:------:|--------------------------------:|:--------:|
| $optionKey   | string | Tên của option phải là duy nhất | bắt buộc |
| $optionValue | mixed  |              Giá trị của option | bắt buộc |

> Example

```php
Option::add('mailer_gmail_username', 'thehalfheart@gmail.com');
Option::add('mailer_gmail_password', '@password');
```



#### <code>Option::get</code>
Method <code>Option::get</code> Truy xuất giá trị option dựa trên tên option
> **Tham số bao gồm:**

```php
Option::get(string $optionKey): mixed
```

| Params       |  Type  |                     Description | Default  |
|--------------|:------:|--------------------------------:|:--------:|
| $optionKey   | string |                  Tên của option | bắt buộc |

> Example

```php
Option::get('mailer_gmail_username');
Option::get('mailer_gmail_password');
```

#### <code>Option::update</code>
Method <code>Option::update</code> cập nhật giá trị của một option, nếu option không tồn tại hàm sẽ thêm mới
> **Tham số bao gồm:**

```php
Option::update(string $optionKey, mixed $optionValue): boolean
```

| Params       |  Type  |                     Description | Default  |
|--------------|:------:|--------------------------------:|:--------:|
| $optionKey   | string | Tên của option phải là duy nhất | bắt buộc |
| $optionValue | mixed  |              Giá trị của option | bắt buộc |

> Example

```php
Option::update('mailer_gmail_username', 'name@gmail.com');
```


#### <code>Option::delete</code>
Method <code>Option::delete</code> xóa đi một option dựa trên tên option
> **Tham số bao gồm:**

```php
Option::delete(string $optionKey): mixed
```

| Params       |  Type  |                     Description | Default  |
|--------------|:------:|--------------------------------:|:--------:|
| $optionKey   | string |                  Tên của option | bắt buộc |

> Example

```php
Option::delete('mailer_gmail_username');
```