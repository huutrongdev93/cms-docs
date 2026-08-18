# Release Notes

### Phiên bản hỗ trợ

| Cms Version |  PHP Support  |  Release   |    Support     |
|:-----------:|:-------------:|:----------:|:--------------:|
|      8      | 8.4.x - 8.5.x | 30/03/2026 |  Đang hỗ trợ   |
|      7      | 8.2.x - 8.3.x | 10/08/2024 | Hỗ trợ hạn chế |
|      6      | 8.0.x - 8.1.x | 25/07/2022 | `Dừng hỗ trợ`  |
|      5      | 8.0.x - 8.1.x | 10/12/2021 | `Dừng hỗ trợ`  |
|      4      | 7.0.x - 7.3.x | 29/09/2020 | `Dừng hỗ trợ`  |
|      3      |      5.6      | 18/09/2019 | `Dừng hỗ trợ`  |

### version 8.1.6 - 17.08.2026

<span class="badge text-bg-red">Fix</span> Page Builder — hiệu ứng khi cuộn (AOS) cho mọi element

<span class="badge text-bg-red">Fix</span> Sửa migration 8.1.5 chưa được chạy

<span class="badge text-bg-red">Fix</span> Menu — Fix lỗi clear slug (vi dụ `/#sosanh` thành `sosanh`)

### version 8.1.5 - 14.08.2026

<span class="badge text-bg-red">Fix</span> Page Builder — thứ tự tab/field không lưu được

<span class="badge text-bg-red">Fix</span> Chống clickjacking không hoạt động

<span class="badge text-bg-red">Fix</span> Bài viết liên quan / breadcrumb rỗng

### version 8.1.4 - 10.08.2026

<span class="badge text-bg-blue">Update</span> CSP — cho phép *.youtube-nocookie.com (nhúng YouTube chế độ không cookie).

<span class="badge text-bg-red">Fix</span> URL thẻ và tìm kiếm trả về đường dẫn tuyệt đối — Url::tag()

<span class="badge text-bg-red">Fix</span> Xoá nhầm cả bảng — 3 lỗi nghiêm trọng ở tầng Eloquent

<span class="badge text-bg-red">Fix</span> Log mất trắng context (LogDaily/LogSingle) khi gặp byte không hợp lệ UTF-8

<span class="badge text-bg-red">Fix</span> Cache menu không được xoá do sai khóa

<span class="badge text-bg-red">Fix</span> Cấu hình hệ thống ghi đè ngược version

<span class="badge text-bg-red">Fix</span> Preview builder trang nội dung mất CSS/JS header–footer

### version 8.1.3 - 06.08.2026

<span class="badge text-bg-green">Add</span> Hệ thống Thẻ (tag) - Thêm tính năng quản lý thẻ (tag) cho bài viết, cho phép người dùng tạo, chỉnh sửa và xóa thẻ, cũng như gán thẻ.

<span class="badge text-bg-blue">Update</span> Hệ thống cập nhật (Update) - Cập nhật cơ chế kiểm tra và cài đặt bản cập nhật mới cho CMS, giúp người dùng dễ dàng nâng cấp hệ thống.

<span class="badge text-bg-red">Fix</span> Template CSS — sửa lỗi gõ nhầm: trạng thái active gọi cssBorder() cho boxShadow <span class="badge text-bg-yellow">Tâm</span>

### version 8.1.2 - 05.08.2026

<span class="badge text-bg-green">Add</span> Element Builder - nạp thêm element đăng ký từ plugin đang active

<span class="badge text-bg-green">Add</span> Routing — Router::gatherRouteMiddleware() nay thật sự tôn trọng withoutMiddleware(): trước đây excluded_middleware được ghi vào action nhưng không nơi nào đọc ra

<span class="badge text-bg-green">Add</span> Trình soạn thảo TinyMCE — AdminHeaderService bỏ lớp nháy kép thừa quanh danh sách plugin và toolbar

<span class="badge text-bg-blue">Update</span> Trường nhập liệu Field\Price thêm cấu hình số lẻ thập phân (mặc định 0, đổi qua filter form_price_decimals hoặc args['decimals']) và đẩy xuống JS bằng data-decimals

<span class="badge text-bg-red">Fix</span> i18n / hook / DB — LanguageServiceProvider sửa điều kiện luôn false và tiền tố cắt sai khiến namespace ngôn ngữ element chưa bao giờ được đăng ký

### version 8.1.1 - 01.08.2026

<span class="badge text-bg-green">Add</span> CSS bundle & đường dẫn tài nguyên: thêm `Support\CssUrl` để viết lại `url()` trong CSS/LESS về đường dẫn tính từ gốc site trước khi gộp vào file bundle.

<span class="badge text-bg-green">Add</span> Thêm Motion Effects ở cấp row

<span class="badge text-bg-blue">Update</span> Tên file bundle theo base path

<span class="badge text-bg-red">Fix</span> Element instance bị dùng chung

<span class="badge text-bg-red">Fix</span> Namespace ngôn ngữ của element không chạy

<span class="badge text-bg-red">Fix</span> Form nhóm lồng nhau làm toàn bộ field bên trong group vắng mặt → mất bước làm sạch dữ liệu khi lưu.

<span class="badge text-bg-red">Fix</span> `DB::select()` / `DB::raw()` — bổ sung `$bindings`, `$useReadPdo` vào chữ ký. Tham số truyền vào trước đây bị nuốt im lặng, câu lệnh có placeholder lỗi "Invalid parameter number".

<span class="badge text-bg-red">Fix</span> WidgetBase xác định thư mục widget theo class con (`ReflectionClass` trên `get_class($this)`) thay vì class cha.

### version 8.1.0 - 27.07.2026

<span class="badge text-bg-green">Add</span> Middleware TrailingSlash. Chuẩn hóa URL, redirect 301 xóa dấu / thừa ở cuối

<span class="badge text-bg-green">Add</span> Quản lý key quyền Builder. Hiển thị key đang sử dụng và bổ sung nút Xóa key

<span class="badge text-bg-blue">Update</span> Page Builder – Vá DOM trực tiếp thay vì reload iframe.

<span class="badge text-bg-blue">Update</span> Cải thiện hiệu năng (Memoize ElementBuilder::getSection() theo phạm vi request, Chỉ đồng bộ MASTER_DATA sau message thực sự đổi dữ liệu)

<span class="badge text-bg-red">Fix</span> Làm sạch nội dung WYSIWYG khi lưu element

<span class="badge text-bg-red">Fix</span> Giới hạn lịch sử builder 20 phiên bản/section

<span class="badge text-bg-red">Fix</span> ButtonBuilding: tab style (normal/hover/active) sửa lỗi trùng id khi trên cùng form có nhiều nút. <span class="badge text-bg-yellow">Nhàn</span>

<span class="badge text-bg-red">Fix</span> xử lý đúng đường dẫn dạng uploads/... (khi URL bị bỏ tên miền) — tránh nối lặp uploads/source/ <span class="badge text-bg-yellow">Tâm</span>

<span class="badge text-bg-red">Fix</span> parse object_type cho post/post_categories dựa trên post_type/cate_type rõ ràng thay vì tách chuỗi theo dấu<span class="badge text-bg-yellow">Tâm</span>

### version 8.0.4 - 15.07.2026

<span class="badge text-bg-red">Fix</span> Fix lỗi không truy cập được route có chữ ký method có nhiều tham số optional <span class="badge text-bg-yellow">Tâm</span>

### version 8.0.3 - 10.07.2026

<span class="badge text-bg-red">Fix</span> Fix lỗi Image::large không lấy đúng image large <span class="badge text-bg-yellow">Tâm</span>

<span class="badge text-bg-red">Fix</span> Fix lỗi chọn layout builder không load taxonomy <span class="badge text-bg-yellow">Tâm</span>

<span class="badge text-bg-red">Fix</span> Fix lỗi Field Time không lấy đúng type <span class="badge text-bg-yellow">Nhàn</span>

<span class="badge text-bg-red">Fix</span> Fix lỗi thêm menu tùy chọn <span class="badge text-bg-yellow">Hòa</span>

<span class="badge text-bg-red">Fix</span> Fix lỗi load file env và cache không đúng

<span class="badge text-bg-red">Fix</span> Fix lỗi Database Column Cleaner đối với các trường có dữ liệu null

<span class="badge text-bg-blue">Update</span> Upload cài đặt font từ máy local

<span class="badge text-bg-blue">Update</span> Upload cài đặt font từ server

### version 8.0.2 - 12.06.2026

<span class="badge text-bg-red">Fix</span> Fix lỗi bảo mật SEC-02 SQLi

<span class="badge text-bg-red">Fix</span> Fix lỗi bảo mật SEC-03, SEC-05 Stored XSS

<span class="badge text-bg-red">Fix</span> Fix lỗi bảo mật SEC-08

<span class="badge text-bg-red">Fix</span> Fix lỗi bảo mật SEC-13

<span class="badge text-bg-red">Fix</span> Fix lỗi SEC-09 - xem được review của builder khi chưa đăng nhập

<span class="badge text-bg-red">Fix</span> Fix lỗi element trong nested row lồng nested row khác không cập nhật được config

<span class="badge text-bg-blue">Update</span> PERF-01 — N+1 metadata khi nạp menu

<span class="badge text-bg-blue">Update</span> PERF-02 — N+1 đệ quy cây danh mục

<span class="badge text-bg-blue">Update</span> PERF-04 — hasTable() không cache (Metadata.php)


### version 8.0.1 - 04.06.2026

<span class="badge text-bg-red">Fix</span> Fix lỗi bảo mật LGRT-2026-06

<span class="badge text-bg-red">Fix</span> Fix lỗi bảo mật CSRF-2026-06

<span class="badge text-bg-red">Fix</span> Fix lỗi bảo mật TA-SIB-2026-06

<span class="badge text-bg-red">Fix</span> Fix lỗi bảo mật TA-STE-2026-06

<span class="badge text-bg-red">Fix</span> Fix lỗi bảo mật UT-SE-2026-06

<span class="badge text-bg-blue">Update</span> Tối ưu code cải thiện tốc độ load cache

<span class="badge text-bg-blue">Update</span> Tối ưu code cải thiện tốc độ load theme menu

<span class="badge text-bg-blue">Update</span> Tối ưu code cải thiện tốc độ load của loader

### version 8.0.0 - 30.03.2026

<span class="badge text-bg-green">Add</span> triển khai framework hoàn toàn mới trên nền tảng Illuminate components từ Laravel

<span class="badge text-bg-green">Add</span> Triển khai cơ chế loader cms hoàn toàn mới

<span class="badge text-bg-green">Add</span> Hệ thống builder mới tích hợp xâu

<span class="badge text-bg-green">Add</span> Các lớp bảo mật mới (Cơ chế sinh mật khẩu, Headers, CORS...)

<span class="badge text-bg-green">Add</span> Form - Thêm nhiều Field mới

<span class="badge text-bg-green">Add</span> Jquery - Nâng cấp thư viện jquery lên phiên bản 4.0.0

### version 7.5.7 - 28.08.2025

<span class="badge text-bg-red">Fix</span> Fix một số lỗi

### version 7.5.6 - 16.07.2025

<span class="badge text-bg-green">Add</span> Thêm class Location2 lấy địa chỉ theo đơn vị hành chính mới

<span class="badge text-bg-green">Add</span> Thêm validate rule kiểu array

<span class="badge text-bg-red">Fix</span> Fix lỗi phân trang dính index_php <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Fix lỗi url current dính index.php <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> Fix ẩn hiện bài viết không reset cache

<span class="badge text-bg-red">Fix</span> Fix lỗi count trong Model User lấy query sai

<span class="badge text-bg-red">Fix</span> Fix lỗi api bị chặn options

<span class="badge text-bg-red">Fix</span> Fix lỗi builder download đè lên widget có sẳn

### version 7.5.5 - 21.05.2025

<span class="badge text-bg-green">Add</span> Bổ sung phương thức xác thực request requiredIf

<span class="badge text-bg-green">Add</span> Thêm button ẩn hiện danh mục

<span class="badge text-bg-blue">Update</span> Tối ưu việc lưu metadata

<span class="badge text-bg-red">Fix</span> Fix lỗi Theme::isProduct và Theme::isProductCategory chỉ chạy ở root <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> Fix lỗi select2 trong dialog model không thể search

<span class="badge text-bg-red">Fix</span> Fix lỗi checkbox khi options chỉ có một giá trị thì giá trị checked không nhận value là array

### version 7.5.4 - 12.05.2025

<span class="badge text-bg-red">Fix</span> Fix lỗi không load wysiwyg khi chỉnh sửa danh mục <span class="badge text-bg-yellow">Tâm - Trang</span>

<span class="badge text-bg-red">Fix</span> Fix lỗi không load wysiwyg khi chỉnh sửa widget <span class="badge text-bg-yellow">Thái</span>

<span class="badge text-bg-red">Fix</span> Fix lỗi không load đúng ngôn ngữ <span class="badge text-bg-yellow">Châu Thạch</span>

### version 7.5.3 - 28.04.2025

<span class="badge text-bg-green">Add</span> Bổ sung bulk action cho table user (điều chỉnh trạng thái hàng loạt)

<span class="badge text-bg-red">Fix</span> Fix chuyển hướng đăng nhập

<span class="badge text-bg-red">Fix</span> Sữa lỗi lấy request()->query() dính biến index_php <span class="badge text-bg-yellow">Dương</span>

### version 7.5.2 - 21.04.2025

<span class="badge text-bg-blue">Update</span> Cập nhật singleton cho class request

<span class="badge text-bg-blue">Update</span> Thêm lựa chọn rel trong plugin link của tinymce

<span class="badge text-bg-red">Fix</span> Sữa lỗi Language::has

<span class="badge text-bg-red">Fix</span> Sữa lỗi Route default khi đăng ký route api

### version 7.5.1 - 17.04.2025

<span class="badge text-bg-green">Add</span> `TableBuilder` bổ sung function `headerButton` tạo button cho header table

<span class="badge text-bg-green">Add</span> `Model` bổ sung function `inserts` tạo nhiều row cùng một lúc

<span class="badge text-bg-green">Add</span> Bổ sung menu mobile cho admin

<span class="badge text-bg-red">Fix</span> `TableBuilder` Sữa lỗi cache page hiện tại khác 1 mà số lượng data chỉ có 1 page làm lỗi không có dữ liệu khi hiển thị table

<span class="badge text-bg-red">Fix</span> Method Str::price clear string tốt hơn với giá tiền có . và , <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Sữa lỗi danh mục dạng cây <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> popover không hiển thị kết quả post có taxonomy <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> gallery không hiển ảnh khi là đường link youtube <span class="badge text-bg-yellow">Trang</span>

### version 7.5.0 - 12.02.2025

<span class="badge text-bg-red">Fix</span> Sữa lỗi không có quyền truy cập ở danh mục bài viết <span class="badge text-bg-yellow">Dương - Trang</span>

<span class="badge text-bg-red">Fix</span> Sữa lỗi không có quyền xóa thành viên <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-green">Add</span> Thêm phưng thức `reducer` vào thư viện SkilldoUtil (javascript)

<span class="badge text-bg-green">Add</span> Tách Widget footer ra thành mục quản lý riêng

<span class="badge text-bg-green">Add</span> Table Builder bổ sung cơ chế table child

<span class="badge text-bg-blue">Update</span> Filter Background bổ sung blend-mode color cho tùy chọn ảnh nền

<span class="badge text-bg-blue">Change</span> Filter Background Ẩn các tùy chọn nâng cao của tùy chọn ảnh nền

<span class="badge text-bg-blue">Update</span> Mở lại chức năng builder

### version 7.4.6 - 10.01.2025

<span class="badge text-bg-red">Fix</span> Lỗi validate rule GreaterThan, LessThan <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi load file validate core

<span class="badge text-bg-blue">Update</span> Hỗ trợ thêm js cho validate custom

<span class="badge text-bg-blue">Update</span> Điều chỉnh giao diện cho repeater

### version 7.4.5 - 03.01.2025

<span class="badge text-bg-red">Fix</span> Lỗi ký tự ø trong slug <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Fix</span> Lỗi hình ảnh watermark <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> Lỗi xóa bài viết thư viện kèm theo bị xóa sai <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-red">Fix</span> Lỗi css khi sử dụng widget ở nhiều trang khác nhau <span class="badge text-bg-yellow">Thạch</span>

### version 7.4.2 - 19.12.2024

<span class="badge text-bg-red">Fix</span> Lỗi load bản dịch cho menu <span class="badge text-bg-yellow">Hòa</span>

<span class="badge text-bg-red">Fix</span> Lỗi input fontIcon <span class="badge text-bg-yellow">Dương</span>

<span class="badge text-bg-red">Fix</span> Lỗi trang system info <span class="badge text-bg-yellow">Tâm</span>

### version 7.4.1 - 13.12.2024

<span class="badge text-bg-red">Fix</span> Lỗi load bản dịch ngôn ngữ ở admin <span class="badge text-bg-yellow">Tâm - Hòa</span>

<span class="badge text-bg-red">Fix</span> Lỗi load bản dịch khi chỉ có duy nhất 1 ngôn ngữ không phải tiếng việt <span class="badge text-bg-yellow">Tâm</span>

<span class="badge text-bg-red">Fix</span> Lỗi xóa gallery item bị mất toàn bộ item <span class="badge text-bg-yellow">Trang</span>

<span class="badge text-bg-green">Add</span> Thêm các hooks `plugin_active`, `plugin_update`, `plugin_deactivate`, `plugin_delete`

<span class="badge text-bg-green">Add</span> Kiểm tra thông tin server có đầy đủ để chạy cms không

<span class="badge text-bg-green">Add</span> Thêm trung tâm hỗ trợ

<span class="badge text-bg-blue">Update</span> Thay đổi tên session theo từng dự án khác nhau

<span class="badge text-bg-blue">Update</span> Method `find` trong Model có thể chạy event

### version 7.4.0 - 09.12.2024

<span class="badge text-bg-red">Fix</span> Bị lặp lại hook ở components/page-default/page-save.blade.php <span class="badge text-bg-yellow">Châu Thạch</span>

<span class="badge text-bg-red">Delete</span> Gở bỏ helper phiên bản 2.0 (`url`, `cookie`, `date`, `session`)

<span class="badge text-bg-red">Delete</span> Gở bỏ thư mục language củ

<span class="badge text-bg-red">Delete</span> Gở bỏ thư viện HMVC

<span class="badge text-bg-green">Update</span> Trang update cms luôn kiểm tra và lấy version mới nhất

<span class="badge text-bg-green">Update</span> Tối ưu code cải thiện tốc độ load admin

<span class="badge text-bg-green">Add</span> Thêm hook `cms_class_autoloader_map` hỗ trợ việc autoload class

<span class="badge text-bg-green">Add</span> `Dark mode` chế độ tối cho giao diện admin

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

<span class="badge text-bg-green">Add</span> Thêm class SkillDo\Service\ServiceLocation lấy thông tin địa chỉ từ service

