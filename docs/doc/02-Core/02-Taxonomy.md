import TOCInline from "@theme/TOCInline"
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Post Type
Theo mặc định, SkillDo đi kèm với post (bài viết), bạn có thể tạo bao nhiêu loại nội dung tùy chỉnh tùy thích và các loại nội dung tùy chỉnh này được gọi là custom post type .
Một Custom Post Type sẽ hoàn toàn có đủ những chức năng giống hệt như post type mặc định, nghĩa là bạn có thể sử dụng category, tag, custom field, featured image,….và có thể gọi hiển thị ra ngoài trang chủ cùng lúc với Post.

#### <code>Taxonomy::addPost</code>
Thêm một post type vào hệ thống

> **Tham số truyền vào bao gồm:**

```php
::addPost($post_type, $args)
```

| Params     |  Type  |                                               Description | Default |
|------------|:------:|----------------------------------------------------------:|:-------:|
| $post_type | string | Loại post type của bạn (Ex: question, project, ebooks...) |         |
| $args      | array  |                                 Mãng các tham số cấu hình |         |


> **Tham số _$args_ bao gồm:**

| Params            |  Type   |                                                                                      Description |   Default    |
|-------------------|:-------:|-------------------------------------------------------------------------------------------------:|:------------:|
| labels            |  array  | <p>name : tên của post type dạng số nhiều</p><p>singular_name : tên của post type dạng số ít</p> |              |
| public            | boolean |                                                                true sử dụng, false không sử dụng |     true     |
| show_in_nav_menus | boolean |             true sẽ xuất hiện trong theme/menu để có thể thao tác sử dụng ngoài giao diện client |     true     |
| show_in_nav_admin | boolean |                                                            true sẽ xuất hiện trong sidebar admin |     true     |
| menu_position     |   int   |                                                 Thứ tự sắp xếp với các menu khác ở sidebar admin |      0       |
| menu_icon         | string  |                                                                             Icon ở sidebar admin |     null     |
| supports          |  array  |                      Cấu hình hiển thị các metabox và field trong trang thêm (cập nhật) bài viết |              |
| capabilities      |  array  |                                                   Các quyền mà post type cung cấp cho người dùng | Lấy của post |

> **Tham số _supports_ bao gồm:**
> 
**Group:**: danh sách các Metabox sẽ hiển thị
* _info_: Group thông tin bao gồm các field (title, excerpt, content)
* _media_: Group media bao gồm các field (image)
* _seo_: Group seo bao gồm các field (slug, seo_title, seo_keywords, seo_description)
* _theme_: Group Template bao gồm các field (theme_layout, theme_view)
>
**Field:**: danh sách các Field sẽ hiển thị
* title: tiêu đề bài viết 
* excerpt: mô tả ngắn 
* content: nội dung chi tiết
* image: ảnh đại diện
* slug, seo_title, seo_keywords, seo_description : các trường thông tin seo
* theme_layout, theme_view : các trường cấu hình template

```php
$label = [
    'name' => 'Các dự án', //Tên post type dạng số nhiều
    'singular_name' => 'Dự án' //Tên post type dạng số ít
];

$supports = [
    'group'  => ['info', 'media', 'seo', 'theme'],
    'field'  => [
        'title', 'excerpt', 'content', 'image', 'public', 'slug',
        'seo_title', 'seo_keywords', 'seo_description', 'theme_layout', 'theme_view'
    ]
];

$args = [
    'labels' => $label, //Gọi các label trong biến $label ở trên
    'public' => true, //Kích hoạt post type
    'show_in_nav_menus' => true, //hiển thị bên trang quản lý menu.
    'show_in_nav_admin' => true, //Hiển thị trên thanh Admin bar màu đen.
    'menu_position'     => 5,    //Thứ tự vị trí hiển thị trong menu (tay trái)
    'menu_icon'         => '',   //Đường dẫn tới icon sẽ hiển thị
    'taxonomies'        => array('category', 'post_tag'), //cate type được phép sử dụng
    'supports'          => $supports,
    'capabilities' => [
        'view'      => 'view_posts',
        'add'       => 'add_posts',
        'edit'      => 'edit_posts',
        'delete'    => 'delete_posts',
    ]
];
Taxonomy::addPost('project', $args);
```

#### <code>Taxonomy::getPost</code>
Lấy thông tin của post type đã được đăng ký vào hệ thống

> **Tham số truyền vào bao gồm:**

```php
::getPost($post_type)
```
<Tabs groupId="Taxonomy-getPost" queryString>
    <TabItem value="code" label="Code PHP">
        ```php
        Taxonomy::getPost('post');
        ```
    </TabItem>
    <TabItem value="result" label="Result">
        ```php
        /* Array
        (
            [labels] => Array
                (
                    [name] => Bài viết
                    [singular_name] => Bài viết
                    [add_new_item] => Thêm bài viết
                    [edit_item] => Thêm bài viết
                )
        
            [public] => 1
            [menu_position] => 3
            [menu_icon] =>
            [cate_type] => post_categories
            [taxonomies] => Array
                (
                    [0] => post_categories
                )
        
            [supports] => Array
                (
                    [group] => Array
                        (
                            [0] => info
                            [1] => media
                            [2] => seo
                            [3] => theme
                        )
        
                    [field] => Array
                        (
                            [0] => title
                            [1] => excerpt
                            [2] => content
                            [3] => image
                            [4] => public
                            [5] => slug
                            [6] => seo_title
                            [7] => seo_keywords
                            [8] => seo_description
                            [9] => theme_layout
                            [10] => theme_view
                        )
        
                )
        
            [capabilities] => Array
                (
                    [view] => view_posts
                    [add] => add_posts
                    [edit] => edit_posts
                    [delete] => delete_posts
                )
        
            [exclude_from_search] => 1
            [show_in_nav_menus] => 0
            [show_in_nav_admin] => 1
        ) */
        ```
    </TabItem>
</Tabs>

#### <code>Taxonomy::hasPost</code>
Kiểm tra post type có được đăng ký chưa nếu có trả về true ngược lại là false
```php
Taxonomy::hasPost($post_type)
```

#### <code>Taxonomy::removePost</code>
Gở bỏ post type khỏi hệ thống.
```php
if(Taxonomy::hasPost($post_type)) {
    Taxonomy::removePost($post_type)
}
```

### Cate Type
Taxonomy là tập hợp những thể loại giống như category. Mặc định khi bạn cài đặt SkillDo sẽ có taxonomies mặc định đó là Category.


#### <code>Taxonomy::addCategory</code>
Thêm một cate type vào hệ thống

> **Tham số truyền vào bao gồm:**

```php
::addCategory($cate_type, $post_type, $args)
```

| Params     |  Type  |                                               Description | Default |
|------------|:------:|----------------------------------------------------------:|:-------:|
| $cate_type | string |                  Loại cate type của bạn (Ex: question...) |         |
| $post_type | string |                    Loại post type của bạn (Ex: answer...) |         |
| $args      | array  |                                 Mãng các tham số cấu hình |         |


> **Tham số _$args_ bao gồm:**

| Params            |  Type   |                                                                                      Description |   Default    |
|-------------------|:-------:|-------------------------------------------------------------------------------------------------:|:------------:|
| labels            |  array  | <p>name : tên của cate type dạng số nhiều</p><p>singular_name : tên của cate type dạng số ít</p> |              |
| public            | boolean |                                                                true sử dụng, false không sử dụng |     true     |
| show_in_nav_menus | boolean |             true sẽ xuất hiện trong theme/menu để có thể thao tác sử dụng ngoài giao diện client |     true     |
| show_in_nav_admin | boolean |                                                            true sẽ xuất hiện trong sidebar admin |     true     |
| menu_position     |   int   |                                                 Thứ tự sắp xếp với các menu khác ở sidebar admin |      0       |
| menu_icon         | string  |                                                                             Icon ở sidebar admin |     null     |
| parent            | boolean |                                                       Nếu true cate type sẽ có phân cấp danh mục |     true     |
| supports          |  array  |                      Cấu hình hiển thị các metabox và field trong trang thêm (cập nhật) bài viết |              |
| capabilities      |  array  |                                                   Các quyền mà post type cung cấp cho người dùng | Lấy của post |

> **Tham số _supports_ bao gồm:**
>
**Group:**: danh sách các Metabox sẽ hiển thị
* _info_: Group thông tin bao gồm các field (title, excerpt, content)
* _media_: Group media bao gồm các field (image)
* _seo_: Group seo bao gồm các field (slug, seo_title, seo_keywords, seo_description)
* _theme_: Group Template bao gồm các field (theme_layout, theme_view)
>
**Field:**: danh sách các Field sẽ hiển thị
* name: tiêu đề bài viết
* excerpt: mô tả ngắn
* content: nội dung chi tiết
* image: ảnh đại diện
* slug, seo_title, seo_keywords, seo_description : các trường thông tin seo
* theme_layout, theme_view : các trường cấu hình template

```php
$label = [
    'name' => 'Các loại dự án',
    'singular' => 'Loại dự án',
];

$supports = [
    'group'  => ['info', 'media', 'seo', 'theme'],
    'field'  => [
        'title', 'excerpt', 'content', 'image', 'public', 'slug',
        'seo_title', 'seo_keywords', 'seo_description', 'theme_layout', 'theme_view'
    ]
];

$args = [
    'labels' => $label, //Gọi các label trong biến $label ở trên
    'public' => true, //Kích hoạt post type
    'show_in_nav_menus' => true, //hiển thị bên trang quản lý menu.
    'show_in_nav_admin' => true, //Hiển thị trên thanh Admin bar màu đen.
    'parent'     => true,
    'supports'          => $supports,
    'capabilities' => [
        'edit'      => 'manage_categories',
        'delete'    => 'delete_categories',
    ]
];
Taxonomy::addCategory('category_project', 'project', $args);
```

#### <code>Taxonomy::getCategory</code>
Lấy thông tin của cate type đã được đăng ký vào hệ thống

> **Tham số truyền vào bao gồm:**

```php
::getCategory($cate_type)
```
<Tabs groupId="Taxonomy-getCategory" queryString>
    <TabItem value="code" label="Code PHP">
        ```php
        Taxonomy::getCategory('post_categories');
        ```
    </TabItem>
    <TabItem value="result" label="Result">
        ```php
        /* Array
        (
            [labels] => Array
            (
                [name] => Chuyên mục bài viết
                [singular_name] => Chuyên mục
                [add_new_item] => Thêm chuyên mục
            )
            [public] => 1
            [menu_position] => 3
            [menu_icon] =>
            [parent] => 1
            [show_admin_column] => 1
            [post_type] => post
            [supports] => Array
            (
                [group] => Array
                    (
                        [0] => info
                        [1] => media
                        [2] => seo
                        [3] => theme
                        [4] => category
                    )
                [field] => Array
                    (
                        [0] => name
                        [1] => excerpt
                        [2] => content
                        [3] => image
                        [4] => public
                        [5] => slug
                        [6] => seo_title
                        [7] => seo_keywords
                        [8] => seo_description
                        [9] => theme_layout
                        [10] => theme_view
                        [11] => parent_id
                    )
            )
            [capabilities] => Array
            (
                [edit] => manage_categories
                [delete] => delete_categories
            )
            [show_in_nav_menus] => 1
            [exclude_from_search] => 1
            [show_in_nav_admin] => 1
        ) */
        ```
    </TabItem>
</Tabs>

#### <code>Taxonomy::getCategoryByPost</code>
Lấy danh sách cate type thuộc một post type

```php
Taxonomy::getCategoryByPost('post')
```

#### <code>Taxonomy::hasCategory</code>
Kiểm tra cate type có được đăng ký chưa nếu có trả về true ngược lại là false
```php
Taxonomy::hasCategory($cate_type)
```

#### <code>Taxonomy::removeCategory</code>
Gở bỏ cate type khỏi hệ thống.
```php
if(Taxonomy::hasCategory($cate_type)) {
    Taxonomy::removeCategory($cate_type)
}
```