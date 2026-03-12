### Method Now
Hàm `now` tạo một phiên bản `Illuminate\Support\Carbon` mới cho thời điểm hiện tại:

#### Lấy dữ liệu
Lấy ngày, tháng, năm, giờ, phút, giây, ngày của tuần, ngày của tháng, ngày của năm, tuần của tháng, tuần của năm, số ngày trong tháng
```php
now()->second; //giây
now()->minute; //phút
now()->hour; //giờ
now()->day; //ngày
now()->month; //tháng
now()->year; //năm
now()->dayOfWeek; //ngày của tuần
now()->dayOfYear; //ngày của năm
now()->weekOfMonth; //ngày của tháng
now()->weekOfYear; //tuần của năm
now()->daysInMonth; //số ngày trong tháng
```

#### Second
```php
//Cộng thêm 1 giây vào thời gian hiện tại
echo now()->addSecond()->format('d/m/Y H:i:s');
echo now()->addSecond()->getTimestamp();
//Cộng thêm số giây cụ thể vào thời gian hiện tại
echo now()->addSeconds(10)->format('d/m/Y H:i:s');

//Trừ đi 1 giây vào thời gian hiện tại
echo now()->subSecond()->format('d/m/Y H:i:s');
//Trừ đi số giây cụ thể vào thời gian hiện tại
echo now()->subSeconds(10)->format('d/m/Y H:i:s');
```

#### Minute

```php
//Cộng thêm 1 phút vào thời gian hiện tại
echo now()->addMinute()->format('d/m/Y H:i:s');
echo now()->addMinute()->getTimestamp();
//Cộng thêm số phút cụ thể vào thời gian hiện tại
echo now()->addMinutes(10)->format('d/m/Y H:i:s');

//Trừ đi 1 phút vào thời gian hiện tại
echo now()->subMinute()->format('d/m/Y H:i:s');
//Trừ đi số phút cụ thể vào thời gian hiện tại
echo now()->subMinutes(10)->format('d/m/Y H:i:s');
```

#### Hour

```php
//Cộng thêm 1 giờ vào thời gian hiện tại
echo now()->addHour()->format('d/m/Y H:i:s');
echo now()->addHour()->getTimestamp();
//Cộng thêm số giờ cụ thể vào thời gian hiện tại
echo now()->addHours(10)->format('d/m/Y H:i:s');

//Trừ đi 1 giờ vào thời gian hiện tại
echo now()->subHour()->format('d/m/Y H:i:s');
//Trừ đi số giờ cụ thể vào thời gian hiện tại
echo now()->subHours(10)->format('d/m/Y H:i:s');
```

#### Day

```php
//Cộng thêm 1 ngày vào thời gian hiện tại
echo now()->addDay()->format('d/m/Y H:i:s');
echo now()->addDay()->getTimestamp();
//Cộng thêm số ngày cụ thể vào thời gian hiện tại
echo now()->addDays(10)->format('d/m/Y H:i:s');

//Trừ đi 1 ngày vào thời gian hiện tại
echo now()->subDay()->format('d/m/Y H:i:s');
//Trừ đi số ngày cụ thể vào thời gian hiện tại
echo now()->subDays(10)->format('d/m/Y H:i:s');
```

#### Month

```php
//Cộng thêm 1 tháng vào thời gian hiện tại
echo now()->addMonth()->format('d/m/Y H:i:s');
echo now()->addMonth()->getTimestamp();
//Cộng thêm số tháng cụ thể vào thời gian hiện tại
echo now()->addMonths(10)->format('d/m/Y H:i:s');

//Trừ đi 1 tháng vào thời gian hiện tại
echo now()->subMonth()->format('d/m/Y H:i:s');
//Trừ đi số tháng cụ thể vào thời gian hiện tại
echo now()->subMonths(10)->format('d/m/Y H:i:s');
```

#### Year

```php
//Cộng thêm 1 năm vào thời gian hiện tại
echo now()->addYear()->format('d/m/Y H:i:s');
echo now()->addYear()->getTimestamp();
//Cộng thêm số năm cụ thể vào thời gian hiện tại
echo now()->addYears(10)->format('d/m/Y H:i:s');

//Trừ đi 1 năm vào thời gian hiện tại
echo now()->subYear()->format('d/m/Y H:i:s');
//Trừ đi số năm cụ thể vào thời gian hiện tại
echo now()->subYears(10)->format('d/m/Y H:i:s');
```


### Method carbon
Hàm `carbon` tạo một phiên bản `Illuminate\Support\Carbon` mới cho thời điểm được chỉ định:

```php
echo carbon('today')->format('d/m/Y H:i:s');

echo carbon('yesterday')->format('d/m/Y H:i:s');

echo carbon('tomorrow')->format('d/m/Y H:i:s');

echo carbon(strtotime('15-10-2024 00:00:00'))->format('d/m/Y H:i:s');

```

Tính toán sự khác nhau giữa 2 datetime  
Kết quả trả về theo dạng timestamp
```php
$carbon = carbon(strtotime('15-10-2024 00:00:00')); //Tạo 1 datetime
$now = now();
echo $now->diffInSeconds($carbon);
echo $now->diffInMinutes($carbon);
echo $now->diffInHours($carbon);
echo $now->diffInDays($carbon);
echo $now->diffInMonths($carbon);
echo $now->diffInYears($carbon);
```
Kết quả trả về theo dạng ngôn ngữ 1 phút trước, 1 giờ trước ...
```php
$carbon = carbon(strtotime('15-10-2024 00:00:00'));
$now = now();
echo $now->diffForHumans($carbon);
```