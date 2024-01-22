### Field cơ bản
#### Field Text, Password, Number, Email, Tel, Url, Textarea, hidden

Sử dụng phương thức động
```php
$form = new Form();
$form
    ->text('username', ['label' => 'Tên đăng nhập'])
    ->password('password', ['label' => 'Mật khẩu'])
    ->email('email', ['label' => 'email của bạn'])
    ->tel('phone', ['label' => 'Số điện thoại'])
    ->number('age', ['label' => 'Số tuổi', 'min' => 18])
    ->textarea('note', ['label' => 'Ghi chú'])
    ->hidden('token', [], 'y99dkdQLu9856zh');
```

Sử dụng phương thức add
```php
$form = new Form();
$form
    ->add('username', 'text', ['label' => 'Tên đăng nhập'])
    ->add('password', 'password', ['label' => 'Mật khẩu'])
    ->add('email', 'email', ['label' => 'email của bạn'])
    ->add('phone', 'tel', ['label' => 'Số điện thoại'])
    ->add('age', 'number', ['label' => 'Số tuổi', 'min' => 18])
    ->add('note', 'textarea', ['label' => 'Ghi chú'])
    ->add('token', 'hidden', [], 'y99dkdQLu9856zh');
```

#### Field Checkbox, Radio, Select

```php
$options = [
    'value1' => 'Label 1',
    'value2' => 'Label 2',
    'value3' => 'Label 3'
];
$form = new Form();

//Sử dụng phương thức `động`
$form
    ->checkbox('field_name_checkbox', $options, ['label' => 'Label Checkbox'])
    ->radio('field_name_radio', $options, ['label' => 'Label Radio'])
    ->select('field_name_select', $options, ['label' => 'Label Select']);
    
//Sử dụng phương thức `add`
$form
    ->add('field_name_checkbox', 'checkbox', ['label' => 'Label Checkbox', 'options' => $options])
    ->add('field_name_radio', 'radio', ['label' => 'Label Radio', 'options' => $options])
    ->add('field_name_select', 'select', ['label' => 'Label Select', 'options' => $options]);
```

### Field đặt biệt

#### Radio Icon, Checkbox Icon

```php
$options = [
    'left' => [
        'label' => 'Label 1',
        'icon'  => '<i class="fa-sharp fa-light fa-align-left"></i>'
    ],
    'center' => [
        'label' => 'Label 2',
        'icon'  => '<i class="fa-sharp fa-light fa-align-justify"></i>'
    ],
    'right' => [
        'label' => 'Label 3',
        'icon'  => '<i class="fa-sharp fa-light fa-align-right"></i>'
    ],
];

$form = new Form();

//Sử dụng phương thức `động`
$form
    ->checkBoxIcon('field_name_checkbox', $options, ['label' => 'Label Checkbox'])
    ->radioIcon('field_name_radio', $options, ['label' => 'Label Radio']);
    
//Sử dụng phương thức `add`
$form
    ->add('field_name_checkbox', 'checkbox-icon', ['label' => 'Label Checkbox', 'options' => $options])
    ->add('field_name_radio', 'radio-icon', ['label' => 'Label Radio', 'options' => $options]);
```

#### Switch (On/Off)
Mặt định input Switch sẽ trả về giá trị 1 nếu bật và 0 nếu tắt
```php
//Sử dụng phương thức `động`
$form
    ->switch('field_name_switch', ['label' => 'Label switch']);
    
//Sử dụng phương thức `add`
$form
    ->add('field_name_switch', 'switch', ['label' => 'Label switch']);
```
Nếu bạn muốn truyền vào 2 giá trị khác có thể sử dụng biến options, 
biến options phải có 2 phần tử và key phải là 0 và 1,

```php
$form->switch('field_name_switch', ['label' => 'Label switch', 'options' => [
    0 => 'off', //Giá trị trả về khi tắt
    1 => 'on', //Giá trị trả về khi bật
]]);
```

#### Color
Input color sử dụng thư viện `melloware/coloris` nên bạn cần nhúng vào `theme` thư viện này nếu muốn sử dụng field color ở theme
```php
$header->add('color', 'node_modules/@melloware/coloris/dist/coloris.min.css');
$footer->add('color', 'node_modules/@melloware/coloris/dist/umd/coloris.min.js');
```

```php
//Sử dụng phương thức `động`
$form->color('field_name_color', ['label' => 'Label color']);
    
//Sử dụng phương thức `add`
$form->add('field_name_color', 'color', ['label' => 'Label color']);
```

#### Image, File, Video

#### Select2
Input color sử dụng thư viện `select2` nên bạn cần nhúng vào `theme` thư viện này nếu muốn sử dụng field color ở theme

```php
$header->add('select2', 'node_modules/select2/dist/css/select2.min.css');
$footer->add('select2', 'node_modules/select2/dist/js/select2.min.js');
```

```php
$options = [
    'value1' => 'Label 1',
    'value2' => 'Label 2',
    'value3' => 'Label 3'
];

//Sử dụng phương thức `động`
$form->select2('field_name_select2', $options, ['label' => 'Label Select 2']);
    
//Sử dụng phương thức `add`
$form->add('field_name_select2', 'select2', ['label' => 'Label Select 2', 'options' => $options]);
```
Nếu bạn muốn chọn nhiều option thì thêm `multiple` bằng true vào attributes

```php
$form->select2('field_name_select2', $options, ['label' => 'Label Select 2', 'multiple' => true]);
```

#### Date và Datetime

#### Date range

#### Range

#### Repeater
