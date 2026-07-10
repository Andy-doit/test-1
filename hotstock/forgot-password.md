# Kế hoạch Triển khai tính năng Quên mật khẩu (Forgot Password)

## 1. Tổng quan (Overview)
- **Mục tiêu**: Xây dựng quy trình cho phép người dùng khôi phục lại mật khẩu khi bị quên thông qua mã xác nhận (OTP) gửi về email.
- **Dịch vụ Email**: Sử dụng **Nodemailer** (miễn phí) kết hợp với tài khoản Gmail (hoặc SMTP server bất kỳ).
- **Project Type**: WEB (Next.js Frontend) kết hợp với Backend API.

## 2. Tiêu chí thành công (Success Criteria)
1. Người dùng nhập email vào form Quên mật khẩu.
2. Hệ thống kiểm tra email tồn tại và gửi 1 mã OTP 6 số qua email.
3. Người dùng nhập mã OTP và mật khẩu mới để thiết lập lại mật khẩu.
4. Mã OTP có thời hạn sử dụng (ví dụ: 15 phút) và chỉ dùng được 1 lần.

## 3. Kiến trúc hệ thống (Tech Stack & Architecture)
Vì Project hiện tại là Frontend Next.js gọi API đến một Backend độc lập, quy trình chuẩn nhất nên là:
1. **Frontend (Next.js)**: Tạo giao diện (UI) cho 2 màn hình: 
   - Màn hình nhập Email yêu cầu gửi OTP (`/forgot-password`).
   - Màn hình nhập mã OTP và Mật khẩu mới (`/reset-password`).
2. **Backend (API Server hiện tại)**: 
   - Thêm 2 cột vào bảng `User`: `resetPasswordOtp` (lưu mã OTP) và `resetPasswordExpires` (lưu thời gian hết hạn).
   - Viết API `POST /auth/forgot-password`: Tạo OTP, lưu vào DB và gọi Nodemailer gửi email.
   - Viết API `POST /auth/reset-password`: Nhận email, OTP, newPassword -> Kiểm tra OTP hợp lệ -> Cập nhật mật khẩu mới.

> **Lưu ý**: Nếu Backend của bạn được viết bằng framework khác (NestJS, Express, Strapi,...), phần cấu hình Nodemailer và logic DB sẽ được đặt ở Backend.

## 4. Biến môi trường mẫu cần chuẩn bị (Environment Variables)

Bạn cần tạo mật khẩu ứng dụng (App Password) cho tài khoản Gmail của bạn để Nodemailer có thể gửi mail, thay vì dùng mật khẩu gốc (để bảo mật).

Thêm các biến này vào file `.env` ở **Backend** (hoặc Next.js nếu bạn viết API bằng Next.js):

```env
# Cấu hình Nodemailer gửi mail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email_cua_ban@gmail.com
SMTP_PASS=mat_khau_ung_dung_gmail # Mã 16 ký tự do Google cung cấp
SMTP_FROM_EMAIL="HotStock Support <email_cua_ban@gmail.com>"
```

## 5. Phân chia công việc (Task Breakdown)

### Task 1: Cập nhật Database & Backend API (Dành cho Backend)
- **Input**: Email người dùng.
- **Output**: 
  - Tạo 2 cột mới trong DB: `resetPasswordOtp` (string), `resetPasswordExpires` (datetime).
  - API `POST /auth/forgot-password` (Sinh OTP 6 số, lưu DB, dùng Nodemailer gửi mail).
  - API `POST /auth/reset-password` (Validate OTP, băm mật khẩu mới, lưu DB, xóa OTP).
- **Verify**: Gọi API qua Postman/Swagger thành công, nhận được email chứa OTP.

### Task 2: Giao diện Yêu cầu gửi Email (Next.js)
- **Input**: Màn hình `app/(public)/forgot-password/page.tsx`
- **Output**: Form nhập email, có validate Zod. Khi submit sẽ gọi API `POST /auth/forgot-password`.
- **Verify**: Hiển thị thông báo "OTP đã được gửi" và chuyển hướng sang trang nhập OTP.
- **Agent**: `frontend-specialist`

### Task 3: Giao diện Đặt lại mật khẩu (Next.js)
- **Input**: Màn hình `app/(public)/reset-password/page.tsx` (Có thể truyền email qua query url `?email=xxx`).
- **Output**: Form nhập mã OTP (6 ô) và Form nhập mật khẩu mới. Gọi API `POST /auth/reset-password`.
- **Verify**: Hiện thông báo thành công và chuyển hướng về trang `/login`.
- **Agent**: `frontend-specialist`

## 6. Phase X: Verification Checklist
- [ ] Gửi thử email yêu cầu OTP: ✅ Mail nhận được trong inbox/spam.
- [ ] Nhập sai mã OTP: ✅ Hệ thống báo lỗi "Mã OTP không hợp lệ".
- [ ] Nhập OTP hết hạn: ✅ Hệ thống báo lỗi "Mã OTP đã hết hạn".
- [ ] Đổi mật khẩu thành công: ✅ Đăng nhập lại bằng mật khẩu mới thành công.
