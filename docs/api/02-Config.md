# Cấu Hình
Để cấu hình jwt bạn có thể edit file `config/jwt.php`, một số tùy chọn:  

Tùy chọn ```login``` cho phép người dùng login bằng thông tin nào (`email` hoặc `phone`)

Tùy chọn ```private_key``` chứa thông tin private key  

Tùy chọn ```public_key``` chứa thông tin public key  

Tùy chọn ```ttl``` chứa thông thời gian sống của token mặc định là 8 giờ  

Tùy chọn ```refresh_ttl``` chứa thông thời gian sống của refresh token mặc định là 2 tuần

Tùy chọn ```cronjob_token_delete``` chứa thông thời key action của cronjob xóa token hết hạn quá 24 giờ