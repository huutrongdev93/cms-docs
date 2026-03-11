# Hệ Thống Ngôn Ngữ Framework & CMS (i18n Core)

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
sourcev8/
└── language/
    ├── vi/
    │   ├── validation.php    // Lỗi validate form
    │   ├── system.php        // Từ khóa Hệ Thống lỗi
    │   └── ...
    └── en/
        ├── validation.php
        └── system.php
```

Mỗi file ngôn ngữ trả về một mảng:
`language/vi/system.php`
```php
<?php
return [
    'success' => 'Thao tác thành công.',
    'error'   => 'Đã xảy ra lỗi hệ thống!',
];
```

---

## 3. Cách Sử Dụng Ngôn Ngữ Trong Code

### Mọi nơi đều dùng `trans()`

```php
// 1. Gọi ở dạng Root Global (Không có '::')
echo trans('system.success'); 
// Trả về: Thao tác thành công. (Nếu là vi) 

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

## 4. Quản lý Đa Ngôn Ngữ Trong Database 

**Lưu ý:** Việc sử dụng hàm `trans()` và mảng file `language/` chỉ dùng cho UI tĩnh (Nút bấm, Label Form, Text thông báo tĩnh).

Nếu bạn muốn phần **Nội dung bài viết (Post Content) hoặc Tên chuyên mục (Category Name) tự động đa ngôn ngữ**, bạn hãy cài đặt Plugin `skd-multi-language`. Bộ plugin này chịu trách nhiệm can thiệp vòng đời Database để lưu nhiều cột dữ liệu khác nhau cho từng ngôn ngữ, tách biệt với hệ thống `trans()` tĩnh này.
