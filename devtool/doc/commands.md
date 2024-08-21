# Commands
Danh sách các lệnh được sử dụng trong plugin Devtool Skilldo CMS
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
<span class="badge text-bg-pink">v.1.0.6</span> Xóa tất cả file cache của bản dịch ngôn ngữ
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
* type - loại lấy version (current ```default```, last) <span class="badge text-bg-success">Optional</span>
```shell
cms:version [<type>]
```

</div>

### Db

<div class="card-command">

#### ```db:empty```
empty table, views, hoặc types được chỉ định
> **Arguments**
* table_name -  tên table muốn empty <span class="badge text-bg-red">REQUIRED</span>
```shell
db:empty [<table_name>]
```

</div>

<div class="card-command">

#### ```db:run:plugin```
Thực thi file migration của một plugin được chỉ định
> **Arguments**
* plugin_name -  tên thư mục plugin muốn chạy migration <span class="badge text-bg-red">REQUIRED</span>
* file_name -  tên file migration muốn chạy <span class="badge text-bg-success">optional</span>
```shell
db:run:plugin [<plugin_name>] [<file_name>]
```

</div>

<div class="card-command">

#### ```db:run:theme```
Thực thi file migration của theme hiện tại
> **Arguments**
* file_name -  tên file migration muốn chạy <span class="badge text-bg-success">optional</span>
```shell
db:run:plugin [<file_name>]
```

</div>

<div class="card-command">

#### ```db:show```
Hiển thị thông tin cơ sở dữ liệu
```shell
db:show
```

</div>

<div class="card-command">

#### ```db:table```
Hiển thị thông tin của một bảng trong cơ sở dữ liệu
> **Arguments**
* table_name -  tên table muốn xem thông tin <span class="badge text-bg-red">REQUIRED</span>
```shell
db:table [<table_name>]
```

</div>


<div class="card-command">

#### ```db:seed```
Tạo dữ liệu mẫu
> **Options**
* module -  tên module muốn tạo dữ liệu (hiện tại chỉ hỗ trợ post) <span class="badge text-bg-red">REQUIRED</span>
> **Arguments**
* number -  số lượng dữ liệu muốn tạo nhỏ nhất 1 và lớn nhất là 50 (mặc định 10) <span class="badge text-bg-success">optional</span>
```shell
db:seed [--module=] [<number>]
```

</div>

### Lang
<div class="card-command">

#### ```lang:build```
Build file json language từ plugin và theme
```shell
lang:build
```

</div>

### Make
<div class="card-command">

#### ```make:command```
Tạo lệnh Devtool mới
> **Arguments**
* name -  tên class của command <span class="badge text-bg-red">REQUIRED</span>
```shell
make:command [<name>]
```

</div>

<div class="card-command">

#### ```make:db:plugin```
Tạo file migration cho một plugin được chỉ định.  
File được tạo nằm trong thư mục ```views/plugins/[plugin_name]/database```
> **Arguments**
* plugin_name -  tên thư mục plugin muốn tạo migration <span class="badge text-bg-red">REQUIRED</span>
* file_name -  tên file migration muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:db:plugin [<plugin_name>] [<file_name>]
```

</div>

<div class="card-command">

#### ```make:db:theme```
Tạo file migration cho theme hiện tại  
File được tạo nằm trong thư mục ```views/[theme]/database```
> **Arguments**
* file_name -  tên file migration muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:db:theme [<file_name>]
```

</div>

<div class="card-command">

#### ```make:form-field:plugin```
Tạo field mới cho một plugin được chỉ định  
File được tạo nằm trong thư mục ```views/plugins/[plugin_name]/core/Form/Field```
> **Arguments**
* plugin_name -  tên thư mục plugin muốn tạo field <span class="badge text-bg-red">REQUIRED</span>
* file_name -  tên class field muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:form-field:plugin [<plugin_name>] [<file_name>]
```

</div>

<div class="card-command">

#### ```make:form-field:theme```
Tạo field mới cho theme hiện tại  
File được tạo nằm trong thư mục ```views/[theme]/core/Form/Field```
> **Arguments**
* file_name -  tên class field muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:form-field:theme [<file_name>]
```

</div>

<div class="card-command">

#### ```make:lang:plugin```
Tạo bản dịch cho một plugin được chỉ định  
File được tạo nằm trong thư mục ```views/plugins/[plugin_name]/language/[local]```

> **Arguments**
* plugin_name -  tên thư mục plugin muốn tạo bản dịch <span class="badge text-bg-red">REQUIRED</span>
* file_name -  tên file bản dịch muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:lang:plugin [<plugin_name>] [<file_name>]
```

</div>

<div class="card-command">

#### ```make:lang:theme```
Tạo bản dịch cho theme hiện tại  
File được tạo nằm trong thư mục ```views/[theme]/language/[local]```

> **Arguments**
* file_name -  tên file bản dịch muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:lang:theme [<file_name>]
```

</div>

<div class="card-command">

#### ```make:macro:plugin```
Tạo file macro cho một plugin được chỉ định  
File được tạo nằm trong thư mục ```views/plugins/[plugin_name]/core/Macro```
> **Arguments**
* plugin_name -  tên thư mục plugin muốn tạo macro <span class="badge text-bg-red">REQUIRED</span>
* file_name -  tên file macro muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:macro:plugin [<plugin_name>] [<file_name>]
```

</div>

<div class="card-command">

#### ```make:macro:theme```
Tạo file macro cho theme hiện tại  
File được tạo nằm trong thư mục ```views/[theme]/core/Macro```

> **Arguments**
* file_name -  tên file macro muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:macro:theme [<file_name>]
```

</div>

<div class="card-command">

#### ```make:popover:plugin```
Tạo popover cho một plugin được chỉ định  
File được tạo nằm trong thư mục ```views/plugins/[plugin_name]/core/Form/Popover```
> **Arguments**
* plugin_name -  tên thư mục plugin muốn tạo popover <span class="badge text-bg-red">REQUIRED</span>
* file_name -  tên class popover muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:popover:plugin [<plugin_name>] [<file_name>]
```

</div>

<div class="card-command">

#### ```make:popover:theme```
Tạo popover cho theme hiện tại  
File được tạo nằm trong thư mục ```views/[theme]/core/Form/Popover```

> **Arguments**
* file_name -  tên class popover muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:popover:theme [<file_name>]
```

</div>

<div class="card-command">

#### ```make:validate:plugin```
Tạo validate rule cho một plugin được chỉ định  
File được tạo nằm trong thư mục ```views/plugins/[plugin_name]/core/Validate```

> **Arguments**
* plugin_name -  tên thư mục plugin muốn tạo validate <span class="badge text-bg-red">REQUIRED</span>
* file_name -  tên class validate muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:validate:plugin [<plugin_name>] [<file_name>]
```
</div>

<div class="card-command">

#### ```make:validate:theme```
Tạo validate rule cho theme hiện tại  
File được tạo nằm trong thư mục ```views/[theme]/core/Validate```

> **Arguments**
* file_name -  tên class validate muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:validate:theme [<file_name>]
```
</div>

<div class="card-command">

#### ```make:column:plugin```
<span class="badge text-bg-pink">v.1.0.2</span> Tạo table column cho một plugin được chỉ định  
File được tạo nằm trong thư mục ```views/plugins/[plugin_name]/core/Table/Columns```

> **Arguments**
* plugin_name -  tên thư mục plugin muốn tạo validate <span class="badge text-bg-red">REQUIRED</span>
* file_name -  tên class column muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:column:plugin [<plugin_name>] [<file_name>]
```
</div>

<div class="card-command">

#### ```make:column:theme```
<span class="badge text-bg-pink">v.1.0.2</span> Tạo table column cho theme hiện tại  
File được tạo nằm trong thư mục ```views/[theme]/core/Table/Columns```

> **Arguments**
* file_name -  tên class column muốn tạo <span class="badge text-bg-red">REQUIRED</span>
```shell
make:column:theme [<file_name>]
```
</div>

<div class="card-command">

#### ```make:plugin```
Tạo cấu trúc thư mục cơ bản cho plugin
> **Arguments**
* plugin_name -  tên thư mục plugin <span class="badge text-bg-red">REQUIRED</span>
```shell
make:plugin [<plugin_name>]
```

</div>

<div class="card-command">

#### ```make:widget```
Tạo cấu trúc cho một widget mới

> **Arguments**
* folder -  tên thư mục widget (about, items, slider...) <span class="badge text-bg-red">REQUIRED</span>
* class? -  tên class widget <span class="badge text-bg-success">OPTIONAL</span>
* file? -  tên file widget <span class="badge text-bg-success">OPTIONAL</span>

```shell
make:widget [<folder>] [<class>] [<file>]
```
</div>

<div class="card-command">

#### ```make:widget:sidebar```
Tạo cấu trúc cho một widget sidebar
> **Arguments**
* type - Loại widget sidebar (sidebar, list, detail) <span class="badge text-bg-red">REQUIRED</span>
* folder -  tên thư mục widget sidebar (about, items, slider...) <span class="badge text-bg-red">REQUIRED</span>
* class? -  tên class widget sidebar <span class="badge text-bg-success">OPTIONAL</span>
* file? -  tên file widget sidebar <span class="badge text-bg-success">OPTIONAL</span>

```shell
make:widget:sidebar [<type>] [<folder>] [<class>] [<file>]
```
</div>


<div class="card-command">

#### ```make::taxonomy```
<span class="badge text-bg-pink">v.1.0.3</span> Tạo cấu trúc cho một taxonomy  
File được tạo nằm trong thư mục ```views/[theme]/theme-custom/taxonomies```
> **Arguments**
* post_type - Tên post type <span class="badge text-bg-red">REQUIRED</span>
* cate_type? - Tên cate type nếu có <span class="badge text-bg-success">OPTIONAL</span>

```shell
make:taxonomy [<post_type>] [<cate_type>?]
```
</div>

<div class="card-command">

#### ```make::ajax```
<span class="badge text-bg-pink">v.1.0.3</span> Tạo cấu trúc cho một ajax  
File được tạo nằm trong thư mục ```views/[theme]/theme-custom/ajax```
> **Arguments**
* file - Tên file ajax <span class="badge text-bg-red">REQUIRED</span>

```shell
make:ajax [<file>]
```
</div>


<div class="card-command">

#### ```make::table```
<span class="badge text-bg-pink">v.1.0.4</span> Tạo cấu trúc cho một table  
File được tạo nằm trong thư mục ```views/[theme]/theme-custom/table```
> **Arguments**
* file - Tên file table <span class="badge text-bg-red">REQUIRED</span>
* class - Tên class table <span class="badge text-bg-red">REQUIRED</span>

```shell
make:table [<file>] [<class>]
```
</div>


<div class="card-command">

#### ```make::model```
<span class="badge text-bg-pink">v.1.0.4</span> Tạo cấu trúc cho một model  
File được tạo nằm trong thư mục ```views/[theme]/theme-custom/model```
> **Options**
* --db - Điền tùy chọn này nếu muốn tạo kèm file database <span class="badge text-bg-green">Optional</span>
* 
> **Arguments**
* file - Tên file model <span class="badge text-bg-red">REQUIRED</span>

```shell
make:model [<file>] [--db]
```
</div>

<div class="card-command">

#### ```make::module```
<span class="badge text-bg-pink">v.1.0.5</span> Tạo cấu trúc cho một module  
File được tạo nằm trong thư mục ```views/[theme]/theme-custom/modules```
> **Arguments**
* module - Tên file module <span class="badge text-bg-red">REQUIRED</span>
* model - Tên class model <span class="badge text-bg-red">REQUIRED</span>
* table - Tên table model <span class="badge text-bg-red">REQUIRED</span>

```shell
make:module [<module>] [<model>] [<table>]
```
</div>

### Plugin
<div class="card-command">

#### ```plugin```
Lấy danh sách plugin hiện có hoặc chi tiết một plugin
> **Arguments**
* plugin_name? - Tên plugin muốn xem chi tiết <span class="badge text-bg-success">OPTIONAL</span>

```shell
plugin [<plugin_name>]
```
</div>

<div class="card-command">

#### ```plugin:activate```
Kích hoạt plugin
> **Arguments**
* plugin_name - Tên plugin muốn kích hoạt <span class="badge text-bg-red">REQUIRED</span>

```shell
plugin:activate [<plugin_name>]
```
</div>

<div class="card-command">

#### ```plugin:deactivate```
Dừng kích hoạt plugin

> **Arguments**
* plugin_name - Tên plugin muốn dừng kích hoạt <span class="badge text-bg-red">REQUIRED</span>

```shell
plugin:deactivate [<plugin_name>]
```
</div>

### Theme

<div class="card-command">

#### ```Theme:child:copy```
Khi chạy lệnh này cms sẽ copy thư mục hoặc file đưa vào thư mục `theme-child`

> **Arguments**
* path - đường dẫn đến thư mục hoặc file muốn copy <span class="badge text-bg-red">REQUIRED</span>

```shell
theme:child:copy [<path>]
```

</div>

