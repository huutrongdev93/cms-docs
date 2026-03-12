# Style Build
Trong theme cung cấp cho bạn một class giúp bạn build css nhanh từ các input của form building
```php
$style = new ThemeCssBuild()
```
Khi khởi tạo bạn có thể truyền vào class mà bạn muốn khi build css class này sẽ bọc lại tất cả css của bạn

```php
$style = new ThemeCssBuild('.box-parent')
```

### Variables (Biến)
Khởi tạo các biến cho css
```php
$style->cssVariables('--header-logo-height', '100px');
$style->cssVariables('--header-logo-width', '200px');
$style->cssVariables('--header-logo-border-color', '#000');
```

### Css Building
Tạo css từ data của các input building của `Skilldo\Form\Form`

```php
$style->cssStyle($class, [
    'data'  => $dataInput,
    'style' => 'cssButton',
    'options' => [
        'desktop' => 'css',
        'tablet'  => 'cssTablet',
        'mobile'  => 'cssMobile',
        'hover'   => 'cssHover',
    ]
]);
```

- **$class** : class của dom cần được áp dụng css
- **$args** : cấu hình  
  `data` : chứa dữ liệu từ field building  
  `style` : function tương ứng với từng loại field

| data                                     | style         |
|------------------------------------------|---------------|
| background                               | cssBackground |
| textBuilding                             | cssText       |
| inputDimension                           | cssRadius     |
| inputDimension, inputDimensionResponsive | cssDimension  |
| boxShadow                                | cssBoxShadow  |
| border                                   | cssBorder     |
| spacing                                  | cssSpacing    |
| buttonBuilding                           | cssButton     |
| boxBuilding                              | cssBox        |
| colorBuilding                            | cssColor      |
| colorBuilding                            | cssTextColor  |

`options` : bạn sẽ khai báo các loại css nào sẽ áp dụng cho các trường hợp nào
- desktop: css hỗ trợ cho màng hình desktop
- tablet: css hỗ trợ cho màng hình tablet
- mobile: css hỗ trợ cho màng hình mobile
- hover: css hỗ trợ cho trường hợp hover vào dom đang xử lý  

Đối với trường hợp hover giả dụ class của bạn là `.class-demo` thì khi build sẽ tự động tạo thêm `.class-demo:hover`

### Clouse
Ngoài ra bạn cũng có thể truyền thẳng css vào style bằng `Clouse`

```php
$style->cssStyle('.read-more a:after', [
    'style' => function () {
        return 'background-color:#000';
    },
]);
```

### Build
Sau khi hoàn tất khai báo các css cần thiết bạn có thể dùng method build để nhận được css thuần
```php
$css = $style->build();
```