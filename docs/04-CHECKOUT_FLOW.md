# 04 - Checkout & License Lifecycle

Quy trình từ lúc chọn sản phẩm đến khi kích hoạt License thành công.

## 1. Checkout Journey (Hành trình mua hàng)
1. **Selection**: Người dùng chọn gói dịch vụ (Free/Pro/Max) tại Pricing Table.
2. **Cart**: Sản phẩm được thêm vào giỏ hàng (Zustand state).
3. **Identification**:
   - Nếu là khách hàng mới: Nhập email/password để tạo tài khoản.
   - Nếu là khách hàng cũ: Đăng nhập để cộng dồn hoặc nâng cấp license.
4. **Payment**: Chuyển hướng đến Stripe Checkout để thanh toán an toàn.
5. **Success**: Sau khi thanh toán thành công, người dùng được đưa về trang Success để nhận License Key.

## 2. License Management
Hệ thống license của PI hỗ trợ:
- **Instant Activation**: License key được tạo tự động và gửi qua email ngay sau khi thanh toán.
- **Site Management**: Người dùng có thể quản lý danh sách các domain đang active license thông qua Dashboard.
- **Upgrades**: Hỗ trợ nâng cấp từ gói thấp lên gói cao bằng cách thanh toán phần chênh lệch giá.

## 3. Security & Validation
- **JWT Authentication**: Bảo mật các yêu cầu từ Client đến Backend.
- **Stripe Webhooks**: Đảm bảo trạng thái đơn hàng luôn được cập nhật chính xác kể cả khi người dùng đóng trình duyệt đột ngột.
- **Encryption**: Mọi thông tin nhạy cảm của khách hàng đều được mã hóa theo tiêu chuẩn quốc tế.
