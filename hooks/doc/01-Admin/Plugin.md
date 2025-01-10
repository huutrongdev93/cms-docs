### Plugin

#### Kích hoạt plugin
Hook được kích hoạt khi một plugin hoàn thành quá trình active

| **Loại Hook**                                    | **Platform** |                                   **Version** |
|--------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">do_action</span> |     cms      | <span class="badge text-bg-cyan">7.4.1</span> |

```php
do_action('plugin_active', string $name)
```
**Params**: $name tên plugin active

#### Tắt Kích hoạt plugin

Hook được kích hoạt khi một plugin hoàn thành quá trình deactivate

| **Loại Hook**                                    | **Platform** |                                   **Version** |
|--------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">do_action</span> |     cms      | <span class="badge text-bg-cyan">7.4.1</span> |

```php
do_action('plugin_deactivate', string $name)
```
**Params**: $name tên plugin active

#### Câp nhật plugin

Hook được kích hoạt khi một plugin hoàn thành quá trình upgrade

| **Loại Hook**                                    | **Platform** |                                   **Version** |
|--------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">do_action</span> |     cms      | <span class="badge text-bg-cyan">7.4.1</span> |

```php
do_action('plugin_update', string $name)
```
**Params**: $name tên plugin active

#### Xóa plugin

Hook được kích hoạt khi một plugin hoàn thành quá trình remove

| **Loại Hook**                                    | **Platform** |                                   **Version** |
|--------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">do_action</span> |     cms      | <span class="badge text-bg-cyan">7.4.1</span> |

```php
do_action('plugin_delete', string $name)
```
**Params**: $name tên plugin active
