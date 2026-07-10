## Giai đoạn 2 - Kết quả test module: Auth

### Đăng nhập - Thành công (Admin)
- **Method**: POST
- **Endpoint**: `/api/v1/auth/login`
- **Body**: `{
  "email": "admin@app.com",
  "password": "change-me-immediately"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Đăng nhập - Sai mật khẩu
- **Method**: POST
- **Endpoint**: `/api/v1/auth/login`
- **Body**: `{
  "email": "admin@app.com",
  "password": "wrong"
}`
- **Status**: 401
- **Kết quả**: ✅ PASS

---
### Đăng nhập - Email không tồn tại
- **Method**: POST
- **Endpoint**: `/api/v1/auth/login`
- **Body**: `{
  "email": "nobody@app.com",
  "password": "abc"
}`
- **Status**: 401
- **Kết quả**: ✅ PASS

---
### Đăng nhập - Thiếu field bắt buộc (password)
- **Method**: POST
- **Endpoint**: `/api/v1/auth/login`
- **Body**: `{
  "email": "admin@app.com"
}`
- **Status**: 400
- **Kết quả**: ✅ PASS

---
### Đăng ký - Thành công
- **Method**: POST
- **Endpoint**: `/api/v1/auth/register`
- **Body**: `{
  "email": "tester1783500580607@test.com",
  "password": "Test@12345",
  "confirmPassword": "Test@12345",
  "username": "tester1783500580607",
  "fullName": "Test User"
}`
- **Status**: 201
- **Kết quả**: ✅ PASS

---
### Đăng ký - Trùng email
- **Method**: POST
- **Endpoint**: `/api/v1/auth/register`
- **Body**: `{
  "email": "tester1783500580607@test.com",
  "password": "Test@12345",
  "confirmPassword": "Test@12345",
  "username": "tester1783500580607_dup",
  "fullName": "Test User"
}`
- **Status**: 409
- **Kết quả**: ✅ PASS

---
### Đăng ký - Mật khẩu yếu
- **Method**: POST
- **Endpoint**: `/api/v1/auth/register`
- **Body**: `{
  "email": "weak@test.com",
  "password": "123",
  "confirmPassword": "123",
  "username": "tester1783500580607_wk",
  "fullName": "Test"
}`
- **Status**: 400
- **Kết quả**: ✅ PASS

---
### Làm mới token - Lỗi thiếu token refresh
- **Method**: POST
- **Endpoint**: `/api/v1/auth/refresh`
- **Body**: `{}`
- **Status**: 400
- **Kết quả**: ✅ PASS

---
### Làm mới token - Refresh hợp lệ (dùng token đăng ký)
- **Method**: POST
- **Endpoint**: `/api/v1/auth/refresh`
- **Body**: `{
  "refresh_token": "a2260dbd-e335-427f-8a4e-f7df6528f3a5-b1c6302d-78fb-4145-833e-476c057413d1"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Đổi mật khẩu - Thành công
- **Method**: POST
- **Endpoint**: `/api/v1/auth/change-password`
- **Body**: `{
  "oldPassword": "Test@12345",
  "newPassword": "New@12345"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Đổi mật khẩu - Sai mật khẩu cũ
- **Method**: POST
- **Endpoint**: `/api/v1/auth/change-password`
- **Body**: `{
  "oldPassword": "WrongOld",
  "newPassword": "New@12345"
}`
- **Status**: 401
- **Kết quả**: ✅ PASS

---
### Đổi mật khẩu - Không có Access Token
- **Method**: POST
- **Endpoint**: `/api/v1/auth/change-password`
- **Body**: `{
  "oldPassword": "Test@12345",
  "newPassword": "New@12345"
}`
- **Status**: 401
- **Kết quả**: ✅ PASS

---
### Quên mật khẩu - Email hợp lệ
- **Method**: POST
- **Endpoint**: `/api/v1/auth/forgot-password`
- **Body**: `{
  "email": "admin@app.com"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Quên mật khẩu - Email không tồn tại
- **Method**: POST
- **Endpoint**: `/api/v1/auth/forgot-password`
- **Body**: `{
  "email": "nobody@test.com"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Quên mật khẩu - Sai định dạng email
- **Method**: POST
- **Endpoint**: `/api/v1/auth/forgot-password`
- **Body**: `{
  "email": "invalid"
}`
- **Status**: 400
- **Kết quả**: ✅ PASS

---
### Xác minh OTP - Sai OTP
- **Method**: POST
- **Endpoint**: `/api/v1/auth/verify-otp`
- **Body**: `{
  "email": "admin@app.com",
  "otp": "000000"
}`
- **Status**: 400
- **Kết quả**: ✅ PASS

---
### Đặt lại mật khẩu - Sai reset token
- **Method**: POST
- **Endpoint**: `/api/v1/auth/reset-password`
- **Body**: `{
  "resetToken": "invalid",
  "newPassword": "New@12345"
}`
- **Status**: 401
- **Kết quả**: ✅ PASS

---
### Đăng xuất - Đăng xuất thành công
- **Method**: POST
- **Endpoint**: `/api/v1/auth/logout`
- **Body**: `{
  "refresh_token": "326592b7-490c-4add-9fe0-9b78b8ee289c-efbe7f24-500d-4b1e-ab66-7bc78730345d"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Đăng xuất - Không có token
- **Method**: POST
- **Endpoint**: `/api/v1/auth/logout`
- **Body**: `{}`
- **Status**: 401
- **Kết quả**: ✅ PASS

---
### Xóa tài khoản (Admin)
- **Method**: DELETE
- **Endpoint**: `/api/v1/users/%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:43.299Z","path":"/api/v1/users/%3Cnumber%3E"}`

---
### Chi tiết người dùng (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/users/%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:43.394Z","path":"/api/v1/users/%3Cnumber%3E"}`

---
### Danh sách người dùng (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/users`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:43.484Z","path":"/api/v1/users?page=%3Cnumber%3E&limit=%3Cnumber%3E&role=user&blocked=%3Cboolean%3E"}`

---
### Lấy thông tin cá nhân
- **Method**: GET
- **Endpoint**: `/api/v1/users/me`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Cập nhật thông tin cá nhân
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/me`
- **Body**: `{
  "username": "<string>"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Cập nhật phân quyền người dùng (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/%3Cnumber%3E/role`
- **Body**: `{
  "role": "admin"
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:43.762Z","path":"/api/v1/users/%3Cnumber%3E/role"}`

---
### Gán gói cho người dùng (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/%3Cnumber%3E/plan`
- **Body**: `{
  "planId": "<number>"
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:43.837Z","path":"/api/v1/users/%3Cnumber%3E/plan"}`

---
### Khóa tài khoản (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/%3Cnumber%3E/block`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:43.932Z","path":"/api/v1/users/%3Cnumber%3E/block"}`

---
### Mở khóa tài khoản (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/%3Cnumber%3E/unblock`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:44.029Z","path":"/api/v1/users/%3Cnumber%3E/unblock"}`

---
### Danh sách gói (public)
- **Method**: GET
- **Endpoint**: `/api/v1/plans`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Tạo gói mới
- **Method**: POST
- **Endpoint**: `/api/v1/plans`
- **Body**: `{
  "name": "<string>",
  "slug": "<string>",
  "level": "<number>",
  "monthlyPrice": "<number>",
  "features": [
    "<string>",
    "<string>"
  ],
  "tagline": "<string>",
  "icon": "<string>",
  "theme": "<string>",
  "badge": "<string>",
  "semiAnnualPrice": "<number>",
  "originalPrice": "<number>",
  "discountPercent": "<number>",
  "description": "<string>",
  "ctaLabel": "<string>",
  "isPopular": "<boolean>",
  "highlighted": "<boolean>",
  "isActive": "<boolean>",
  "sortOrder": "<number>",
  "fieldVisibility": {}
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:44.212Z","path":"/api/v1/plans"}`

---
### Danh sách gói (admin)
- **Method**: GET
- **Endpoint**: `/api/v1/plans/admin`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:44.306Z","path":"/api/v1/plans/admin"}`

---
### Chi tiết gói
- **Method**: GET
- **Endpoint**: `/api/v1/plans/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy gói","error":"Not Found","timestamp":"2026-07-08T08:49:44.397Z","path":"/api/v1/plans/%3Cstring%3E"}`

---
### Cập nhật gói
- **Method**: PATCH
- **Endpoint**: `/api/v1/plans/%3Cstring%3E`
- **Body**: `{
  "name": "<string>",
  "tagline": "<string>",
  "icon": "<string>",
  "theme": "<string>",
  "badge": "<string>",
  "monthlyPrice": "<number>",
  "semiAnnualPrice": "<number>",
  "originalPrice": "<number>",
  "discountPercent": "<number>",
  "description": "<string>",
  "features": [
    "<string>",
    "<string>"
  ],
  "ctaLabel": "<string>",
  "isPopular": "<boolean>",
  "highlighted": "<boolean>",
  "isActive": "<boolean>",
  "sortOrder": "<number>",
  "fieldVisibility": {}
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:44.479Z","path":"/api/v1/plans/%3Cstring%3E"}`

---
### Xóa gói
- **Method**: DELETE
- **Endpoint**: `/api/v1/plans/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:44.572Z","path":"/api/v1/plans/%3Cstring%3E"}`

---
### Cập nhật quyền xem dữ liệu theo plan
- **Method**: PATCH
- **Endpoint**: `/api/v1/plans/%3Cstring%3E/field-visibility`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:44.631Z","path":"/api/v1/plans/%3Cstring%3E/field-visibility"}`

---
### Danh sách danh mục
- **Method**: GET
- **Endpoint**: `/api/v1/categories`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Tạo danh mục
- **Method**: POST
- **Endpoint**: `/api/v1/categories`
- **Body**: `{
  "name": "<string>",
  "slug": "<string>",
  "isVisibleOnUI": "<boolean>"
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:44.791Z","path":"/api/v1/categories"}`

---
### Chi tiết danh mục
- **Method**: GET
- **Endpoint**: `/api/v1/categories/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy danh mục","error":"Not Found","timestamp":"2026-07-08T08:49:44.884Z","path":"/api/v1/categories/%3Cstring%3E"}`

---
### Cập nhật danh mục
- **Method**: PATCH
- **Endpoint**: `/api/v1/categories/%3Cstring%3E`
- **Body**: `{
  "name": "<string>",
  "slug": "<string>",
  "isVisibleOnUI": "<boolean>"
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:44.973Z","path":"/api/v1/categories/%3Cstring%3E"}`

---
### Xóa danh mục
- **Method**: DELETE
- **Endpoint**: `/api/v1/categories/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:45.068Z","path":"/api/v1/categories/%3Cstring%3E"}`

---
### Danh sách bài viết
- **Method**: GET
- **Endpoint**: `/api/v1/articles`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Tạo bài viết
- **Method**: POST
- **Endpoint**: `/api/v1/articles`
- **Body**: `{
  "title": "<string>",
  "description": "<string>",
  "slug": "<string>",
  "contentBlocks": [
    {
      "content": "<string>",
      "id": "<string>",
      "type": "<string>"
    },
    {
      "content": "<string>",
      "id": "<string>",
      "type": "<string>"
    }
  ],
  "categoryId": "<number>",
  "publishedAt": "<string>",
  "coverUrl": "<string>",
  "tagIds": [
    "<string>",
    "<string>"
  ],
  "readPermission": "<string>",
  "planIds": [
    "<string>",
    "<string>"
  ]
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:45.240Z","path":"/api/v1/articles"}`

---
### Danh sách bài viết của tôi
- **Method**: GET
- **Endpoint**: `/api/v1/articles/me`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Danh sách bài viết (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/articles/admin/list`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:45.427Z","path":"/api/v1/articles/admin/list?category=%3Cstring%3E&cursor=%3Cnumber%3E&limit=%3Cnumber%3E"}`

---
### Chi tiết bài viết (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/articles/admin/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:45.519Z","path":"/api/v1/articles/admin/%3Cstring%3E"}`

---
### Chi tiết bài viết
- **Method**: GET
- **Endpoint**: `/api/v1/articles/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy bài viết","error":"Not Found","timestamp":"2026-07-08T08:49:45.621Z","path":"/api/v1/articles/%3Cstring%3E"}`

---
### Cập nhật bài viết
- **Method**: PATCH
- **Endpoint**: `/api/v1/articles/%3Cstring%3E`
- **Body**: `{
  "title": "<string>",
  "description": "<string>",
  "slug": "<string>",
  "publishedAt": "<string>",
  "contentBlocks": [
    {
      "content": "<string>",
      "id": "<string>",
      "type": "<string>"
    },
    {
      "content": "<string>",
      "id": "<string>",
      "type": "<string>"
    }
  ],
  "coverUrl": "<string>",
  "categoryId": "<number>",
  "tagIds": [
    "<string>",
    "<string>"
  ],
  "readPermission": "<string>",
  "planIds": [
    "<string>",
    "<string>"
  ]
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:45.705Z","path":"/api/v1/articles/%3Cstring%3E"}`

---
### Xóa bài viết
- **Method**: DELETE
- **Endpoint**: `/api/v1/articles/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy bài viết","error":"Not Found","timestamp":"2026-07-08T08:49:45.785Z","path":"/api/v1/articles/%3Cstring%3E"}`

---
### Lấy tất cả danh mục đầu tư (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/portfolios/all`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:45.876Z","path":"/api/v1/portfolios/all"}`

---
### Danh mục đầu tư mới nhất
- **Method**: GET
- **Endpoint**: `/api/v1/portfolios`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy gói","error":"Not Found","timestamp":"2026-07-08T08:49:45.975Z","path":"/api/v1/portfolios?plan=%3Cstring%3E"}`

---
### Tạo danh mục đầu tư
- **Method**: POST
- **Endpoint**: `/api/v1/portfolios`
- **Body**: `{
  "planId": "<number>",
  "publishedAt": "<string>",
  "stocks": [
    {
      "symbol": "<string>",
      "purchaseDate": "<string>",
      "costBasis": "<number>",
      "marketPrice": "<number>",
      "quantity": "<number>",
      "sector": "<string>",
      "note": "<string>"
    },
    {
      "symbol": "<string>",
      "purchaseDate": "<string>",
      "costBasis": "<number>",
      "marketPrice": "<number>",
      "quantity": "<number>",
      "sector": "<string>",
      "note": "<string>"
    }
  ],
  "information": [
    {
      "month": "<string>",
      "vnindexReturn": "<number>",
      "recommendReturn": "<number>"
    },
    {
      "month": "<string>",
      "vnindexReturn": "<number>",
      "recommendReturn": "<number>"
    }
  ],
  "reasons": [
    {
      "type": "sell",
      "symbol": "<string>",
      "content": "<string>"
    },
    {
      "type": "sell",
      "symbol": "<string>",
      "content": "<string>"
    }
  ],
  "signals": [
    {
      "symbol": "<string>",
      "signalType": "<string>",
      "description": "<string>",
      "targetPrice": "<number>",
      "stopLoss": "<number>"
    },
    {
      "symbol": "<string>",
      "signalType": "<string>",
      "description": "<string>",
      "targetPrice": "<number>",
      "stopLoss": "<number>"
    }
  ]
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:46.065Z","path":"/api/v1/portfolios"}`

---
### Cập nhật danh mục đầu tư
- **Method**: PATCH
- **Endpoint**: `/api/v1/portfolios/%3Cnumber%3E`
- **Body**: `{
  "planId": "<number>",
  "publishedAt": "<string>",
  "stocks": [
    {
      "symbol": "<string>",
      "purchaseDate": "<string>",
      "costBasis": "<number>",
      "marketPrice": "<number>",
      "quantity": "<number>",
      "sector": "<string>",
      "note": "<string>"
    },
    {
      "symbol": "<string>",
      "purchaseDate": "<string>",
      "costBasis": "<number>",
      "marketPrice": "<number>",
      "quantity": "<number>",
      "sector": "<string>",
      "note": "<string>"
    }
  ],
  "information": [
    {
      "month": "<string>",
      "vnindexReturn": "<number>",
      "recommendReturn": "<number>"
    },
    {
      "month": "<string>",
      "vnindexReturn": "<number>",
      "recommendReturn": "<number>"
    }
  ],
  "reasons": [
    {
      "type": "sell",
      "symbol": "<string>",
      "content": "<string>"
    },
    {
      "type": "sell",
      "symbol": "<string>",
      "content": "<string>"
    }
  ],
  "signals": [
    {
      "symbol": "<string>",
      "signalType": "<string>",
      "description": "<string>",
      "targetPrice": "<number>",
      "stopLoss": "<number>"
    },
    {
      "symbol": "<string>",
      "signalType": "<string>",
      "description": "<string>",
      "targetPrice": "<number>",
      "stopLoss": "<number>"
    }
  ]
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:46.153Z","path":"/api/v1/portfolios/%3Cnumber%3E"}`

---
### Xóa danh mục đầu tư
- **Method**: DELETE
- **Endpoint**: `/api/v1/portfolios/%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:46.246Z","path":"/api/v1/portfolios/%3Cnumber%3E"}`

---
### Tạo S3 Pre-signed URL
- **Method**: POST
- **Endpoint**: `/api/v1/uploads/presign`
- **Body**: `{
  "filename": "<string>",
  "contentType": "<string>"
}`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Cannot POST /api/v1/uploads/presign","error":"Not Found","timestamp":"2026-07-08T08:49:46.346Z","path":"/api/v1/uploads/presign"}`

---
### Kiểm tra trạng thái hệ thống
- **Method**: GET
- **Endpoint**: `/api/v1/health`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Dashboard Controller get Stats
- **Method**: GET
- **Endpoint**: `/api/v1/dashboard/stats`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:46.534Z","path":"/api/v1/dashboard/stats"}`

---
### Tags Controller find All
- **Method**: GET
- **Endpoint**: `/api/v1/tags`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Tags Controller create
- **Method**: POST
- **Endpoint**: `/api/v1/tags`
- **Body**: `{
  "name": "<string>",
  "slug": "<string>"
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:46.718Z","path":"/api/v1/tags"}`

---
### Tags Controller update
- **Method**: PATCH
- **Endpoint**: `/api/v1/tags/%3Cstring%3E`
- **Body**: `{
  "name": "<string>",
  "slug": "<string>"
}`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:46.813Z","path":"/api/v1/tags/%3Cstring%3E"}`

---
### Tags Controller remove
- **Method**: DELETE
- **Endpoint**: `/api/v1/tags/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 403 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":403,"message":"Bạn không có quyền thực hiện hành động này","error":"Forbidden","timestamp":"2026-07-08T08:49:46.906Z","path":"/api/v1/tags/%3Cstring%3E"}`

---

**Tổng kết**: 27 PASS / 60 TOTAL
