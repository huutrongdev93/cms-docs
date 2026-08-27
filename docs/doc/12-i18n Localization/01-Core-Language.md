# Hệ Thống Ngôn Ngữ

Hệ thống SkillDo CMS v8 được xây dựng ngay từ đầu với khả năng hỗ trợ **Đa Ngôn Ngữ (Internationalization - i18n)**. Hệ thống quản lý các tệp ngôn ngữ cực kỳ chặt chẽ dựa trên các **Namespace** để phân biệt rõ ràng ngôn ngữ của Core, Theme, Plugin hay Admin.

Bản chất của i18n trong SkillDo là việc truy xuất các file Mảng (Array) PHP chứa văn bản, dựa theo Ngôn ngữ hiện tại đang được kích hoạt (locale).

---

## 1. Cơ chế hoạt động của hàm `trans()` 

Thay vì sử dụng các hàm cũ của Framework khác, trong SkillDo v8, **toàn bộ hệ thống đều sử dụng hàm `trans()`** để gọi các key ngôn ngữ.

Cú pháp chuẩn: `trans('namespace::tên-file.từ-khóa', $parameters)`

Hệ thống v8 phân rã cấu trúc tệp dịch thuật thành **5 kiểu Namespace (Khu vực)** như sau:

| Loại (Namespace) | Cách gọi hàm trans() | Mục đích sử dụng |
|---|---|---|
| **1. Global** (Mặc định) | `trans('file.key')` | Dành cho các từ khóa gốc của Framework nằm ở thư mục `sourcev8/language/` (Không có prefix namespace) |
| **2. Plugin** | `trans('tên-plugin::file.key')` | Dành cho ngôn ngữ nội bộ của từng Plugin sinh ra. VD: `trans('skd-seo::admin.title')` |
| **3. Admin** | `trans('admin::file.key')` | Dành riêng cho khu vực giao diện Quản trị Backend. |
| **4. Theme** | `trans('theme::file.key')` | Dành riêng cho giao diện Frontend của Theme đang kích hoạt. VD: `trans('theme::home.welcome')` |
| **5. Element** | `trans('tên-element::file.key')`| Dành cho nội dung của giao diện cấu hình Page Builder Element. VD: `trans('auth-button::style.color')` |

---

## 2. Thư mục chứa File Ngôn Ngữ Không Gian Global (Core CMS)

Mọi tệp ngôn ngữ cốt lõi của **Framework Core** (Global) đều được đặt cứng tại thư mục gốc của dự án:
```text
<gốc dự án>/
└── language/
    ├── vi/
    │   ├── ajax.php          // Thông báo trả về từ ajax
    │   ├── alert.php         // Nhãn mức độ thông báo (lỗi, cảnh báo, hoàn thành…)
    │   ├── auth.php          // Đăng nhập / đăng ký / quên mật khẩu
    │   ├── button.php        // Chữ trên các nút
    │   ├── field.php         // Nhãn trường nhập liệu
    │   ├── form.php          // Thông báo của form
    │   ├── general.php       // Từ vựng dùng chung (điện thoại, địa chỉ, lưu…)
    │   ├── lang-js.php       // Chuỗi đẩy xuống JavaScript
    │   ├── table.php         // Bảng dữ liệu admin
    │   └── validation.php    // Lỗi validate form
    └── en/
        └── … (cùng danh sách file)
```

Mỗi file ngôn ngữ trả về một mảng:
`language/vi/alert.php`
```php
<?php
return [
    'danger'  => 'Có lỗi',
    'error'   => 'Có lỗi',
    'warning' => 'Cảnh báo',
    'info'    => 'Thông tin',
    'success' => 'Hoàn thành',
];
```

---

## 3. Cách Sử Dụng Ngôn Ngữ Trong Code

### Mọi nơi đều dùng `trans()`

```php
// 1. Gọi ở dạng Root Global (Không có '::')
echo trans('alert.success');
// Trả về: Hoàn thành (nếu đang là vi)

echo trans('general.phone');
// Trả về: Điện thoại

// 2. Gọi dạng Admin Namespace
echo trans('admin::form.button_save');

// 3. Fallback: Nếu không tìm thấy file hoặc key, hàm trans() trả về ĐÚNG CÁI CHUỖI NHẬN VÀO để nhắc lập trình viên.
echo trans('auth.not_found'); 
// Trả về string tệp Text: "auth.not_found"
```

### Thay thế tham số động (Placeholders)

Hệ thống Core Language cung cấp sức mạnh truyền biến vào chuỗi. Chú ý trong chuỗi gốc dùng `:name` để đánh dấu tham số.

Trong tệp ngôn ngữ (vd `mail.php`):
```php
return [
    'welcome' => 'Xin chào :name, mừng bạn đến với hệ thống CMS v8.',
];
```

Trong Controllers:
```php
// Gửi một mảng làm đối số thứ 2
echo trans('mail.welcome', ['name' => 'Hữu Trọng']);
// Kết quả: Xin chào Hữu Trọng, mừng bạn đến với hệ thống CMS v8.
```

---

## 4. Một namespace, nhiều thư mục — cơ chế Merge

Một namespace **không bị giới hạn ở một thư mục**. `Translation::addNamespace()` **chồng thêm** thư mục chứ không thay thế: gọi lại cùng một namespace với thư mục khác là thêm một tầng mới, và **thư mục đăng ký sau có độ ưu tiên cao hơn**.

Khi hai thư mục cùng có file trùng tên (ví dụ cả hai đều có `vi/contact.php`), hệ thống **không** lấy file này thay cho file kia. Hai mảng được **trộn theo từng key**:

- Key chỉ có ở tầng dưới → **giữ nguyên**.
- Key có ở cả hai tầng → **lấy giá trị của tầng trên** (đăng ký sau).
- Key mới của tầng trên → **bổ sung thêm**.

Nhờ vậy tầng ghi đè chỉ cần khai đúng những chuỗi muốn sửa, không phải chép lại nguyên file.

### Quy tắc trộn chi tiết

| Kiểu giá trị | Cách xử lý |
|---|---|
| Chuỗi / số | Tầng trên thay tầng dưới |
| Mảng khoá chuỗi (nhóm key lồng nhau) | Trộn **đệ quy** theo từng key |
| Mảng danh sách (`['t1', 't2', 't3']`) | Thay **nguyên cụm**, không trộn theo chỉ số |

Mảng danh sách bị thay nguyên cụm là chủ ý: nếu trộn theo chỉ số thì `'months' => [12 phần tử]` ở tầng dưới mà tầng trên khai lại 3 phần tử sẽ còn dính 9 phần tử cũ ở đuôi.

Ví dụ — tầng dưới:
```php
return [
    'heading'   => 'Thông tin liên hệ',
    'form.name' => 'Họ tên của bạn',
    'nested'    => ['x' => 'giữ', 'y' => 'sẽ bị đè'],
];
```

Tầng trên:
```php
return [
    'form.name' => 'Tên đầy đủ',
    'extra'     => 'Chuỗi mới',
    'nested'    => ['y' => 'giá trị mới'],
];
```

Kết quả `trans()` đọc được:
```php
trans('...heading');    // 'Thông tin liên hệ'   (giữ của tầng dưới)
trans('...form.name');  // 'Tên đầy đủ'          (tầng trên thắng)
trans('...extra');      // 'Chuỗi mới'           (bổ sung)
trans('...nested.x');   // 'giữ'                 (không đụng tới)
trans('...nested.y');   // 'giá trị mới'         (trộn đệ quy)
```

### Nơi cơ chế này đang được dùng

| Namespace | Các tầng, theo thứ tự ưu tiên tăng dần |
|---|---|
| `theme::` | `views/<theme-cha>/language/` → `views/theme-child/language/` |
| `e-<element>::` | Thư mục `language/` cạnh file `.widget.php` → thư mục cùng đường dẫn tương đối bên `views/theme-child/` |
| Namespace tự đăng ký | Theo đúng thứ tự bạn gọi `loadTranslationsFrom()` |

Bạn cũng có thể tự tạo tầng ghi đè cho namespace bất kỳ bằng cách gọi `loadTranslationsFrom()` lần nữa trong Service Provider của mình, với thư mục muốn cho ưu tiên cao hơn.

:::warning Thêm file ngôn ngữ mới phải xoá cache
Danh sách file của mỗi namespace được cache lại. **Sửa nội dung** file có sẵn thì thấy ngay, nhưng **thêm file mới** (hoặc thêm thư mục ngôn ngữ mới cho theme con) thì phải bấm xoá cache ở admin — `cmsClearCache()` gọi `Translation::clearCache()` để quét lại.
:::

---

## 5. Quản lý Đa Ngôn Ngữ Trong Database 

**Lưu ý:** Việc sử dụng hàm `trans()` và mảng file `language/` chỉ dùng cho UI tĩnh (Nút bấm, Label Form, Text thông báo tĩnh).

Nếu bạn muốn phần **Nội dung bài viết (Post Content) hoặc Tên chuyên mục (Category Name) tự động đa ngôn ngữ**, bạn hãy cài đặt Plugin `skd-multi-language`. Bộ plugin này chịu trách nhiệm can thiệp vòng đời Database để lưu nhiều cột dữ liệu khác nhau cho từng ngôn ngữ, tách biệt với hệ thống `trans()` tĩnh này.

Nội dung dịch được lưu ở bảng `language`, và trait `ModelLanguage` tự thay các cột đã dịch
(`title`, `name`, `excerpt`, `content`) vào kết quả truy vấn khi người dùng đang xem ngôn ngữ
khác mặc định. Nhờ vậy code trong theme **không phải phân biệt ngôn ngữ**:

```php
// Cùng một dòng code, ra tiêu đề đúng theo ngôn ngữ đang xem
echo $post->title;
```

---

## 6. Đường dẫn (slug) theo ngôn ngữ

Từ **8.2.0**, mỗi ngôn ngữ có thể có một đường dẫn riêng: `/gioi-thieu` ↔ `/en/about-us`.
Tính năng **tắt sẵn** trên site nâng cấp, bật ở *Cấu hình hệ thống → Đường dẫn*.

Hai điều cần nhớ khi viết code theme/plugin:

**1. Link trong trang thì không đổi gì.** Cột `slug` cũng được thay theo ngôn ngữ giống
`title`/`content`, nên cách viết cũ vẫn đúng:

```php
Url::permalink($post->slug);   // vi/gioi-thieu  hoặc  en/about-us, tuỳ ngôn ngữ đang xem
```

**2. Link sang ngôn ngữ KHÁC thì phải dùng hàm riêng.** `Url::permalink()` luôn dựng theo ngôn
ngữ *đang xem*, nên không dùng được cho bộ chuyển ngôn ngữ, `hreflang` hay sitemap:

```php
Url::language('en');            // URL của CHÍNH trang này ở tiếng Anh
Url::localized($post);          // ['vi' => '...', 'en' => '...'] — URL tuyệt đối mọi ngôn ngữ
Url::localizedSlugs($post);     // ['vi' => 'gioi-thieu', 'en' => 'about-us'] — slug thô
```

Ngoài ra: tên file template (`page-{slug}.blade.php`) phải tra bằng `slug_default`, **không**
phải `slug` — chi tiết và toàn bộ cơ chế xem
[Đường dẫn riêng cho từng ngôn ngữ](./05-Slug-Per-Language.md).
