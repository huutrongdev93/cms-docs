### Đăng ký gateway
Đầu tiên bạn cần đăng ký cổng giao hàng của bạn với hệ thống

```php
function my_shipping_gateway($gateways)
{
    $gateways['my_shipping'] 	= [
        'label'         => 'Tên cổng giao hàng',
        'description'   => 'Mô tả',
        'class'         => 'MY_Shipping', //class xử lý các yêu cầu shipping
        'callback'      => 'MY_Shipping::setting', //callback hiển thị trang cấu hình
    ];
    return $gateways;
}
add_filter('shipping_gateways', 'my_shipping_gateway', 10, 2);
```
### Danh sách gateway shipping
Để lấy danh sách các cổng giao hàng hiện có bạn dùng method
```php
Shippings::list();
```
Lấy chi tiết của một cổng theo key
```php
Shippings::list('my_shipping');
```

### Class Xử lý
```php
class MY_Shipping {

    function __construct() {
    }

    static function form($keyShipping, $shipping): void
    {
    }

    static function config(\SkillDo\Http\Request $request): void
    {
    }

    static function listService($package, $order) 
    {
    }

    static function calculate($package): bool|int
    {
        return 0;
    }

    static function change($shipping, $order): array
    {
        $orderMeta = [];

        return [
            'order' => $order,
            'orderMeta' => $orderMeta
        ];
    }
}
```

#### Method hiển thị form cấu hình
```php
class MY_Shipping 
{
    static function form($keyShipping, $shipping): void
    {
        $languages = Language::list();

        $languageDefault = Language::default();

        $tabs = [];

        $form = form();

        $form->none('<div class="row">');

        $form->radio('enabled', ['Tắt','Bật'], [
            'label' => 'Bật /Tắt hình thức vận chuyển này',
        ], (!empty($shipping['enabled'])) ? 1 : 0);

        $form->checkbox('default', SHIP_KEY, [
            'label' => 'Đặt làm phí ship mặc định',
        ], (!empty($shipping['default'])) ? SHIP_KEY : '');

        if(count($languages) === 1) {

            $form->image('img', [ 'label' => 'Icon', 'start' => 4, ], $shipping['img']);

            $form->text('title', [ 'label' => 'Tiêu đề', 'start' => 8, ], $shipping['title']);

            $form->textarea('description', [ 'label' => 'Mô tả', ], $shipping['description']);
        }
        else {

            $form->image('img', [ 'label' => 'Icon', 'start' => 12, ], $shipping['img']);

            foreach ($languages as $languageKey => $language) {
                $tabs['shipping_'.$languageKey] = [
                    'label'   => $language['label'],
                    'content' => function () use ($languageKey, $languageDefault, $shipping) {

                        $name = ($languageDefault == $languageKey) ? '' : '_'.$languageKey;

                        $form = form();

                        $form->none('<div class="row">');

                        $form->text('title'.$name, [ 'label' => 'Tiêu đề', 'start' => 8, ], $shipping['title'.$name] ?? '');

                        $form->textarea('description'.$name, ['label' => 'Mô tả',], $shipping['description'.$name] ?? '');

                        $form->none('</div>');

                        $form->html(false);
                    }
                ];
            }
        }

        $form->none('</div>');

        $form = apply_filters('admin_payment_'.$keyShipping.'_input_fields', $form, $shipping);

        $form->html(false);

        if(!empty($tabs)) {
            echo Admin::tabs($tabs, 'shipping_'.Language::default());
        }
    }
}
```
#### Method lưu lại thông tin cấu hình
```php
class MY_Shipping 
{
    static function config(\SkillDo\Http\Request $request): void
    {
        $shipping_key = trim((string)$request->input('shipping_key'));

        $enabled = trim((string)$request->input('enabled'));

        $default = trim((string)$request->input('default'));

        $img     = trim((string)$request->input('img'));

        $title   = trim((string)$request->input('title'));

        $description   = trim((string)$request->input('description'));

        if(empty($title)) {
            response()->error('Không được để trống tên hình thức vận chuyển');
        }

        $shipping = Option::get('cart_shipping', []);

        if (!have_posts($shipping)) $shipping = [];

        $shipping[$shipping_key]['enabled'] = (!empty($enabled)) ? $enabled : false;

        $shipping[$shipping_key]['title'] = $title;

        $shipping[$shipping_key]['description'] = $description;

        $shipping[$shipping_key]['img'] = FileHandler::handlingUrl($img);

        if(Language::isMulti()) {

            $languages = Language::list();

            $languageDefault = Language::default();

            foreach ($languages as $languageKey => $language) {

                if($languageKey == $languageDefault) continue;

                $title   = trim((string)$request->input('title_'.$languageKey));

                $description   = trim((string)$request->input('description_'.$languageKey));

                $shipping[$shipping_key]['title_'.$languageKey] = $title;

                $shipping[$shipping_key]['description_'.$languageKey] = $description;
            }
        }

        Option::update('cart_shipping', $shipping);

        if(!empty($default) && $default == $shipping_key) {
            Option::update('cart_shipping_default', $default);
        }
    }
}
```
#### 