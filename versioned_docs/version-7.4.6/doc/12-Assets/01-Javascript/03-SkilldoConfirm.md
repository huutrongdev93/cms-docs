class tạo ra thông báo xác nhận hành động _(Hiện tại chỉ hoạt động ở admin)_

Cách tạo event click cho button
```javascript
$(document).on('click', '.btn_confirm_demo', function() {
    SkilldoConfirm.show({
        element: $(this),
        success: callbackSuccess,
        error: callbackError
    })
})
```
Button được click phải có các tham số
- data-model : chứa model xử lý
- data-id : chứa id đối tượng cần xử lý
- data-ajax: tên ajax sẽ được gọi đến để xử lý
- data-trash: có sử dụng thùng rác hay không (enable hoặc disable)
- data-action: thông tin hành động
- data-heading
- data-description
```html
<button type="button" class="btn btn-theme btn_confirm_demo" 
        data-model="MyModel" 
        data-action="delete" 
        data-ajax="MyAjax::delete"
        data-id=1
        data-trash="disable"
        data-heading="Xóa dữ liệu"
        data-description="Are you sure?"
>Xóa data</button>
```

callbackSuccess: function sẽ được call sau khi confirm ajax trả về response.status là `success`
callbackError: function sẽ được call sau khi confirm ajax trả về response.status là `error`