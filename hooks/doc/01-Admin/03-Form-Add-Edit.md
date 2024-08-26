# Form, Add & Edit

#### Tùy chỉnh form add, edit
Nếu bạn muốn tùy chỉnh form add, edit của các module page, post, category, ... bạn dùng hooks này để điều chỉnh

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
do_action('manage_form_input', $module, $adminForm);
```

#### Tùy chỉnh object trang edit
Khi bạn edit page, post, ... sẽ có một đối tượng chứa data bạn có thể dùng hook `sets_field_before` để tùy chỉnh object này

| **Loại Hook**                                   | **Platform** |                                   **Version** |
|-------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
$object = apply_filters('sets_field_before', $object);
```

#### Hành động sau khi thêm mới
Sau khi thêm mới một page, post, category, products... thì hook `save_object_add` (hoặc `save_{module}_object_add`) sẽ được thự thi  
Tất cả module

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
do_action('save_object_add', $id, $module, request());
```
Chạy riêng cho từng module

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
do_action('save_{module}_object_add', $id, request());
```

#### Hành động sau khi cập nhật
Sau khi cập nhật một page, post, category, products... thì hook `save_object_edit` (hoặc `save_{module}_object_edit`) sẽ được thự thi  
Tất cả module

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
do_action('save_object_edit', $id, $module, request());
```
Chạy riêng cho từng module

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">7.0.0</span> |

```php
do_action('save_{module}_object_edit', $id, request());
```

#### Hành động sau khi thêm mới hoặc cập nhật

| **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

```php
do_action('save_object', $id, request());
```