# Tổng Quan

Sicommerce là một plugin hệ thống thương mại điện tử cốt lõi được xây dựng riêng cho **SkillDo CMS v8**, giúp nền tảng mở rộng các chức năng bán hàng một cách toàn diện. Được phát triển theo chuẩn PSR-4, Sicommerce tuân thủ hoàn toàn kiến trúc của CMS với sự phân lớp logic rõ ràng giữa Data Models, Services, Modules và User Interface.

---

## 1. Cấu trúc thư mục Plugin

```
plugins/sicommerce/
├── app/
│   ├── Ajax/           # Ajax handlers (đăng ký trong bootstrap/ajax.php)
│   ├── Cart/           # Cart (lõi) + Scart (facade tĩnh) + Driver/{Session,Database}
│   ├── Cms/            # Form field & popover riêng của plugin
│   ├── Controllers/    # Web Controllers (ProductController, CheckoutController...)
│   ├── Gateway/
│   │   ├── Payment/    # Cổng thanh toán (AbstractPaymentBase, PaymentManager...)
│   │   └── Shipping/   # Cổng vận chuyển (AbstractShippingBase, ShippingManager...)
│   ├── helpers/        # Global helper functions (nạp theo file, không PSR-4)
│   ├── Macros/         # Macro mở rộng (nạp theo file, không PSR-4)
│   ├── Models/         # Eloquent Models (Product, Order, Brands, Currencies...)
│   ├── Modules/
│   │   ├── Admin/      # Logic Admin (Products, Orders, Customer, Setting...)
│   │   └── Web/        # Logic Frontend (Checkout, AccountOrder...)
│   ├── Providers/      # ServiceProvider đăng ký aliases và config
│   ├── Services/       # Business Services (EmailService, OrderHistoryService...)
│   ├── Status/         # Enum trạng thái (OrderStatus, OrderPay)
│   ├── Supports/       # Các lớp tiện ích (Prd, Config, OrderHelper, PrdCartHelper...)
│   └── Template/       # Template render classes (ProductsDetail, ProductsIndex...)
├── bootstrap/          # File đăng ký Hook/Filter theo từng chức năng
├── config/             # File cấu hình mặc định (general, product, checkout, order)
├── database/           # Migration scripts
├── language/           # File dịch (en/, vi/)
├── routes/             # Route definitions (admin.php, api.php, web.php)
└── views/              # Blade views
```

Khi viết mã mở rộng cho Sicommerce, bạn sẽ chủ yếu tương tác với:
- **`app/Cart`**: Class `Scart` quản lý Giỏ hàng theo Session.
- **`app/Models`**: Eloquent Models (`Product`, `Order`, `ProductCategory`...).
- **`app/Gateway`**: Thành phần mở rộng cổng thanh toán và giao hàng.
- **`app/Modules/Admin`**: Modules quản lý Admin (sản phẩm, đơn hàng, cấu hình...).
- **`app/Modules/Web`**: Modules xử lý Frontend (checkout, account orders...).
- **`app/Template`**: Classes render giao diện Frontend thông qua Hook.
- **`bootstrap/`**: Files đăng ký action/filter hooks theo từng tính năng.

---

## 2. Namespace & Hằng Số

- **Namespace gốc**: `Ecommerce\` (**không phải** `Sicommerce`)
- **Class chính**: `Sicommerce` trong `index.php` (không namespace) — chỉ gọi `ActivatorService::activate()` / `DeactivatorService::uninstall()`
- **Hằng số** (khai trong `bootstrap/constants.php`): `ECOMMERCE_NAME` = `'sicommerce'`, `ECOMMERCE_PATH`, `URL_PRODUCT` = `'san-pham'`, các hằng trạng thái đơn `ORDER_WAIT` … `ORDER_CANCELLED`
- **Option config**: toàn bộ config override lưu trong **một** option duy nhất `ecommerce_config` (mảng lồng nhau) trong bảng `system`

```php
// Lấy config bằng helper
$value = Config::get('general.layout_products');        // \Ecommerce\Supports\Config
$value = config('sicommerce::general.layout_products'); // config helper của framework
```

Ngoài `ecommerce_config`, plugin còn dùng các option rời: `product_currency`, `product_price_contact`, `product_fulltext_search`, `attributeDisplay`, `payments` (cấu hình cổng thanh toán), `cart_shipping` (cấu hình vận chuyển), `admin_product_limit`.

---

## 3. Class Aliases (Facades)

ServiceProvider đã đăng ký sẵn danh sách Class Alias. Bạn có thể gọi trực tiếp không cần namespace đầy đủ.

| Alias             | Class Thực                         | Mô tả                                      |
|:------------------|:-----------------------------------|:-------------------------------------------|
| `Product`         | `Ecommerce\Models\Product`         | Model sản phẩm                             |
| `ProductCategory` | `Ecommerce\Models\ProductCategory` | Model danh mục sản phẩm                    |
| `Brands`          | `Ecommerce\Models\Brands`          | Model thương hiệu                          |
| `Currencies`      | `Ecommerce\Models\Currencies`      | Model tiền tệ                              |
| `Attributes`      | `Ecommerce\Models\Attributes`      | Model thuộc tính (Size, Color...)          |
| `AttributesItem`  | `Ecommerce\Models\AttributesItem`  | Model giá trị thuộc tính                   |
| `Variation`       | `Ecommerce\Models\Variation`       | Model sản phẩm biến thể                    |
| `Order`           | `Ecommerce\Models\Order`           | Model đơn hàng                             |
| `OrderItem`       | `Ecommerce\Models\OrderItem`       | Model dòng sản phẩm trong đơn              |
| `Scart`           | `Ecommerce\Cart\Scart`             | Lớp xử lý giỏ hàng                         |
| `ExtraTemplate`   | `Ecommerce\Models\ExtraTemplate`   | Model template Extra Options               |
| `ExtraGroup`      | `Ecommerce\Models\ExtraGroup`      | Model nhóm Extra Options                   |
| `ExtraItem`       | `Ecommerce\Models\ExtraItem`       | Model field Extra Options                  |
| `ExtraUpload`     | `Ecommerce\Models\ExtraUpload`     | Model file khách tải lên theo dòng đơn     |
| `Prd`             | `Ecommerce\Supports\Prd`           | Helper tiện ích (giá, view, collection...) |
| `PrdCartHelper`   | `Ecommerce\Supports\PrdCartHelper` | Helper địa chỉ & hiển thị thuộc tính       |

Ngoài ra còn alias legacy `Ecommerce\Model\*` → `Ecommerce\Models\*` (chú ý khác chữ **"s"**) cho `Product`, `ProductCategory`, `Brands`, `Currencies`.

> **KHÔNG có alias** — phải dùng namespace đầy đủ: `Collection`, `OrderHistory`, `Models\Session`, `Supports\Config`, `OrderHelper`, `EmailTemplate`, `CartLocation`, `Supports\Report`.

**Ví dụ sử dụng:**
```php
// Không cần gọi \Ecommerce\Models\Product::...
$products = Product::where('public', 1)->get();

// Lấy danh mục dạng cây — scope thực thi query ngay, KHÔNG chain ->get()
$categories = ProductCategory::tree();

// Định dạng giá
echo Prd::price($product->price);
```

---

## 4. File Bootstrap – Nơi Đăng Ký Hook

Thư mục `bootstrap/` chứa các file PHP được load tự động khi plugin khởi động. Mỗi file phụ trách đăng ký hook cho một nhóm tính năng:

| File                      | Chức năng                                                   |
|:--------------------------|:------------------------------------------------------------|
| `constants.php`           | Khai báo hằng số (`ECOMMERCE_PATH`, `URL_PRODUCT`, trạng thái đơn…) |
| `ajax.php`                | **Registry toàn bộ ajax endpoint** (`Ajax::admin()` / `Ajax::client()`) — tra file này để biết một ajax action trỏ đi đâu |
| `config.php`              | Navigation, assets, breadcrumb, phân quyền, webhook tỷ giá  |
| `products.php`            | Hooks form sản phẩm (add/edit/trash/delete), metabox, modal UI |
| `categories.php`          | Hooks CRUD danh mục sản phẩm                                |
| `brands.php`              | Hooks CRUD thương hiệu (chỉ đăng ký menu khi bật `general.brands`) |
| `collections.php`         | Hooks CRUD bộ sưu tập                                       |
| `attributes.php`          | Hooks CRUD thuộc tính                                       |
| `order.php`               | Hooks đơn hàng (detail, add, status, in đơn, email)         |
| `customer.php`            | Hooks quản lý khách hàng (bảng, tab chi tiết, đơn hàng web) |
| `setting.php`             | Hooks cấu hình hệ thống Commerce                            |
| `history.php`             | Ghi log lịch sử đơn hàng                                    |
| `extra-options.php`       | Wire `ExtraOptionsService` vào giỏ hàng / đơn hàng          |
| `template.php`            | Frontend chung: assets, biến CSS, layout resolver, breadcrumb, tìm kiếm |
| `template-index.php`      | Hooks trang danh sách sản phẩm                              |
| `template-detail.php`     | Hooks trang chi tiết sản phẩm                               |
| `template-object.php`     | Hooks khối sản phẩm (Product Item)                          |
| `template-cart.php`       | Hooks giỏ hàng sidebar                                      |
| `template-checkout.php`   | Hooks trang thanh toán                                      |
| `template-collection.php` | Hooks trang bộ sưu tập sản phẩm                             |

---

## 5. Cách thức mở rộng (Extensibility)

Để tùy chỉnh hoặc tích hợp thêm chức năng, **không được** sửa trực tiếp code trong thư mục plugin `sicommerce`. Thay vào đó:

1. **Plugin con**: Tạo plugin riêng và hook vào các Action/Filter của Sicommerce.
2. **Theme Override**: Đặt view override tại `views/theme-child/plugins/sicommerce/` để ghi đè Blade views.
3. **Gateway mới**: Tạo class kế thừa `AbstractPaymentBase`/`AbstractShippingBase` và đăng ký vào Manager.

Hãy tham khảo các trang tài liệu tiếp theo trong mục này để nắm rõ từng loại Hook, Models và quy trình viết cổng thanh toán/vận chuyển.
