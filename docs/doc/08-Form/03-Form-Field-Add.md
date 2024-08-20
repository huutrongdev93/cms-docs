# Thêm mới Fields
Ngoài các field mặc định mà cms đã cung cấp, bạn hoàn toàn có thêm mới field của riêng mình

### Sử dụng class
Để tạo một field mới bạn tạo đường dẫn thư mục như sau (trong theme hiện tại hoặc một plugin cụ thể nào đó):
```php
core/Form/Field
```

Tạo class field của bạn kế thừa lại class `InputBuilder` của cms

```php
namespace core\Form\Field;
use SkillDo\Form\InputBuilder;

class MyFieldCustom extends InputBuilder {

    function __construct($args = [], mixed $value = null) {

        parent::__construct($args, $value);

        $this->type = 'my-field-custom';
    }
    
    public function getName(): string
    {
        return $this->name;
    }
    
    public function output(): static
    {
        $this->output .= form_input($this->attributes(true));
        return $this;
    }
}
```

Với method output sẽ gán giao diện input cần hiển thị vào biến output

Nếu ở chế độ DEBUG = false bạn cần xóa cache `core_form_fields_factories` và `core_files_loader` để cập nhật lại danh sách field

```php
CacheHandler::delete('core_form_fields_factories')
CacheHandler::delete('core_files_loader')
```

Sau đó bạn có thể sử dụng field mới bằng cách

 ```php
$form = form();
$form->MyFieldCustom('field_name', ['label' => 'hello']);
//hoặc
$form->add('field_name', 'my-field-custom', ['label' => 'hello']);
```

### Sử dụng static method
Tạo class có method static, method sẽ nhận 2 đối số $params chứa thông tin field và $value chứa giá trị của field

```php
class MyFieldCustom {

    static function field($params, $value): static
    {
        return form_input($params, $value);
    }
}
```
Sau đó bạn có thể sử dụng field mới bằng cách sử dụng method `add`

 ```php
$form = form();
//hoặc
$form->add('field_name', 'MyFieldCustom::field', ['label' => 'hello']);
```

### Sử dụng function

Tạo function có prefix là `_form_`, function sẽ nhận 2 đối số $params chứa thông tin field và $value chứa giá trị của field

```php
function _form_my_field($params, $value)
{
    return form_input($params, $value);
}
```
Sau đó bạn có thể sử dụng field mới bằng cách sử dụng method `add`

 ```php
$form = form();
//hoặc
$form->add('field_name', 'my_field', ['label' => 'hello']);
```