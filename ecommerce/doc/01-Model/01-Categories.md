import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Danh mục sản phẩm
Model `ProductCategory` nằm trong plugin `sicommerce` cung cấp các method thao tác với table danh mục sản phẩm
>
Model `ProductCategory` kế thừa từ `SkillDo\Model\Model` nên bạn có thể sử dụng các method của model cho ProductCategory như first, fetch, get, gets...
Ngoài các method mặc định model ProductCategory còn cung cấp một số method bổ sung.

### categoryType
Lấy toàn bộ danh mục sắp xếp theo thứ tự level

<Tabs groupId="ProductCategory-categoryType-tree" queryString>
    <TabItem value="code" label="Code">
        ```php
        ProductCategory::select('id', 'name', 'level')->tree()
        ```
    </TabItem>
    <TabItem value="result" label="Result">
        ```php
        /* Array
        (
            [0] => stdClass Object
                (
                    [id] => 4
                    [name] => Dụng cụ ăn
                    [slug] => dung-cu-a
                    [level] => 1
                )
            [1] => stdClass Object
                (
                    [id] => 3
                    [name] => Dao, kéo
                    [slug] => dao-keo
                    [level] => 1
                )
            [2] => stdClass Object
                (
                    [id] => 2
                    [name] => Đồ gang
                    [slug] => do-gang
                    [level] => 1
                )
            [3] => stdClass Object
                (
                    [id] => 1
                    [name] => Nồi chảo
                    [slug] => noi-chao
                    [level] => 1
                )
        ) */
        ```
    </TabItem>
</Tabs>

Lấy toàn bộ danh mục theo cây thư mục cha con

<Tabs groupId="ProductCategory-categoryType-multilevel" queryString>
    <TabItem value="code" label="Code">
        ```php
        ProductCategory::select('id', 'name', 'level')->multilevel()
        ```
    </TabItem>
    <TabItem value="result" label="Result">
        ```php
        /* Array
        (
            [0] => stdClass Object
                (
                    [id] => 1
                    [name] => Nồi chảo
                    [level] => 1
                    [child] => Array
                        (
                            [0] => stdClass Object
                                (
                                    [id] => 6
                                    [name] => Nồi nhật bản
                                    [level] => 2
                                    [child] => []
                                )
                            [1] => stdClass Object
                                (
                                    [id] => 5
                                    [name] => Nồi hàng quốc
                                    [level] => 2
                                    [child] => []
                                )
                        )
                )
            [1] => stdClass Object
                (
                    [id] => 2
                    [name] => Đồ gang
                    [level] => 1
                    [child] => []
                )
            [2] => stdClass Object
                (
                    [id] => 3
                    [name] => Dao, kéo
                    [level] => 1
                    [child] => []
                )
            [3] => stdClass Object
                (
                    [id] => 4
                    [name] => Dụng cụ ăn
                    [level] => 1
                    [child] => []
                ) 
        )
        */
        ```
    </TabItem>
</Tabs>

Lấy toàn bộ doanh mục theo cây thư mục dạng option

<Tabs groupId="ProductCategory-categoryType-options" queryString>
    <TabItem value="code" label="Code">
        ```php
        ProductCategory::select('id', 'name', 'level')->options()
        ```
    </TabItem>
    <TabItem value="result" label="Result">
        ```php
        /* Array
        (
            [0] => Chọn danh mục
            [1] => Nồi chảo
            [5] => |-----Nồi hàng quốc
            [6] => |-----Nồi nhật bản
            [2] => Đồ gang
            [3] => Dao, kéo
            [4] => Dụng cụ ăn
        ) */
        ```
    </TabItem>
</Tabs>