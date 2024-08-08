import TOCInline from "@theme/TOCInline"

Class <b>Posts</b> cung cấp cho bạn các method thao tác với data của bài viết
### Thao tác với Posts

#### <code>get or first</code>
Method <code>get</code> trả thông tin Posts theo điều kiện Query Builder, Nếu truy vấn của bạn có nhiều hơn một Posts, method chỉ trả về hàng đầu tiên. Kết quả được trả về như một đối tượng.
```php
$post = Posts::get(Qr::set($id)->select('id', 'title', 'excerpt'));
//or
$post = Posts::where($id)->select('id', 'title', 'excerpt')->first();
```

#### <code>gets or fetch</code>
Method <code>Posts::gets</code> trả về danh sách Posts theo điều kiện Query Builder
```php
$posts = Posts::gets(Qr::set('trash', 0)->select('id', 'title'));
//or
$posts = Posts::where('trash', 0)->select('id', 'title')->fetch();
```

#### <code>related</code>
Method <code>related</code> trả về danh sách Posts cùng chuyên mục với bài viết truyền vào

> **Tham số truyền vào bao gồm:**
```php
::related($object);
```
| Params    |   Type    |                           Description |
|-----------|:---------:|--------------------------------------:|
| $object   | int, post | id của bài viết hoặc bài viết cần lấy |

```php
$posts = Posts::where('public', 1)->related(10)->select('id', 'title')->fetch();
```

#### <code>Posts::getsCategory</code>
Method <code>Posts::getsCategory</code> trả về danh sách danh mục của bài viết truyền vào

> **Tham số truyền vào bao gồm:**
```php
::getsCategory($object, $args);
```
| Params    |   Type    |                           Description |
|-----------|:---------:|--------------------------------------:|
| $object   | int, post | id của bài viết hoặc bài viết cần lấy |
| $args     |    Qr     |                 Điều kiện lọc dữ liệu |

```php
$categories = Posts::getsCategory(10, Qr::set()->select('id', 'name'))
```


#### <code>count or amount</code>
Method <code>count</code> trả về số lượng Posts theo điều kiện Query Builder

```php
$postsNumber = Posts::count(Qr::set('trash', 0));
//or
$postsNumber = Posts::where('trash', 0)->amount();
```

#### <code>insert</code>
Method <code>insert</code> thêm or cập nhật thông tin Posts
> **Tham số thứ nhất nhận vào là một mãng bao gồm:**

| Column Name     |  Type  |                                                    Description |
|-----------------|:------:|---------------------------------------------------------------:|
| title           | string |                                               Tiêu để của post |
| excerpt         | string |                                            Mô tả ngắn cho post |
| content         | string |                                     Nội dung chi tiết cho post |
| image           | string |                                Đường dẫn ảnh đại diện cho post |
| slug            | string | Đường dẫn của post nếu không truyền hệ thống tự tạo từ tiêu đề |
| seo_title       | string |                 meta title tự động lấy từ title nếu không điền |
| seo_description | string |         meta description tự động lấy từ excerpt nếu không điền |
| seo_keywords    | string |                                                  meta keywords |
| status          |  int   |                 Trạng thái 0 bình ường, 1 nổi bật (mặc định 0) |
| public          |  int   |              Trạng thái hiển thị 0 ẩn, 1 hiển thị (mặc định 1) |
| trash           |  int   |                  0 bình thường, 1 trong thùng rác (mặc định 0) |
| post_type       | string |                                      Loại post (mặc định post) |
| user_updated    |  int   |                                          Id user cập nhật post |
| user_updated    |  int   |                                          Id user cập nhật post |
| language        | array  |                                         Data các ngôn ngữ khác |
| taxonomies      | array  |                                              Data các danh mục |

> **Tham số thứ 2 nhận vào đối tượng $post cần cập nhật**

Khi bạn truyền thêm column id thì method sẽ tiến hành cập nhật Posts
> **Kết quả sau khi thực thi:**

| Kết quả    |   Type    |                                          Description |
|------------|:---------:|-----------------------------------------------------:|
| Thành công |  number   | Id của Posts vừa ược thêm mới hoặc id Posts cập nhật |
| Thất bại   | SKD_Error |                                     Object SKD_Error |

```php
//Thêm mới
$post = [
    'title'   => 'Tiêu đề bài viết',
    'excerpt' => 'Nội dung tóm tắt',
    'content' => 'Nội dung chi tiết',
    'image'   => 'uploads/images/example.png',
    'public'  => 1,
];
//Examples ngôn ngữ mặc định là vi ngôn ngữ phụ là en
$post['language'] = [
    'en' => [
        'title' 	=> 'This is post name',
        'excerpt' 	=> 'excerpt post',
        'content' 	=> 'content post',
    ]   
];
//Danh mục có cate_type là post_categories
$post['taxonomies'] = [
    'post_categories' => [4,3] //danh sách id danh mục  
];

Posts::insert($post);
```

```php
//Cập nhật
$postUpdate = [
    'id'        => 10
    'title'     => 'example title post',
];
Posts::insert($postUpdate);
```

```php
//Cập nhật nếu có sẳn đối tượng cần cập nhật
//Để giảm tải câu lệnh SQL
$id = 10;
$post = Posts::get(Qr::set($id));
$postUpdate = [
    'id'        => $id
    'title'     => 'example title post',
];
Posts::insert($postUpdate, $post);
```
#### <code>update</code>
Method <code>update</code> cập nhật một hoặc nhiều post theo điều kiện Query Builder
> **Tham số truyền vào bao gồm:**
```php
::update($updateData, $args);
```
| Params      | Type  |                                  Description |
|-------------|:-----:|---------------------------------------------:|
| $updateData | array | mãng các trường thay đổi và giá trị cập nhật |

```php
$pageNew = [
   'title' => 'example title page',
]
Posts::whereIn('id', [1,2,3,4])->update($pageNew);
```

#### <code>delete or remove</code>
Method <code>delete</code> xóa toàn bộ thông tin một hoặc nhiều Page khỏi database,

> **Tham số truyền vào bao gồm:**
```php
::delete($id);
```

| Params | Type |                                                            Description |
|--------|:----:|-----------------------------------------------------------------------:|
| $id    | int  |                                                    id bài viết cần xóa |

```php
Posts::delete($id);
//or
Posts::where('id', $id)->remove();
```

### Post MetaData
Bảng <code>post</code> của SkillDo được thiết kế để chỉ chứa thông tin cần thiết về người dùng.
Do đó, để lưu trữ dữ liệu bổ sung, bảng _post_metadata_ đã được giới thiệu, có thể lưu trữ bất kỳ lượng dữ liệu tùy ý nào về người dùng

#### <code>Posts::getMeta</code>
Method <code>Posts::getMeta</code> lấy metadata của post

| Params   |  Type  |                  Description |
|----------|:------:|-----------------------------:|
| $id      |  int   | Id của post cần lấy metadata |
| $metaKey | string |     key của metadata cần lấy |

```php
Posts::getMeta($id, 'views');
```


#### <code>Posts::updateMeta</code>
Method <code>Posts::updateMeta</code> thêm mới (nếu metaKey chưa có) hoặc cập nhật metadata của post

| Params     |  Type  |                              Description |
|------------|:------:|-----------------------------------------:|
| $id        |  int   | Id của post cần thêm (cập nhật) metadata |
| $metaKey   | string |     key của metadata cần thêm (cập nhật) |
| $metaValue |  mix   | giá trị của metadata cần thêm (cập nhật) |

```php
Posts::updateMeta($id, 'views', 10);
```

#### <code>Posts::deleteMeta</code>
Method <code>Posts::deleteMeta</code> xóa metadata của post khỏi database

| Params   |  Type  |                              Description |
|----------|:------:|-----------------------------------------:|
| $id      |  int   |             Id của post cần xóa metadata |
| $metaKey | string |                 key của metadata cần xóa |

```php
Posts::deleteMeta($id, 'views');
```