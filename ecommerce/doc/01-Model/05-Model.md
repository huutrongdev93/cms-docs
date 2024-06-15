# Model Khác
## Brands (Thương hiệu)
Model `Brands` nằm trong plugin `sicommerce` cung cấp các method thao tác với table thương hiệu
>
Model `Brands` kế thừa từ `SkillDo\Model\Model` nên bạn có thể sử dụng các method của model cho Brands như first, fetch, get, gets...
> **Insert**
>
Các trường data khi insert dữ liệu

| Column          | Type   | Default | Description                                                        |
|-----------------|--------|---------|--------------------------------------------------------------------|
| id              | int    | 0       | Nếu id là 0 method thực hiện add nếu có id method thực hiện update |
| name            | string |         | Tên thương hiệu, bắt buộc có giá trị nếu thêm mới                  |
| excerpt         | string |         | Mô tả thương hiệu                                                  |
| seo_title       | string |         | Meta title                                                         |
| seo_description | string |         | Meta title                                                         |
| seo_keywords    | string |         | Meta keywords                                                      |
| image           | string |         | Hình ảnh đại diện                                                  |
| language        | array  |         | Dữ liệu ngôn ngữ                                                   |

```php
$brand = [
	'title' => 'Brand',
	'excerpt' => 'Nội dung tóm tắt',
	'image' => 'brand/banner.png',
	'language' => [
		'en' => [
			'title' 	=> 'This is post name',
			'excerpt' 	=> 'excerpt post',
		],
	]
];

Brands::insert($brand);
```

## Suppliers (Nhà sản xuất)
Model `Suppliers` nằm trong plugin `sicommerce` cung cấp các method thao tác với table nhà sản xuất
>
Model `Suppliers` kế thừa từ `SkillDo\Model\Model` nên bạn có thể sử dụng các method của model cho Suppliers như first, fetch, get, gets...
> **Insert**
>
Các trường data khi insert dữ liệu

| Column          | Type   | Default | Description                                                        |
|-----------------|--------|---------|--------------------------------------------------------------------|
| id              | int    | 0       | Nếu id là 0 method thực hiện add nếu có id method thực hiện update |
| name            | string |         | Tên nhà sản xuất, bắt buộc có giá trị nếu thêm mới                 |
| firstname       | string |         | Họ và chữ đệm người đại diện                                       |
| lastname        | string |         | Tên người đại diện                                                 |
| email           | string |         | email liên hệ người đại diện                                       |
| phone           | string |         | Số điện thoại người đại diện                                       |
| address         | string |         | Địa chỉ người đại diện                                             |
| excerpt         | string |         | Mô tả                                                              |
| seo_title       | string |         | Meta title                                                         |
| seo_description | string |         | Meta title                                                         |
| seo_keywords    | string |         | Meta keywords                                                      |
| image           | string |         | Hình ảnh đại diện                                                  |
| language        | array  |         | Dữ liệu ngôn ngữ                                                   |

```php
$supplier = [
	'title'     => 'Tiki training',
	'firstname' => 'Nguyễn Tung',
	'lastname'  => 'Hoành',
	'phone'     => '0123456789',
	'email'     => 'tunghoanh@gmail.com',
	'address'   => '213/14 D2 Binh Thanh',
	'image'     => 'nsx/banner.png',
];

Suppliers::insert($supplier);
```

## Currencies (Tiền tệ)
Model `Currencies` nằm trong plugin `sicommerce` cung cấp các method thao tác với table tiền tệ
>
Model `Currencies` kế thừa từ `SkillDo\Model\Model` nên bạn có thể sử dụng các method của model cho Currencies như first, fetch, get, gets...
> **Insert**
>
Các trường data khi insert dữ liệu

| Column    | Type   | Default | Description                                                        |
|-----------|--------|---------|--------------------------------------------------------------------|
| id        | int    | 0       | Nếu id là 0 method thực hiện add nếu có id method thực hiện update |
| currency  | string |         | Key Loại tiền tệ                                                   |
| position  | string |         | Vị trí đơn vị (trước hoặc sau giá tiền)                            |
| rate      | float  |         | Tỉ giá quy đổi so với giá tiền mặc định                            |
| rateFixed | float  |         | Tỉ giá làm tròn                                                    |
| decimals  | int    |         | Số lượng chữ số thập phân                                          |
| symbol    | string |         | Ký hiệu tiền tệ                                                    |
| isDefault | int    | 0       |                                                                    |

```php
$supplier = [
	'currency'     => 'vnd',
	'position' => 'right',
	'rate'  => 0.0001,
	'rateFixed'     => 0,
	'decimals'     => 2,
	'symbol'   => 'đ',
	'isDefault'     => 1,
];

Currencies::insert($supplier);
```