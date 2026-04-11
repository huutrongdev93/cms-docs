# Tổng Quan

Sicommerce là một plugin hệ thống thương mại điện tử cốt lõi được xây dựng riêng cho **SkillDo CMS v8**, giúp nền tảng mở rộng các chức năng bán hàng một cách toàn diện. Được phát triển theo chuẩn PSR-4, Sicommerce tuân thủ hoàn toàn kiến trúc của CMS với sự phân lớp logic rõ ràng giữa Data Models, Services, Modules và User Interface.

---

## 1. Cấu trúc thư mục Plugin

```
plugins/sicommerce/
├── app/
│   ├── Cart/           # Scart – quản lý giỏ hàng theo Session
│   ├── Controllers/    # Web Controllers (ProductController, CheckoutController...)
│   ├── Gateway/
│   │   ├── Payment/    # Cổng thanh toán (AbstractPaymentBase, PaymentManager...)
│   │   └── Shipping/   # Cổng vận chuyển (AbstractShippingBase, ShippingManager...)
│   ├── helpers/        # Global helper functions
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
├── config/             # File cấu hình mặc định (general.php, order.php, product.php...)
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

- **Namespace gốc**: `Ecommerce\`
- **Tên plugin (constant)**: `ECOMMERCE_NAME` = `'sicommerce'`
- **Option config**: Lưu trong database table `options` với key `ecommerce_config`

```php
// Lấy config bằng helper
$value = Config::get('general.layout');    // \Ecommerce\Supports\Config
$value = config('sicommerce::general.layout'); // Laravel config helper
```

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
| `Prd`             | `Ecommerce\Supports\Prd`           | Helper tiện ích (giá, view, collection...) |
| `PrdCartHelper`   | `Ecommerce\Supports\PrdCartHelper` | Helper địa chỉ & hiển thị thuộc tính       |

**Ví dụ sử dụng:**
```php
// Không cần gọi \Ecommerce\Models\Product::...
$products = Product::where('public', 1)->get();

// Lấy danh mục
$categories = ProductCategory::tree()->get();

// Định dạng giá
echo Prd::price($product->price);
```

---

## 4. File Bootstrap – Nơi Đăng Ký Hook

Thư mục `bootstrap/` chứa các file PHP được load tự động khi plugin khởi động. Mỗi file phụ trách đăng ký hook cho một nhóm tính năng:

| File                      | Chức năng                                                   |
|:--------------------------|:------------------------------------------------------------|
| `config.php`              | Navigation, assets, breadcrumb, phân quyền, webhook         |
| `products.php`            | Hooks form sản phẩm (add/edit/trash/delete)                 |
| `order.php`               | Hooks đơn hàng (detail, add, status, email)                 |
| `customer.php`            | Hooks quản lý khách hàng (bảng, tab chi tiết, đơn hàng web) |
| `setting.php`             | Hooks cấu hình hệ thống Commerce                            |
| `history.php`             | Ghi log lịch sử đơn hàng                                    |
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
