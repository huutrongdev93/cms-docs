#### Đăng ký widget dashboard

| Hook                  | **Loại Hook**                                 | **Platform** |                                   **Version** |
|-----------------------|-----------------------------------------------|:------------:|----------------------------------------------:|
| `cle_dashboard_setup` | <span class="badge text-bg-red">action</span> |     cms      | <span class="badge text-bg-cyan">3.0.0</span> |

**Params**: không có  

```php
function my_dashboard_admin_widget(): void
{
    //register dashboard widget
}
add_action('cle_dashboard_setup', 'my_dashboard_admin_widget');
```
