`Location` là một công cụ mạnh mẽ cho việc truy xuất thông tin địa lý cơ bản của Việt Nam, bạn có thể dễ dàng truy cập thông tin về các tỉnh thành, quận huyện và các đơn vị hành chính cấp dưới như phường, xã.

### Tỉnh / Thành phố
#### Danh sách
Lấy danh sách Thành phố trực thuộc Trung ương

```php
\SkillDo\Location::provinces()
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
\SkillDo\Location::provincesOptions()
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
\SkillDo\Location::provinces(58)
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
\SkillDo\Location::provinceName(58) // TP. Hồ Chí Minh
```

### Quận / Huyện / Thị xã / Thành phố

#### Danh sách
Lấy danh sách quận huyện theo id tỉnh / thành phố

```php
\SkillDo\Location::districts($province_id = null)
```
Kết quả
```json
{
    "0": {
        "id": 6440,
        "name": "Huyện Bình Chánh",
        "fullname": "Huyện Bình Chánh",
        "province_id": 58,
        "province_name": "TP. Hồ Chí Minh",
        "active": true
    },
    "1": {
        "id": 6441,
        "name": "Huyện Cần Giờ",
        "fullname": "Huyện Cần Giờ",
        "province_id": 58,
        "province_name": "TP. Hồ Chí Minh",
        "active": true
    },
    ...
}
```
#### Options
Lấy danh sách theo dạng options
```php
\SkillDo\Location::districtsOptions(58)
```
_Kết quả_
```php
[
    6440 => 'Huyện Bình Chánh',
    6441 => 'Huyện Cần Giờ',
    ...
]
```
#### Chi tiết
Lấy chi tiết quận huyện theo id

```php
\SkillDo\Location::districts(58, 6440); //Huyện Bình Chánh
```
kêt quả
```json
{
  "id": 6440,
  "name": "Huyện Bình Chánh",
  "fullname": "Huyện Bình Chánh",
  "province_id": 58,
  "province_name": "TP. Hồ Chí Minh",
  "active": true
}
```
#### Tên
Lấy tên quận huyện bằng id tỉnh thành và id quận huyện

```php
\SkillDo\Location::districtName(58, 6440); //Huyện Bình Chánh
```
### Phường / Xã / Thị trấn / Thôn / Đội

#### Danh sách
Lấy danh sách Phường xã theo id quận huyện

```php
\SkillDo\Location::wards($district_id = null)
```
Kết quả
```json
{
    "0": {
        "id": 83331,
        "name": "Xã Tân Kiên",
        "fullname": "Xã Tân Kiên",
        "district_id": 6440,
        "district_name": "Huyện Bình Chánh",
        "active": true
    },
    "1": {
        "id": 83332,
        "name": "Xã An Phú Tây",
        "fullname": "Xã An Phú Tây",
        "district_id": 6440,
        "district_name": "Huyện Bình Chánh",
        "active": true
    }
}
```
#### Options
Lấy danh sách theo dạng options
```php
\SkillDo\Location::wardsOptions(6440)
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
\SkillDo\Location::wards(6440, 83331); //Huyện Bình Chánh
```
kêt quả
```json
{
    "id": 83331,
    "name": "Xã Tân Kiên",
    "fullname": "Xã Tân Kiên",
    "district_id": 6440,
    "district_name": "Huyện Bình Chánh",
    "active": true
}
```
#### Tên
Lấy tên phường xã bằng id quận huyện và id phường xã

```php
\SkillDo\Location::wardName(6440, 83331); //Xã Tân Kiên
```