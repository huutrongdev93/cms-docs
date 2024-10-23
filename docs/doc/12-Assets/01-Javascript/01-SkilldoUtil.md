class cung cấp một số method thường hay sử dụng

### buttonLoading
Tạo đối tượng loading cho button. Tham số nhận vào là đối tượng muốn tạo loading
```javascript
let button = document.getElementById('buttonLoading')

let loading = SkilldoUtil.buttonLoading(button)

//bắt đầu hiển thị loading
button.start()

//kết thúc loading
button.stop()
```

### uniqId
Hàm SkilldoUtil.uniqId được sử dụng để tạo ra một chuỗi ID duy nhất mỗi khi nó được gọi. 
Chuỗi ID này được tạo ra bằng cách kết hợp timestamp hiện tại, một chuỗi ngẫu nhiên, và một bộ đếm nội bộ. Hàm đảm bảo rằng mỗi lần được gọi sẽ trả về một ID khác nhau, ngay cả khi được gọi liên tiếp trong thời gian ngắn.

```javascript
let id = SkilldoUtil.uniqId()
```

### Cookie <span class="badge text-bg-pink">7.3.0</span>
SkilldoUtil.cookie cung cấp các method giúp bạn thao tác với cookie dễ dàng hơn
#### set cookie
Hàm SkilldoUtil.cookie.set được sử dụng để tạo hoặc cập nhật một cookie trên trình duyệt. Cookie này sẽ lưu trữ một giá trị cụ thể cho một khoảng thời gian nhất định và có thể được áp dụng cho một đường dẫn nhất định trong trang web.
* name: tên cookie
* value: giá trị của cookie
* time: thời gian tồn tại của cookie tính bằng phút
* path
```javascript
SkilldoUtil.cookie.set('login', true, 30)
```
Kiểu củ
```javascript
SkilldoUtil.setCookie('login', true, 30)
```

#### get cookie
Hàm SkilldoUtil.cookie.get được sử dụng để lấy giá trị của một cookie dựa trên tên của nó. Nếu cookie tồn tại, hàm sẽ trả về giá trị của nó, ngược lại sẽ trả về một chuỗi rỗng.
```javascript
let isLogin = SkilldoUtil.cookie.get('login')
```
Kiểu củ
```javascript
let isLogin = SkilldoUtil.getCookie('login')
```

#### del cookie
Hàm SkilldoUtil.cookie.del được sử dụng để xóa một cookie khỏi trình duyệt bằng cách thiết lập thời gian hết hạn của cookie về một ngày trong quá khứ.
```javascript
SkilldoUtil.cookie.del('login')
```
Kiểu củ
```javascript
SkilldoUtil.delCookie('login')
```

### formatNumber
method định dạng một số theo hàng ngìn 
```javascript
SkilldoUtil.formatNumber(10000000) // 10,000,000
```

### isset
Hàm SkilldoUtil.isset được sử dụng để kiểm tra xem một phần tử HTML có tồn tại và hợp lệ hay không. Hàm này có thể xử lý đầu vào là một chuỗi (string) đại diện cho một CSS selector hoặc là một đối tượng jQuery. 
Hàm sẽ trả về giá trị `true` nếu phần tử tồn tại và có thuộc tính innerHTML, ngược lại, sẽ trả về `false`.
```javascript
SkilldoUtil.isset('.btn-login') //true or false
SkilldoUtil.isset($('.btn-login')) //true or false
```

### debounce
Tạo một debounce để trì hoãn việc gọi func cho đến khi hết một phần nghìn giây chờ đợi kể từ lần cuối cùng debounce được gọi.

```javascript
$(document).on('keyup', '.js_input_search', SkilldoUtil.debounce(function () {
    searchObject() //function search
}, 500));
```

### slugify <span class="badge text-bg-pink">7.3.0</span>
Bạn đã bao giờ thấy mình cần chuyển tiêu đề bài viết trên blog của mình sang định dạng 'URL-like' chưa?
```javascript
SkilldoUtil.slugify('Siêu Kinh Doanh')
//sieu-kinh-doanh
```

### LocalStorage <span class="badge text-bg-pink">7.3.0</span>
Bạn có thể đã sử dụng localStorage trong các ứng dụng danh sách việc cần làm của mình hoặc bất kỳ dự án nào khác để lưu dữ liệu cụ thể vào bộ nhớ máy tính của người dùng. Khi lấy và thiết lập các mục, bạn phải sử dụng các phương thức JSON pars() và stringify() để đạt được kết quả mong muốn. Vì vậy, hãy làm cho việc làm việc với họ trở nên dễ dàng hơn.
#### set storage
Hàm SkilldoUtil.storage.set được sử dụng để tạo hoặc cập nhật một LocalStorage trên trình duyệt.
* name: tên LocalStorage
* value: giá trị của LocalStorage
```javascript
SkilldoUtil.storage.set('login', true)
```

#### get storage
Hàm SkilldoUtil.storage.get được sử dụng để lấy giá trị của một LocalStorage dựa trên tên của nó
```javascript
let isLogin = SkilldoUtil.storage.get('login', defaultValue)
```

#### remove storage
Hàm SkilldoUtil.storage.remove được sử dụng để xóa một LocalStorage khỏi trình duyệt.
```javascript
SkilldoUtil.storage.remove('login')
```

#### clear storage
Hàm SkilldoUtil.storage.clear được sử dụng để xóa toàn bộ LocalStorage khỏi trình duyệt.
```javascript
SkilldoUtil.storage.clear()
```

### validate <span class="badge text-bg-pink">7.3.0</span>
SkilldoUtil.validate hỗ trợ cho bạn kiểm tra một số kiểu dữ liệu

#### email
Kiểm tra string có đúng định dạng mail
```javascript
SkilldoUtil.validate.email('email-test@gmail.com') //true
SkilldoUtil.validate.email('email-test-gmail.com') //false
```

#### url
Kiểm tra string có đúng định dạng url
```javascript
SkilldoUtil.validate.url('https://domain.com') //true
```

#### youtube
Kiểm tra string có phải là một link video youtube
```javascript
SkilldoUtil.validate.youtube('https://domain.com') //false
```

#### number
Kiểm tra string có phải kiểu số
```javascript
SkilldoUtil.validate.number(1) //true
SkilldoUtil.validate.number('1') //false
```

#### strIsNumeric
Kiểm tra string có phải là số
```javascript
SkilldoUtil.validate.strIsNumeric(1) //true
SkilldoUtil.validate.strIsNumeric('1') //false
```

### Object <span class="badge text-bg-pink">7.3.0</span>
SkilldoUtil.object cung cấp cho bạn một số function xử lý object cơ bản
#### is
nếu đối tượng có kiểu object sẽ trả về `true` ngược lại là `false`

```javascript
console.log(SkilldoUtil.object.is({ a: 1 })); // true
console.log(SkilldoUtil.object.is([1, 2, 3])); // false
```

#### isEmpty
nếu đối tượng là object rỗng thì sẽ trả về `true` ngược lại là `false`

```javascript
console.log(SkilldoUtil.object.isEmpty({})); // true
console.log(SkilldoUtil.object.isEmpty({ a: 1 })); // false
```

#### merge
Gộp nhiều object lại thành một object

```javascript
console.log(SkilldoUtil.object.merge({ a: 1 }, { b: 2 }, { a: 3 })); // { a: 3, b: 2 }
```

#### deepMerge
Gộp nhiều object đa chiều vào thành một object

```javascript
const obj1 = { a: 1, b: { x: 10 } };
const obj2 = { b: { y: 20 }, c: 3 };
console.log(SkilldoUtil.object.deepMerge(obj1, obj2)); // { a: 1, b: { x: 10, y: 20 }, c: 3 }
```

#### clone
Tạo một bản sao của một object

```javascript
const original = { a: 1, b: { c: 2 } };
const clone = SkilldoUtil.object.clone(original);
clone.b.c = 3;
console.log(original.b.c); // 2
console.log(clone.b.c); // 3
```

#### map
Tạo một object mới có cùng khóa nhưng có các giá trị được chuyển đổi bằng `callback`. Tương tự như `array.map()`, nhưng dành cho đối tượng

```javascript
console.log(SkilldoUtil.object.map({ a: 1, b: 2, c: 3 }, (value) => value * 2)); // { a: 2, b: 4, c: 6 }
```
#### filter
Tạo một object mới chỉ có các thuộc tính vượt qua chức năng lọc. Tương tự như array.filter(), nhưng dành cho đối tượng

```javascript
console.log(SkilldoUtil.object.filter({ a: 1, b: 2, c: 3 }, (value) => value > 1)); // { b: 2, c: 3 }
```

### Array <span class="badge text-bg-pink">7.3.0</span>
SkilldoUtil.array cung cấp cho bạn một số function xử lý array cơ bản

##### unique
Loại bỏ các giá trị trùng lặp khỏi một mảng

```javascript
console.log(SkilldoUtil.array.unique([1, 2, 2, 3, 4, 4, 5])); // [1, 2, 3, 4, 5]
```

##### flatten
Làm phẳng một mảng lồng nhau

```javascript
const nestedArray = [1, [2, [3, 4], 5], 6];
const flatArray = SkilldoUtil.array.flatten(nestedArray);
console.log('Flattened:', flatArray);
```
##### merge
Hợp nhất nhiều mảng

```javascript
const array1 = [1, 2];
const array2 = [3, 4];
const mergedArray = SkilldoUtil.array.merge(array1, array2);
console.log('Merged:', mergedArray);
```
##### sort
Sắp xếp một mảng

```javascript
const unsortedArray = [5, 3, 8, 1];
const sortedArray = SkilldoUtil.array.sort(unsortedArray, (a, b) => a - b);
console.log('Sorted:', sortedArray);
```
##### find
Tìm một phần tử trong mảng

```javascript
const foundElement = SkilldoUtil.array.find(numbers, (num) => num > 3);
console.log('Found Element:', foundElement);
```
##### findIndex
Tìm chỉ số của một phần tử trong mảng

```javascript
const foundIndex = SkilldoUtil.array.findIndex(numbers, (num) => num > 3);
console.log('Found Index:', foundIndex);
```
##### intersect
Trả về các điểm giống nhau của hai mảng

```javascript
console.log(SkilldoUtil.array.intersect([1, 2, 3], [2, 3, 4])); // [2,3]
```

##### difference
Trả về sự khác biệt giữa hai mảng

```javascript
console.log(SkilldoUtil.array.difference([1, 2, 3], [2, 3, 4])); // [1,4]
```