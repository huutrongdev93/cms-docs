# User Page
Thêm tab vào trang thông tin thành viên  

![img.png](img.png)
### Thêm tab
Để thêm một tab mới vào trang user bạn sử dụng hook `my_action_links`  
Ví dụ:
```php
function registerMenu($menus): array
{
    $menusNew = [];

    foreach ($menus as $key => $value) {

        if($key == 'logout') {
            $menusNew['test'] = [
                'label' => 'Page tester',
                'icon'  => '<i class="fal fa-shopping-cart"></i>',
                'view'  => ''
            ];
        }

        $menusNew[$key] = $value;
    }

    return $menusNew;
}

add_filter('my_action_links', 'registerMenu');
```
Thêm một tab có key là `test` với tên `Page tester` vào trước tab logout

### Nội dung tab
Để hiển thị nội dung tab vừa đăng ký bạn dử dụng hook `account_template_render_<key>`, với `key` là key tab vừa đăng ký  

Ví dụ:
```php
function tabRender($user, \SkillDo\Http\Request $request): void
{
    echo "hello";
}

add_action('account_template_render_test', 'tabRender', 10, 2);
```