# Thêm mới Fields
Ngoài các field mặc định mà cms đã cung cấp, bạn hoàn toàn có thêm mới field của riêng mình

### Sử dụng class

#### Bước 1 — Tạo class field

Tạo class field của bạn (trong `app/` của theme hoặc plugin, miễn là được autoload) kế thừa lại class `InputBuilder` của cms

```php
namespace MyPlugin\Form\Field;

use SkillDo\Cms\Form\InputBuilder;

class MyFieldCustom extends InputBuilder {

    function __construct($args = [], mixed $value = null, $form = null) {

        parent::__construct($args, $value, $form);

        $this->setType('my-field-custom');
    }

    public function output(): static
    {
        $this->output .= $this->_inputDefault($this->attributes(true));

        return $this;
    }
}
```

Với method `output` sẽ gán giao diện input cần hiển thị vào biến `$this->output` (có thể dùng các helper sẵn có của `InputBuilder` như `_inputDefault`, `_inputTextarea`, `_inputDropdown`... hoặc tự build chuỗi html)

#### Bước 2 — Đăng ký field

Đăng ký field với hệ thống qua key `cms.form.fields` trong `plugin.json` (với plugin) hoặc `theme.json` / `theme-child.json` (với theme):

```json
{
    "cms": {
        "form": {
            "fields": {
                "my-field-custom": {
                    "class": "MyPlugin\\Form\\Field\\MyFieldCustom",
                    "options": false
                }
            }
        }
    }
}
```

- **Key** (`"my-field-custom"`) là `$type` dùng với phương thức `add`. Tên phương thức động được sinh từ key bằng cách viết thường ký tự đầu (ví dụ key `"MyFieldCustom"` → `$form->myFieldCustom(...)`).
- **`class`** là Namespace đầy đủ của class field (phải được map đúng trong `autoload`).
- **`options`** đặt true nếu field nhận danh sách options làm đối số thứ 2 (giống select, radio, checkbox).

Danh sách field được hệ thống cache với key `core_form_fields_factories`, nếu field mới chưa nhận bạn cần xóa cache này để hệ thống build lại danh sách field

```php
Cache::delete('core_form_fields_factories');
```

#### Bước 3 — Sử dụng field

 ```php
$form = form();
$form->add('field_name', 'my-field-custom', ['label' => 'hello']);
```

### Sử dụng static method
Tạo class có method static, method sẽ nhận 2 đối số: `$params` (object chứa các attributes của field) và `$value` (giá trị của field), trả về chuỗi html của field

```php
class MyFieldCustom {

    static function field($params, $value): string
    {
        return '<input type="text" name="'.$params->name.'" value="'.$value.'" class="form-control">';
    }
}
```
Sau đó bạn có thể sử dụng field mới bằng cách truyền `Class::method` vào tham số `$type` của method `add`

 ```php
$form = form();
$form->add('field_name', 'MyFieldCustom::field', ['label' => 'hello']);
```

### Sử dụng function

Tạo function có prefix là `_form_`, function sẽ nhận 2 đối số: `$params` (object chứa các attributes của field) và `$value` (giá trị của field), trả về chuỗi html của field

```php
function _form_my_field($params, $value)
{
    return '<input type="text" name="'.$params->name.'" value="'.$value.'" class="form-control">';
}
```
Sau đó bạn có thể sử dụng field mới bằng cách truyền phần tên sau prefix `_form_` vào tham số `$type` của method `add`

 ```php
$form = form();
$form->add('field_name', 'my_field', ['label' => 'hello']);
```
