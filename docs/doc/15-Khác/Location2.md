> **File:** `packages/skilldo/cms/src/Location/Location2.php`  
> **Class:** `SkillDo\Cms\Location\Location2` (không có alias ngắn — gọi bằng namespace đầy đủ)

`Location2` là một công cụ mạnh mẽ cho việc truy xuất thông tin địa lý cơ bản của Việt Nam, địa chi lấy theo đơn vị hành chính mới áp dụng từ ngày 01/07/2025 — mô hình **2 cấp: Tỉnh/Thành phố → Phường/Xã** (không còn cấp Quận/Huyện như `Location`).

Dữ liệu được lấy từ dịch vụ SkillDo (`SKDService::location('v2')`) và **cache 30 ngày**. Các method `*Options()` chỉ trả về đơn vị có `active = true` và nhận thêm tham số `$column` để chọn field hiển thị (mặc định `'fullname'`).

### Tỉnh / Thành phố
#### Danh sách
Lấy danh sách Thành phố trực thuộc Trung ương

```php
\SkillDo\Cms\Location\Location2::provinces()
```
_Kết quả_
```json
{
    "0": {
        "id": 58,
        "name": "Hồ Chí Minh",
        "fullname": "TP. Hồ Chí Minh",
        "keywords": [
            "HCM",
            "Hcm",
            "Sài gòn",
            "TP.HCM"
        ],
        "active": true
    },
    "1": {
        "id": 24,
        "name": "Hà Nội",
        "fullname": "Hà Nội",
        "active": true
    },
    ...
}
```
#### Options
Lấy danh sách theo dạng options

```php
\SkillDo\Cms\Location\Location2::provincesOptions($column = 'fullname')
```

```php
\SkillDo\Cms\Location\Location2::provincesOptions()
```
_Kết quả_
```php
[
    58 => 'TP. Hồ Chí Minh',
    24 => 'Hà Nội',
    1 => 'Tỉnh An Giang',
    2 => 'Tỉnh Bà Rịa - Vũng Tàu',
    3 => 'Tỉnh Bắc Giang',
    4 => 'Tỉnh Bắc Kạn',
    5 => 'Tỉnh Bạc Liêu',
    ...
]
```

#### Chi tiết
Lấy chi tiết tỉnh thành phố theo id

```php
\SkillDo\Cms\Location\Location2::provinces(58)
```

_Kết quả_
```json
{
    "id": 58,
    "name": "Hồ Chí Minh",
    "fullname": "TP. Hồ Chí Minh",
    "keywords": [
        "HCM",
        "Hcm",
        "Sài gòn",
        "TP.HCM"
    ],
    "active": true
}
```

#### Tên
Lấy tên tỉnh thành phố

```php
\SkillDo\Cms\Location\Location2::provinceName($provinces_id, $column = 'fullname')
```

```php
\SkillDo\Cms\Location\Location2::provinceName(58) // TP. Hồ Chí Minh
```

#### Tìm id theo slug
Lấy id tỉnh thành theo slug (field `slugId` của object tỉnh thành). Không tìm thấy trả về `false`

```php
\SkillDo\Cms\Location\Location2::provincesIdBySlug('ho-chi-minh') // 58
```

### Phường / Xã / Thị trấn / Thôn / Đội

#### Danh sách
Lấy danh sách Phường xã theo id tỉnh thành

```php
\SkillDo\Cms\Location\Location2::wards($province_id = null)
```
Kết quả
```json
{
    "0": {
        "id": 83331,
        "name": "Xã Tân Kiên",
        "fullname": "Xã Tân Kiên",
        "province_id": 58,
        "province_name": "TP. Hồ Chí Minh",
        "active": true
    },
    "1": {
        "id": 83332,
        "name": "Xã An Phú Tây",
        "fullname": "Xã An Phú Tây",
        "province_id": 58,
        "province_name": "TP. Hồ Chí Minh",
        "active": true
    }
}
```
#### Options
Lấy danh sách theo dạng options

```php
\SkillDo\Cms\Location\Location2::wardsOptions($province_id, $column = 'fullname')
```

```php
\SkillDo\Cms\Location\Location2::wardsOptions(58)
```
_Kết quả_
```php
[
    83331 => 'Xã Tân Kiên',
    83332 => 'Xã An Phú Tây',
    ...
]
```
#### Chi tiết
Lấy chi tiết phường xã theo id tỉnh thành và id phường xã

```php
\SkillDo\Cms\Location\Location2::wards(58, 83331); //Xã Tân Kiên
```
kêt quả
```json
{
    "id": 83331,
    "name": "Xã Tân Kiên",
    "fullname": "Xã Tân Kiên",
    "province_id": 58,
    "province_name": "TP. Hồ Chí Minh",
    "active": true
}
```
#### Tên
Lấy tên phường xã bằng id tỉnh thành và id phường xã

```php
\SkillDo\Cms\Location\Location2::wardName($provinces_id, $ward_id, $column = 'fullname')
```

```php
\SkillDo\Cms\Location\Location2::wardName(58, 83331); //Xã Tân Kiên
```

#### Tìm id theo slug
Lấy id phường xã theo slug (field `slugId`) trong phạm vi một tỉnh thành. Không tìm thấy trả về `false`

```php
\SkillDo\Cms\Location\Location2::wardIdBySlug('xa-tan-kien', 58) // 83331
```

### Địa chỉ đầy đủ

Ghép tên Phường xã + Tỉnh thành thành chuỗi địa chỉ hoàn chỉnh:

```php
\SkillDo\Cms\Location\Location2::address($provinces_id, $ward_id)
```

```php
\SkillDo\Cms\Location\Location2::address(58, 83331);
// "Xã Tân Kiên, TP. Hồ Chí Minh"
```