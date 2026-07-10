## Giai đoạn 2 - Kết quả test module: Categories, Tags, Articles

### Đăng nhập
- **Method**: POST
- **Endpoint**: `/api/v1/auth/login`
- **Body**: `{
  "email": "<string>",
  "password": "<string>"
}`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Email không hợp lệ","error":"Bad Request","timestamp":"2026-07-08T09:14:20.196Z","path":"/api/v1/auth/login"}`

---
### Đăng ký
- **Method**: POST
- **Endpoint**: `/api/v1/auth/register`
- **Body**: `{
  "email": "<string>",
  "username": "<string>",
  "password": "<string>",
  "confirmPassword": "<string>",
  "fullName": "<string>",
  "phoneNumber": "<string>"
}`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Email không hợp lệ; Số điện thoại không hợp lệ","error":"Bad Request","timestamp":"2026-07-08T09:14:20.302Z","path":"/api/v1/auth/register"}`

---
### Làm mới token
- **Method**: POST
- **Endpoint**: `/api/v1/auth/refresh`
- **Body**: `{
  "refresh_token": "<string>"
}`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Invalid or expired refresh token","error":"Unauthorized","timestamp":"2026-07-08T09:14:20.401Z","path":"/api/v1/auth/refresh"}`

---
### Đăng xuất
- **Method**: POST
- **Endpoint**: `/api/v1/auth/logout`
- **Body**: `{
  "refresh_token": "<string>"
}`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:20.490Z","path":"/api/v1/auth/logout"}`

---
### Đổi mật khẩu
- **Method**: POST
- **Endpoint**: `/api/v1/auth/change-password`
- **Body**: `{
  "oldPassword": "<string>",
  "newPassword": "<string>"
}`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:20.584Z","path":"/api/v1/auth/change-password"}`

---
### Quên mật khẩu
- **Method**: POST
- **Endpoint**: `/api/v1/auth/forgot-password`
- **Body**: `{
  "email": "<string>"
}`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Email không hợp lệ","error":"Bad Request","timestamp":"2026-07-08T09:14:20.669Z","path":"/api/v1/auth/forgot-password"}`

---
### Xác minh OTP
- **Method**: POST
- **Endpoint**: `/api/v1/auth/verify-otp`
- **Body**: `{
  "email": "<string>",
  "otp": "<string>"
}`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Email không hợp lệ; OTP phải có đúng 6 ký tự","error":"Bad Request","timestamp":"2026-07-08T09:14:20.757Z","path":"/api/v1/auth/verify-otp"}`

---
### Đặt lại mật khẩu
- **Method**: POST
- **Endpoint**: `/api/v1/auth/reset-password`
- **Body**: `{
  "resetToken": "<string>",
  "newPassword": "<string>"
}`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Token không hợp lệ hoặc đã hết hạn","error":"Unauthorized","timestamp":"2026-07-08T09:14:20.836Z","path":"/api/v1/auth/reset-password"}`

---
### Xóa tài khoản (Admin)
- **Method**: DELETE
- **Endpoint**: `/api/v1/users/%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:20.928Z","path":"/api/v1/users/%3Cnumber%3E"}`

---
### Chi tiết người dùng (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/users/%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:21.026Z","path":"/api/v1/users/%3Cnumber%3E"}`

---
### Danh sách người dùng (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/users?page=%3Cnumber%3E&limit=%3Cnumber%3E&role=user&blocked=%3Cboolean%3E`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:21.115Z","path":"/api/v1/users?page=%3Cnumber%3E&limit=%3Cnumber%3E&role=user&blocked=%3Cboolean%3E"}`

---
### Lấy thông tin cá nhân
- **Method**: GET
- **Endpoint**: `/api/v1/users/me`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:21.210Z","path":"/api/v1/users/me"}`

---
### Cập nhật thông tin cá nhân
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/me`
- **Body**: `{
  "username": "<string>"
}`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:21.302Z","path":"/api/v1/users/me"}`

---
### Cập nhật phân quyền người dùng (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/%3Cnumber%3E/role`
- **Body**: `{
  "role": "admin"
}`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:21.394Z","path":"/api/v1/users/%3Cnumber%3E/role"}`

---
### Gán gói cho người dùng (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/%3Cnumber%3E/plan`
- **Body**: `{
  "planId": "<number>"
}`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:21.488Z","path":"/api/v1/users/%3Cnumber%3E/plan"}`

---
### Khóa tài khoản (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/%3Cnumber%3E/block`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:21.578Z","path":"/api/v1/users/%3Cnumber%3E/block"}`

---
### Mở khóa tài khoản (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/%3Cnumber%3E/unblock`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:21.671Z","path":"/api/v1/users/%3Cnumber%3E/unblock"}`

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
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:21.861Z","path":"/api/v1/plans"}`

---
### Danh sách gói (admin)
- **Method**: GET
- **Endpoint**: `/api/v1/plans/admin`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:21.955Z","path":"/api/v1/plans/admin"}`

---
### Chi tiết gói
- **Method**: GET
- **Endpoint**: `/api/v1/plans/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy gói","error":"Not Found","timestamp":"2026-07-08T09:14:22.036Z","path":"/api/v1/plans/%3Cstring%3E"}`

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
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:22.129Z","path":"/api/v1/plans/%3Cstring%3E"}`

---
### Xóa gói
- **Method**: DELETE
- **Endpoint**: `/api/v1/plans/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:22.222Z","path":"/api/v1/plans/%3Cstring%3E"}`

---
### Cập nhật quyền xem dữ liệu theo plan
- **Method**: PATCH
- **Endpoint**: `/api/v1/plans/%3Cstring%3E/field-visibility`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:22.314Z","path":"/api/v1/plans/%3Cstring%3E/field-visibility"}`

---
### Tạo danh mục - Thành công (Admin)
- **Method**: POST
- **Endpoint**: `/api/v1/categories`
- **Body**: `{
  "name": "Category Test",
  "slug": "cat-1783502059890"
}`
- **Status**: 201
- **Kết quả**: ✅ PASS

---
### Tạo danh mục - Trùng slug (Admin)
- **Method**: POST
- **Endpoint**: `/api/v1/categories`
- **Body**: `{
  "name": "Category Test 2",
  "slug": "cat-1783502059890"
}`
- **Status**: 409
- **Kết quả**: ✅ PASS

---
### Tạo danh mục - Forbidden (User)
- **Method**: POST
- **Endpoint**: `/api/v1/categories`
- **Body**: `{
  "name": "User Cat"
}`
- **Status**: 403
- **Kết quả**: ✅ PASS

---
### Danh sách danh mục - Danh sách danh mục (Public)
- **Method**: GET
- **Endpoint**: `/api/v1/categories`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Chi tiết danh mục - Chi tiết danh mục (Public)
- **Method**: GET
- **Endpoint**: `/api/v1/categories/cat-1783502059890`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Cập nhật danh mục - Cập nhật danh mục (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/categories/cat-1783502059890`
- **Body**: `{
  "name": "Category Test Updated"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Xóa danh mục - Xóa danh mục (Admin)
- **Method**: DELETE
- **Endpoint**: `/api/v1/categories/cat-1783502059890`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Tạo bài viết - Tạo bài viết (Admin)
- **Method**: POST
- **Endpoint**: `/api/v1/articles`
- **Body**: `{"title":"Test Article Title","description":"Test description","slug":"article-4783502059890","publishedAt":"2026-07-08T09:14:19.890Z","contentBlocks":[{"content":"Paragraph 1 content","type":"text","id":"block-1"}],"categoryId":1}`
- **Status**: 201
- **Kết quả**: ✅ PASS

---
### Tạo bài viết - Tạo bài viết - Lỗi thiếu field (Admin)
- **Method**: POST
- **Endpoint**: `/api/v1/articles`
- **Body**: `{
  "title": "No description"
}`
- **Status**: 400
- **Kết quả**: ✅ PASS

---
### Danh sách bài viết - Danh sách bài viết (Public)
- **Method**: GET
- **Endpoint**: `/api/v1/articles?category=%3Cstring%3E&cursor=%3Cnumber%3E&limit=%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Danh sách bài viết của tôi - Danh sách bài viết của tôi (User)
- **Method**: GET
- **Endpoint**: `/api/v1/articles/me?category=%3Cstring%3E&cursor=%3Cnumber%3E&limit=%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Danh sách bài viết của tôi - Danh sách bài viết của tôi (Unauthorized)
- **Method**: GET
- **Endpoint**: `/api/v1/articles/me?category=%3Cstring%3E&cursor=%3Cnumber%3E&limit=%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ✅ PASS

---
### Danh sách bài viết (Admin) - Danh sách bài viết Admin
- **Method**: GET
- **Endpoint**: `/api/v1/articles/admin/list`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Danh sách bài viết (Admin) - Danh sách bài viết Admin - Forbidden (User)
- **Method**: GET
- **Endpoint**: `/api/v1/articles/admin/list`
- **Body**: `undefined`
- **Status**: 403
- **Kết quả**: ✅ PASS

---
### Chi tiết bài viết (Admin) - Chi tiết bài viết Admin
- **Method**: GET
- **Endpoint**: `/api/v1/articles/admin/article-4783502059890`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Chi tiết bài viết - Chi tiết bài viết (Public)
- **Method**: GET
- **Endpoint**: `/api/v1/articles/article-4783502059890`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Chi tiết bài viết - Chi tiết bài viết (Non-existent)
- **Method**: GET
- **Endpoint**: `/api/v1/articles/non-existent-999`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ✅ PASS

---
### Cập nhật bài viết - Cập nhật bài viết (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/articles/article-4783502059890`
- **Body**: `{
  "title": "Updated Title"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Cập nhật bài viết - Cập nhật bài viết - Forbidden (User)
- **Method**: PATCH
- **Endpoint**: `/api/v1/articles/article-4783502059890`
- **Body**: `{
  "title": "Hacked"
}`
- **Status**: 403
- **Kết quả**: ✅ PASS

---
### Xóa bài viết - Xóa bài viết (Admin)
- **Method**: DELETE
- **Endpoint**: `/api/v1/articles/article-4783502059890`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Lấy tất cả danh mục đầu tư (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/portfolios/all`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:24.901Z","path":"/api/v1/portfolios/all"}`

---
### Danh mục đầu tư mới nhất
- **Method**: GET
- **Endpoint**: `/api/v1/portfolios?plan=%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy gói","error":"Not Found","timestamp":"2026-07-08T09:14:24.993Z","path":"/api/v1/portfolios?plan=%3Cstring%3E"}`

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
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:25.085Z","path":"/api/v1/portfolios"}`

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
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:25.180Z","path":"/api/v1/portfolios/%3Cnumber%3E"}`

---
### Xóa danh mục đầu tư
- **Method**: DELETE
- **Endpoint**: `/api/v1/portfolios/%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:25.272Z","path":"/api/v1/portfolios/%3Cnumber%3E"}`

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
- **Response Thực Tế**: `{"statusCode":404,"message":"Cannot POST /api/v1/uploads/presign","error":"Not Found","timestamp":"2026-07-08T09:14:25.364Z","path":"/api/v1/uploads/presign"}`

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
- **Status**: 401
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 401 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T09:14:25.554Z","path":"/api/v1/dashboard/stats"}`

---
### Tags Controller create - Thành công (Admin)
- **Method**: POST
- **Endpoint**: `/api/v1/tags`
- **Body**: `{
  "name": "Tag Test",
  "slug": "tag-1783502059890"
}`
- **Status**: 201
- **Kết quả**: ✅ PASS

---
### Tags Controller create - Forbidden (User)
- **Method**: POST
- **Endpoint**: `/api/v1/tags`
- **Body**: `{
  "name": "User Tag"
}`
- **Status**: 403
- **Kết quả**: ✅ PASS

---
### Tags Controller find All - Danh sách thẻ (Public)
- **Method**: GET
- **Endpoint**: `/api/v1/tags`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Tags Controller update - Cập nhật thẻ (Admin)
- **Method**: PATCH
- **Endpoint**: `/api/v1/tags/tag-1783502059890`
- **Body**: `{
  "name": "Tag Test Updated"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Tags Controller remove - Xóa thẻ (Admin)
- **Method**: DELETE
- **Endpoint**: `/api/v1/tags/tag-1783502059890`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---

**Tổng kết**: 27 PASS / 57 TOTAL
