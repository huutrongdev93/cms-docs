# Route
Tùy chỉnh route nằm trong các file

**Route cms**
* `routes/web.php` : Các tuyến dựa trên HTTP mặc định
* `routes/api.php` : Các tuyến ajax, api

**Route theme**
* `views/<theme-current>/routes/web.php` : Các tuyến dựa trên HTTP mặc định
* `views/<theme-current>/routes/api.php` : Các tuyến ajax, api

**Route plugin**
* `views/plugins/<plugin-current>/routes/web.php` : Các tuyến dựa trên HTTP mặc định
* `views/plugins/<plugin-current>/routes/api.php` : Các tuyến ajax, api

Để thêm các route, hãy sử dụng các phương thức tĩnh của lớp Route:


### Sử dụng:
```php
<?php
# routes/web.php

// This points to 'baz' method of 'bar' controller at '/foo' path under a GET request:
Route::get('foo', 'bar@baz')->name('foo.bar.baz');

// To add a route parameter, enclose with curly brackets {}
Route::get('blog/{slug}', 'blog@post')->name('blog.post.index');

// To make a parameter optional, add a ? just before closing the curly brackets
Route::get('categories/{primary?}/{secondary?}/{filter?}', 'clients@list')->name('clients.list');

// The (:any) and (:num) CodeIgniter route placeholders are available to use, with this syntax:
Route::get('cars/{num:id}/{any:registration}', 'CarCatalog@index')->name('CarCatalog.index');
```

Bạn có thể xác định các route cho các method GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS và TRACE bằng các phương thức sau của lớp Route:

```php
Route::post('foo', 'bar@baz');
Route::put('foo', 'bar@baz');
Route::patch('foo', 'bar@baz');
Route::delete('foo', 'bar@baz');
Route::head('foo', 'bar@baz');
Route::options('foo', 'bar@baz');
Route::trace('foo', 'bar@baz');
```

Bạn có thể truyền một mảng với các thuộc tính tuyến đường làm đối số thứ ba:

```php
Route::get('test', 'controller@method', ['prefix' => '...', 'namespace' => '...', (...)] );
```

Bạn cũng có thể chấp nhận nhiều method HTTP trong một route bằng cách sử dụng phương thức `Route::match()` :

```php
Route::match(['GET', 'POST'], 'path', 'controller@method', [ (...) ]);
```
### Name
Thêm prefix cho tên các route trong một nhóm
```php
Route::name('books.')->group(function () {
    Route::get('books', 'books@index', ['namespace' => 'frontend'])->name('index'); //name is books.index
    Route::get('books/add', 'books@add', ['namespace' => 'frontend'])->name('add'); //name is books.add
    Route::get('books/edit/{id}', 'books@edit', ['namespace' => 'frontend'])->name('edit'); //name is books.edit
});
```
### Prefix
Thêm prefix cho đường dẫn các route trong một nhóm
```php
Route::prefix('books')->group(function () {
    Route::get('/', 'books@index', ['namespace' => 'frontend'])->name('books.index');
    Route::get('add', 'books@add', ['namespace' => 'frontend'])->name('books.add');
    Route::get('edit/{id}', 'books@edit', ['namespace' => 'frontend'])->name('books.edit');
});
```
### Namespaces

Thuộc tính **Namespaces** tên cho CMS biết **thư mục** con chứa controller:

```php
Route::get('hello/world', 'bar@index', ['namespace' => 'admin']);
```

### Groups

Sử dụng phương thức `Route::group($prefix,$routes)` để xác định một nhóm các route, trong đó $prefix là tiền tố và $routes là một hàm ẩn danh chứa các route phụ:

```php
Route::group('my_prefix', function(){
    Route::get('bar','test@bar')->name('bar');
    Route::get('baz','test@baz')->name('baz');
});
```

### Anonymous functions as routes

Không cần thiết phải cung cấp controller/method để xác định route. Bạn có thể sử dụng các function ẩn danh (hoặc closures) làm controllers:
```php
Route::get('foo', function(){
    echo 'hello';
});
```