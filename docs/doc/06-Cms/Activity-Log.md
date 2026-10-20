# Nhật ký hoạt động (Activity Log)

> **Ghi:** `packages/skilldo/cms/src/Activity/ActivityLog.php` — `SkillDo\Cms\Activity\ActivityLog`
> **Đọc:** `packages/skilldo/cms/src/Activity/ActivityQuery.php` — `SkillDo\Cms\Activity\ActivityQuery`
> **Tiêu đề đối tượng:** `packages/skilldo/cms/src/Activity/ObjectTitle.php`
> **Listener của lõi:** `views/admin/app/Modules/Logger/ActivityHook.php`
> **Giao diện:** *Cấu hình hệ thống → Nhật ký hoạt động* (`views/admin/app/Modules/ActivityLog/`)
> **Bảng:** `activity_logs` (migration `8.6.0-activity-logs.php`)
> **Có từ:** 8.6.0

## Tổng quan

Nhật ký trả lời ba câu hỏi mà trước 8.6.0 không ai trả lời được nếu không SSH vào máy chủ:

- *Ai sửa / xoá cái này, lúc nào?* (theo đối tượng)
- *Tài khoản X đã làm gì tuần qua?* (theo người)
- *Có ai đang dò mật khẩu admin không?* (đăng nhập thất bại theo IP)

Mỗi dòng ghi **ai** (tài khoản, họ tên), **làm gì** (sự kiện + đối tượng + tiêu đề), **từ đâu** (IP, trình duyệt) và **lúc nào**. Có hai kênh:

| Kênh | Sự kiện |
|---|---|
| `auth` | `login`, `login_failed`, `logout`, `login_as`, `login_as_back`, `password` |
| `action` | `create`, `update`, `trash`, `restore`, `delete`, `status`, `role`, `setting`, `install`, `activate`, `deactivate`, `upgrade`, `upgrade_failed`, `publish`, `revoke` (danh sách mở: plugin thêm sự kiện riêng được) |

Chỉ tài khoản **root** xem được nhật ký: trang *Cấu hình hệ thống → Nhật ký hoạt động*, tab *Hoạt động* trong trang sửa tài khoản, và link "Xem tất cả" ở widget *Hành động gần đây* của Dashboard.

:::info Trước 8.6.0
Nhật ký ghi ra file `storage/logs/activity/{năm}/activity-{tháng-năm}.log`. Migration 8.6.0 nhập các file trong 180 ngày gần nhất vào bảng (file giữ nguyên). Lời gọi cũ `Admin\Supports\ActivityLogger::log()` vẫn chạy, xem [Tương thích ngược](#tương-thích-ngược).
:::

---

## Lõi đã ghi những gì

Bạn **không cần** tự ghi cho các thao tác sau, kể cả với module của plugin:

| Nhóm | Ghi khi |
|---|---|
| Nội dung | Thêm / sửa qua `FormAdminHelper` (mọi module có form admin chuẩn), cho vào thùng rác / khôi phục / xoá qua `ActionAjax`, bật/tắt cột boolean trên bảng. Sửa có kèm **tên các cột đã đổi** (không lưu giá trị) |
| Tài khoản | Thêm, sửa hồ sơ, đổi trạng thái (cả hàng loạt), cho vào thùng rác, đổi vai trò, đổi mật khẩu |
| Vai trò | Quyền thêm / bớt của từng vai trò (so đầu và cuối mỗi request POST, nên bắt được cả quyền do plugin tự thêm khi bật) |
| Đăng nhập | Thành công, thất bại (kèm lý do), đăng xuất, đăng nhập thay và thoát đăng nhập thay |
| Cấu hình | Mọi tab *Cấu hình hệ thống* (tên tab + tên các ô đã gửi), cấu hình giao diện, widget, menu |
| Hệ thống | Cài / bật / tắt / cập nhật / xoá plugin, cập nhật CMS (thành công / lỗi), xuất bản / xoá trang Page Builder, ngắt kết nối ứng dụng OAuth |

Tiêu đề đối tượng lấy theo thứ tự: ô `{ngôn ngữ mặc định}[title|name]` của form → ô `title|name` → cột `title`, `name`, `username`, `label` của bản ghi. Module **không tìm được tiêu đề thì không ghi** (tránh dòng vô nghĩa).

Thao tác hàng loạt (xoá 20 bài một lần) ghi **một dòng** cho cả lô: id ở `context.ids`, tiêu đề ở `context.titles` (tối đa 50).

Listener của lõi chỉ nạp trong ngữ cảnh admin, nên đăng nhập sai ở trang tài khoản của khách ngoài frontend **không** bị ghi.

---

## Ghi một dòng từ plugin

Dùng khi plugin có thao tác **không** đi qua form / bảng chuẩn (nút ajax riêng, đồng bộ dữ liệu…):

```php
use SkillDo\Cms\Activity\ActivityLog;

ActivityLog::record('update', [
    'module'    => 'products',          // khoá module, hiển thị qua filter activity_log_modules
    'object_id' => $product->id,        // int|string; mảng = thao tác hàng loạt
    'title'     => $product->title,     // văn bản thuần, lõi tự bỏ thẻ HTML
    'context'   => [                    // tuỳ ý, hiện ở mục "Chi tiết"
        'fields' => ['price', 'stock'],
    ],
]);

// Kênh đăng nhập
ActivityLog::auth('login', ['user' => $user]);
```

| Khoá `$data` | Ý nghĩa |
|---|---|
| `module` | Khoá module (≤ 50 ký tự) |
| `object_id` | Id đối tượng; truyền **mảng** cho thao tác hàng loạt (lõi chuyển vào `context.ids`) |
| `title` | Tiêu đề chụp lúc ghi (đối tượng có thể bị xoá sau) |
| `message` | Câu tự do, chỉ dùng khi không mô tả được bằng sự kiện + tiêu đề (không dịch được) |
| `context` | Mảng phụ, lưu JSON |
| `user` | Ghi thay cho người khác; `false` = không gắn người đang đăng nhập |
| `channel` | `action` (mặc định) hoặc `auth` |

Quy tắc của `record()`:

- **Không bao giờ ném lỗi.** Lỗi DB chỉ ghi ra `error_log`: thà mất một dòng nhật ký còn hơn hỏng thao tác chính.
- Tự tạo bảng nếu chưa có (site bung source đè, chưa chạy `/upgrade`).
- Tự điền người dùng, IP, trình duyệt; nếu root đang *đăng nhập thay* thì thêm `context.impersonator`.
- **Bỏ mọi khoá nhạy cảm** khỏi `context` (đệ quy, không phân biệt hoa thường): tên chứa `password`, `pass`, `token`, `secret`, `api_key`, `apikey`, `authorization`, `cookie`, `otp`.
- Cắt độ dài theo cột, dọn nhật ký cũ ngẫu nhiên ~1/100 lượt ghi (không cần cron).

:::warning Đừng ghi đôi
Nếu module của bạn đã đi qua `FormAdminHelper` / `ActionAjax` thì lõi đã ghi rồi. Gọi `record()` thêm cho cùng `create` / `update` / `trash` / `restore` / `delete` sẽ ra hai dòng.
:::

---

## Hiển thị đẹp cho module của plugin

Câu chữ **không** lưu trong DB mà dựng lúc đọc từ sự kiện + nhãn module + tiêu đề, nên đổi ngôn ngữ admin là nhật ký đổi theo. Khai nhãn module:

```php
add_filter('activity_log_modules', function (array $modules) {
    $modules['products']            = trans('sicommerce::activity.products');   // "sản phẩm"
    $modules['products_categories'] = trans('sicommerce::activity.categories'); // "danh mục sản phẩm"
    return $modules;
});
```

Không khai thì nhật ký hiện thẳng khoá module ("cập nhật products **Áo thun**").

Sự kiện riêng của plugin hiện theo câu chung `:event :module :title`. Muốn câu riêng, thêm khoá vào file ngôn ngữ admin của site hoặc dùng `message`.

---

## Đọc nhật ký

```php
use SkillDo\Cms\Activity\ActivityQuery;

$rows  = ActivityQuery::recent(10, includeRoot: false);          // mới nhất trước
$page  = ActivityQuery::paginate(page: 2, limit: 50);
$stats = ActivityQuery::stats();     // actions_today, logins_today, failed_24h, failed_ips_24h, active_users_7d

foreach ($rows as $row) {
    echo ActivityQuery::describe($row);   // câu mô tả, ĐÃ escape, in bằng {!! !!} được
}
```

Luôn sắp theo `created`, không theo `id`: migration 8.6.0 nhập log file cũ sau khi bảng có thể đã có dòng mới.

---

## Đăng nhập thất bại và chống phình bảng

Bot dò mật khẩu bắn hàng nghìn lượt mỗi giờ. Trong 10 phút, cùng IP + tài khoản, 5 lần đầu ghi mỗi lần một dòng; từ lần thứ 6 chỉ cộng `context.attempts` vào dòng gần nhất. Trang nhật ký hiện tổng số lần thật ("(12 lần)") và số IP khác nhau trong 24 giờ.

Lý do thất bại nằm ở `context.code`: `empty_credentials`, `authenticate_filter`, `invalid_user_login`, `incorrect_password`, `authentication_failed`, `status_pending`, `status_block`, `no_admin_role`, `crm_member`.

Nhật ký chỉ **ghi nhận**, không chặn đăng nhập.

---

## Lưu trữ

| Option | Mặc định | Ý nghĩa |
|---|---|---|
| `activity_log_days` | 180 | Giữ nhật ký bao nhiêu ngày (0 = giữ mãi) |
| `activity_log_failed_days` | 30 | Riêng dòng đăng nhập thất bại |

Sửa được ở nút **Cấu hình** trên trang nhật ký, cùng nút xoá toàn bộ. Chính việc xoá được ghi lại thành dòng đầu tiên của bảng mới.

---

## Tương thích ngược

`Admin\Supports\ActivityLogger::log($event, $content)` (cách ghi trước 8.6.0) vẫn chạy và ghi vào bảng:

```php
\Admin\Supports\ActivityLogger::log('create', [
    'message' => 'Thêm sản phẩm <b>Áo thun</b>',
    'module'  => 'products',
    'id'      => 12,
]);
```

- Tiêu đề được bóc từ phần trong `<b>…</b>` để lọc / tìm được; `message` lưu dạng văn bản thuần.
- Nếu trong cùng request lõi **đã** ghi đúng sự kiện đó cho module đó (ví dụ `save_object_add` chạy trước `save_products_object_add`), lời gọi kiểu cũ bị bỏ qua; ngược lại cũng vậy. Plugin cũ không phải sửa gì vẫn không ghi đôi.
- Các filter `admin_activity_logger_{create,update,trash,restore,delete}_message` và `admin_activity_logger_{trash,restore,delete}_objects` vẫn chạy: trả chuỗi rỗng để bỏ ghi, trả câu khác để thay câu dựng sẵn.

---

## Hook

Danh sách đầy đủ ở mục **Hooks → Admin → Nhật ký hoạt động**. Tóm tắt:

| Hook | Loại | Dùng để |
|---|---|---|
| `activity_log_record` | filter | Sửa hoặc bỏ (`false`) một dòng trước khi ghi |
| `activity_log_recorded` | action | Chạy sau khi ghi (gửi cảnh báo email / Telegram…) |
| `activity_log_modules` | filter | Nhãn hiển thị của module |
| `manage_activity_logs_columns` | filter | Cột của bảng nhật ký |
| `admin_activity_logs_table_form_filter` | filter | Ô lọc của bảng |
| `admin_activity_logs_table_query` | filter | Điều kiện truy vấn của bảng |

---

## Bảo mật

- Bảng tự chặn người không phải root **ngay trong truy vấn** (`Table::queryFilter`), vì `TableAjax::load` dựng bảng theo tên class gửi lên và mọi tài khoản vào được admin đều gọi được.
- Tab *Cấu hình hệ thống → Nhật ký hoạt động* chỉ được đăng ký khi người xem là root (người khác vào URL nhận 404).
- `ActivityLogAjax::saveSettings` / `clear` tự kiểm tra root.
- Mọi dữ liệu người dùng (tiêu đề, tên, user agent) được escape khi hiển thị.
