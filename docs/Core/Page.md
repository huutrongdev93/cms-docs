import TOCInline from "@theme/TOCInline"

Class <b>Pages</b> cung cấp cho bạn các method thao tác với data của trang nội dung
### Thao tác với Pages

#### <code>Pages::get</code>
Method <code>Pages::get</code> trả thông tin Pages theo điều kiện Query Builder, Nếu truy vấn của bạn có nhiều hơn một Pages, method chỉ trả về hàng đầu tiên. Kết quả được trả về như một đối tượng.
```php
$page = Pages::get(Qr::set($id)->select('id', 'title', 'excerpt'))
```

#### <code>Pages::gets</code>
Method <code>Pages::gets</code> trả về danh sách Pages theo điều kiện Query Builder
```php
$pages = Pages::gets(Qr::set('trash', 0)->select('id', 'Pagesname'))
```

#### <code>Pages::count</code>
Method <code>Pages::count</code> trả về số lượng Pages theo điều kiện Query Builder

```php
$pagesNumber = Pages::count(Qr::set('trash', 0))
```

#### <code>Pages::insert</code>
Method <code>Pages::insert</code> thêm or cập nhật thông tin Pages
> **Tham số thứ nhất nhận vào là một mãng bao gồm:**

| Column Name     |  Type  |                                                     Description |
|-----------------|:------:|----------------------------------------------------------------:|
| title           | string |                                               Tiêu để của trang |
| excerpt         | string |                                            Mô tả ngắn cho trang |
| content         | string |                                     Nội dung chi tiết cho trang |
| image           | string |                                Đường dẫn ảnh đại diện cho trang |
| slug            | string | Đường dẫn của trang nếu không truyền hệ thống tự tạo từ tiêu đề |
| seo_title       | string |                  meta title tự động lấy từ title nếu không điền |
| seo_description | string |          meta description tự động lấy từ excerpt nếu không điền |
| seo_keywords    | string |                                                   meta keywords |
| user_created    |  int   |                                               Id user tạo trang |
| user_updated    |  int   |                                          Id user cập nhật trang |

> **Tham số thứ 2 nhận vào đối tượng page cần cập nhật**
> 
Khi bạn truyền thêm column id thì method sẽ tiến hành cập nhật Pages
> **Kết quả sau khi thực thi:**

| Kết quả     |     Type     |                                        Description |
|-------------|:------------:|---------------------------------------------------:|
| Thành công  |  number      | Id của Pages vừa ược thêm mới hoặc id Pages cập nhật |
| Thất bại    |  SKD_Error   |                                 Object SKD_Error   |

```php
//Thêm mới
$pageNew = [
    'title'     => 'example title page',
    'excerpt'   => 'example excerpt page',
    'content'   => 'example content page',
    'image'     => 'uploads/images/example.png',
]
Pages::insert($pageNew);
```

```php
//Cập nhật
$pageUpdate = [
    'id'        => 10
    'title'     => 'example title page',
];
Pages::insert($pageUpdate);
```

```php
//Cập nhật nếu có sẳn đối tượng cần cập nhật
//Để giảm tải câu lệnh SQL
$id = 10;
$page = Pages::get(Qr::set($id));
$pageUpdate = [
    'id'        => $id
    'title'     => 'example title page',
];
Pages::insert($pageUpdate, $page);
```
#### <code>Pages::update</code>
Method <code>Pages::update</code> cập nhật một hoặc nhiều page theo điều kiện Query Builder
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
Pages::update($pageNew, Qr::set()->whereIn('id', [1,2,3,4]));
```

#### <code>Pages::delete</code>
Method <code>Pages::delete</code> xóa toàn bộ thông tin một hoặc nhiều Page khỏi database,

> **Tham số truyền vào bao gồm:**
```php
::delete($where, $trash);
```

| Params |    Type     |                                                            Description |
|--------|:-----------:|-----------------------------------------------------------------------:|
| $where | int hoặc Qr |                 id bài viết cần xóa hoặc điều kiện lấy trang cần xóa   |
| $trash |    bool     | true nếu cho vào thùng rác, false nếu xóa vĩnh viển (mặc định `false`) |

```php
Pages::delete($id);
```
```php
Pages::delete(Qr::set()->whereIn('id', [1,2,3,4]));
```