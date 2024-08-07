# Tạo command

### Tạo một custom command
Để tạo lệnh command mới, hãy chạy lệnh sau
```php
make:command CommandNew
```

Lệnh này sẽ tạo một tệp mới trong thư mục ```views/plugins/DevTool/Console```. Tên tệp sẽ là CommandNew.php. 
Thay thế "CommandNew" bằng tên mong muốn cho lệnh của bạn.

### Xác định lệnh

Trong tệp CommandNew.php được tạo, bạn có thể xác định custom command. Phương thức hand() là nơi thự thi lệnh của bạn và là nơi bạn sẽ đặt logic tùy chỉnh của mình.  
Ví dụ:
```php
<?php

namespace SkillDo\DevTool\Console;

use SkillDo\DevTool\Commands\Command;

class CommandNew extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:custom {model}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a new model';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $model = $this->argument('model');
        
        if(empty($model)) {
            // Display a fail message
            $this->line('fail.');
            
            return self::ERROR;
        }

        // Display a success message
        $this->line('successfully.');

        return self::SUCCESS;
    }
}
```

### Đối số (Arguments)

Tất cả các đối số và tùy chọn do người dùng cung cấp đều được gói trong dấu ngoặc nhọn. Trong ví dụ sau, lệnh xác định một đối số bắt buộc:
```php
/**
 * The name and signature of the console command.
 *
 * @var string
 */
protected $signature = 'mail:send {user}';
```

Bạn cũng có thể đặt đối số là tùy chọn hoặc xác định giá trị mặc định cho đối số:

```php
// Optional argument...
'mail:send {user?}'
 
// Optional argument with default value...
'mail:send {user=foo}'
```

### Tùy chọn (Options)
Các tùy chọn, như đối số, là một dạng đầu vào khác của người dùng. Các tùy chọn được bắt đầu bằng hai dấu gạch nối (`--`) khi chúng được cung cấp thông qua dòng lệnh.
Có hai loại tùy chọn: loại nhận giá trị và loại không nhận. Các tùy chọn không nhận được giá trị đóng vai trò là "công tắc" `boolean`. 
Chúng ta hãy xem một ví dụ về loại tùy chọn này:
```php
/**
 * The name and signature of the console command.
 *
 * @var string
 */
protected $signature = 'mail:send {user} {--queue}';
```
Trong ví dụ này, `--queue` có thể được chỉ định khi gọi lệnh command. Nếu `--queue` được thông qua, giá trị của tùy chọn sẽ là `true`. Nếu không, giá trị sẽ `false`

```php
mail:send 1 --queue
```

Tiếp theo, chúng ta hãy xem xét một tùy chọn nhận một giá trị. Nếu người dùng phải chỉ định giá trị cho một tùy chọn, bạn nên thêm hậu tố tên tùy chọn bằng dấu `=`:
```php
/**
 * The name and signature of the console command.
 *
 * @var string
 */
protected $signature = 'mail:send {user} {--queue=}';
```
Trong ví dụ này, người dùng có thể điền một giá trị cho tùy chọn. Nếu tùy chọn không được chỉ định khi gọi lệnh, giá trị của nó sẽ là `null`:
```php
mail:send 1 --queue=default
```

Bạn có thể gán giá trị mặc định cho các tùy chọn bằng cách chỉ định giá trị mặc định sau tên tùy chọn. Nếu người dùng không điền giá trị tùy chọn nào thì giá trị mặc định sẽ được sử dụng:
```php
'mail:send {user} {--queue=default}'
```

### Message output

Để gửi message đến console, bạn có thể sử dụng `line` method.

```php
/**
 * Execute the console command.
 */
public function handle(): void
{
    // ...
    //message default
    $this->line('The command was successful!');
    //message color green
    $this->line('The command was successful!', 'green');
    //message color blue
    $this->line('The command was successful!', 'blue');
    //message color yellow
    $this->line('The command was successful!', 'yellow');
}
```

hoặc tạo message nhiều màu sắc

```php
use SkillDo\DevTool\Commands\Message;
/**
 * Execute the console command.
 */
public function handle(): void
{
    $this->line(function (Message $message) use ($file) {
        $message->line('success!', 'green');
        $message->line('file is created');
        $message->line('your check', 'blue');
    });
}
```

