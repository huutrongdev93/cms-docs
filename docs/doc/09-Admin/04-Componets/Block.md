# Block
Tạo một component block cho website

```php
Admin::block($title, $content, $args);
```
- $title : là tiêu đề của block
- $content : là nội dung của block, bạn có thể truyền vào là string, Closure hoặc một SkillDo\Form\Form
- $args : cấu hình cho block

`$args['id']` (array | string) gán id cho thẻ div có class là box  
`$args['box-class']` (array | string) gán class cho thẻ div có class là box  
`$args['header-class']` (array | string) gán class cho thẻ div có class là box-header  
`$args['content-class']` (array | string) gán class cho thẻ div có class là box-content  
`$args['isRow']` (bool) chèn thẻ row bao lại content nếu `true` (mặc định `false`) 

![img_5.png](block-img/img_5.png)