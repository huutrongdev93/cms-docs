# Query Builder

> **File:** `packages/skilldo/framework/src/Database/DB.php`  
> **Class thực:** `SkillDo\Database\DB` — được alias toàn cục thành `DB`, `SkillDo\DB` **và** `Illuminate\Support\Facades\DB` (xem `SkillDo\Support\Facade::defaultAliases()`)  
> **Tài liệu tham khảo:** [Laravel Query Builder](https://laravel.com/docs/12.x/queries)

## 1. Query Builder là gì?

Query Builder là một giao diện lập trình linh hoạt và an toàn để tương tác với Database mà không cần viết câu lệnh SQL thuần. Mọi giá trị đầu vào đều được **tự động escaped** (thoát ký tự) để chặn tấn công SQL Injection.

Lớp `SkillDo\Database\DB` là một Wrapper nhẹ chuyển tiếp mọi lời gọi đến Capsule Manager (`app('db')` — Illuminate Database). `DB::table()` trả về `Illuminate\Database\Query\Builder` (Laravel 12), nên tất cả phương thức của Laravel Query Builder đều khả dụng trong SkillDo. Nhờ alias, bạn có thể `use Illuminate\Support\Facades\DB;` như code Laravel quen thuộc — thực chất vẫn gọi vào `SkillDo\Database\DB`.

## 2. Khởi Tạo Query

Dùng `DB::table('tên_bảng')` để bắt đầu một Query Builder mới trỏ đến bảng cụ thể.
**Lưu ý:** Hệ thống tự động thêm prefix bảng (vd: `cle_`) vào tên bảng nếu đã cấu hình DB_PREFIX trong `.env`.

```php
use Illuminate\Support\Facades\DB;

$query = DB::table('post');
```

---

## 3. Truy Vấn Dữ Liệu (SELECT)

### Lấy Tất Cả Bản Ghi
```php
$posts = DB::table('post')->get();

// Duyệt qua danh sách
foreach ($posts as $post) {
    echo $post->title;
}
```

### Lấy Một Bản Ghi
```php
// Lấy bản ghi đầu tiên khớp với điều kiện
$post = DB::table('post')->where('id', 1)->first();

echo $post->title;
```

### Chỉ Lấy Một Số Cột
```php
$posts = DB::table('post')
    ->select('id', 'title', 'created')
    ->get();

// Thêm cột vào câu SELECT đã khởi tạo
$posts = DB::table('post')
    ->select('id', 'title')
    ->addSelect('status')
    ->get();
```

### Lấy Giá Trị Của Một Cột (Pluck)
```php
// Trả về Collection chứa mỗi giá trị của cột 'title'
$titles = DB::table('post')->pluck('title');

// Dùng cột 'id' làm key của mảng kết quả
$titlesById = DB::table('post')->pluck('title', 'id');
```

### Raw Expressions (Biểu Thức SQL Thô)
Dùng `DB::raw()` khi cần nhúng SQL thuần vào giữa các câu Query Builder (vẫn cần cẩn thận SQL injection với đầu vào người dùng):

```php
$posts = DB::table('post')
    ->select(DB::raw('COUNT(*) as post_count, status'))
    ->groupBy('status')
    ->get();
```

---

## 4. Điều Kiện Lọc (WHERE)

### Điều Kiện Cơ Bản

```php
// Toán tử so sánh mặc định là '='
DB::table('post')->where('status', 'public')->get();

// Các toán tử khác: '>', '<>', 'like', '>=', '<=', 'LIKE'
DB::table('post')->where('id', '>', 10)->get();
DB::table('post')->where('title', 'like', '%skilldo%')->get();
```

### Nhiều Điều Kiện (AND / OR)
```php
// Nhiều where() = AND
$posts = DB::table('post')
    ->where('status', 'public')
    ->where('post_type', 'article')
    ->get();

// orWhere = OR
$posts = DB::table('post')
    ->where('status', 'public')
    ->orWhere('status', 'featured')
    ->get();
```

### whereIn / whereNotIn
```php
$posts = DB::table('post')
    ->whereIn('id', [1, 2, 3, 4])
    ->get();

$posts = DB::table('post')
    ->whereNotIn('status', ['trash', 'pending'])
    ->get();
```

### whereNull / whereNotNull
```php
// Tìm bản ghi chưa từng được cập nhật (updated = null)
DB::table('post')->whereNull('updated')->get();

// Tìm bản ghi đã từng được cập nhật
DB::table('post')->whereNotNull('updated')->get();
```

> **Lưu ý:** Xóa mềm trong SkillDo dùng cột `trash` kiểu số (`0` = bình thường, `1` = đã xóa mềm), **không phải** `NULL` như `deleted_at` của Laravel. Khi query thuần bằng Query Builder hãy dùng `where('trash', 0)` / `where('trash', 1)`. Xem chi tiết tại `03-Eloquent.md` mục Soft Deletes.

### whereBetween (Trong Khoảng)
```php
$posts = DB::table('post')
    ->whereBetween('id', [10, 50])
    ->get();
```

### whereDate / whereYear / whereMonth (Lọc Theo Thời Gian)
```php
DB::table('post')->whereDate('created', '2026-01-01')->get();
DB::table('post')->whereYear('created', '2026')->get();
DB::table('post')->whereMonth('created', '3')->get();
```

### Nhóm Điều Kiện Lồng Nhau (Closure)
```php
$posts = DB::table('post')
    ->where('status', 'public')
    ->where(function ($query) {
        $query->where('post_type', 'post')
              ->orWhere('post_type', 'page');
    })
    ->get();
// Tương đương SQL: WHERE status = 'public' AND (post_type = 'post' OR post_type = 'page')
```

---

## 5. Sắp Xếp & Phân Trang

```php
// orderBy (mặc định ASC)
DB::table('post')->orderBy('created', 'desc')->get();

// 10 bản ghi mới nhất
DB::table('post')->latest('created')->limit(10)->get();

// Phân trang thủ công
DB::table('post')
    ->limit(10)       // Số bản ghi trên 1 trang
    ->offset(20)      // Bỏ qua 20 bản ghi đầu (trang 3)
    ->get();

// Thứ tự ngẫu nhiên
DB::table('post')->inRandomOrder()->limit(5)->get();
```

---

## 6. JOIN Bảng

```php
// INNER JOIN
DB::table('post')
    ->join('relationships as r', 'r.object_id', '=', 'post.id')
    ->where('r.object_type', 'post')
    ->select('post.*', 'r.category_id')
    ->get();

// LEFT JOIN
DB::table('post')
    ->leftJoin('gallery_items as g', function ($join) {
        $join->on('g.object_id', '=', 'post.id')
             ->where('g.object_type', 'post');
    })
    ->get();
```

---

## 7. Group By & Having

```php
$stats = DB::table('post')
    ->select(DB::raw('post_type, COUNT(*) as total'))
    ->groupBy('post_type')
    ->having('total', '>', 5)
    ->get();
```

---

## 8. Các Hàm Tổng Hợp (Aggregate)

```php
$count = DB::table('post')->where('status', 'public')->count();
$maxId = DB::table('post')->max('id');
$minId = DB::table('post')->min('id');
$sum   = DB::table('orders')->sum('total_price');
$avg   = DB::table('orders')->avg('total_price');
```

---

## 9. Ghi Dữ Liệu

### Insert (Thêm Mới)
```php
// Chèn 1 bản ghi (bảng metadata chuẩn CMS dùng cột object_id/meta_key/meta_value)
DB::table('users_metadata')->insert([
    'object_id'  => 5,
    'meta_key'   => 'views',
    'meta_value' => 0,
]);

// Chèn và lấy ID tự tăng vừa được insert
$id = DB::table('users_metadata')->insertGetId([
    'object_id'  => 5,
    'meta_key'   => 'featured',
    'meta_value' => 1,
]);
```

### Update (Cập Nhật)
```php
DB::table('post')
    ->where('id', 5)
    ->update(['status' => 'public', 'title' => 'Tiêu đề mới']);

// Tăng / giảm giá trị số nguyên
DB::table('users_metadata')->where('meta_key', 'views')->increment('meta_value', 1);
DB::table('users_metadata')->where('meta_key', 'stock')->decrement('meta_value', 5);
```

### Delete (Xóa)
```php
DB::table('users_metadata')
    ->where('object_id', 5)
    ->delete();
```

---

## 10. Transaction (Giao Dịch)

Dùng Transaction để đảm bảo toàn vẹn dữ liệu. Nếu bất cứ truy vấn nào trong khối thất bại, toàn bộ sẽ được rollback.

```php
use Illuminate\Support\Facades\DB;

DB::beginTransaction();

try {
    DB::table('orders')->insert(['user_id' => 1, 'total' => 250000]);
    DB::table('inventory')->where('product_id', 10)->decrement('quantity', 1);

    DB::commit(); // Lưu thành công tất cả thay đổi

} catch (\Exception $e) {
    DB::rollBack(); // Hủy mọi thay đổi nếu có lỗi
    throw $e;
}
```

---

## 11. Chạy SQL Thuần

Ngoài `DB::raw()`, lớp `SkillDo\Database\DB` còn khai báo sẵn:

```php
// SELECT thuần, trả về mảng kết quả
$rows = DB::select('SELECT * FROM cle_post WHERE status = \'public\'');

// Chạy câu lệnh bất kỳ (DDL, SET...)
DB::statement('ALTER TABLE cle_post ADD INDEX idx_status (status)');
```

Mọi phương thức static khác (vd: `DB::getQueryLog()`) được chuyển tiếp đến `app('db')` (Capsule Manager) qua `__callStatic`.

---

## 12. Debug Câu Lệnh SQL

```php
// In câu SQL ra màn hình rồi dừng
DB::table('post')->where('status', 'public')->dd();

// Lấy chuỗi SQL để ghi log
$sql = DB::table('post')->where('status', 'public')->toSql();
```
