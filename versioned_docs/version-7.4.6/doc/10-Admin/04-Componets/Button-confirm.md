# Button Confirm
Button Confirm là button khi người dùng click vào button sẽ hiển thị một popup xác nhận lại hành động của người dùng.

### Confirm
Để sử dụng component button confirm bạn sử dụng
```php
Admin::btnConfirm($template, $attributes)
```
* $template : Các loại template button bạn tham khảo ở component button
* $attributes :
> Các attribute dành cho việc hiển thị button

  | Key     |     Type      |                                                     Description |
  |---------|:-------------:|----------------------------------------------------------------:|
  | class   | string, array |                                     chuổi class hoặc mãng class |
  | text    |    string     |                                      text hiển thị trong button |
  | icon    |    string     |                                                 icon của button |
  | tooltip |    string     |                                              tooltip của button |
  | style   |     array     |                                    mãng các attrbiute tùy chỉnh |

> Các attribute dành cho việc xử lý confirm

| Key         |  Type  |                                             Description |
  |-------------|:------:|--------------------------------------------------------:|
| model       | string |                                             Model xử lý |
| ajax        | string | ajax sẽ được gọi khi button confirm xác nhận được click |
| action      | string |                         Hành động delete, edit, restore |
| heading     | string |                              Tiêu đề của popup xác nhận |
| description | string |                                Mô tả của popup xác nhận |
| trash       |  bool  |           Nếu true popup sẽ hiển thị tùy chọn thùng rác |
| id          |  int   |                                   Id đối tượng thao tác |

* **Lưu ý:**  
- khi gửi ajax các params sẽ được gửi kèm bao gồm model, trash, id  
- Khi action bằng delete, edit, restore và icon không được truyền vào thì sẽ tự động lấy icon tương ứng
- Khi action bằng delete sau khi ajax hoàn thành sẽ nhận về response.data chứa danh sách id thì các dom có class `.js-confirm-delete-wrapper[data-id="${id}"]` sẽ bị xóa

### Delete
Cms cung cấp function tạo nhanh button delete
```php
Admin::btnDelete($attributes)
```
> Các giá trị attribute mặc định sẽ được tạo

| Key         |               Giá trị                | Tùy chỉnh |
|-------------|:------------------------------------:|----------:|
| template    |                 red                  |     Không |
| ajax        |       Cms_Ajax_Action::delete        |     Không |
| action      |                delete                |     không |
| heading     |             Xóa Dữ liệu              |        có |
| description | Bạn chắc chắn muốn xóa dữ liệu này ? |        có |

Model của bạn phải có method Model::delete và Model::trash (nếu bạn có sử dụng trash)

### Restore
Cms cung cấp function tạo nhanh button restore chuyển đối tượng ra khỏi thùng rác
```php
Admin::btnRestore($attributes)
```
> Các giá trị attribute mặc định sẽ được tạo

| Key         |                  Giá trị                   | Tùy chỉnh |
|-------------|:------------------------------------------:|----------:|
| template    |                   green                    |     Không |
| ajax        |          Cms_Ajax_Action::restore          |     Không |
| action      |                  restore                   |     không |
| heading     |             Khôi Phục Dữ liệu              |        có |
| description | Bạn chắc chắn muốn khôi phục dữ liệu này ? |        có |