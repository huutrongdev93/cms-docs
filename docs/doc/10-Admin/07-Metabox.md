Khi bạn đăng nhập vào admin và bạn edit một bài viết nào đó thì các khối trong giao diện ta gọi là các Meta Boxes.
Vậy Meta Boxes là các khối hiển thị dữ liệu cho phép người dùng chỉnh sửa và lưu lại trong trang quản lý bài viết của CMS.

```php
Metabox::add($id, $title, $callback, $args);
```
**Parameters**
* id : (string) Là ID của meta box, ID này phải là duy nhất không trùng với các Meta Boxes khác.
* title : (string) Tiêu đề của Meta Box.
* callback : (string) Hàm callback dùng để hiển thị mã HTML nằm bên trong Meta Box
* args : (array) phần mở rộng

| key      | mô tả                                                       |
|----------|-------------------------------------------------------------|
| module   | module metabox sẽ hiển thị                                  |
| position | Thứ tự giữa các metabox cùng khu vực hiển thị               |
| content  | Khu vực hiển thị metabox (tabs, leftTop, leftBottom, right) |

* Thêm metabox vào page

```php
Metabox::add('metabox_page_id', 'Metabox test', 'MetaboxTestRender', ['module' => 'page', 'content' => 'tabs']);

function MetaboxTestRender($object) {
    if(have_post($object)) {
        // edit post
    }
    else {
        // add post
    }
}
```

* Thêm metabox vào post
```php
//Thêm metabox vào post có post type là post
Metabox::add('metabox_post_id', 'Metabox test', 'MetaboxTestRender', ['module' => 'post', 'content' => 'leftBottom']);

function MetaboxTestRender($object) {
    if(have_post($object)) {
        // edit post
    }
    else {
        // add post
    }
}

//Thêm metabox vào post có post type là books
Metabox::add('metabox_post_books_id', 'Metabox test', 'MetaboxBookTestRender', ['module' => 'post_books', 'content' => 'leftBottom']);

function MetaboxBookTestRender($object) {
    if(have_post($object)) {
        // edit post
    }
    else {
        // add post
    }
}
```


* Thêm metabox vào post categories
```php
//Thêm metabox vào category có cate type là category
Metabox::add('metabox_category_id', 'Metabox test', 'MetaboxTestRender', ['module' => 'post_categories_category', 'content' => 'leftBottom']);

function MetaboxTestRender($object) {
    if(have_post($object)) {
        // edit post
    }
    else {
        // add post
    }
}

//Thêm metabox vào category có cate type là books
Metabox::add('metabox_category_books_id', 'Metabox test', 'MetaboxBookTestRender', ['module' => 'post_categories_books', 'content' => 'leftBottom']);

function MetaboxBookTestRender($object) {
    if(have_post($object)) {
        // edit post
    }
    else {
        // add post
    }
}
```