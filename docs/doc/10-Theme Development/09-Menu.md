## Menu Location
### Thêm vị trí menu
> Để thêm vị trí hiển thị menu bạn sử dung method `addLocation`, `addLocation` nhận vào 2 tham số

| Params     |  Type  | Description | Mặc định |
|------------|:------:|------------:|---------:|
| $locations | string |   id vị trí |          |
| $label     | string |  tên vị trí |          |

```php
ThemeMenu::addLocation($locations, $label)
```

### Hiển thị menu theo vị trí

`ThemeMenu::render(array $args): void` — **echo thẳng** HTML ra output, không trả về chuỗi.

```php
ThemeMenu::render(['theme_location' => $locations]);
```

Ba cách chỉ định nguồn menu (xét theo thứ tự ưu tiên):

| Key | Ý nghĩa |
|---|---|
| `theme_location` | Vị trí đã đăng ký bằng `addLocation()` |
| `theme_id` | Id của menu (có cache theo `cms.cache_time.default`) |
| `theme_data` | Truyền thẳng mảng dữ liệu menu đã dựng sẵn |

| Key | Mặc định | Ý nghĩa |
|---|---|---|
| `walker` | `walker_nav_menu` | Tên class walker dựng HTML |

> [!NOTE]
> Nếu class walker truyền vào **không tồn tại**, hệ thống âm thầm quay về `walker_nav_menu` (alias của `Theme\Supports\WalkerNavMenu`). Vì vậy gõ sai tên walker sẽ không báo lỗi — menu vẫn hiện nhưng bằng HTML mặc định.

## Menu Data
### Lấy data menu theo vị trí
$locations có thể là vị trí bạn đăng ký bằng `ThemeMenu::addLocation` hoặc id menu
```php
ThemeMenu::getData($locations)
```
Data nhận được có dạng
```php
[
    0 => [
        "id" => 44, //id menu item
        "name" => "Giới thiệu",
        "slug" => "gioi-thieu",
        "type" => "page", 
        "object_type" => "page",
        "menu_id" => "1", //id menu
        "parent_id" => 0,
        "object_id" => 1,
        "child" => [],
        "data" => [] //Data mở rộng
    ],
    1 => [
        "id" => 58,
        "name" => "Sản Phẩm",
        "slug" => "san-pham",
        "type" => "products_categories",
        "object_type" => "products_categories",
        "menu_id" => "1",
        "parent_id" => 0,
        "object_id" => 1,
        "child" => [
            0 => [
                "id" => 58,
                "name" => "Bếp chiên điện",
                "slug" => "bep-chien-dien",
                ...
            ]
        ],
        "data" => []
    ],
]
```

### Thêm options vào menu item
> Để thêm option vào menu item bạn sử dung method `addItemOption`, `addItemOption` nhận vào 2 tham số

| Params  |  Type  |    Description | Mặc định |
|---------|:------:|---------------:|---------:|
| $module | string | loại menu item |          |
| $args   | array  |   các cấu hình |          |

Các loại `$module` hỗ trợ:

| `$module` | Áp dụng cho | Khoá lọc thêm trong `$args` |
|---|---|---|
| `menu` *(mặc định)* | Mọi menu item | — |
| `page` | Menu item là trang tĩnh | — |
| `post` | Menu item là bài viết | `post_type` (mặc định `all`) |
| `post_categories` | Menu item là danh mục | `cate_type` (mặc định `all`) |
| *khác* | Loại menu do plugin tự đăng ký | xử lý qua filter `theme_menu_add_item_{module}_option` |

`$args` chứa thông tin field input cần thêm. Bắt buộc có `field` **hoặc** `name` (dùng làm khoá) — thiếu cả hai thì hàm trả về `false` và không làm gì.

```php
ThemeMenu::addItemOption('menu', [
    'field' => 'icon',
    'label' => 'Icon',
    'type'  => 'font-icon',
    'level' => 0
]);

// Chỉ áp cho menu item thuộc post type "post"
ThemeMenu::addItemOption('post', [
    'field'     => 'badge',
    'label'     => 'Nhãn',
    'type'      => 'text',
    'post_type' => 'post',
]);
```

Key `level` quy định option xuất hiện ở cấp menu nào.

Đọc lại option đã lưu bằng `ThemeMenu::getItemOption($object, $object_type)`.

## Thêm Menu Type

Bạn sử dụng filter `admin_menu_list_object` để thêm một loại menu mới. Ví dụ thật từ plugin sicommerce — thêm loại menu **thương hiệu**:

```php
use Ecommerce\Models\Brands;

function adminMenuBrands($menuData)
{
    $menuData['brands'] = [
        'label' => trans('sicommerce::brand.title'),
        'type'  => 'brands',
        'data'  => []
    ];

    $data = Brands::all();

    if(hasItems($data))
    {
        foreach ($data as $datum)
        {
            if(empty($datum->id)) continue;

            $menuData['brands']['data'][$datum->id] = (object)[
                'id'   => $datum->id,
                'name' => $datum->name
            ];
        }
    }

    return $menuData;
}

add_filter('admin_menu_list_object', 'adminMenuBrands');
```

Mỗi phần tử cần ba khoá: `label` (tên nhóm trong màn hình quản lý menu), `type` (dùng làm `object_type` của menu item), `data` (mảng `id => object{id, name}`).

> Model của SkillDo dùng `all()` để lấy danh sách. **Không có** `Brands::gets()` — và `Brands::get()` gọi tĩnh chỉ trả về **một** bản ghi (xem [Eloquent Model](../05-Database/03-Eloquent.md)).