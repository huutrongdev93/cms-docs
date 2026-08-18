# Tạo command

### Tạo một custom command

Để tạo lệnh command mới, hãy chạy lệnh sau trong Terminal của admin:

```shell
make:command CommandNew
```

Lệnh này tạo một tệp mới trong thư mục `plugins/DevTool/app/Console/`. Tên tệp sẽ là `CommandNew.php`.
Thay thế `CommandNew` bằng tên mong muốn cho lệnh của bạn.

> **Bắt buộc:** tên file phải **trùng tên class** — `Kernel` suy ra tên class từ đường dẫn file.

> Sau khi tạo lệnh, muốn lệnh xuất hiện trong gợi ý autocomplete của terminal thì bổ sung tên lệnh vào bảng `TerminalDevTool.commands` trong `plugins/DevTool/assets/js/devtool.js`, rồi chạy lại `cms:build:js`.

### Xác định lệnh

Trong tệp `CommandNew.php` được tạo, bạn khai báo `signature`, `description` và viết logic trong phương thức `handle()`.

```php
<?php

namespace DevTool\Console;

use DevTool\Commands\Command;

class CommandNew extends Command
{
    /**
     * Tên và chữ ký của lệnh
     */
    protected string $signature = 'make:custom {model}';

    /**
     * Mô tả của lệnh
     */
    protected string $description = 'Generate a new model';

    /**
     * Thực thi lệnh
     */
    public function handle(): bool
    {
        $model = $this->argument('model');

        if(empty($model)) {
            // Hiển thị thông báo lỗi
            $this->line('fail.');

            return self::ERROR;
        }

        // Hiển thị thông báo thành công
        $this->line('successfully.');

        return self::SUCCESS;
    }
}
```

> `handle()` trả về `bool`: hằng số `self::SUCCESS` là `true`, `self::ERROR` là `false`.

### Đối số (Arguments)

Tất cả các đối số và tùy chọn do người dùng cung cấp đều được gói trong dấu ngoặc nhọn. Trong ví dụ sau, lệnh xác định một đối số bắt buộc:

```php
protected string $signature = 'mail:send {user}';
```

Bạn cũng có thể đặt đối số là tùy chọn hoặc xác định giá trị mặc định cho đối số:

```php
// Optional argument...
'mail:send {user?}'

// Optional argument with default value...
'mail:send {user=foo}'
```

> **Lưu ý quan trọng:** `SignatureParser` **không ép tham số bắt buộc**. Nếu người dùng bỏ trống, `$this->argument('user')` trả về `false` chứ không báo lỗi. Mọi lệnh phải **tự kiểm tra** và ép kiểu trước khi dùng:
>
> ```php
> $user = (string) $this->argument('user');
>
> if(!preg_match('/^[a-zA-Z0-9_-]+$/', $user)) {
>     $this->line('Error: tham số user không hợp lệ');
>     $this->line($this->fullCommand());
>     return self::ERROR;
> }
> ```

### Tùy chọn (Options)

Các tùy chọn, như đối số, là một dạng đầu vào khác của người dùng. Các tùy chọn được bắt đầu bằng hai dấu gạch nối (`--`).

Có hai loại tùy chọn: loại nhận giá trị và loại không nhận. Các tùy chọn không nhận giá trị đóng vai trò là "công tắc" `boolean`:

```php
protected string $signature = 'mail:send {user} {--queue}';
```

Trong ví dụ này, nếu `--queue` được truyền thì giá trị của tùy chọn là `true`, ngược lại là `false`.

```shell
mail:send 1 --queue
```

Tiếp theo là tùy chọn nhận một giá trị — thêm hậu tố `=` sau tên tùy chọn:

```php
protected string $signature = 'mail:send {user} {--queue=}';
```

Nếu tùy chọn không được chỉ định khi gọi lệnh, giá trị của nó sẽ là `null`:

```shell
mail:send 1 --queue=default
```

Bạn có thể gán giá trị mặc định cho tùy chọn bằng cách chỉ định giá trị sau tên tùy chọn:

```php
'mail:send {user} {--queue=default}'
```

### Message output

Để gửi message ra terminal, dùng phương thức `line`:

```php
public function handle(): bool
{
    // message mặc định
    $this->line('The command was successful!');
    // message màu xanh lá
    $this->line('The command was successful!', 'green');
    // message màu xanh dương
    $this->line('The command was successful!', 'blue');
    // message màu vàng
    $this->line('The command was successful!', 'yellow');

    return self::SUCCESS;
}
```

Hoặc tạo message nhiều màu sắc bằng cách truyền một closure nhận `Message`:

```php
use DevTool\Commands\Message;

public function handle(): bool
{
    $this->line(function (Message $message) use ($file) {
        $message->line('success!', 'green');
        $message->line('file is created');
        $message->line('your check', 'blue');
    });

    return self::SUCCESS;
}
```

`Message` còn có các phương thức rút gọn theo màu:

```php
$message->green('Thành công');
$message->blue('Thông tin');
$message->yellow('Cảnh báo');

// In đậm
$message->green('Thành công', true);
```

### Các phương thức hữu ích khác của `Command`

| Phương thức | Mô tả |
|---|---|
| `argument($name)` | Lấy giá trị đối số (trả `false` nếu không có) |
| `option($name)` | Lấy giá trị tùy chọn |
| `signature()` | Chuỗi signature của lệnh |
| `getDescription()` | Mô tả của lệnh |
| `fullCommand()` | Cú pháp đầy đủ của lệnh — thường in kèm khi báo lỗi để nhắc người dùng |
| `success($message = null)` | Kết thúc với trạng thái thành công |
| `error($message = null)` | Kết thúc với trạng thái lỗi |
