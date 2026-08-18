# Commands

Danh sách đầy đủ **61 lệnh** của plugin DevTool trên SkillDo CMS v8.

> **Lưu ý quan trọng:** DevTool **không có CLI**. Mọi lệnh chạy trong **Terminal của admin** (nút *Terminal* trên thanh header, chỉ hiện với tài khoản root), gửi qua ajax `POST /admin/ajax`. Không chạy được từ shell/SSH.

Quy ước ký hiệu trong tài liệu:

* `[<arg>]` — tham số **bắt buộc** <span class="badge text-bg-red">REQUIRED</span>
* `[<arg>?]` — tham số **tùy chọn** <span class="badge text-bg-success">Optional</span>
* `[<arg>=giá-trị]` — tham số tùy chọn có **giá trị mặc định**
* `--option` — cờ tùy chọn

Hai biến thể `:plugin` và `:theme` của cùng một lệnh chỉ khác nơi ghi file:

* `:plugin` → ghi vào `plugins/<plugin>/…`
* `:theme` → ghi vào **theme con** `views/<theme-child>/…` (trừ `make:lang:theme`, `make:widget*` ghi vào **theme cha**)

<div class="card-command">

#### ```help```
Liệt kê các lệnh
> **Arguments**
* group_name - tên nhóm lệnh muốn xem <span class="badge text-bg-success">Optional</span>
```shell
help [<group_name>]
```

</div>

### Auth

<div class="card-command">

#### ```auth:logout```
Đăng xuất tài khoản hiện đang đăng nhập
```shell
auth:logout
```
</div>

### User

<div class="card-command">

#### ```user:username```
Thay đổi tên đăng nhập của một user
> **Arguments**
* usernameOld - username hiện tại của account <span class="badge text-bg-red">REQUIRED</span>
* usernameNew - username mới <span class="badge text-bg-red">REQUIRED</span>
```shell
user:username [<usernameOld>] [<usernameNew>]
```
```shell
user:username hello xinchao
```
</div>

<div class="card-command">

#### ```user:password```
Thay đổi mật khẩu đăng nhập của một user
> **Arguments**
* username - username của account muốn đổi mật khẩu <span class="badge text-bg-red">REQUIRED</span>
* password - mật khẩu mới <span class="badge text-bg-red">REQUIRED</span>
```shell
user:password [<username>] [<password>]
```
```shell
user:password xinchao 1234Game
```
</div>

### Cache

<div class="card-command">

#### ```cache:clear```
Xóa tất cả file cache trong thư mục cache bao gồm cả views
```shell
cache:clear
```

</div>

<div class="card-command">

#### ```cache:view```
Xóa tất cả file cache views
```shell
cache:view
```
</div>

<div class="card-command">

#### ```cache:lang```
Xóa tất cả file cache của bản dịch ngôn ngữ
```shell
cache:lang
```
</div>

### Cms

<div class="card-command">

#### ```cms:build:js```
Build file js của admin
```shell
cms:build:js
```

</div>

<div class="card-command">

#### ```cms:version```
Lấy thông tin phiên bản của cms
> **Arguments**
* type - loại version cần lấy: `current` (mặc định), `last` <span class="badge text-bg-success">Optional</span>
```shell
cms:version [<type=current>]
```

</div>

### Builder

Xuất / nhập cấu hình Page Builder của một section dưới dạng JSON. Section hợp lệ: `header`, `home`, `footer`.

<div class="card-command">

#### ```builder:export```
Xuất section của Page Builder ra file JSON.
File được ghi vào `storage/cms/builder/`, mặc định tên `<section>.json`.
> **Arguments**
* section - `header` | `home` | `footer` <span class="badge text-bg-red">REQUIRED</span>
* file - tên file JSON đích <span class="badge text-bg-success">Optional</span>
```shell
builder:export [<section>] [<file>?]
```
```shell
builder:export header
builder:export home home-v2.json
```
</div>

<div class="card-command">

#### ```builder:import```
Nhập section của Page Builder từ file JSON trong `storage/cms/builder/`.

Trước khi ghi đè, lệnh **tự sao lưu** cấu hình hiện tại vào `storage/cms/builder/backups/<section>_backup_<ngày_giờ>.json`. Dùng `--no-backup` để bỏ qua bước này.
> **Arguments**
* section - `header` | `home` | `footer` <span class="badge text-bg-red">REQUIRED</span>
* file - tên file JSON nguồn (mặc định `<section>.json`) <span class="badge text-bg-success">Optional</span>
> **Options**
* --no-backup - không sao lưu cấu hình hiện tại <span class="badge text-bg-success">Optional</span>
```shell
builder:import [<section>] [<file>?] [--no-backup]
```
```shell
builder:import header
builder:import home home-v2.json --no-backup
```
</div>

### Db

<div class="card-command">

#### ```db:empty```
Xóa sạch dữ liệu của một table
> **Arguments**
* table - tên table muốn empty <span class="badge text-bg-red">REQUIRED</span>
```shell
db:empty [<table>]
```

</div>

<div class="card-command">

#### ```db:show```
Hiển thị thông tin tổng quan về database đang kết nối
```shell
db:show
```
</div>

<div class="card-command">

#### ```db:table```
Hiển thị thông tin chi tiết của một table (cột, kiểu dữ liệu, index)
> **Arguments**
* table - tên table <span class="badge text-bg-red">REQUIRED</span>
```shell
db:table [<table>]
```
</div>

<div class="card-command">

#### ```db:run:plugin```
Thực thi file migration của một plugin được chỉ định.
File nằm trong `plugins/<plugin>/database/`.
> **Arguments**
* plugin - tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* file - tên file migration, mặc định `database` <span class="badge text-bg-success">Optional</span>
```shell
db:run:plugin [<plugin>] [<file=database>]
```
```shell
db:run:plugin sicommerce
db:run:plugin sicommerce update-8-1-0
```
</div>

<div class="card-command">

#### ```db:run:theme```
Thực thi file migration của theme con.
File nằm trong `views/<theme-child>/database/`.
> **Arguments**
* file - tên file migration, mặc định `database` <span class="badge text-bg-success">Optional</span>
```shell
db:run:theme [<file=database>]
```
</div>

<div class="card-command">

#### ```db:seed```
Sinh dữ liệu giả ngẫu nhiên cho một module
> **Arguments**
* number - số lượng bản ghi, từ **1** đến **50**, mặc định 10 <span class="badge text-bg-success">Optional</span>
> **Options**
* --module= - module cần sinh dữ liệu (vd `post`) <span class="badge text-bg-red">REQUIRED</span>
```shell
db:seed [--module=<module>] [<number=10>]
```
```shell
db:seed --module=post 20
```
</div>

### Lang

<div class="card-command">

#### ```lang:build```
Build file json ngôn ngữ
> **Arguments**
* type - loại ngôn ngữ cần build <span class="badge text-bg-red">REQUIRED</span>
```shell
lang:build [<type>]
```
</div>

### License

<div class="card-command">

#### ```license```
Hiển thị thông tin bản quyền đang sử dụng
```shell
license
```
</div>

<div class="card-command">

#### ```license:change```
Thay đổi thông tin bản quyền
> **Arguments**
* key - license key <span class="badge text-bg-red">REQUIRED</span>
* secretKey - secret key <span class="badge text-bg-red">REQUIRED</span>
```shell
license:change [<key>] [<secretKey>]
```
</div>

### Plugin

<div class="card-command">

#### ```plugin```
Hiển thị danh sách plugin hoặc thông tin của một plugin
> **Arguments**
* name - tên thư mục plugin, mặc định `all` <span class="badge text-bg-success">Optional</span>
```shell
plugin [<name=all>]
```
</div>

<div class="card-command">

#### ```plugin:activate```
Kích hoạt một plugin
> **Arguments**
* folder - tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
```shell
plugin:activate [<folder>]
```
</div>

<div class="card-command">

#### ```plugin:deactivate```
Ngừng kích hoạt một plugin
> **Arguments**
* folder - tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
```shell
plugin:deactivate [<folder>]
```
</div>

### Role

<div class="card-command">

#### ```role:list```
Hiển thị danh sách tất cả các nhóm quyền
```shell
role:list
```
</div>

<div class="card-command">

#### ```role:cap```
Hiển thị danh sách quyền (capability) của một nhóm quyền
> **Arguments**
* role - key của role <span class="badge text-bg-red">REQUIRED</span>
```shell
role:cap [<role>]
```
</div>

### Theme

<div class="card-command">

#### ```theme:child:copy```
Sao chép một file hoặc thư mục từ **theme cha** sang **theme con**.
Báo lỗi nếu theme đang dùng chính là theme con.
> **Arguments**
* source - đường dẫn tương đối tính từ gốc theme cha <span class="badge text-bg-red">REQUIRED</span>
```shell
theme:child:copy [<source>]
```
```shell
theme:child:copy layouts/master.blade.php
theme:child:copy elements/banner
```
</div>

### Make — Plugin & Command

<div class="card-command">

#### ```make:plugin```
Tạo bộ khung một plugin mới trong `plugins/<folder>/`: `plugin.json`, `index.php`, `ActivatorService`, `DeactivatorService`, `routes/admin.php`.
> **Arguments**
* folder - tên thư mục plugin (kebab-case) <span class="badge text-bg-red">REQUIRED</span>
```shell
make:plugin [<folder>]
```
</div>

<div class="card-command">

#### ```make:command```
Tạo một lệnh DevTool mới trong `plugins/DevTool/app/Console/<class>.php`.
> **Arguments**
* class - tên class command <span class="badge text-bg-red">REQUIRED</span>
```shell
make:command [<class>]
```

> Sau khi tạo lệnh PHP, phải bổ sung tên lệnh vào bảng autocomplete `TerminalDevTool.commands` trong `plugins/DevTool/assets/js/devtool.js` rồi chạy lại `cms:build:js`.
</div>

### Make — Cấu trúc code

Nhóm lệnh có hai biến thể `:plugin` / `:theme`. Đích ghi file:

| Lệnh | `:plugin` → `plugins/<plugin>/` | `:theme` → `views/<theme-child>/` |
|---|---|---|
| `make:ajax:*` | `app/Ajax/<Name>Ajax.php` | `app/Ajax/<Name>Ajax.php` |
| `make:controller:*` | `app/Controllers/<Name>Controller.php` | `app/Controllers/<Name>Controller.php` |
| `make:provider:*` | `app/Providers/<Name>ServiceProvider.php` | `app/Providers/<Name>ServiceProvider.php` |
| `make:services:*` | `app/Services/<Name>Service.php` | `app/Services/<Name>Service.php` |
| `make:supports:*` | `app/Supports/<Name>.php` | `app/Supports/<Name>.php` |
| `make:macro:*` | `app/Macros/<Class>.php` | `app/Macros/<Class>.php` |
| `make:middleware:*` | `app/Middlewares/<Class>.php` | `app/Middlewares/<Class>.php` |
| `make:column:*` | `app/Cms/Table/Columns/<Class>.php` | `app/Cms/Table/Columns/<Class>.php` |
| `make:form-field:*` | `app/Cms/Form/Field/<Class>.php` | `app/Cms/Form/Field/<Class>.php` |
| `make:popover:*` | `app/Cms/Form/Popovers/<Class>.php` | `app/Cms/Form/Popovers/<Class>.php` |
| `make:model:*` | `app/Models/<Class>.php` | `app/Models/<Class>.php` |
| `make:db:*` | `database/<file>.php` | `database/<file>.php` |

Tham số `name`/`class` chấp nhận dạng `Thu\Muc\Con\TenClass` để tạo file trong thư mục con kèm namespace tương ứng.

<div class="card-command">

#### ```make:ajax:plugin``` / ```make:ajax:theme```
Tạo class xử lý Ajax.
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* name - tên class (hậu tố `Ajax` được thêm tự động) <span class="badge text-bg-red">REQUIRED</span>
```shell
make:ajax:plugin [<plugin>] [<name>]
make:ajax:theme [<name>]
```
</div>

<div class="card-command">

#### ```make:controller:plugin``` / ```make:controller:theme```
Tạo controller (hậu tố `Controller` được thêm tự động).
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* name - tên class <span class="badge text-bg-red">REQUIRED</span>
```shell
make:controller:plugin [<plugin>] [<name>]
make:controller:theme [<name>]
```
</div>

<div class="card-command">

#### ```make:provider:plugin``` / ```make:provider:theme```
Tạo Service Provider (hậu tố `ServiceProvider` được thêm tự động).
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* name - tên class <span class="badge text-bg-red">REQUIRED</span>
```shell
make:provider:plugin [<plugin>] [<name>]
make:provider:theme [<name>]
```

> Provider tạo ra vẫn phải khai vào `providers` trong `plugin.json` / `theme-child.json` thì mới được nạp.
</div>

<div class="card-command">

#### ```make:services:plugin``` / ```make:services:theme```
Tạo class Service (hậu tố `Service` được thêm tự động).
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* name - tên class <span class="badge text-bg-red">REQUIRED</span>
```shell
make:services:plugin [<plugin>] [<name>]
make:services:theme [<name>]
```
</div>

<div class="card-command">

#### ```make:supports:plugin``` / ```make:supports:theme```
Tạo class Support (helper dùng chung).
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* name - tên class <span class="badge text-bg-red">REQUIRED</span>
```shell
make:supports:plugin [<plugin>] [<name>]
make:supports:theme [<name>]
```
</div>

<div class="card-command">

#### ```make:macro:plugin``` / ```make:macro:theme```
Tạo file macro.
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* class - tên file macro <span class="badge text-bg-red">REQUIRED</span>
```shell
make:macro:plugin [<plugin>] [<class>]
make:macro:theme [<class>]
```

> `app/Macros` được **nạp theo file**, không qua PSR-4 — file macro không đặt namespace.
</div>

<div class="card-command">

#### ```make:middleware:plugin``` / ```make:middleware:theme```
Tạo middleware **và tự đăng ký alias** vào `middlewares.aliases` của `plugin.json` (bản `:plugin`) hoặc `theme-child.json` (bản `:theme`).
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* class - tên class middleware <span class="badge text-bg-red">REQUIRED</span>
```shell
make:middleware:plugin [<plugin>] [<class>]
make:middleware:theme [<class>]
```
</div>

<div class="card-command">

#### ```make:column:plugin``` / ```make:column:theme```
Tạo class column dùng cho bảng dữ liệu admin (`SKDObjectTable`).
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* class - tên class column <span class="badge text-bg-red">REQUIRED</span>
```shell
make:column:plugin [<plugin>] [<class>]
make:column:theme [<class>]
```
</div>

<div class="card-command">

#### ```make:form-field:plugin``` / ```make:form-field:theme```
Tạo class field cho Form **và tự đăng ký** vào `cms.form.fields` của `plugin.json` / `theme-child.json`.
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* class - tên class field <span class="badge text-bg-red">REQUIRED</span>
```shell
make:form-field:plugin [<plugin>] [<class>]
make:form-field:theme [<class>]
```
</div>

<div class="card-command">

#### ```make:popover:plugin``` / ```make:popover:theme```
Tạo class popover cho Form **và tự đăng ký** vào `cms.form.popover` của `plugin.json` / `theme-child.json`.
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* class - tên class popover <span class="badge text-bg-red">REQUIRED</span>
```shell
make:popover:plugin [<plugin>] [<class>]
make:popover:theme [<class>]
```
</div>

<div class="card-command">

#### ```make:lang:plugin``` / ```make:lang:theme```
Tạo file bản dịch cho **tất cả** ngôn ngữ đang bật.

* `:plugin` → `plugins/<plugin>/language/<locale>/<file>.php`
* `:theme` → `views/<theme-cha>/language/<locale>/<file>.php`

> **Chú ý:** `make:lang:theme` ghi vào **theme cha**, không phải theme con — `LanguageServiceProvider` chỉ nạp bản dịch từ theme cha.

> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* file - tên file bản dịch <span class="badge text-bg-red">REQUIRED</span>
```shell
make:lang:plugin [<plugin>] [<file>]
make:lang:theme [<file>]
```
</div>

### Make — Dữ liệu

<div class="card-command">

#### ```make:db:plugin``` / ```make:db:theme```
Tạo file migration.
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* file - tên file, mặc định `database` <span class="badge text-bg-success">Optional</span>
```shell
make:db:plugin [<plugin>] [<file=database>]
make:db:theme [<file=database>]
```
</div>

<div class="card-command">

#### ```make:model:plugin``` / ```make:model:theme```
Tạo class Model từ tên bảng.
> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* table - tên bảng dữ liệu <span class="badge text-bg-red">REQUIRED</span>
> **Options**
* --db - tạo kèm file migration trong `database/` <span class="badge text-bg-success">Optional</span>
```shell
make:model:plugin [<plugin>] [<table>] [--db]
make:model:theme [<table>] [--db]
```
```shell
make:model:theme books
make:model:theme books --db
```
</div>

<div class="card-command">

#### ```make:table```
Tạo class bảng dữ liệu admin trong `app/Modules/Admin/<class>.php`.
> **Arguments**
* table - tên bảng dữ liệu <span class="badge text-bg-red">REQUIRED</span>
* class - tên class table <span class="badge text-bg-red">REQUIRED</span>
> **Options**
* --plugin= - tạo trong plugin thay vì theme con <span class="badge text-bg-success">Optional</span>
```shell
make:table [<table>] [<class>] [--plugin=<plugin>]
```
</div>

<div class="card-command">

#### ```make:module:plugin``` / ```make:module:theme```
Tạo trọn bộ một module CRUD admin và **tự nối route** vào `routes/admin.php`:

```
app/Modules/Admin/<Module>/<Module>Table.php
app/Modules/Admin/<Module>/<Module>Form.php
app/Modules/Admin/<Module>/<Module>Service.php
app/Models/<Module>.php
app/Controllers/Admin/<Module>Controller.php
bootstrap/<module>.php
routes/admin-<module>.php
```

> **Arguments**
* plugin - *(chỉ bản `:plugin`)* tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
* module - tên module <span class="badge text-bg-red">REQUIRED</span>
* table - tên bảng dữ liệu <span class="badge text-bg-red">REQUIRED</span>
```shell
make:module:plugin [<plugin>] [<module>] [<table>]
make:module:theme [<module>] [<table>]
```
```shell
make:module:theme books books
```
</div>

<div class="card-command">

#### ```make:taxonomy```
Tạo Service đăng ký taxonomy kèm hook `add_action('init', …)` trong `bootstrap/`.
> **Arguments**
* postType - tên post type <span class="badge text-bg-red">REQUIRED</span>
* cateType - tên category type nếu có <span class="badge text-bg-success">Optional</span>
> **Options**
* --plugin= - tạo trong plugin thay vì theme con <span class="badge text-bg-success">Optional</span>
```shell
make:taxonomy [<postType>] [<cateType>?] [--plugin=<plugin>]
```
```shell
make:taxonomy services service_categories
```
</div>

### Make — Giao diện

<div class="card-command">

#### ```make:element```
Tạo class element cho Page Builder trong `views/<theme-child>/elements/<folder>/` **và tự đăng ký** vào `elements/elements.json`.
> **Arguments**
* folder - tên thư mục element (chỉ chữ, số, dấu `-`) <span class="badge text-bg-red">REQUIRED</span>
* class - tên class <span class="badge text-bg-success">Optional</span>
* file - tên file `.widget.php` <span class="badge text-bg-success">Optional</span>
> **Options**
* --type= - nhóm đăng ký: `general` (mặc định), `header`, `footer` <span class="badge text-bg-success">Optional</span>
```shell
make:element [<folder>] [<class>?] [<file>?] [--type=general]
```
```shell
make:element banner
make:element menu-top --type=header
```

> Element `header`/`footer` chỉ dùng được trong đúng phạm vi đó; `general` dùng được ở mọi nơi.
</div>

<div class="card-command">

#### ```make:widget```
Tạo class widget trong `views/<theme-cha>/widget/<folder>/` **và tự đăng ký** vào `widget/widget.json`.
> **Arguments**
* folder - tên thư mục widget <span class="badge text-bg-red">REQUIRED</span>
* class - tên class <span class="badge text-bg-success">Optional</span>
* file - tên file widget <span class="badge text-bg-success">Optional</span>
> **Options**
* --type= - nhóm đăng ký: `block` (mặc định), `footer` <span class="badge text-bg-success">Optional</span>
```shell
make:widget [<folder>] [<class>?] [<file>?] [--type=block]
```

> `widget/widget.json` **chỉ tồn tại ở theme cha** — không có bản theme con.
</div>

<div class="card-command">

#### ```make:widget:sidebar```
Tạo class widget cho sidebar trong `views/<theme-cha>/widget/sidebar/<type>/<folder>/` và đăng ký vào `widget/widget.json`.
> **Arguments**
* type - nhóm sidebar: `sidebar`, `sidebar-list`, `sidebar-detail` <span class="badge text-bg-red">REQUIRED</span>
* folder - tên thư mục widget <span class="badge text-bg-red">REQUIRED</span>
* class - tên class <span class="badge text-bg-success">Optional</span>
* file - tên file widget <span class="badge text-bg-success">Optional</span>
```shell
make:widget:sidebar [<type>] [<folder>] [<class>?] [<file>?]
```
</div>

---

## Những thay đổi so với v7

| Thay đổi | Chi tiết |
|---|---|
| **Đã gỡ `make:validate:plugin` / `make:validate:theme`** | v8 không mở rộng được custom validate rule (`RuleCollection` khởi tạo `ValidatorFactory` mới mỗi lần). Dùng `Rule::make('Label')->custom(fn($v) => …)` thay thế. |
| **Đường dẫn đổi hoàn toàn** | Các thư mục `theme-custom/`, `<theme>/core/`, `<theme>/Cms/`, `<plugin>/core/` **không còn tồn tại**. Code plugin nằm ở `plugins/<id>/app/`, code theme nằm ở `views/<theme-child>/app/`. |
| **Lõi không quét thư mục nữa** | Tạo class mà quên đăng ký vào registry (`elements.json`, `widget.json`, `plugin.json`, `theme-child.json`) thì class **không bao giờ được nạp**. Các lệnh `make:*` đã tự ghi registry giúp. |
| **Lệnh mới** | `builder:export`, `builder:import`, `make:element`, `make:controller:*`, `make:middleware:*`, `make:provider:*`, `make:services:*`, `make:supports:*`, `theme:child:copy`, `cache:lang`, `db:show`, `db:table`. |
| **Tên lệnh chuẩn hóa** | `make:ajax`, `make:model`, `make:module`, `make:taxonomy` nay tách rõ hai biến thể `:plugin` / `:theme` (riêng `make:table` và `make:taxonomy` dùng option `--plugin=`). |
