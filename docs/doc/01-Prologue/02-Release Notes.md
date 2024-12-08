### Phiên bản hỗ trợ

| Cms Version |  PHP Support  |  Release   |    Support    |
|:-----------:|:-------------:|:----------:|:-------------:|
|      7      | 8.2.x - 8.3.x | 10/08/2024 |  Đang hỗ trợ  |
|      6      | 8.0.x - 8.1.x | 25/07/2022 | Hỗ trợ vá lỗi |
|      5      | 8.0.x - 8.1.x | 10/12/2021 | `Dừng hỗ trợ` |
|      4      | 7.0.x - 7.3.x | 29/09/2020 | `Dừng hỗ trợ` |
|      3      |      5.6      | 18/09/2019 | `Dừng hỗ trợ` |

### version 7.4.0 - 09.12.2024

<span class="badge text-bg-green">Add</span> Thêm hook autoload hỗ trợ việc autoload class

<span class="badge text-bg-green">Update</span> Gở bỏ helper mặc định `url`, `cookie`, `date`

<span class="badge text-bg-green">Update</span> Tôi ưu code

### version 7.3.6 - 04.12.2024

<span class="badge text-bg-red">Fix</span> Lỗi load sai layout trong post <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi route có thể bị trùng lặp trong trường hợp đặc biệt

<span class="badge text-bg-green">Update</span> Cập nhật js load table dễ sử dụng và cải thiện tốc độ

<span class="badge text-bg-green">Add</span> Thêm method `dataDisplay` vào class table hỗ trợ custom dữ liệu hiển thị

<span class="badge text-bg-green">Add</span> Method `defer` thực hiện các function sau khi response được gửi đến client

<span class="badge text-bg-green">Update</span> Tối ưu code tăng hiệu xuất

### version 7.3.5 - 28.11.2024

<span class="badge text-bg-red">Fix</span> Lỗi không xóa được danh mục post categories <span class="badge text-bg-yellow">Dương</span>

<span class="badge text-bg-red">Fix</span> Lỗi lưu post chuyển hướng bị sai <span class="badge text-bg-yellow">Trang - Hòa</span>

<span class="badge text-bg-red">Fix</span> Không hiển thị ảnh cho widget field container box <span class="badge text-bg-yellow">Tâm</span>

<span class="badge text-bg-red">Fix</span> Lỗi Validate\Unique

### version 7.3.4 - 27.11.2024

<span class="badge text-bg-red">Fix</span> Lỗi không load lại cache khi cập nhật trang nội dung <span class="badge text-bg-yellow">Nhàn</span>

<span class="badge text-bg-red">Fix</span> Lỗi cập nhật thứ tự table <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi hiển thị hình ảnh layout <span class="badge text-bg-yellow">Hòa</span>

<span class="badge text-bg-red">Fix</span> Lỗi hiển thị admin menu <span class="badge text-bg-yellow">Dương</span>

### version 7.3.3 - 25.11.2024

<span class="badge text-bg-red">Fix</span> Lỗi hiển thị với widget ở chế độ in-container

<span class="badge text-bg-red">Fix</span> Lỗi popoverAdvance trong repeater không hiển thị giá trị sau khi chọn

<span class="badge text-bg-red">Fix</span> Lỗi hiển thị sai số lượng data public và trash table ở admin

<span class="badge text-bg-green">Update</span> Có thể truyền Query build vào method `withTrashed`, `onlyTrashed`

<span class="badge text-bg-green">Update</span> Model Hỗ trợ sử dụng `count` với arrow (Post::withTrashed()->count())

<span class="badge text-bg-green">Update</span> Model Hỗ trợ sử dụng `delete` với arrow (Post::onlyTrashed()->delete())

<span class="badge text-bg-green">Add</span> Thêm class `Image` thao tác hiển thị image

<span class="badge text-bg-green">Add</span> module hỗ trợ ajax load mặc định không cần tự tạo

<span class="badge text-bg-green">Add</span> Thêm method `queryFilter`, `queryDisplay` vào class table hỗ trợ lọc dữ liệu table

### version 7.3.2 - 15.11.2024

<span class="badge text-bg-red">Fix</span> Lỗi mất slug <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-green">Add</span> Thêm `namespace` vào table routes

<span class="badge text-bg-green">Update</span> Tối ưu components `Admin::btnConfirm` bổ sung callback

<span class="badge text-bg-green">Update</span> Tối ưu lại class table

### version 7.3.1 - 06.10.2024

<span class="badge text-bg-red">Fix</span> Lỗi load bản dịch sau một số cài đặt <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Một số lỗi lấy ngôn ngữ khi build sql

<span class="badge text-bg-green">Add</span> Thêm channel Log `single` hỗ trợ tạo log theo file

<span class="badge text-bg-green">Add</span> Thêm hook `admin_user_table_column_username`

<span class="badge text-bg-green">Add</span> Thêm method `notLang` vào model để loại bỏ lấy dữ liệu language khi cần

<span class="badge text-bg-green">Add</span> Thêm method `withTrashed`, `onlyTrashed` vào model để lấy dữ liệu softDelete

### version 7.3.0 - 24.10.2024

_`Version này có cập nhật cách viết model`_

<span class="badge text-bg-red">Fix</span> Không sử dụng được bulk button để xóa trang nội dung <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi trang chủ khi sử dụng plugin đa ngôn ngữ <span class="badge text-bg-yellow">Nhàn - Dương</span>

<span class="badge text-bg-red">Fix</span> Lỗi trang danh mục, chi tiết bài viết khi sử dụng plugin đa ngôn ngữ <span class="badge text-bg-yellow">Dương</span>

<span class="badge text-bg-green">Update</span> Cải tiến admin menu

<span class="badge text-bg-green">Update</span> Khi đăng ký ajax có thể kèm theo phương thức http request mà ajax sẽ chạy

<span class="badge text-bg-green">Update</span> FormAdmin đã có thể thêm field giống Form

<span class="badge text-bg-green">Update</span> Sử dụng `SoftDeletes` mặc dịnh của Model cho Model User

<span class="badge text-bg-blue">Change</span> Tách hỗ trợ route của Model thành trails `ModelRoute`

<span class="badge text-bg-blue">Change</span> Tách hỗ trợ language của Model thành trails `ModelLanguage`

<span class="badge text-bg-blue">Change</span> Tách hỗ trợ metadata của Model thành trails `ModelMeta`

<span class="badge text-bg-green">Add</span> Thêm method hỗ trợ `storage`, `validate`, `object`, `array`, `date` trong SkilldoUtil

### version 7.2.1 - 16.10.2024

<span class="badge text-bg-red">Fix</span> Không xóa được dữ liệu trong thùng rác <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi up hình ảnh định dạng webp <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi widget bị lệch vị trí khi chọn box `in-container` <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> Lỗi không edit được post khi tắt hiển thị

<span class="badge text-bg-red">Fix</span> Lỗi không kiểm tra được ssl của cloudflare

<span class="badge text-bg-green">Add</span> Thêm cấu hình namespace cho một nhóm route

<span class="badge text-bg-green">Add</span> Thêm method `provinceName`, `districtName`, `wardName` lấy tên local bằng id

### version 7.2.0 - 08.10.2024

<span class="badge text-bg-red">Fix</span> Sử dụng widget giống nhau trong cùng 1 screen load chồng config

<span class="badge text-bg-blue">Update</span> Hỗ trợ việc load controller từ plugin

<span class="badge text-bg-blue">Update</span> Hỗ trợ việc load route api từ plugin

<span class="badge text-bg-blue">Update</span> Hỗ trợ việc load Middleware từ plugin

<span class="badge text-bg-blue">Update</span> Tối ưu Rest, Route hỗ trợ việc tạo api

<span class="badge text-bg-blue">Update</span> Model đã hỗ trợ việc tạo macro

<span class="badge text-bg-green">Add</span> Thêm thư viện Firebase JWT

### version 7.1.6 - 04.10.2024

<span class="badge text-bg-red">Fix</span> Lỗi không lấy được margin, padding trong css tablet, mobile của cssText <span class="badge text-bg-yellow">Tâm</span>

<span class="badge text-bg-red">Fix</span> Lỗi không lấy được bài viết liên quan taxonomy <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> Lỗi truy cập hệ thống > thông tin hệ thống <span class="badge text-bg-yellow">Dương</span>

<span class="badge text-bg-red">Fix</span> Lỗi bảo mật hệ thống <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi không tạo được các loại ảnh thumb, medium,... <span class="badge text-bg-yellow">Tâm</span>

<span class="badge text-bg-red">Fix</span> Lỗi softDelete không nhận điều kiện <span class="badge text-bg-yellow">Châu Thạch</span>

### version 7.1.5 - 28.09.2024

<span class="badge text-bg-red">Fix</span> Lỗi xem trang thông tin thành viên root trong admin <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi upload ảnh trùng tên bị đè mất ảnh <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi lấy attribute của menu item <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> Lỗi nhận diện css cho widget sidebar

<span class="badge text-bg-red">Fix</span> Lỗi widget field col không trigger sựu kiện change <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-blue">Change</span> Thay đổi hiển thị js widget loại bỏ `$({})` mặc định

<span class="badge text-bg-blue">Change</span> Thay đổi method `make` của model thành `query`

<span class="badge text-bg-blue">Change</span> Thay đổi `WidgetSidebar::add` nếu không truyền loại widget sẽ tự động đăng ký cho tất cả loại

<span class="badge text-bg-blue">Update</span> Tối ưu cơ chế load widget studio tăng tốc độ tải widget

<span class="badge text-bg-green">Add</span> Thêm search cho widget studio

### version 7.1.4 - 25.09.2024

<span class="badge text-bg-red">Fix</span> Trùng class widget và heading widget <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi chức năng login as <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-blue">Change</span> Thay đổi service tải dữ liệu update

<span class="badge text-bg-green">Update</span> Tối ưu code

### version 7.1.3 - 22.09.2024

<span class="badge text-bg-red">Fix</span> Lỗi thêm danh mục taxonomy <span class="badge text-bg-yellow">Dương</span>

<span class="badge text-bg-red">Fix</span> Lỗi hiển thị cây danh mục sau khi chọn trong post taxonomy

<span class="badge text-bg-red">Fix</span> Lỗi không lưu được imageRepeat trong field background

<span class="badge text-bg-red">Fix</span> Lỗi không lấy được margin, padding trong css tablet, mobile của cssButton <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi không thêm dữ liệu vào menu khi mới tạo menu lần đầu <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-green">Update</span> Tối ưu model add, save


### version 7.1.2 - 18.09.2024

<span class="badge text-bg-red">Fix</span> Lỗi module không truy cập được page add, edit <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi post không thêm xóa danh mục <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi sẵp xếp thứ tự theme/menu

<span class="badge text-bg-green">Add</span> Thêm Middleware `RateLimit` quản lý số lượt request / khoản thời gian

<span class="badge text-bg-green">Add</span> Thêm Middleware `SecurityAgents` kiểm tra và block request có Agents không hợp lệ

<span class="badge text-bg-green">Update</span> Cải thiện Auth::check

### version 7.1.1 - 16.09.2024

<span class="badge text-bg-red">Fix</span> Lỗi theme/menu và gallery hiển thị sai dữ liệu <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> Lỗi theme/menu không hiển thị location đã chọn <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-green">Update</span> Cải thiện trình hiển thị lỗi ở các file view

<span class="badge text-bg-green">Update</span> Cập nhật sửa đổi trait SoftDelete của Model

<span class="badge text-bg-green">Add</span> Thêm method `now` và `carbon` hỗ trợ xử lý dữ liệu thời gian

### version 7.1.0 - 13.09.2024

_`Version này cập nhật cách viết model vui lòng đọc lại documnet`_

<span class="badge text-bg-red">Fix</span> Lỗi router account <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi bản dịch thông báo javascript

<span class="badge text-bg-red">Fix</span> Lỗi bulkAction sau khi delete hoặc restore không xóa các column đã chọn

<span class="badge text-bg-red">Fix</span> Lỗi bulkAction xóa nhiều bài viết không hoạt động <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi sai đường dẫn logout trong trang account <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Delete</span> Xóa nhật ký hoạt động củ tách thành plugin log mới (chuẩn bị ra mắt)

<span class="badge text-bg-red">Delete</span> Loại bỏ MY_Model

<span class="badge text-bg-red">Delete</span> Xóa thư viện Security thay thế bằng Middleware

<span class="badge text-bg-blue">Change</span> Thay đổi core thư viện cache (loại bỏ thư viện cache của codeigniter)

<span class="badge text-bg-green">Update</span> Tối ưu lại thư viện Storage

<span class="badge text-bg-green">Update</span> Thay đổi sâu nhiều thành phần Model

<span class="badge text-bg-green">Add</span> Thêm Model Event vào Model

<span class="badge text-bg-green">Add</span> Thêm Model SoftDelete vào Model

<span class="badge text-bg-green">Add</span> SkillDo/Log thư viện ghi log mới

<span class="badge text-bg-green">Add</span> Tự động ghi toàn bộ log error vào thư mục logs

<span class="badge text-bg-green">Add</span> Thêm chức năng Middleware vào cms


### version 7.0.6 - candidates - 26.08.2024

<span class="badge text-bg-red">Fix</span> lỗi input-dimension không hiển thị giá trị khi nhập 0 <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> lỗi input-dimension không cho submit khi nhập số thập phân <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> lỗi text-building kiểu chữ không hiển thị giá trị sau khi lưu <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> lỗi thêm nhiều gallery item một lúc <span class="badge text-bg-yellow">Dương</span>

<span class="badge text-bg-red">Fix</span> lỗi không tạo được column danh mục taxonomy trong table post <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> lỗi function SkilldoUtil.isset

### version 7.0.5 - candidates - 21.08.2024

<span class="badge text-bg-red">Fix</span> lỗi không tạo được gallery trong admin

<span class="badge text-bg-red">Fix</span> lỗi login-as bị chuyển hướng sai khi logout

<span class="badge text-bg-red">Fix</span> <span class="badge text-bg-pink">Location</span> lỗi khi truyền sai dữ liệu lấy địa chỉ

<span class="badge text-bg-red">Fix</span> <span class="badge text-bg-pink">Javascript</span> SkilldoMessage header đa ngôn ngữ <span class="badge text-bg-yellow">Dương</span>

<span class="badge text-bg-blue">Change</span> <span class="badge text-bg-pink">Language</span> Tách bản dịch cho core cms và trang admin thành 2

<span class="badge text-bg-blue">Change</span> Thay đổi giao diện trang admin 404

<span class="badge text-bg-green">Add</span> Thêm bản dịch cho backend/404-error

<span class="badge text-bg-green">Add</span> Thêm bản dịch cho backend/galleries-index

<span class="badge text-bg-green">Update</span> Cập nhật bản dịch cho backend/menu-index

<span class="badge text-bg-green">Update</span> Áp dụng Validation (server) khi lưu theme options

<span class="badge text-bg-green">Update</span> Tối ưu hiển thị media review của các trường image trong admin

<span class="badge text-bg-green">Add</span> SkilldoUtil.elementSize lấy width và height của một dom

<span class="badge text-bg-green">Add</span> SkilldoUtil.windowSize lấy width và height của một window hoặc gán function vào sự kiện resize

### version 7.0.4 - public beta - 20.08.2024

<span class="badge text-bg-red">Fix</span> lỗi lưu post không có kết nối với danh mục <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> lỗi url chuyển hướng trong auth nếu user đã đăng nhập

<span class="badge text-bg-green">Add</span> Thêm hooks user_form_profile

<span class="badge text-bg-blue">Change</span> Optimize code

### version 7.0.3 - public beta - 18.08.2024

<span class="badge text-bg-red">Fix</span> lỗi logout khi redirect lưu cache trình duyệt

<span class="badge text-bg-red">Fix</span> lỗi review image <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-blue">Change</span> Đổi service lấy danh sách fonts google

<span class="badge text-bg-green">Add</span> Thêm hooks admin_pre_user_update, admin_pre_user_update_meta, admin_user_update_success

### version 7.0.2 - public beta - 15.08.2024

<span class="badge text-bg-red">Fix</span> lỗi route khi bật đa ngôn ngữ  <span class="badge text-bg-yellow">Dương</span>

<span class="badge text-bg-red">Fix</span> <span class="badge text-bg-pink">Location</span> lỗi thư viện Location lấy sai tên full_name  <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> <span class="badge text-bg-pink">Widget</span> lỗi widget kéo thả không cập nhật thứ tự  <span class="badge text-bg-yellow">Dương</span>

<span class="badge text-bg-red">Fix</span> <span class="badge text-bg-pink">Theme menu</span> lỗi khi edit menu không hiện data đã lưu <span class="badge text-bg-yellow">Dương</span>

### version 7.0.1 - public beta - 13.08.2024

<span class="badge text-bg-red">Fix</span> lỗi không vào được trang update phiên bản bằng button upload  

<span class="badge text-bg-red">Fix</span> <span class="badge text-bg-pink">Theme menu</span> lỗi thêm menu không xóa cache củ <span class="badge text-bg-yellow">Dương</span>

<span class="badge text-bg-blue">Change</span> <span class="badge text-bg-pink">Cache</span> Đổi class CacheHandler thành class SkillDo\Cache  

<span class="badge text-bg-blue">Change</span> <span class="badge text-bg-pink">Mail</span> Đổi class Mail thành class SkillDo\Mail

<span class="badge text-bg-green">Add</span> Thêm class SkillDo\Location xử lý thông tin địa chỉ

<span class="badge text-bg-green">Add</span> Thêm class SkillDo\ServiceLocation lấy thông tin địa chỉ từ service

