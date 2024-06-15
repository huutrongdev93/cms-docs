# Sản phẩm
Model `Product` nằm trong plugin `sicommerce` cung cấp các method thao tác với table sản phẩm
>
Model `Product` kế thừa từ `SkillDo\Model\Model` nên bạn có thể sử dụng các method của model cho Product như first, fetch, get, gets...
Ngoài các method mặc định model Product còn cung cấp một số method bổ sung.

### Related
Method lấy danh sách sản phẩm liên quan theo tiêu chí cùng danh mục, tham số nhận vào là id của sản phẩm muốn lấy sản phẩm liên quan
```php
Product::related(1)->limit(10)->fetch()

//or
Product::select('id', 'title')->related(1)->limit(10)->fetch()
```

Lấy ra ngẫu nhiên
```php
Product::select('id', 'title')
                            ->related(1)
                            ->limit(10)
                            ->orderByRaw('rand()')
                            ->fetch()
```