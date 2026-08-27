# Đa Ngôn Ngữ Cho Element

SkillDo CMS v8 sở hữu một trình dựng trang (Page Builder) xoay quanh các khối gọi là **Element**. Khi người dùng nhấp vào một Element, CMS hiển thị bảng điều khiển (Form Fields) để nhập cấu hình.

Vấn đề: nếu người dùng chuyển CMS sang tiếng Anh, làm sao để nhãn của các trường trong bảng điều khiển — và cả nội dung element render ra ngoài trang — hiển thị đúng ngôn ngữ?

---

## 1. Ba cách gọi ngôn ngữ trong Element

Element là class kế thừa `SkillDo\Cms\Element\Element`. Mọi nhãn đều đi qua hàm `trans()`, khác nhau ở **namespace** đứng trước `::`.

| Nguồn ngôn ngữ | Cách gọi | Ghi chú |
|---|---|---|
| Ngôn ngữ **lõi** | `trans('general.phone')`, `trans('button.save')` | Không có namespace. File nằm ở `language/{locale}/` |
| Ngôn ngữ **theme** | `trans('theme::post.readmore')` | File nằm ở `views/<theme-cha>/language/{locale}/` |
| Ngôn ngữ **plugin** | `trans('skd-seo::admin.keywords')` | File nằm ở `plugins/<plugin-id>/language/{locale}/` |
| Ngôn ngữ **riêng của element** | `trans('e-<đường-dẫn>::<file>.<key>')` | Xem mục 2 |

> Các file ngôn ngữ lõi hiện có: `ajax.php`, `alert.php`, `auth.php`, `button.php`, `field.php`, `form.php`, `general.php`, `lang-js.php`, `table.php`, `validation.php`. Trước khi tạo file riêng, hãy mở các file này xem đã có sẵn chuỗi bạn cần chưa.

---

## 2. Namespace ngôn ngữ riêng của Element

Khi element lớn và bạn muốn tách file ngôn ngữ độc lập, chỉ cần tạo thư mục `language/{locale}/` **ngay cạnh file `.widget.php`**. `LanguageServiceProvider::loadElementTranslations()` sẽ tự đăng ký namespace.

Quy tắc đặt tên namespace: lấy phần đường dẫn **sau thư mục `elements`**, nối các cấp bằng dấu chấm, thêm tiền tố `e-`.

| Đường dẫn thư mục element | Namespace ngôn ngữ |
|---|---|
| `elements/search-bar/language` | `e-search-bar` |
| `elements/auth-button/style1/language` | `e-auth-button.style1` |
| `elements/translate/language` | `e-translate` |

> Namespace chỉ được đăng ký cho element **đã khai trong `elements/elements.json`** — tạo thư mục `language/` mà quên đăng ký element thì namespace không tồn tại.

---

## 3. Theme con ghi đè ngôn ngữ element của theme cha

Mỗi namespace element được nạp từ **hai** thư mục, theo thứ tự ưu tiên tăng dần:

1. Thư mục `language/` cạnh file `.widget.php` của element (ở theme cha, theme con, hoặc trong plugin).
2. Thư mục **cùng đường dẫn tương đối** bên `views/theme-child/`.

Hai thư mục này được **trộn theo từng key** (xem [cơ chế Merge](./01-Core-Language.md)), nên theme con chỉ cần khai lại đúng chuỗi muốn sửa.

Điểm đáng giá nhất: bạn **không cần khai lại element trong `elements.json`** của theme con chỉ để đổi vài chữ. Chỉ cần tạo đúng thư mục ngôn ngữ theo đường dẫn tương đối:

```text
views/theme-store/elements/intro-banner/
├── intro-banner.widget.php
└── language/vi/main.php              <-- bản gốc: title, heading_label, readmore…

views/theme-child/elements/intro-banner/
└── language/vi/main.php              <-- CHỈ khai key muốn đổi, không cần .widget.php
```

`views/theme-child/elements/intro-banner/language/vi/main.php`:
```php
<?php
return [
    'readmore' => 'Tìm hiểu thêm',   // đổi mỗi chuỗi này
];
```

Kết quả: `trans('e-intro-banner::main.title')` vẫn lấy của theme cha, riêng `trans('e-intro-banner::main.readmore')` lấy của theme con.

Cách này cũng áp dụng được cho element **do plugin cung cấp**: tạo `views/theme-child/elements/<tên-element>/language/{locale}/` là dịch lại được chuỗi của element đó mà không phải sửa file trong plugin.

:::note Khi nào element bị thay hẳn thay vì merge
Nếu theme con khai lại element **cùng key** trong `elements/elements.json`, đó là thay hẳn element (class + view + ngôn ngữ đều lấy của theme con) — lúc này chỉ còn một thư mục ngôn ngữ nên không có gì để merge.
:::

:::warning Tạo thư mục ngôn ngữ mới phải xoá cache
Lần đầu tạo thư mục `language/` bên theme con phải bấm xoá cache ở admin thì namespace mới được quét lại và đăng ký.
:::

---

## 4. Ví dụ đầy đủ

**Bước 1 — Tạo file ngôn ngữ** cạnh file widget:

```
views/theme-child/elements/intro-banner/
├── intro-banner.widget.php
├── language/
│   ├── vi/main.php
│   └── en/main.php
└── views/view.blade.php
```

```php
// language/vi/main.php
return [
    'title'         => 'Khối Banner Giới Thiệu',
    'heading_label' => 'Tiêu đề lớn',
    'desc_label'    => 'Mô tả tóm tắt ngắn gọn',
    'readmore'      => 'Xem thêm',
];
```

```php
// language/en/main.php
return [
    'title'         => 'Intro Banner Block',
    'heading_label' => 'Main Heading',
    'desc_label'    => 'Short Summary Description',
    'readmore'      => 'Read more',
];
```

**Bước 2 — Class Element.**

Lưu ý: file `.widget.php` của element **không đặt namespace** — class nằm ở phạm vi global. Class bắt buộc phải hiện thực 4 phương thức của `ElementInterface`: `icon()`, `category()`, `form()`, `widget()`.

```php
<?php

use SkillDo\Cms\Element\Element;
use SkillDo\Cms\Form\Form;

class IntroBannerElement extends Element
{
    public function __construct()
    {
        // Tham số 2 là tên hiển thị trong cột kéo thả -> dịch được
        parent::__construct('IntroBannerElement', trans('e-intro-banner::main.title'));

        $this->assets('assets/intro-banner.css');

        $this->setTags('banner', 'intro');
    }

    public function icon(): string
    {
        return '<i class="fa-duotone fa-solid fa-rectangle-ad"></i>';
    }

    public function category(): string
    {
        return 'general';
    }

    public function form(): void
    {
        $this->tabs('generate')->adds(function (Form $form)
        {
            $form->text('heading', [
                'label'    => trans('e-intro-banner::main.heading_label'),
                'language' => true,   // cho phép nhập nội dung theo từng ngôn ngữ
            ]);

            $form->textarea('description', [
                'label'    => trans('e-intro-banner::main.desc_label'),
                'language' => true,
            ]);
        });
    }

    public function widget()
    {
        return $this->view('view', [
            'options' => $this->options,
        ]);
    }
}
```

**Bước 3 — File view.**

```blade
<div class="intro-banner">
    <h2>{!! $options->heading !!}</h2>
    <p>{!! $options->description !!}</p>
    <a href="#">{{ trans('e-intro-banner::main.readmore') }}</a>
</div>
```

---

## 5. Nội dung người dùng nhập (`'language' => true`)

Hai loại nội dung cần phân biệt:

| Loại | Cách xử lý |
|---|---|
| **Nhãn giao diện** (label field, chữ trên nút mặc định) | Do lập trình viên viết → dùng `trans()` |
| **Nội dung do người dùng nhập** (tiêu đề banner, mô tả) | Do người dùng nhập → thêm `'language' => true` vào field |

Khi field khai `'language' => true`, Page Builder hiển thị thêm ô nhập cho từng ngôn ngữ và lưu giá trị vào key kèm hậu tố ngôn ngữ (`heading_en`). Phương thức `Element::translations()` tự tráo giá trị đúng ngôn ngữ hiện tại vào `$this->options->heading` trước khi render — bạn **không cần** tự xử lý.
