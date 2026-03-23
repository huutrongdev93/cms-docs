# Metabox & metadata

Trong CMS truyền thống (như WordPress), bảng `posts` (Bài viết) hay `pages` (Trang nội dung) thường chỉ chứa 3 cột chính là `Title`, `Content` (Nội dung HTML lớn) và `Slug`. 

Nhưng nếu dự án của bạn muốn Bài Viết gắn thêm trường Dữ Phụ: "Tên Tác Giả Gốc", "Ngày dự kiến phát hành", "Nguồn Báo Nào"? Thì lẽ ra bạn phải tạo thêm 3 cột lưu CSDL. 

Tuy nhiên, SkillDo CMS sở hữu tính năng **Metabox** mạnh mẽ giúp bạn thêm "Bảng Điền Form Phụ" (thường xuất hiện dưới khung Nội dung Bài Viết hoặc Bên phải cột) mà VẪN lưu riêng từng Bài Viết dưới dạng Metadata mà KHÔNG CẦN đụng đến Cột (Column) trong Bảng Chính!

---

## 1. Cơ Khí Hoạt Động (Hook)

SkillDo quy định 2 Action chính để bạn thao tác với giao diện tạo/sửa Bài Viết (hoặc Chủ Đề, Category):
1. **`add_meta_box`**: Action yêu cầu in một vùng HTML Form nằm lọt thỏm trong giao diện chung.
2. **`save_post` (hoặc save_page, `save_{module}`)**: Action gọi khi người quản trị Lưu Cập Nhật toàn trang. (Để thu thập data).

Bộ thư viện Form Builder (Mảng Array giống Plugin Element) được sử dụng để sinh ra giao diện `TextBox / Select / Radio` cho Metadata một cách đồng bộ nhất với Admin thay vì bạn phải tự cặm cụi code tay HTML Bootstrap.

---

## 2. Nơi Đăng Ký Metabox

Thông thường, do Metabox là "Lựa chọn thêm" của Giao diện (Theme) mong muốn hoặc là cấu trúc mở rộng của Plugin nên bạn để trong file **Bootstrapper (Service Provider)** hoặc **File Hàm (`theme-store/app/functions.php`)**.

---

## 3. Ví Dụ Đăng Ký Metabox Gắn Thêm Nguồn Cho Post (Bài Viết)

```php
use SkillDo\Cms\Metabox\Metabox;
use SkillDo\Cms\Form\Form;

// 1. Chỉ định việc gọi hàm thêm Box 
add_action('add_meta_box', 'register_my_source_metabox');

function register_my_source_metabox() {
    
    // Metabox::add($id, $title, $callback, $args = [])
    Metabox::add(
        'source_post_metabox',              // ID Bảng Phụ
        'Nguồn Gốc Của Bài Viết Này',   // Tiêu đề của Box
        'render_source_post_metabox',   // Hàm callback
        [
            'module'   => 'post',           // Áp dụng cho module (post, page, products...)
            'position' => 10,               // Thứ tự sắp xếp hiển thị
            'content'  => 'leftBottom'      // Vị trí (VD: leftBottom, leftTop, right)
        ]
    );
}

// 2. Định nghĩa hàm in nội dung Form (Hệ thống sẽ truyền $object là Post Data hoặc Null nếu Tạo mới)
function render_source_post_metabox($object) {
    
    // a. Lấy Metadata đã lưu cũ từ DB (Nếu đang ở trang Sửa). Còn Thêm mới sẽ rỗng = ''
    // $object->id là ID bài viết.
    $source_name = Metadata::get('post', $object->id, '_source_name', '');
    $source_url  = Metadata::get('post', $object->id, '_source_url', '');

    // b. Sử dụng SkillDo Form Builder để in nhanh HTML chuẩn thay vì gõ
    $form = new Form();
    
    echo $form->text('source_name', [
        'label' => 'Tên Tạp chí/Báo gốc',
        'value' => $source_name,
        'placeholder' => 'VD: VNExpress'
    ]);

    echo $form->url('source_url', [
        'label' => 'Đường dẫn link báo gốc',
        'value' => $source_url
    ]);
}
```

---

## 4. Xử Lý Khi Lưu Giao Diện (Save Data)

Lúc người dùng ấn "Sửa Bài Viết". Post Data mặc định (Tiêu đề, ảnh) được Hệ Thống lưu. Sau đó hệ thống sẽ phóng một tín hiệu (Hook Action) bắn kèm ID bài viết đó vừa lưu: `save_post`. 

Ta bắt tín hiệu đó để nhét tiếp Meta Fields của Nguồn vào kho Metadata.

```php
use SkillDo\Http\Request;

// 1. Lắng nghe hành vi thay đổi bài viết
add_action('save_post', 'save_my_source_metabox', 10, 2);

function save_my_source_metabox($post_id, Request $request) {
    
    // Để ý: Hàm render ta xài ô tên `source_name` và `source_url`
    if ($request->has('source_name')) {
        
        // Cú pháp Meta CMS: Update dữ liệu $value vào key '_source_name' cho module 'post' mang id $post_id
        Metadata::update('post', $post_id, '_source_name', $request->input('source_name'));
        Metadata::update('post', $post_id, '_source_url', $request->input('source_url'));
        
    }
}
```

> [!CAUTION] 
> Bảo mật: CMS Form tự động nhúng CSRF token ở tầng cha, giúp hành vi LƯU CẬP NHẬT an toàn chống bị giả lập form (Cross-Site) dù bạn không tự gọi `<input _token>` ở phần in form.

---

## 5. Truy Xuất Field Này Ra Màn Hình Frontend Cho Người Đọc

Tưởng tượng bây giờ một người dùng đọc bài viết (Trang Frontend), và ta muốn hiển thị Link Báo Gốc mà quản trị viên đã gõ ở trên.

Trong file View Theme `theme-store/views/post-detail.blade.php`:

```php
@php
    // SkillDo Blade đã bơm tự động Object bài viết là biến $post
    // Từ biến $post trích lục dữ liệu phụ Metadata ra theo KEY
    $name = Metadata::get('post', $post->id, '_source_name', null);
    $url  = Metadata::get('post', $post->id, '_source_url', null);
@endphp

<!-- In Ra Màn Hình -->
@if($name && $url)
    <div class="source-credit" style="padding:10px; background:#f0f0f0;">
        <p><strong>Bản quyền thuộc về:</strong> <a href="{{ $url }}" target="_blank">{{ $name }}</a></p>
    </div>
@endif
```

## TỔNG KẾT
1. Lợi dụng khả năng mở rộng không giới hạn của bảng `Metadata` CMS (Gồm `Module Type`, `Target ID`, `Key`, và `Value`). 
2. Dùng Metabox Hook để mượn chỗ đặt form thu thập liệu mà không phải phá hư form Mặc Định CMS.
3. Không làm bốc hơi/phình to Hệ Quản Trị Hệ Cơ Sở Dữ Liệu SQL cốt lõi của bảng chính bằng việc hạn chế dùng chức năng Thêm Cột (Col). 
4. Phân chia rõ ràng (Tên trường bắt đầu bằng gạch dưới là Metabox Ẩn ở UI, Không gạch là Custom Field mặc định cho Admin).
