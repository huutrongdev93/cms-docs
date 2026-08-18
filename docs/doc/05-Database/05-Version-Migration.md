# Phiên bản & Migration cơ sở dữ liệu

Hệ thống có **hai** mốc phiên bản, và phần lớn lỗi cập nhật đến từ việc nhầm hai
mốc này với nhau.

| Mốc | Nằm ở đâu | Nghĩa là gì | Đọc bằng |
|---|---|---|---|
| Phiên bản **mã nguồn** | `packages/skilldo/cms/src/config/cms.php` → `version` | Code trên đĩa đang là bản nào | `config('cms.version')`, `Cms::version()` |
| Phiên bản **cơ sở dữ liệu** | option `cms_db_version` trong bảng `system` | Schema đã được nâng cấp tới bản nào | `DatabaseVersion::stored()` |

Mã nguồn nằm trong file nên **bị ghi đè theo source**. Nếu dev bung bản mới đè lên
thư mục cũ thay vì chạy trình cập nhật trong admin thì mốc mã nguồn nhảy lên bản
mới trong khi database vẫn ở bản cũ. Trước 8.1.5 không có gì phát hiện được: updater
lấy "phiên bản đang cài" từ chính `config('cms.version')` nên nó tin rằng migration
đã chạy rồi và bỏ qua — website chạy code mới trên schema cũ, hỏng ngầm.

## Hai nguồn khai báo migration

Cùng liệt kê migration nhưng phục vụ hai luồng khác nhau, **phải cập nhật cả hai**:

| | `manifest.json` → `migrations` | `database/updates/updates.json` |
|---|---|---|
| Sống ở đâu | chỉ trong gói ZIP; `AbstractUpdater::cleanupPackageArtifacts()` xoá khỏi thư mục cài đặt sau khi cập nhật | nằm luôn trong mã nguồn, tích luỹ qua các bản |
| Đường dẫn | đầy đủ, đã remap production: `vendor/skilldo/cms/database/updates/x.php` | chỉ tên file, tương đối thư mục `updates/` |
| Ai đọc | `UpdateManifest::getMigrations()` — luồng updater trong admin | `DatabaseVersion::pending()` — trang `/upgrade` |
| Dùng khi | cập nhật đúng quy trình | source bị bung đè, không còn gói nào |

## Luồng cập nhật đúng quy trình

`UpdateAjax::update()` → `UpdateManager::updateFromZip()` → `AbstractUpdater::performUpdate()`:

```
preparePackage → beforeUpdate → ensureVersionIsNewer → createBackup
  → copyFiles → runMigrationsIfNeeded → recordVersion → verifyInstallation
  → cleanupRemovedFiles → cleanupPackageArtifacts
```

- `ensureVersionIsNewer()` dùng `installedVersion()` = `config('cms.version')` — chặn hạ cấp, chuyện của **file**.
- `runMigrationsIfNeeded()` dùng `currentVersion()` = `DatabaseVersion::stored()` — chọn migration, chuyện của **dữ liệu**.
- `recordVersion()` ghi `cms_db_version` = version của manifest, **kể cả khi gói không có migration nào** — không ghi thì mốc đứng yên và lần truy cập sau bị đẩy sang `/upgrade`.
- Lỗi ở bất kỳ bước nào → `rollback()` khôi phục từ backup rồi ném lại ngoại lệ.

## Luồng sửa chữa khi source bị bung đè

`CheckDatabaseVersion` (middleware nhóm `web`, ngay sau `CheckInstallation`) so hai mốc
mỗi request. Lệch nhau → đưa **mọi** truy cập về `/upgrade`, giống hệt cách
`CheckInstallation` đưa về `/install`.

Các đường dẫn được miễn để không tự khoá mình ra ngoài: `/install`, `/upgrade`,
`{admin_prefix}/login`, `{admin_prefix}/crm-login`, `{admin_prefix}/ajax`.

Trang `/upgrade` (`UpgradeController` + `UpgradeAjax`) hiện hai mốc phiên bản và danh
sách migration sẽ chạy. Nút chạy **chỉ hiện với tài khoản có quyền `loggin_admin`** —
`UpgradeAjax::runUpgrade()` kiểm tra lại quyền ở phía server. Chạy xong thì
`DatabaseVersion::mark()` ghi mốc và `Cache::flush()`.

`DatabaseVersion::stored()` trả `null` nghĩa là **không xác định**, không phải "đã đồng
bộ": site cài từ bản cũ hơn cơ chế này rơi vào trường hợp này và sẽ được yêu cầu chạy
lại toàn bộ chuỗi migration. An toàn vì mọi migration đều phải viết theo hướng chạy
lại được.

## Viết một migration mới

1. Tạo `packages/skilldo/cms/database/updates/<version>-<mô-tả>.php`, trả về
   `new class () extends Migration { public function up(): void {...} }`.
2. Thân `up()` **bắt buộc tự kiểm tra trước khi đổi** — `schema()->hasTable()`,
   `schema()->hasColumn()`, hoặc soi kiểu cột hiện tại. Migration được chạy lại trong
   nhiều tình huống (cài lại gói, mốc phiên bản không xác định) và không có bảng nào
   ghi lịch sử đã-chạy.
3. Khai vào `database/updates/updates.json` theo khoá version.
4. Khai vào `manifest.json` → `migrations` (đường dẫn `vendor/...`) và thêm file vào
   `manifest.files`. Skill `/build-update` Bước 4b + 4c lo việc này.
5. Bảng/cột mới còn phải bổ sung vào `packages/skilldo/cms/database/database.php` cho
   luồng **cài mới** — migration chỉ phục vụ site đang nâng cấp.

Log của cả hai luồng ghi vào `storage/logs/updater-<Ymd>.log`.
