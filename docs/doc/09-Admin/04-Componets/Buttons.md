# Button

Để sử dụng component button bạn sử dụng

```php
Admin::button($template, $attributes)
```
Các loại template button
- add
- save
- edit
- back
- trash
- delete
- reload
- white
- blue
- red
- green
- black

Danh sách attributes:

| Key     |     Type      |                                                     Description |
|---------|:-------------:|----------------------------------------------------------------:|
| class   | string, array |                                     chuổi class hoặc mãng class |
| text    |    string     |                                      text hiển thị trong button |
| icon    |    string     |                                                 icon của button |
| modal   |    string     |                                      id của model cần hiênt thị |
| tooltip |    string     |                                              tooltip của button |
| type    |    string     |                         button hoặc submit (mặc định là button) |
| href    |    string     | nếu truyền href comp sẽ là tab `a` nếu không sẽ là tag `button` |
| style   |     array     |                                    mãng các attrbiute tùy chỉnh |

```php
$button = Admin::button('red', ['text' => 'Xóa', 'icon' => Admin::icon('delete')]);
```