### Trang danh sách thẻ (tag)

> Module Thẻ có từ phiên bản **8.1.3**. Xem tài liệu tính năng đầy đủ tại [Thẻ (Tag)](/8.0.0/doc/Cms/Tags).

#### Table columns
Chỉnh sửa danh sách cột của bảng thẻ

| Hooks                | **Loại Hook**                                   | **Platform** |                                   **Version** |
|----------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `manage_tag_columns` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

```php
$this->_column_headers = apply_filters('manage_tag_columns', array $columnHeaders);
```
**Params**:
* _$columnHeaders (array)_ : danh sách column

**Return**: $columnHeaders

#### Table columns action
Tạo ra danh sách buttons cho column action

| Hooks                            | **Loại Hook**                                   | **Platform** |                                   **Version** |
|----------------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_tag_table_columns_action` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

```php
$buttons = apply_filters('admin_tag_table_columns_action', array $buttons, $item);
```
**Params**:
* _$buttons (array)_ : danh sách button
* _$item (object)_ : đối tượng thẻ của dòng hiện tại

**Return**: $buttons

#### View trang danh sách

| Hooks                  | **Loại Hook**                                   | **Platform** |                                   **Version** |
|------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_tag_index_view` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

```php
return Cms::view(apply_filters('admin_tag_index_view', 'tag-index'));
```

---

### Thêm & Cập nhật thẻ

#### Form fields
Thay đổi các group, các field trong form thêm/sửa thẻ

| Hooks              | **Loại Hook**                                   | **Platform** |                                   **Version** |
|--------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `manage_tag_input` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

```php
return apply_filters('manage_tag_input', $form);
```
**Params**: `$form` — đối tượng Form

**Return**: `$form`

#### Điều kiện lấy thẻ ở trang sửa

| Hooks                             | **Loại Hook**                                   | **Platform** |                                   **Version** |
|-----------------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_tag_controllers_edit_args` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

```php
$query = apply_filters('admin_tag_controllers_edit_args', Tag::whereKey($id), $id);
```
**Params**:
* _$query (`SkillDo\Database\Eloquent\Builder`)_ : query lấy thẻ
* _$id (int)_ : id thẻ đang sửa

**Return**: `$query`

#### Đối tượng thẻ ở trang sửa

| Hooks                                | **Loại Hook**                                   | **Platform** |                                   **Version** |
|--------------------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_tag_controllers_edit_objects` | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

```php
$object = apply_filters('admin_tag_controllers_edit_objects', $query->first(), $id);
```

#### View trang thêm / sửa

| Hooks                  | **Loại Hook**                                   | **Platform** |                                   **Version** |
|------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `admin_tag_add_view`   | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |
| `admin_tag_edit_view`  | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

```php
return Cms::view(apply_filters('admin_tag_add_view', 'tag-save'));
return Cms::view(apply_filters('admin_tag_edit_view', 'tag-save'));
```

#### Cột dữ liệu của model Tag

| Hooks              | **Loại Hook**                                   | **Platform** |                                   **Version** |
|--------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `columns_db_tag`   | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

Dùng để bổ sung cột cho model `Tag`.

---

### Gắn thẻ vào nội dung

#### Bật/tắt thẻ cho một post type

| Hooks                     | **Loại Hook**                                   | **Platform** |                                   **Version** |
|---------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `tag_enabled_{tagType}`   | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

Hook **động** — tên hook ghép theo post type.

```php
$enabled = apply_filters('tag_enabled_'.$tagType, bool $enabled, string $tagType);
```

#### Danh sách thẻ của một đối tượng

| Hooks                  | **Loại Hook**                                   | **Platform** |                                   **Version** |
|------------------------|-------------------------------------------------|:------------:|----------------------------------------------:|
| `gets_tags_by_object`  | <span class="badge text-bg-green">filter</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

```php
return apply_filters('gets_tags_by_object', $query->get(), clone $query);
```

#### Sau khi đồng bộ thẻ

| Hooks         | **Loại Hook**                                 | **Platform** |                                   **Version** |
|---------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `tag_synced`  | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">8.1.3</span> |

```php
do_action('tag_synced', $objectId, $objectType, $tagIds);
```
**Params**:
* _$objectId (int)_ : id nội dung
* _$objectType (string)_ : loại đối tượng (thường là `post`)
* _$tagIds (array)_ : danh sách id thẻ sau khi đồng bộ

---

### Trang lưu trữ theo thẻ (frontend)

| Hooks                            | **Loại Hook**                                   | Mô tả                                        |
|----------------------------------|-------------------------------------------------|-----------------------------------------------|
| `tag_controllers_index_tag`      | <span class="badge text-bg-green">filter</span> | Đối tượng thẻ của trang lưu trữ               |
| `tag_controllers_index_args`     | <span class="badge text-bg-green">filter</span> | Query bài viết (`$query`, `$tag`)             |
| `tag_controllers_index_count`    | <span class="badge text-bg-green">filter</span> | Tổng số bài viết dùng để phân trang           |
| `tag_controllers_index_paging`   | <span class="badge text-bg-green">filter</span> | Đối tượng phân trang                          |
| `tag_controllers_index_params`   | <span class="badge text-bg-green">filter</span> | Query sau khi áp limit / offset / order       |
| `tag_controllers_index_objects`  | <span class="badge text-bg-green">filter</span> | Danh sách bài viết trả về                     |
