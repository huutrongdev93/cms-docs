### cle_dashboard_setup
Dùng đăng ký danh sách widget dashboard  

| **Loại Hook**                                    | **Platform** |                                   **Version** |
|--------------------------------------------------|:------------:|----------------------------------------------:|
| <span class="badge text-bg-red">do_action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

**Params**: không có  

```php
function my_dashboard_admin_widget(): void
{
    //register dashboard widget
}
add_action('cle_dashboard_setup', 'my_dashboard_admin_widget');
```
