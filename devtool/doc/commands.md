# Commands
Danh sách các lệnh được sử dụng trong plugin Devtool Skilldo CMS

### Cms
#### Lấy version hiện tại của cms
```php
cms:version
```
#### Lấy version mới nhất của cms
```php
cms:version last
```

#### Tạo file language cho javascript
```php
cms:lang:build js
```

#### Xóa toàn bộ file cache
```php
cache:clear
```

### Plugin
#### Lấy danh sách plugin
```php
plugin
```
hoặc 
```php
pl
```

#### Lấy thông tin plugin

```php
plugin <folder_name>
```

#### Tạo file cài đặt database
Khi chạy lệnh này cms sẽ tạo một file chứa code mẫu thao tác với database trong thư mục `database` của plugin `folder_plugin`,
file_database_name không bao gồm .php
```php
plugin:db:create <folder_plugin> <file_database_name>
```

#### Chạy file cài đặt database
Khi chạy lệnh này cms sẽ run file `file_database_name` chứa code thao tác với database trong thư mục `database` của plugin `folder_plugin`,
file_database_name không bao gồm .php
```php
plugin:db:run <folder_plugin> <file_database_name>
```

### Theme

#### Tạo file cài đặt database
Khi chạy lệnh này cms sẽ tạo một file chứa code mẫu thao tác với database trong thư mục `database` của theme hiện tại,
file_database_name không bao gồm .php
```php
theme:db:create <file_database_name>
```

#### Chạy file cài đặt database
Khi chạy lệnh này cms sẽ run file `file_database_name` chứa code thao tác với database trong thư mục `database` của theme hiện tại,
file_database_name không bao gồm .php
```php
theme:db:run <file_database_name>
```

#### Theme child
Khi chạy lệnh này cms sẽ copy thư mục hoặc file đưa vào thư mục `theme-child`
```php
theme:child:copy <path>
```

