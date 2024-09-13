# Fields

| [Cơ bản](#field-text-password-number-email-tel-url-textarea-hidden) | [Checkbox](#field-checkbox-radio-select) |       [Checkbox Icon](##radio-icon-checkbox-icon)       | [Radio](#field-checkbox-radio-select) | [Radio Icon](##radio-icon-checkbox-icon) | [Select](#field-checkbox-radio-select) |    [Select2](#select2)     |
|:-------------------------------------------------------------------:|:----------------------------------------:|:-------------------------------------------------------:|:-------------------------------------:|:----------------------------------------:|:--------------------------------------:|:--------------------------:|
|                     [Wysiwyg](#wysiwyg-editor)                      |     [Wysiwyg short](#wysiwyg-editor)     |                 [Switch](#switch-onoff)                 |            [Color](#color)            |        [Image](#image-file-video)        |       [File](#image-file-video)        | [Video](#image-file-video) |
|                   [Date ](#date-time-và-datetime)                   |      [Time](#date-time-và-datetime)      |           [Datetime](#date-time-và-datetime)            |       [Date Range](#date-range)       |             [Range](#range)              |         [Repeater](#repeater)          |  [Font Icon](#font-icon)   |
|                           [Price](#price)                           |           [Gallery](#gallery)            |                      [Menu](#menu)                      |             [Page](#page)             |              [Post](#post)               |     [Post Category](#postcategory)     |  [Font Icon](#font-icon)   |
|                [Input Responsive](#inputresponsive)                 |    [Input Dimension](#inputdimension)    | [Input Dimension Responsive](#inputdimensionresponsive) |       [background](#background)       |            [border](#border)             |        [box shadow](#boxshadow)        |    [spacing](#spacing)     |
|                   [Text Building](#text-building)                   |    [Color Building](#color-building)     |              [Box Building](#box-building)              |  [Button Building](#button-building)  |                                          |                                        |                            |

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

#### Wysiwyg Editor
Input Wysiwyg sử dụng thư viện `tinymce` nên bạn cần nhúng vào `theme` thư viện này nếu muốn sử dụng field Wysiwyg ở theme
```php
$footer->add('tinymce', 'node_modules/tinymce/tinymce.min.js');
```
Input Wysiwyg với đầy đủ các thuộc tính plugin

```php
$form = new Form();

//Sử dụng phương thức `động`
$form->wysiwyg('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'wysiwyg', ['label' => 'Label Field']);
```

Input Wysiwyg với nhỏ gọn hạn chế thuộc tinh plugin

```php
//Sử dụng phương thức `động`
$form->wysiwygShort('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'wysiwyg-short', ['label' => 'Label Field']);
```

#### Radio Icon, Checkbox Icon

```php
$options = [
    'left' => [
        'label' => 'Label 1',
        'icon'  => '<i class="fa-light fa-align-left"></i>'
    ],
    'center' => [
        'label' => 'Label 2',
        'icon'  => '<i class="fa-light fa-align-justify"></i>'
    ],
    'right' => [
        'label' => 'Label 3',
        'icon'  => '<i class="fa-light fa-align-right"></i>'
    ],
];

$form = new Form();

//Sử dụng phương thức `động`
$form
    ->checkboxIcon('field_name_checkbox', $options, ['label' => 'Label Checkbox'])
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
Mặc định label của 2 lựa chọn field switch là bật và tắt nếu muốn thay đổi bạn có thể sử dụng attribute `label-true` và `label-false` để thay đổi
```php
$form->switch('field_name_switch', ['label' => 'Label switch', 'label-true' => 'Ok', 'label-false' => 'No']);
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

#### Date, Time Và Datetime
Field Date, Time Và Datetime sử dụng thư viện `air-datepicker` nên bạn cần nhúng vào `theme` thư viện này nếu muốn sử dụng field Date, Time Và Datetime ở theme
```php
$header->add('air-datepicker', 'node_modules/air-datepicker/air-datepicker.css');
$footer->add('air-datepicker', 'node_modules/air-datepicker/air-datepicker.js');
```
Field Date trả về giá trị có format là `dd/mm/yyyy`
> 
Field Time trả về giá trị có format là `HH:mm`
> 
Field Datetime trả về giá trị có format là `dd/mm/yyyy HH:mm`

```php
//Sử dụng phương thức `động`
$form->date('field_name_date', ['label' => 'Label Date']);
$form->time('field_name_time', ['label' => 'Label Time']);
$form->datetime('field_name_datetime', ['label' => 'Label Datetime']);
    
//Sử dụng phương thức `add`
$form->add('field_name_date', 'date', ['label' => 'Label Date']);
$form->add('field_name_time', 'time', ['label' => 'Label Time']);
$form->add('field_name_datetime', 'datetime', ['label' => 'Label Datetime']);
```

#### Date range
Field Date range sử dụng thư viện `daterangepicker` nên bạn cần nhúng vào `theme` thư viện này nếu muốn sử dụng field Date range ở theme
```php
$header->add('dateRangePicker', 'node_modules/daterangepicker/daterangepicker.css');
$footer->add('dateRangePicker', 'node_modules/daterangepicker/moment.min.js');
$footer->add('dateRangePicker', 'node_modules/daterangepicker/daterangepicker.js');
```

Field DateRange trả về giá trị có format là `dd/mm/yyyy - dd/mm/yyyy`

```php
//Sử dụng phương thức `động`
$form->dateRange('field_name_date_range', ['label' => 'Label Date Range']);
    
//Sử dụng phương thức `add`
$form->add('field_name_date_range', 'daterange', ['label' => 'Label Date Range']);
```

#### Range
Field Range nhận vào 2 options là `min` và `max` mặc định min sẽ là 0 và max sẽ là 100

```php
//Sử dụng phương thức `động`
$form->range('field_name_range', ['label' => 'Label Range', 'min' => 10, 'max' => 200]);
    
//Sử dụng phương thức `add`
$form->add('field_name_range', 'range', ['label' => 'Label Range', 'min' = 10, 'max' = 200]);
```

#### Repeater
Field Repeater tạo một giao diện để thêm và xóa một nhóm input có thể lặp lại.

```php
//Sử dụng phương thức `động`
$form->repeater('items', ['label' => 'Label Range', 'fields' => [
    ['name' => 'title', 'type' => 'text',  'label' => __('Tiêu đề'), 'start' => 6],
    ['name' => 'image', 'type' => 'image', 'label' => __('Images'), 'start' => 6],
    ['name' => 'des', 'type' => 'textarea', 'label' => __('Mô tả'), 'start' => 12],
]]);
    
//Sử dụng phương thức `add`
$form->add('items', 'repeater', ['label' => 'Label Test', 'fields' => [
    ['name' => 'title', 'type' => 'text',  'label' => __('Tiêu đề'), 'start' => 6],
    ['name' => 'image', 'type' => 'image', 'label' => __('Images'), 'start' => 6],
    ['name' => 'des', 'type' => 'textarea', 'label' => __('Mô tả'), 'start' => 12],
]]);
```
#### Font Icon
Field font icon tạo một giao diện để bạn có thể chọn icon nhanh từ font icon cms hỗ trợ
```php
//Sử dụng phương thức `động`
$form->fontIcon('field_name_range', ['label' => 'Label icon']);
    
//Sử dụng phương thức `add`
$form->add('field_name_range', 'font-icon', ['label' => 'Label icon']);
```

#### Price
Field price tạo một input nhập số tự động chèn thêm "," cho phần ngàn
```php
//Sử dụng phương thức `động`
$form->price('field_name_range', ['label' => 'Label price']);
    
//Sử dụng phương thức `add`
$form->add('field_name_range', 'price', ['label' => 'Label price']);
```

### Field lấy dữ liệu

#### Gallery
Lấy danh sách thư viện _(Admin > Thư viện)_ dưới dạng select2

```php
//Sử dụng phương thức `động`
$form->gallery('field_name_gallery', ['label' => 'Label Gallery']);
    
//Sử dụng phương thức `add`
$form->add('field_name_gallery', 'gallery', ['label' => 'Label Gallery']);
```

#### Menu
Lấy danh sách menu _(Admin > giao diện > menu)_ dưới dạng select2

```php
//Sử dụng phương thức `động`
$form->menu('field_name_menu', ['label' => 'Label Menu']);
    
//Sử dụng phương thức `add`
$form->add('field_name_menu', 'menu', ['label' => 'Label Menu']);
```

#### Page

Lấy danh sách Trang Nội Dung _(Admin > Trang nội dung)_ dưới dạng select2

```php
//Sử dụng phương thức `động`
$form->page('field_name_page', ['label' => 'Label Page']);
    
//Sử dụng phương thức `add`
$form->add('field_name_page', 'page', ['label' => 'Label Page']);
```

#### Post
Lấy danh sách Bài viết _(Admin > Bài viết)_ dưới dạng select2
>
Field post nhận options `post_type` để xác định post_type của bài viết, nếu không truyền mặc định post_type là `post`

```php
//Sử dụng phương thức `động`
$form->post('field_name_post', ['label' => 'Label Post', 'post_type' => 'post']);
    
//Sử dụng phương thức `add`
$form->add('field_name_post', 'post', ['label' => 'Label Post', 'post_type' => 'post']);
```


#### postCategory
Lấy danh sách danh mục bài viết _(Admin > Bài viết > Danh mục)_ dưới dạng select2
>
Field postCategory nhận options `cate_type` để xác định cate_type của danh mục bài viết, nếu không truyền mặc định cate_type là `post_categories`

```php
//Sử dụng phương thức `động`
$form->postCategory('field_name_category', ['label' => 'Label Category', 'cate_type' => 'post_categories']);
    
//Sử dụng phương thức `add`
$form->add('field_name_category', 'postCategory', ['label' => 'Label Category', 'cate_type' => 'post_categories']);
```


### Field giao diện
#### none
none cho phép chèn html vào form
```php
$form->none(Admin::button('red', ['text' => 'Xóa']));
```
#### inputResponsive
inputResponsive Tạo cho bạn field text có thể điền 3 kích thước (Desktop, Tablet, Mobile)

```php
//Sử dụng phương thức `động`
$form->inputResponsive('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'input-responsive', ['label' => 'Label Field']);
```

Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        'desktop' => '',
        'tablet' => '',
        'mobile' => '',
    ]
]
```

#### inputDimension
inputDimension Tạo cho bạn bốn field với type là number tương ứng với `Trên`, `Phải`, `Dưới`, `Trái`

```php
//Sử dụng phương thức `động`
$form->inputDimension('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'input-dimension', ['label' => 'Label Field']);
```

Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        'top'       => 0,
        'right'     => 0,
        'bottom'    => 0,
        'left'      => 0,
    ]
]
```

#### inputDimensionResponsive

inputDimensionResponsive tạo cho bạn field giống inputDimension nhưng kèm theo điều kiện Responsive (Desktop, Tablet, Mobile)

```php
//Sử dụng phương thức `động`
$form->inputDimensionResponsive('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'input-dimension-responsive', ['label' => 'Label Field']);
```

Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        'desktop' => [
            'top'       => 0,
            'right'     => 0,
            'bottom'    => 0,
            'left'      => 0,   
        ],
        'tablet' => [
            'top'       => 0,
            'right'     => 0,
            'bottom'    => 0,
            'left'      => 0,
        ],
        'mobile' => [
            'top'       => 0,
            'right'     => 0,
            'bottom'    => 0,
            'left'      => 0,
        ],
    ]
]
```

#### background
Field tạo cho bạn input có thể cấu hình cho thuộc tính css background:
> background theo màu
> background theo màu Gradient
> background theo ảnh nền

```php
//Sử dụng phương thức `động`
$form->background('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'background', ['label' => 'Label Field']);
```

Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        "color" => "",
        //gradient
        "gradientUse" => "0",
        "gradientColor1" => "",
        "gradientColor2" => "",
        "gradientType" => "linear",
        "gradientRadialDirection1" => "center",
        "gradientRadialDirection2" => "180",
        "gradientPositionStart" => "0",
        "gradientPositionEnd" => "100",
        //image
        "image" => "",
        "imageSize" => "cover",
        "imagePosition" => "center center",
    ]
]
```
Để chuyển đổi nhanh data từ field background thành css bạn có thể sử dụng method `cssBg` của class `Template`

```php
$css = Template::cssBg($backgrounData);
```

#### border
Field tạo cho bạn input có thể cấu hình cho thuộc tính css `border`:
```php
//Sử dụng phương thức `động`
$form->border('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'border', ['label' => 'Label Field']);
```
Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        "style" => ""
        "color" => ""
        "width" => [
            "top"       => ""
            "right"     => ""
            "bottom"    => ""
            "left"      => ""
        ],
        "radius" => [
            "top"       => ""
            "right"     => ""
            "bottom"    => ""
            "left"      => ""
        ]
    ]
]
```
Bạn có thể thêm attribute `customInput` để custom các field, `customInput` là một mãng các giá trị

| Params | Type |                                    Description | Default |
|--------|:----:|-----------------------------------------------:|:-------:|
| border | bool |        Hiển thị các field liên quan đến border |  true   |
| radius | bool | Hiển thị các field liên quan đến border-radius |  true   |

Để chuyển đổi nhanh data từ field border thành css bạn có thể sử dụng method `cssBorder` của class `Template`

```php
$css = Template::cssBorder($data);
```
Giá trị bạn nhận được sẽ là

```php
[
    "style" => "",
    "color" => "",
    "width" => [
        "top"    => "",
        "right"  => "",
        "bottom" => "",
        "left"   => "",
    ],
    "radius" => [
        "top"     => "",
        "right"   => "",
        "bottom"  => "",
        "left"    => "",
    ],
    "css" => "...." //mã css
]
```

#### boxShadow
Field tạo cho bạn input có thể cấu hình cho thuộc tính css `box-shadow`:
```php
//Sử dụng phương thức `động`
$form->boxShadow('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'box-shadow', ['label' => 'Label Field']);
```
Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        "color" => "",
        "x" => "",
        "y" => "",
        "blur" => "",
        "spread" => "",
        "position" => "outline"
    ]
]
```
Để chuyển đổi nhanh data từ field boxShadow thành css bạn có thể sử dụng method `cssBoxShadow` của class `Template`

```php
$css = Template::cssBoxShadow($data);
```
Giá trị bạn nhận được sẽ là

```php
[
    "color" => ""
    "x"     => ""
    "y"     => ""
    "blur"  => ""
    "spread" => ""
    "position" => "",
    "css" => "...." //mã css
]
```
#### spacing
Field tạo cho bạn input có thể cấu hình cho thuộc tính css `margin` và `padding`:
```php
//Sử dụng phương thức `động`
$form->spacing('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'spacing', ['label' => 'Label Field']);
```
Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        "margin" => [
            "desktop" => [
                "top"       => "",
                "right"     => "",
                "bottom"    => "",
                "left"      => ""
            ],
            "tablet" => [
                "top"       => "",
                "right"     => "",
                "bottom"    => "",
                "left"      => ""
            ],
            "mobile" => [
                "top"       => "",
                "right"     => "",
                "bottom"    => "",
                "left"      => ""
            ]
        ],
        "padding" => [
            "desktop" => [
                "top"       => "",
                "right"     => "",
                "bottom"    => "",
                "left"      => ""
            ],
            "tablet" => [
                "top"       => "",
                "right"     => "",
                "bottom"    => "",
                "left"      => ""
            ],
            "mobile" => [
                "top"       => "",
                "right"     => "",
                "bottom"    => "",
                "left"      => ""
            ]
        ]
    ]
]
```
Bạn có thể thêm attribute `customInput` để custom các field, `customInput` là một mãng các giá trị

| Params  | Type |                              Description | Default |
|---------|:----:|-----------------------------------------:|:-------:|
| padding | bool | Hiển thị các field liên quan đến padding |  true   |
| margin  | bool |  Hiển thị các field liên quan đến margin |  true   |

Để chuyển đổi nhanh data từ field boxShadow thành css bạn có thể sử dụng method `cssSpacing` của class `Template`

```php
$css = Template::cssSpacing($data);
```

### Field build

Field Build là tập hợp các field giao diện để có thể cấu hình css cho một thành phần element html nào đo như button, text...

#### `Text Building`
Field Text Building là tập hợp các field giao diện để có thể cấu hình css cho text. 

```php
//Sử dụng phương thức `động`
$form->textBuilding('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'text-building', ['label' => 'Label Field']);
```
Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        "txt" => "",
        "color" => "",
        "fontFamily" => "0",
        "fontSize" => [
            "desktop" => "",
            "tablet" => "",
            "mobile" => "",
        ],
        "lineHeight" => "0"
        "margin" => //Giống field inputDimensionResponsive với name margin
        "padding" => //Giống field inputDimensionResponsive với name padding
        "stroke" => [
            "color" => "",
            "width" => ""
        ],
        "shadow" => [
            "color" => "",
            "x" => "",
            "y" => "",
            "blur" => ""
        ]
    ]
]
```

Để cấu hình loại bỏ các thành phần trong Text Building bạn có thể sử dụng options `customInput` là một mãng với key là thành phần và có value là `false`, 
Thành phần của Text Building bao gồm:

| Params             | Type |                                       Description | Default |
|--------------------|:----:|--------------------------------------------------:|:-------:|
| txt                | bool |                          Hiển thị field nhập text |  true   |
| fontFamily         | bool |                   Hiển thị field chọn font family |  true   |
| fontSize           | bool |                     Hiển thị field nhập font size |  true   |
| fontSizeResponsive | bool | nếu true font size sẽ là chọn lựa theo kích thước |  true   |
| fontWeight         | bool |                   Hiển thị field chọn font weight |  true   |
| lineHeight         | bool |                    Hiển thị field nhập LineHeight |  true   |
| textStyle          | bool |                    Hiển thị field nhập font style |  true   |
| color              | bool |                       Hiển thị field chọn màu chữ |  true   |
| colorHover         | bool |             Hiển thị field chọn màu chữ lúc hover |  false  |
| align              | bool |                         Hiển thị field chọn align |  true   |
| margin             | bool |         Hiển thị field chọn margin ở tab nâng cao |  true   |
| padding            | bool |        Hiển thị field chọn padding ở tab nâng cao |  true   |
| stroke             | bool |         Hiển thị field chọn stroke ở tab nâng cao |  true   |
| shadow             | bool |         Hiển thị field chọn shadow ở tab nâng cao |  true   |
| tabAdvanced        | bool |                          Hiển thị cả tab nâng cao |  true   |

```php
//Sử dụng phương thức `động`
$form->textBuilding('field_name', ['label' => 'Label Field', 'customInput' => [
    'txt' => false,
    'colorHover' => false,
]]);
```

Để chuyển đổi nhanh data từ field textBuilding thành css bạn có thể sử dụng method `cssText` của class `Template`

```php
$css = Template::cssText($data);
```
Giá trị bạn nhận được sẽ là

```php
[
    ...
    "cssText" => "", //các css liên quan đến text
    "cssTextTablet" => "", //các css liên quan đến text cho tablet
    "cssTextMobile" => "", //các css liên quan đến text cho mobile
    "cssDimension" => "" //css margin padding 
    "cssDimensionTablet" => "" //css margin padding cho tablet
    "cssDimensionMobile" => "" //css margin padding cho mobile
    "css"       => "" //css tất cả
    "cssMobile" => "" //css tất cả cho mobile
    "cssTablet" => "" //css tất cả cho tablet
    "cssHover"  => "" //css cho các thành phần có hover
]
```

#### `Color Building`
Field Color Building là tập hợp các field giao diện để có thể cấu hình css màu sắc cho các thành phần html.
```php
//Sử dụng phương thức `động`
$form->colorBuilding('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'color-building', ['label' => 'Label Field']);
```
Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        "color" => "",
        "colorHover" => "",
    ]
]
```
#### `Box Building`
Field Box Building là tập hợp các field giao diện để có thể cấu hình css cho div.

```php
//Sử dụng phương thức `động`
$form->boxBuilding('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'box-building', ['label' => 'Label Field']);
```
Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        "background" => //các thuộc tính của field background,
        "border" => //các thuộc tính của field border,
        "boxShadow" => //các thuộc tính của field boxShadow,
        "margin" => //Giống field inputDimensionResponsive với name margin
        "padding" => //Giống field inputDimensionResponsive với name padding
        "hover" => [
            "borderColor" => "",
            "background" => //các thuộc tính của field background,
        ],
    ]
]
```

Tương tự như Text Building, Box Building cũng sử dụng options `customInput`,
Thành phần của Box Building bao gồm:

| Params     | Type |                                Description | Default |
|------------|:----:|-------------------------------------------:|:-------:|
| background | bool |                  Hiển thị field background |  true   |
| border     | bool |                 Hiển thị field chọn border |  true   |
| margin     | bool |  Hiển thị field chọn margin ở tab nâng cao |  true   |
| padding    | bool | Hiển thị field chọn padding ở tab nâng cao |  true   |
| boxShadow  | bool |  Hiển thị field chọn shadow ở tab nâng cao |  true   |
| hover      | bool |                   Hiển thị các field hover |  true   |


```php
$form->boxBuilding('boxBuilding', ['label' => 'Label Field', 'customInput' => [
    'hover' => false,
]]);
```

Để chuyển đổi nhanh data từ field boxBuilding thành css bạn có thể sử dụng method `cssBox` của class `Template`

```php
$css = Template::cssBox($data);
```
Giá trị bạn nhận được sẽ là

```php
[
    ...
    "cssBox"             => "", //các css liên quan đến box background, border, box-shadow
    "cssDimension"       => "" //css margin padding 
    "cssDimensionTablet" => "" //css margin padding cho tablet
    "cssDimensionMobile" => "" //css margin padding cho mobile
    "css"       => "" //css tất cả
    "cssMobile" => "" //css tất cả cho mobile
    "cssTablet" => "" //css tất cả cho tablet
    "cssHover"  => "" //css cho các thành phần có hover
]
```

#### Button Building
Field Button Building là tập hợp các field giao diện để có thể cấu hình css cho Button.

```php
//Sử dụng phương thức `động`
$form->buttonBuilding('field_name', ['label' => 'Label Field']);
    
//Sử dụng phương thức `add`
$form->add('field_name', 'button-building', ['label' => 'Label Field']);
```
Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        "background" => //các thuộc tính của field background,
        "border" => //các thuộc tính của field border,
        "color" => ""
        "fontFamily" => "0"
        "fontSize" => [
            "desktop" => ""
            "tablet" => ""
            "mobile" => ""
        ]
        "lineHeight" => "0"
        "hover" => [
            "color" => ""
            "borderColor" => ""
            "background" => //các thuộc tính của field background,
        ]
        "margin" => //Giống field inputDimensionResponsive với name margin
        "padding" => //Giống field inputDimensionResponsive với name padding
        "boxShadow" => //các thuộc tính của field boxShadow,
    ]
]
```

Tương tự như Text Building, Button Building cũng sử dụng options `customInput`,
Thành phần của Button Building bao gồm:

| Params     | Type |                                Description | Default |
|------------|:----:|-------------------------------------------:|:-------:|
| background | bool |                  Hiển thị field background |  true   |
| border     | bool |                 Hiển thị field chọn border |  true   |
| color      | bool |                Hiển thị field chọn màu chữ |  true   |
| fontFamily | bool |            Hiển thị field chọn font family |  true   |
| fontSize   | bool |              Hiển thị field nhập font size |  true   |
| textStyle  | bool |             Hiển thị field nhập font style |  true   |
| lineHeight | bool |             Hiển thị field nhập LineHeight |  true   |
| align      | bool |                  Hiển thị field chọn align |  true   |
| fontWeight | bool |            Hiển thị field chọn font weight |  true   |
| margin     | bool |  Hiển thị field chọn margin ở tab nâng cao |  true   |
| padding    | bool | Hiển thị field chọn padding ở tab nâng cao |  true   |
| boxShadow  | bool |  Hiển thị field chọn shadow ở tab nâng cao |  true   |
| hover      | bool |                  Hiển thị cac trường hover |  true   |

```php
//Sử dụng phương thức `động`
$form->buttonBuilding('field_name', ['label' => 'Label Field', 'customInput' => [
    'padding' => false,
    'margin' => false,
]]);
```

Để chuyển đổi nhanh data từ field boxBuilding thành css bạn có thể sử dụng method `cssButton` của class `Template`

```php
$css = Template::cssButton($data);
```


