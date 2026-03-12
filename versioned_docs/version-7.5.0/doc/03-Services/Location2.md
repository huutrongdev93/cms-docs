`Location2` là một công cụ mạnh mẽ cho việc truy xuất thông tin địa lý cơ bản của Việt Nam, địa chi lấy theo đơn vị hành chính mới áp dụng từ ngày 01/07/2025

### Tỉnh / Thành phố
#### Danh sách
Lấy danh sách Thành phố trực thuộc Trung ương

```php
\SkillDo\Location2::provinces()
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
\SkillDo\Location2::provincesOptions()
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
\SkillDo\Location2::provinces(58)
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
\SkillDo\Location2::provinceName(58) // TP. Hồ Chí Minh
```
### Phường / Xã / Thị trấn / Thôn / Đội

#### Danh sách
Lấy danh sách Phường xã theo id tỉnh thành

```php
\SkillDo\Location2::wards($province_id = null)
```
Kết quả
```json
{
    "0": {
        "id": 83331,
        "name": "Xã Tân Kiên",
        "fullname": "Xã Tân Kiên",
        "province_id": 6440,
        "province_name": "Huyện Bình Chánh",
        "active": true
    },
    "1": {
        "id": 83332,
        "name": "Xã An Phú Tây",
        "fullname": "Xã An Phú Tây",
        "province_id": 6440,
        "province_name": "Huyện Bình Chánh",
        "active": true
    }
}
```
#### Options
Lấy danh sách theo dạng options
```php
\SkillDo\Location2::wardsOptions(6440)
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
Lấy chi tiết quận huyện theo id

```php
\SkillDo\Location2::wards(6440, 83331); //Huyện Bình Chánh
```
kêt quả
```json
{
    "id": 83331,
    "name": "Xã Tân Kiên",
    "fullname": "Xã Tân Kiên",
    "province_id": 6440,
    "province_name": "Huyện Bình Chánh",
    "active": true
}
```
#### Tên
Lấy tên phường xã bằng id tỉnh thành và id phường xã

```php
\SkillDo\Location2::wardName(6440, 83331); //Xã Tân Kiên
```