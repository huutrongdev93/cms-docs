import TOCInline from "@theme/TOCInline"

Class <b>PostCategory</b> cung cấp cho bạn các method thao tác với data của danh mục bài viết
> _Khi sử dụng Query Builder không có điều kiện **cate_type** mặc định cate_type sẽ là **`post_categories`**_
### Thao tác với danh mục

#### <code>PostCategory::get</code>
Method <code>PostCategory::get</code> trả thông tin PostCategory theo điều kiện Query Builder, Nếu truy vấn của bạn có nhiều hơn một PostCategory, method chỉ trả về hàng đầu tiên. Kết quả được trả về như một đối tượng.
```php
$post = PostCategory::get(Qr::set($id)->select('id', 'name', 'excerpt'))
```

#### <code>PostCategory::gets</code>
Method <code>PostCategory::gets</code> trả về danh sách PostCategory theo điều kiện Query Builder
```php
$posts = PostCategory::gets(Qr::set('trash', 0)->select('id', 'title'))
```

Trong Query Builder sử dụng phương thức categoryType để lấy các danh mục theo các loại khác nhau

| Params     |                                     Description |
|------------|------------------------------------------------:|
| tree       |              Lấy và sắp sếp danh mục theo level |
| multilevel |                    Trả về cây thư mục lồng nhau |
| options    | Trả về cây thư mục phẳng theo dạng key => value |

> Ví dụ có cây thư mục sau
```md
post_categories
├── Blog (level 1)
│   ├── Blog 1 (level 2)
│   └── Blog 2 (level 2)
├── Projects (level 1)
├── Jobs (level 1)
│   ├── Jobs HCM (level 2)
│   └── Jobs HN (level 2)
```


```php
$categories = PostCategory::gets(Qr::set()->categoryType('tree')->select('name', 'level'));
/* Array
(
    [0] => stdClass Object (
            [name] => Blog
            [level] => 1 
    )
    [1] => stdClass Object (
            [name] => Blog 1
            [level] => 2 
    )
    [2] => stdClass Object (
            [name] => Blog 2
            [level] => 2 
    )
    [3] => stdClass Object (
            [name] => Projects
            [level] => 1 
    )
    [4] => stdClass Object (
            [name] => Jobs
            [level] => 1 
    )
    [5] => stdClass Object (
            [name] => Jobs HCM
            [level] => 2 
    )
    [6] => stdClass Object (
            [name] => Jobs HN
            [level] => 2
    )
) */
```

```php
$categories = PostCategory::gets(Qr::set()->categoryType('multilevel')->select('name'));
/* Array
(
    [0] => stdClass Object (
        [name]  => Blog
        [child] => Array (
            [0] => stdClass Object (
                [name] => Blog 1
                [child] => Array ()
            )
            [1] => stdClass Object (
                [name] => Blog 2
                [child] => Array ()
            )
        )
    )
    
    [1] => stdClass Object (
        [name] => Projects
    )
    [2] => stdClass Object (
        [name] => Jobs
        [child] => Array (
            [0] => stdClass Object (
                [name] => Jobs HCM
                [child] => Array ()
            )
            [1] => stdClass Object (
                [name] => Jobs HN
                [child] => Array ()
            )
        )
    )
) */
```

```php
$categories = PostCategory::gets(Qr::set()->categoryType('options')->select('id', 'name', 'level'));
/* Array
(
    [0] => Chọn danh mục
    [1] => Blog
    [2] => |-----Blog 1
    [3] => |-----Blog 2
    [4] => Projects
    [5] => Jobs
    [6] => |-----Jobs HCM
    [7] => |-----Jobs HN
) */
```
#### <code>PostCategory::children</code>
Method <code>PostCategory::children</code> trả về danh sách id của danh mục con theo danh mục cha
> **Tham số truyền vào bao gồm:**
```php
::children($args)
```

| Params    |  Type  |                                                             Description | Default |
|-----------|:------:|------------------------------------------------------------------------:|:-------:|
| andParent |  bool  |                  Nếu true kết quả trả về sẽ kèm theo cả id danh mục cha |  false  |
| id        |  int   |                       Id danh mục cha cần lấy danh sách id danh mục con |         |
| category  | object | Nếu không có id sẽ lấy theo object danh mục (phải bao gồm id, lft, rgt) |  null   |


```php
$listId = PostCategory::children(['andParent' => true, 'id' => 1]);
```

```php
$listId = PostCategory::children(['andParent' => true, 'category' => PostCategory::get(Qr::set(1)->select('id', 'lft', 'rgt'))]);
```

#### <code>PostCategory::count</code>
Method <code>PostCategory::count</code> trả về số lượng PostCategory theo điều kiện Query Builder

```php
$postsNumber = PostCategory::count(Qr::set('trash', 0))
```

#### <code>PostCategory::insert</code>
Method <code>PostCategory::insert</code> thêm or cập nhật thông tin PostCategory
> **Tham số thứ nhất nhận vào là một mãng bao gồm:**

| Column Name     |  Type  |                                                        Description |     Default     |
|-----------------|:------:|-------------------------------------------------------------------:|:---------------:|
| name            | string |                                               Tiêu để của danh mục |                 |
| excerpt         | string |                                            Mô tả ngắn cho danh mục |      null       |
| content         | string |                                     Nội dung chi tiết cho danh mục |      null       |
| image           | string |                                Đường dẫn ảnh đại diện cho danh mục |      null       |
| slug            | string | Đường dẫn của danh mục nếu không truyền hệ thống tự tạo từ tiêu đề |      auto       |
| seo_title       | string |                      meta title tự động lấy từ name nếu không điền |      auto       |
| seo_description | string |             meta description tự động lấy từ excerpt nếu không điền |      auto       |
| seo_keywords    | string |                                                      meta keywords |                 |
| status          |  int   |                                  Trạng thái 0 bình ường, 1 nổi bật |        0        |
| public          |  int   |                               Trạng thái hiển thị 0 ẩn, 1 hiển thị |        1        |
| order           |  int   |                                            Thứ tự sắp xếp danh mục |        0        |
| cate_type       | string |                                                      Loại danh mục | post_categories |
| parent_id       |  int   |                                                    id danh mục cha |        0        |
| user_updated    |  int   |                                          Id user cập nhật danh mục |      auto       |
| user_updated    |  int   |                                          Id user cập nhật danh mục |      auto       |
| language        | array  |                                             Data các ngôn ngữ khác |                 |

> **Tham số thứ 2 nhận vào đối tượng $category cần cập nhật**

Khi bạn truyền thêm column id thì method sẽ tiến hành cập nhật PostCategory
> **Kết quả sau khi thực thi:**

| Kết quả     |   Type    |                                                        Description |
|-------------|:---------:|-------------------------------------------------------------------:|
| Thành công  |  number   | Id của PostCategory vừa ược thêm mới hoặc id PostCategory cập nhật |
| Thất bại    | SKD_Error |                                               Object SKD_Error     |

```php
//Thêm mới
$category = [
    'name'    => 'Tiêu đề bài viết',
    'excerpt' => 'Nội dung tóm tắt',
    'content' => 'Nội dung chi tiết',
    'image'   => 'uploads/images/example.png',
    'public'  => 1,
    'parent_id' => 0,
    'cate_type' => 'post_categories',
];
//Examples language mặc định là vi, ngôn ngữ phụ là en
$category['language'] = [
    'en' => [
        'title' 	=> 'This is post name',
        'excerpt' 	=> 'excerpt post',
        'content' 	=> 'content post',
    ]   
];

PostCategory::insert($category);
```

```php
//Cập nhật
$postUpdate = [
    'id'        => 10
    'title'     => 'example title post',
];
PostCategory::insert($postUpdate);
```

```php
//Cập nhật nếu có sẳn đối tượng cần cập nhật
//Để giảm tải câu lệnh SQL
$id = 10;
$post = PostCategory::get(Qr::set($id));
$postUpdate = [
    'id'        => $id
    'title'     => 'example title post',
];
PostCategory::insert($postUpdate, $post);
```
#### <code>PostCategory::update</code>
Method <code>PostCategory::update</code> cập nhật một hoặc nhiều post theo điều kiện Query Builder
> **Tham số truyền vào bao gồm:**
```php
::update($updateData, $args);
```
| Params      | Type  |                                  Description |
|-------------|:-----:|---------------------------------------------:|
| $updateData | array | mãng các trường thay đổi và giá trị cập nhật |
| $args       |  Qr   |                           Điều kiện cập nhật |

```php
$pageNew = [
   'title' => 'example title page',
]
PostCategory::update($pageNew, Qr::set()->whereIn('id', [1,2,3,4]));
```

#### <code>PostCategory::delete</code>
Method <code>PostCategory::delete</code> xóa toàn bộ thông tin một hoặc nhiều Page khỏi database,

> **Tham số truyền vào bao gồm:**
```php
::delete($where, $trash);
```

| Params | Type |         Description |
|--------|:----:|--------------------:|
| $id    | int  | id danh mục cần xóa |

```php
PostCategory::delete($id);
```

### MetaData
Bảng <code>categories</code> của SkillDo được thiết kế để chỉ chứa thông tin cần thiết về người dùng.
Do đó, để lưu trữ dữ liệu bổ sung, bảng categories_metadata đã được giới thiệu, có thể lưu trữ bất kỳ lượng dữ liệu tùy ý nào về người dùng

#### <code>PostCategory::getMeta</code>
Method <code>PostCategory::getMeta</code> lấy metadata của danh mục

| Params   |  Type  |                      Description |
|----------|:------:|---------------------------------:|
| $id      |  int   | Id của danh mục cần lấy metadata |
| $metaKey | string |         key của metadata cần lấy |

```php
PostCategory::getMeta($id, 'views');
```

#### <code>PostCategory::updateMeta</code>
Method <code>PostCategory::updateMeta</code> thêm mới (nếu metaKey chưa có) hoặc cập nhật metadata của danh mục

| Params     |  Type  |                                  Description |
|------------|:------:|---------------------------------------------:|
| $id        |  int   | Id của danh mục cần thêm (cập nhật) metadata |
| $metaKey   | string |         key của metadata cần thêm (cập nhật) |
| $metaValue |  mix   |     giá trị của metadata cần thêm (cập nhật) |

```php
PostCategory::updateMeta($id, 'views', 10);
```

#### <code>PostCategory::deleteMeta</code>
Method <code>PostCategory::deleteMeta</code> xóa metadata của danh mục khỏi database

| Params   |  Type  |                      Description |
|----------|:------:|---------------------------------:|
| $id      |  int   | Id của danh mục cần xóa metadata |
| $metaKey | string |         key của metadata cần xóa |

```php
PostCategory::deleteMeta($id, 'views');
```