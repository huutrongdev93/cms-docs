# Fields

| [Cơ bản](#field-text-password-number-email-tel-url-textarea-hidden) | [Checkbox](#field-checkbox-radio-select) |       [Checkbox Icon](#radio-icon-checkbox-icon)       | [Radio](#field-checkbox-radio-select) | [Radio Icon](#radio-icon-checkbox-icon) | [Select](#field-checkbox-radio-select) |    [Select2](#select2)     |
| :-----------------------------------------------------------------: | :--------------------------------------: | :-----------------------------------------------------: | :-----------------------------------: | :--------------------------------------: | :------------------------------------: | :------------------------: |
|                     [Wysiwyg](#wysiwyg-editor)                      |     [Wysiwyg short](#wysiwyg-editor)     |                 [Switch](#switch-onoff)                 |            [Color](#color)            |        [Image](#image-file-video)        |       [File](#image-file-video)        | [Video](#image-file-video) |
|                   [Date ](#date-time-và-datetime)                   |      [Time](#date-time-và-datetime)      |           [Datetime](#date-time-và-datetime)            |       [Date Range](#date-range)       |             [Range](#range)              |         [Repeater](#repeater)          |  [Font Icon](#font-icon)   |
|                           [Price](#price)                           |           [Gallery](#gallery)            |                      [Menu](#menu)                      |             [Page](#page)             |              [Posts](#posts)             |     [Post Category](#postcategory)     |  [Font Icon](#font-icon)   |
|                [Input Responsive](#inputresponsive)                 |    [Input Dimension](#inputdimension)    | [Input Dimension Responsive](#inputdimensionresponsive) |       [background](#background)       |            [border](#border)             |        [box shadow](#boxshadow)        |    [spacing](#spacing)     |
|                   [Text Building](#text-building)                   |    [Color Building](#color-building)     |              [Box Building](#box-building)              |  [Button Building](#button-building)  |     [Checkbox Tree](#checkbox-tree)      |       [Select Img](#select-img)        |   [Tab](#tab-select-tabs)  |
|                            [Code](#code)                             | [Post Category Tree](#postcategorytree)  |           [Popover Advance](#popover-advance)            |          [Flexbox](#flexbox)          |       [Text Shadow](#textshadow)         |      [Text Stroke](#textstroke)        | [Typography](#typography)  |
|                  [Scroll Effects](#scrolleffects)                    |         [Container](#container)          |        [Numeric Selector](#numericselector)              |       [Form Field](#formfield)        |          [Heading](#heading)             |  [Widget Heading](#widgetheading)      | [Gallery Item](#gallery-item) |
|                          [Tags](#tags)                               |                                          |                                                          |                                       |                                          |                                        |                            |

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
    ->checkbox('field_name_checkbox', ['label' => 'Label Checkbox'])->options($options)
    ->radio('field_name_radio', ['label' => 'Label Radio'])->options($options)
    ->select('field_name_select', ['label' => 'Label Select'])->options($options);
    
//Sử dụng phương thức `add`
$form
    ->add('field_name_checkbox', 'checkbox', ['label' => 'Label Checkbox'])->options($options)
    ->add('field_name_radio', 'radio', ['label' => 'Label Radio'])->options($options)
    ->add('field_name_select', 'select', ['label' => 'Label Select'])->options($options);
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
    ->checkboxIcon('field_name_checkbox', ['label' => 'Label Checkbox'])->options($options)
    ->radioIcon('field_name_radio', ['label' => 'Label Radio'])->options($options);
    
//Sử dụng phương thức `add`
$form
    ->add('field_name_checkbox', 'checkbox-icon', ['label' => 'Label Checkbox'])->options($options)
    ->add('field_name_radio', 'radio-icon', ['label' => 'Label Radio'])->options($options);
```

#### Checkbox Tree
Tạo danh sách checkbox dạng cây (cha - con), trả về mảng giá trị (name tự thêm `[]`).
Mỗi option có dạng `['label' => ..., 'value' => ..., 'children' => [...]]`, nếu không truyền `value` sẽ lấy key làm value

```php
$options = [
    ['label' => 'Cha 1', 'value' => 1, 'children' => [
        ['label' => 'Con 1', 'value' => 2],
    ]],
];

//Sử dụng phương thức `động`
$form->checkboxTree('field_name', ['label' => 'Label Tree'])->options($options);

//Sử dụng phương thức `add`
$form->add('field_name', 'checkbox-tree', ['label' => 'Label Tree'])->options($options);
```

#### Select Img
Tạo danh sách lựa chọn hiển thị bằng hình ảnh. Mỗi option có dạng `['label' => ..., 'img' => ..., 'value' => ..., 'width' => ..., 'height' => ...]` (hoặc `'icon'` thay cho `'img'`), nếu không truyền `value` sẽ lấy key làm value

```php
$options = [
    'layout1' => ['label' => 'Layout 1', 'img' => 'assets/img/layout1.png'],
    'layout2' => ['label' => 'Layout 2', 'img' => 'assets/img/layout2.png'],
];

//Sử dụng phương thức `động`
$form->selectImg('field_name', ['label' => 'Label Select Img'])->options($options);

//Sử dụng phương thức `add`
$form->add('field_name', 'select-img', ['label' => 'Label Select Img'])->options($options);
```

#### Tab (Select Tabs)
Tạo lựa chọn dạng các tab/nút bấm nằm ngang (thường dùng chọn icon align, direction...), value là key của option được chọn

```php
//Sử dụng phương thức `động`
$form->tab('field_name', ['label' => 'Align'], 'left')->options([
    'left'   => '<i class="fa-light fa-align-left"></i>',
    'center' => '<i class="fa-light fa-align-center"></i>',
    'right'  => '<i class="fa-light fa-align-right"></i>',
]);

//Sử dụng phương thức `add`
$form->add('field_name', 'tab', ['label' => 'Align'], 'left')->options([...]);
```

#### Code
Tạo textarea soạn thảo code (CodeMirror). Hỗ trợ attribute `language` (thêm class `code-{language}`) và `rows`

```php
//Sử dụng phương thức `động`
$form->code('field_name', ['label' => 'Label Code', 'language' => 'css']);

//Sử dụng phương thức `add`
$form->add('field_name', 'code', ['label' => 'Label Code', 'language' => 'css']);
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
$form->switch('field_name_switch', ['label' => 'Label switch'])->options([
    0 => 'off', //Giá trị trả về khi tắt
    1 => 'on', //Giá trị trả về khi bật
]);
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
Ba field này tạo input chọn file từ trình quản lý file (File Manager) của admin, mỗi field mở File Manager với bộ lọc tương ứng (ảnh, file, video) và lưu đường dẫn file vào input

```php
//Sử dụng phương thức `động`
$form->image('field_name_image', ['label' => 'Label Image']);
$form->file('field_name_file', ['label' => 'Label File']);
$form->video('field_name_video', ['label' => 'Label Video']);

//Sử dụng phương thức `add`
$form->add('field_name_image', 'image', ['label' => 'Label Image']);
$form->add('field_name_file', 'file', ['label' => 'Label File']);
$form->add('field_name_video', 'video', ['label' => 'Label Video']);
```

Nếu muốn dùng input upload mặc định của trình duyệt (`<input type="file">`) thay vì File Manager, thêm attribute `default` bằng true:

```php
$form->image('field_name_image', ['label' => 'Label Image', 'default' => true]);
```

#### Select2
Input select2 sử dụng thư viện `select2` nên bạn cần nhúng vào `theme` thư viện này nếu muốn sử dụng field select2 ở theme

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
$form->select2('field_name_select2', ['label' => 'Label Select 2'])->options($options);
    
//Sử dụng phương thức `add`
$form->add('field_name_select2', 'select2', ['label' => 'Label Select 2'])->options($options);
```
Nếu bạn muốn chọn nhiều option thì thêm `multiple` bằng true vào attributes hoặc gọi method

```php
$form->select2('field_name_select2', ['label' => 'Label Select 2'])->options($options)->multiple(true);
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
$form->daterange('field_name_date_range', ['label' => 'Label Date Range']);
    
//Sử dụng phương thức `add`
$form->add('field_name_date_range', 'daterange', ['label' => 'Label Date Range']);
```

#### Range
Field Range nhận vào 2 options là `min` và `max` mặc định min sẽ là 0 và max sẽ là 100

```php
//Sử dụng phương thức `động`
$form->range('field_name_range', ['label' => 'Label Range'])->min(10)->max(200);
    
//Sử dụng phương thức `add`
$form->add('field_name_range', 'range', ['label' => 'Label Range'])->min(10)->max(200);
```

#### Repeater
Field Repeater tạo một giao diện để thêm và xóa một nhóm input có thể lặp lại.

```php
//Sử dụng phương thức `động`
$form->repeater('items', ['label' => 'Label Range'])->fields(function ($repeater) {
    $repeater->text('title', ['label' => __('Tiêu đề'), 'start' => 6]);
    $repeater->image('image', ['label' => __('Images'), 'start' => 6]);
    $repeater->textarea('des', ['label' => __('Mô tả'), 'start' => 12]);
});
    
//Sử dụng phương thức `add`
$form->add('items', 'repeater', ['label' => 'Label Test'])->fields(function ($repeater) {
    $repeater->text('title', ['label' => __('Tiêu đề'), 'start' => 6]);
    $repeater->image('image', ['label' => __('Images'), 'start' => 6]);
    $repeater->textarea('des', ['label' => __('Mô tả'), 'start' => 12]);
});
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

**Số chữ số thập phân** *(từ 8.1.2)* — mặc định `0` vì cột giá của CMS là số nguyên (VND không có phần lẻ). Site dùng tiền tệ có xu (USD…) khai qua filter hoặc tham số `decimals` (nhận giá trị 0–4):

```php
//Đặt cho toàn hệ thống
add_filter('form_price_decimals', fn() => 2);

//Hoặc đặt riêng từng ô
$form->price('price', ['label' => 'Giá', 'decimals' => 2]);
```

> Ô nhập luôn là **tiền tệ cơ sở**; cột `decimals` của bảng `currencies` chỉ dùng khi quy đổi để hiển thị ngoài site. Phần lẻ chỉ giữ được nếu cột tương ứng đổi sang `decimal` — cột `integer` vẫn bị cắt.

#### Tags

Ô nhập thẻ tự do có gợi ý (select2), gợi ý lấy động qua ajax. Có từ phiên bản **8.1.3**.

```php
//Sử dụng phương thức `động`
$form->tags('tags', ['label' => 'Thẻ']);

//Sử dụng phương thức `add`
$form->add('tags', 'tags', [
    'label'       => 'Thẻ',
    'placeholder' => 'Nhập thẻ rồi nhấn Enter',
    'tag_type'    => 'post',   // bộ từ vựng thẻ, mặc định "post"
]);
```

> Giá trị gửi lên server là **TÊN thẻ**, không phải id — thẻ chưa tồn tại sẽ được tạo mới khi lưu. Tối đa 30 thẻ cho một nội dung. Xem [Thẻ (Tag)](../06-Cms/Tags.md).

### Field lấy dữ liệu

#### Gallery
Lấy danh sách thư viện _(Admin > Thư viện)_ dưới dạng select2

```php
//Sử dụng phương thức `động`
$form->gallery('field_name_gallery', ['label' => 'Label Gallery']);
    
//Sử dụng phương thức `add`
$form->add('field_name_gallery', 'gallery', ['label' => 'Label Gallery']);
```
#### Gallery Item
Tạo thư viện ảnh (chọn được danh sách ảnh thành thư viện)

```php
//Sử dụng phương thức `động`
$form->galleryItem('field_name_gallery', ['label' => 'Label list Image']);
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

#### Posts
Tìm kiếm và chọn Bài viết _(Admin > Bài viết)_ dưới dạng popover (kế thừa field `popover-advance`, xem [Popover](Popover))
>
Field posts nhận options `post_type` để xác định post_type của bài viết, nếu không truyền mặc định post_type là `post`.
Có thể thêm options `multiple` (mặc định là true) để chọn nhiều bài viết.

```php
//Sử dụng phương thức `động`
$form->posts('field_name_post', ['label' => 'Label Post', 'post_type' => 'post']);
    
//Sử dụng phương thức `add`
$form->add('field_name_post', 'posts', ['label' => 'Label Post', 'post_type' => 'post']);
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


#### postCategoryTree
Chọn nhiều danh mục bài viết dưới dạng cây checkbox (giống checkbox-tree nhưng dữ liệu lấy tự động từ danh mục), trả về mảng id danh mục.
Nhận options `cate_type` giống field postCategory, mặc định là `post_categories`

```php
//Sử dụng phương thức `động`
$form->postCategoryTree('field_name', ['label' => 'Label Category Tree', 'cate_type' => 'post_categories']);

//Sử dụng phương thức `add`
$form->add('field_name', 'post-category-tree', ['label' => 'Label Category Tree']);
```

#### Popover Advance
Field tìm kiếm và chọn dữ liệu (bài viết, danh mục, trang, thành viên hoặc dữ liệu tùy chỉnh) với giao diện popover.
Xem chi tiết tại [**`Popover`**](Popover)

```php
$form->popoverAdvance('field_name', ['label' => 'Label', 'search' => 'post']);
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

| Params | Type  |                                    Description | Default |
| ------ | :---: | ---------------------------------------------: | :-----: |
| border | bool  |        Hiển thị các field liên quan đến border |  true   |
| radius | bool  | Hiển thị các field liên quan đến border-radius |  true   |

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

| Params  | Type  |                              Description | Default |
| ------- | :---: | ---------------------------------------: | :-----: |
| padding | bool  | Hiển thị các field liên quan đến padding |  true   |
| margin  | bool  |  Hiển thị các field liên quan đến margin |  true   |

Để chuyển đổi nhanh data từ field boxShadow thành css bạn có thể sử dụng method `cssSpacing` của class `Template`

```php
$css = Template::cssSpacing($data);
```

#### flexbox
Field cấu hình các thuộc tính css flexbox: `direction`, `justify_content`, `align_items`, `gap`, `wrap`

```php
//Sử dụng phương thức `động`
$form->flexBox('field_name', ['label' => 'Label Field']);

//Sử dụng phương thức `add`
$form->add('field_name', 'flexbox', ['label' => 'Label Field']);
```

Khi submit bạn sẽ nhận được dữ liệu dạng

```php
[
    'field_name' => [
        'direction'       => 'column',
        'justify_content' => 'start',
        'align_items'     => '',
        'gap'             => '',
        'wrap'            => '',
    ]
]
```

#### flexboxResponsive
Giống field flexbox nhưng cấu hình theo 3 kích thước, dữ liệu trả về gom theo key `desktop`, `tablet`, `mobile`

```php
//Sử dụng phương thức `động`
$form->flexboxResponsive('field_name', ['label' => 'Label Field']);

//Sử dụng phương thức `add`
$form->add('field_name', 'flexbox-responsive', ['label' => 'Label Field']);
```

#### textShadow
Field cấu hình css `text-shadow` gồm `color`, `x`, `y`, `blur`. Attribute `popup` (mặc định true) quyết định hiển thị dạng popup hay inline

```php
//Sử dụng phương thức `động`
$form->textShadow('field_name', ['label' => 'Label Field']);

//Sử dụng phương thức `add`
$form->add('field_name', 'text-shadow', ['label' => 'Label Field']);
```

#### textStroke
Field cấu hình css viền chữ (text-stroke) gồm `color`, `width`. Attribute `popup` (mặc định true)

```php
//Sử dụng phương thức `động`
$form->textStroke('field_name', ['label' => 'Label Field']);

//Sử dụng phương thức `add`
$form->add('field_name', 'text-stroke', ['label' => 'Label Field']);
```

#### typography
Field cấu hình typography cho text: `fontFamily`, `fontSize` (responsive), `lineHeight`, `fontWeight`, `textStyle`, `align`.
Hỗ trợ options `customInput` (mảng key => bool) để bật/tắt từng thành phần: `fontFamily`, `fontSize`, `fontSizeResponsive`, `textStyle`, `align`, `lineHeight`, `fontWeight`, `cssStyle` (tất cả mặc định true) và `fontWeightOptions` để thay danh sách font weight

```php
//Sử dụng phương thức `động`
$form->typography('field_name', ['label' => 'Label Field']);

//Sử dụng phương thức `add`
$form->add('field_name', 'typography', ['label' => 'Label Field']);
```

#### scrollEffects
Field cấu hình nhóm hiệu ứng khi cuộn trang, gồm 6 hiệu ứng con: `vertical`, `horizontal`, `rotate`, `scale`, `opacity`, `blur` (mỗi hiệu ứng cũng là một field riêng: `scroll-effect-vertical`, `scroll-effect-horizontal`, `scroll-effect-rotate`, `scroll-effect-scale`, `scroll-effect-opacity`, `scroll-effect-blur`)

```php
//Sử dụng phương thức `động`
$form->scrollEffects('field_name', ['label' => 'Label Field']);

//Sử dụng phương thức `add`
$form->add('field_name', 'scroll-effects', ['label' => 'Label Field']);
```

#### container
Field chọn kiểu khung chứa nội dung với 3 lựa chọn giá trị: `full`, `container`, `in-container` (lưu vào input hidden)

```php
//Sử dụng phương thức `động`
$form->container('field_name', ['label' => 'Label Field']);

//Sử dụng phương thức `add`
$form->add('field_name', 'container', ['label' => 'Label Field']);
```

#### numericSelector
Field chọn số nguyên dạng thanh kéo có các ô số, nhận attribute `min` (mặc định 1) và `max` (mặc định 12)

```php
//Sử dụng phương thức `động`
$form->numericSelector('field_name', ['label' => 'Label Field', 'min' => 1, 'max' => 12]);

//Sử dụng phương thức `add`
$form->add('field_name', 'numericSelector', ['label' => 'Label Field']);
```

#### heading
Field nhập text kèm chọn style heading, dữ liệu trả về dạng `['text' => ..., 'style' => ..., 'options' => [...]]`

```php
$form->heading('field_name', ['label' => 'Label Field']);
```

#### widgetHeading
Field nhập tiêu đề cho widget (input text với giao diện heading của widget)

```php
$form->widgetHeading('field_name', ['label' => 'Label Field']);
```

#### formField
Field trình tạo danh sách field động (form builder) — cho phép người dùng admin tự thêm/xóa các field (text, email, textarea, url, number, date, time, password, checkbox, radio, select, tel, hidden) kèm cấu hình label, placeholder, required, độ rộng cột (desktop/tablet/mobile), options, min/max...

```php
//Sử dụng phương thức `động`
$form->formField('field_name', ['label' => 'Label Field']);

//Sử dụng phương thức `add`
$form->add('field_name', 'form-field', ['label' => 'Label Field']);
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

| Params             | Type  |                                       Description | Default |
| ------------------ | :---: | ------------------------------------------------: | :-----: |
| txtInput           | bool  |                          Hiển thị field nhập text |  true   |
| fontFamily         | bool  |                   Hiển thị field chọn font family |  true   |
| fontSize           | bool  |                     Hiển thị field nhập font size |  true   |
| fontSizeResponsive | bool  | nếu true font size sẽ là chọn lựa theo kích thước |  true   |
| fontWeight         | bool  |                   Hiển thị field chọn font weight |  true   |
| lineHeight         | bool  |                    Hiển thị field nhập LineHeight |  true   |
| textStyle          | bool  |                    Hiển thị field nhập font style |  true   |
| color              | bool  |                       Hiển thị field chọn màu chữ |  true   |
| colorHover         | bool  |             Hiển thị field chọn màu chữ lúc hover |  false  |
| align              | bool  |                         Hiển thị field chọn align |  true   |
| margin             | bool  |         Hiển thị field chọn margin ở tab nâng cao |  true   |
| padding            | bool  |        Hiển thị field chọn padding ở tab nâng cao |  true   |
| stroke             | bool  |         Hiển thị field chọn stroke ở tab nâng cao |  true   |
| shadow             | bool  |         Hiển thị field chọn shadow ở tab nâng cao |  true   |
| tabAdvanced        | bool  |                          Hiển thị cả tab nâng cao |  true   |

```php
//Sử dụng phương thức `động`
$form->textBuilding('field_name', ['label' => 'Label Field', 'customInput' => [
    'txtInput' => false,
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

| Params     | Type  |                                Description | Default |
| ---------- | :---: | -----------------------------------------: | :-----: |
| background | bool  |                  Hiển thị field background |  true   |
| border     | bool  |                 Hiển thị field chọn border |  true   |
| margin     | bool  |  Hiển thị field chọn margin ở tab nâng cao |  true   |
| padding    | bool  | Hiển thị field chọn padding ở tab nâng cao |  true   |
| boxShadow  | bool  |  Hiển thị field chọn shadow ở tab nâng cao |  true   |
| hover      | bool  |                   Hiển thị các field hover |  true   |


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

| Params     | Type  |                                Description | Default |
| ---------- | :---: | -----------------------------------------: | :-----: |
| background | bool  |                  Hiển thị field background |  true   |
| border     | bool  |                 Hiển thị field chọn border |  true   |
| color      | bool  |                Hiển thị field chọn màu chữ |  true   |
| fontFamily | bool  |            Hiển thị field chọn font family |  true   |
| fontSize   | bool  |              Hiển thị field nhập font size |  true   |
| textStyle  | bool  |             Hiển thị field nhập font style |  true   |
| lineHeight | bool  |             Hiển thị field nhập LineHeight |  true   |
| align      | bool  |                  Hiển thị field chọn align |  true   |
| fontWeight | bool  |            Hiển thị field chọn font weight |  true   |
| margin     | bool  |  Hiển thị field chọn margin ở tab nâng cao |  true   |
| padding    | bool  | Hiển thị field chọn padding ở tab nâng cao |  true   |
| boxShadow  | bool  |  Hiển thị field chọn shadow ở tab nâng cao |  true   |
| hover      | bool  |                  Hiển thị cac trường hover |  true   |

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


