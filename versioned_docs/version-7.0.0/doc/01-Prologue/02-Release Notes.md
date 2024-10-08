### Phiên bản hỗ trợ

| Cms Version |  PHP Support  |  Release   |     Support     |
|:-----------:|:-------------:|:----------:|:---------------:|
|      7      | 8.2.x - 8.3.x | 10/08/2024 |   Đang hỗ trợ   |
|      6      | 8.0.x - 8.1.x | 25/07/2022 | Cập nhật vá lỗi |
|      5      | 8.0.x - 8.1.x | 10/12/2021 | `Dừng hỗ trợ `  |
|      4      | 7.0.x - 7.3.x | 29/09/2020 |  `Dừng hỗ trợ`  |
|      3      |      5.6      | 18/09/2019 |  `Dừng hỗ trợ`  |

### version 7.1.0 - 13.09.2024

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

