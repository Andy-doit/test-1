## Giai đoạn 2 - Kết quả test module: Users

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
- **Response Thực Tế**: `{"statusCode":400,"message":"Email không hợp lệ","error":"Bad Request","timestamp":"2026-07-08T08:56:54.095Z","path":"/api/v1/auth/login"}`

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
- **Response Thực Tế**: `{"statusCode":400,"message":"Email không hợp lệ; Số điện thoại không hợp lệ","error":"Bad Request","timestamp":"2026-07-08T08:56:54.212Z","path":"/api/v1/auth/register"}`

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
- **Response Thực Tế**: `{"statusCode":401,"message":"Invalid or expired refresh token","error":"Unauthorized","timestamp":"2026-07-08T08:56:54.305Z","path":"/api/v1/auth/refresh"}`

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
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T08:56:54.399Z","path":"/api/v1/auth/logout"}`

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
- **Response Thực Tế**: `{"statusCode":401,"message":"Unauthorized","error":"Unauthorized","timestamp":"2026-07-08T08:56:54.491Z","path":"/api/v1/auth/change-password"}`

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
- **Response Thực Tế**: `{"statusCode":400,"message":"Email không hợp lệ","error":"Bad Request","timestamp":"2026-07-08T08:56:54.583Z","path":"/api/v1/auth/forgot-password"}`

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
- **Response Thực Tế**: `{"statusCode":400,"message":"Email không hợp lệ; OTP phải có đúng 6 ký tự","error":"Bad Request","timestamp":"2026-07-08T08:56:54.679Z","path":"/api/v1/auth/verify-otp"}`

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
- **Response Thực Tế**: `{"statusCode":401,"message":"Token không hợp lệ hoặc đã hết hạn","error":"Unauthorized","timestamp":"2026-07-08T08:56:54.770Z","path":"/api/v1/auth/reset-password"}`

---
### Lấy thông tin cá nhân - Thành công (User Token)
- **Method**: GET
- **Endpoint**: `/api/v1/users/me`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Lấy thông tin cá nhân - Không có Token
- **Method**: GET
- **Endpoint**: `/api/v1/users/me`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected response to have status code 401 but got 200
- **Response Thực Tế**: `{"id":1,"email":"admin@app.com","username":"admin","fullName":null,"phoneNumber":null,"role":"admin","provider":"local","confirmed":true,"blocked":false,"passwordChangedAt":null,"plan":null,"createdAt":"2026-07-07T10:59:16.864Z","updatedAt":"2026-07-08T07:27:53.204Z"}`

---
### Cập nhật thông tin cá nhân - Thành công (Update Name)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/me`
- **Body**: `{
  "fullName": "Updated Name"
}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Cập nhật thông tin cá nhân - Không có Token
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/me`
- **Body**: `{
  "fullName": "Hacked"
}`
- **Status**: 200
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected response to have status code 401 but got 200
- **Response Thực Tế**: `{"id":1,"email":"admin@app.com","username":"admin","fullName":"Hacked","phoneNumber":null,"role":"admin","provider":"local","confirmed":true,"blocked":false,"passwordChangedAt":null,"plan":null,"createdAt":"2026-07-07T10:59:16.864Z","updatedAt":"2026-07-08T08:56:55.756Z"}`

---
### Danh sách người dùng (Admin) - Thành công (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/users?page=%3Cnumber%3E&limit=%3Cnumber%3E&role=user&blocked=%3Cboolean%3E`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Danh sách người dùng (Admin) - Phân trang & Tìm kiếm
- **Method**: GET
- **Endpoint**: `/api/v1/users?page=1&limit=5&search=admin?page=%3Cnumber%3E&limit=%3Cnumber%3E&role=user&blocked=%3Cboolean%3E`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Danh sách người dùng (Admin) - Forbidden (User)
- **Method**: GET
- **Endpoint**: `/api/v1/users?page=%3Cnumber%3E&limit=%3Cnumber%3E&role=user&blocked=%3Cboolean%3E`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected response to have status code 403 but got 200
- **Response Thực Tế**: `{"data":[],"total":0,"page":1,"limit":20,"totalPages":0}`

---
### Chi tiết người dùng (Admin) - Thành công (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/users/1`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Chi tiết người dùng (Admin) - Non-existent ID
- **Method**: GET
- **Endpoint**: `/api/v1/users/999999`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ✅ PASS

---
### Chi tiết người dùng (Admin) - Forbidden (User)
- **Method**: GET
- **Endpoint**: `/api/v1/users/1`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected response to have status code 403 but got 200
- **Response Thực Tế**: `{"id":1,"email":"admin@app.com","username":"admin","fullName":"Hacked","phoneNumber":null,"role":"admin","provider":"local","confirmed":true,"blocked":false,"passwordChangedAt":null,"plan":null,"createdAt":"2026-07-07T10:59:16.864Z","updatedAt":"2026-07-08T08:56:55.756Z"}`

---
### Cập nhật phân quyền người dùng (Admin) - Thành công (Admin thay đổi)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/1/role`
- **Body**: `{
  "role": "admin"
}`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected response to have status code 200 but got 400
- **Response Thực Tế**: `{"statusCode":400,"message":"Không thể thay đổi role của chính mình","error":"Bad Request","timestamp":"2026-07-08T08:56:56.413Z","path":"/api/v1/users/1/role"}`

---
### Cập nhật phân quyền người dùng (Admin) - Forbidden (User tự đổi role)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/1/role`
- **Body**: `{
  "role": "admin"
}`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected response to have status code 403 but got 400
- **Response Thực Tế**: `{"statusCode":400,"message":"Không thể thay đổi role của chính mình","error":"Bad Request","timestamp":"2026-07-08T08:56:56.491Z","path":"/api/v1/users/1/role"}`

---
### Gán gói cho người dùng (Admin) - Thành công (Admin đổi plan)
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/1/plan`
- **Body**: `{
  "planId": "titan"
}`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected response to have status code 200 but got 400
- **Response Thực Tế**: `{"statusCode":400,"message":"planId phải là số nguyên","error":"Bad Request","timestamp":"2026-07-08T08:56:56.584Z","path":"/api/v1/users/1/plan"}`

---
### Khóa tài khoản (Admin) - Khóa tài khoản
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/1/block`
- **Body**: `{}`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected response to have status code 200 but got 400
- **Response Thực Tế**: `{"statusCode":400,"message":"Không thể tự khóa tài khoản của mình","error":"Bad Request","timestamp":"2026-07-08T08:56:56.677Z","path":"/api/v1/users/1/block"}`

---
### Mở khóa tài khoản (Admin) - Mở khóa tài khoản
- **Method**: PATCH
- **Endpoint**: `/api/v1/users/1/unblock`
- **Body**: `{}`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Xóa tài khoản (Admin) - Forbidden (User xóa Admin)
- **Method**: DELETE
- **Endpoint**: `/api/v1/users/1`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected response to have status code 403 but got 200
- **Response Thực Tế**: `{"message":"Tài khoản đã bị xóa thành công"}`

---
### Xóa tài khoản (Admin) - Thành công (Admin xóa User)
- **Method**: DELETE
- **Endpoint**: `/api/v1/users/1`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected response to have status code 200 but got 404
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy người dùng","error":"Not Found","timestamp":"2026-07-08T08:56:56.958Z","path":"/api/v1/users/1"}`

---
### Xóa tài khoản (Admin) - Non-existent ID
- **Method**: DELETE
- **Endpoint**: `/api/v1/users/999999`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ✅ PASS

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
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Slug chỉ được chứa chữ thường, số và dấu gạch ngang; level must not be less than 0; level must be an integer number; Theme phải là dark, purple hoặc gold; Giá không được âm; monthlyPrice must be a number conforming to the specified constraints; Giá không được âm; semiAnnualPrice must be a number conforming to the specified constraints; Giá không được âm; originalPrice must be a number conforming to the specified constraints; discountPercent must not be greater than 100; discountPercent must not be less than 0; discountPercent must be an integer number; sortOrder must be an integer number; fieldVisibility.planId must be an integer number","error":"Bad Request","timestamp":"2026-07-08T08:56:57.203Z","path":"/api/v1/plans"}`

---
### Danh sách gói (admin)
- **Method**: GET
- **Endpoint**: `/api/v1/plans/admin`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Chi tiết gói
- **Method**: GET
- **Endpoint**: `/api/v1/plans/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy gói","error":"Not Found","timestamp":"2026-07-08T08:56:57.376Z","path":"/api/v1/plans/%3Cstring%3E"}`

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
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Theme phải là dark, purple hoặc gold; Giá không được âm; monthlyPrice must be a number conforming to the specified constraints; Giá không được âm; semiAnnualPrice must be a number conforming to the specified constraints; Giá không được âm; originalPrice must be a number conforming to the specified constraints; discountPercent must not be greater than 100; discountPercent must not be less than 0; discountPercent must be an integer number; sortOrder must be an integer number; fieldVisibility.planId must be an integer number","error":"Bad Request","timestamp":"2026-07-08T08:56:57.469Z","path":"/api/v1/plans/%3Cstring%3E"}`

---
### Xóa gói
- **Method**: DELETE
- **Endpoint**: `/api/v1/plans/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy gói","error":"Not Found","timestamp":"2026-07-08T08:56:57.546Z","path":"/api/v1/plans/%3Cstring%3E"}`

---
### Cập nhật quyền xem dữ liệu theo plan
- **Method**: PATCH
- **Endpoint**: `/api/v1/plans/%3Cstring%3E/field-visibility`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy gói","error":"Not Found","timestamp":"2026-07-08T08:56:57.629Z","path":"/api/v1/plans/%3Cstring%3E/field-visibility"}`

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
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Slug không hợp lệ","error":"Bad Request","timestamp":"2026-07-08T08:56:57.800Z","path":"/api/v1/categories"}`

---
### Chi tiết danh mục
- **Method**: GET
- **Endpoint**: `/api/v1/categories/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy danh mục","error":"Not Found","timestamp":"2026-07-08T08:56:57.892Z","path":"/api/v1/categories/%3Cstring%3E"}`

---
### Cập nhật danh mục
- **Method**: PATCH
- **Endpoint**: `/api/v1/categories/%3Cstring%3E`
- **Body**: `{
  "name": "<string>",
  "slug": "<string>",
  "isVisibleOnUI": "<boolean>"
}`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Slug không hợp lệ","error":"Bad Request","timestamp":"2026-07-08T08:56:57.984Z","path":"/api/v1/categories/%3Cstring%3E"}`

---
### Xóa danh mục
- **Method**: DELETE
- **Endpoint**: `/api/v1/categories/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy danh mục","error":"Not Found","timestamp":"2026-07-08T08:56:58.081Z","path":"/api/v1/categories/%3Cstring%3E"}`

---
### Danh sách bài viết
- **Method**: GET
- **Endpoint**: `/api/v1/articles?category=%3Cstring%3E&cursor=%3Cnumber%3E&limit=%3Cnumber%3E`
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
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Slug không hợp lệ; Ngày xuất bản không hợp lệ; categoryId phải là số nguyên; Mỗi tagId phải là số nguyên; Mỗi planId phải là số nguyên","error":"Bad Request","timestamp":"2026-07-08T08:56:58.251Z","path":"/api/v1/articles"}`

---
### Danh sách bài viết của tôi
- **Method**: GET
- **Endpoint**: `/api/v1/articles/me?category=%3Cstring%3E&cursor=%3Cnumber%3E&limit=%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Danh sách bài viết (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/articles/admin/list?category=%3Cstring%3E&cursor=%3Cnumber%3E&limit=%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Chi tiết bài viết (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/articles/admin/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy bài viết","error":"Not Found","timestamp":"2026-07-08T08:56:58.532Z","path":"/api/v1/articles/admin/%3Cstring%3E"}`

---
### Chi tiết bài viết
- **Method**: GET
- **Endpoint**: `/api/v1/articles/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy bài viết","error":"Not Found","timestamp":"2026-07-08T08:56:58.626Z","path":"/api/v1/articles/%3Cstring%3E"}`

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
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Slug không hợp lệ; Ngày xuất bản không hợp lệ; categoryId phải là số nguyên; Mỗi tagId phải là số nguyên; Mỗi planId phải là số nguyên","error":"Bad Request","timestamp":"2026-07-08T08:56:58.713Z","path":"/api/v1/articles/%3Cstring%3E"}`

---
### Xóa bài viết
- **Method**: DELETE
- **Endpoint**: `/api/v1/articles/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy bài viết","error":"Not Found","timestamp":"2026-07-08T08:56:58.810Z","path":"/api/v1/articles/%3Cstring%3E"}`

---
### Lấy tất cả danh mục đầu tư (Admin)
- **Method**: GET
- **Endpoint**: `/api/v1/portfolios/all`
- **Body**: `undefined`
- **Status**: 200
- **Kết quả**: ✅ PASS

---
### Danh mục đầu tư mới nhất
- **Method**: GET
- **Endpoint**: `/api/v1/portfolios?plan=%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy gói","error":"Not Found","timestamp":"2026-07-08T08:56:59.001Z","path":"/api/v1/portfolios?plan=%3Cstring%3E"}`

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
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"planId phải là số nguyên; Ngày công bố không hợp lệ; stocks.0.Ngày mua không hợp lệ; stocks.0.Giá mua không được âm; stocks.0.costBasis must be a number conforming to the specified constraints; stocks.0.Giá thị trường không được âm; stocks.0.marketPrice must be a number conforming to the specified constraints; stocks.0.Số lượng không được âm; stocks.0.quantity must be an integer number; stocks.1.Ngày mua không hợp lệ; stocks.1.Giá mua không được âm; stocks.1.costBasis must be a number conforming to the specified constraints; stocks.1.Giá thị trường không được âm; stocks.1.marketPrice must be a number conforming to the specified constraints; stocks.1.Số lượng không được âm; stocks.1.quantity must be an integer number; information.0.vnindexReturn must be a number conforming to the specified constraints; information.0.recommendReturn must be a number conforming to the specified constraints; information.1.vnindexReturn must be a number conforming to the specified constraints; information.1.recommendReturn must be a number conforming to the specified constraints; signals.0.targetPrice must be a number conforming to the specified constraints; signals.0.stopLoss must be a number conforming to the specified constraints; signals.1.targetPrice must be a number conforming to the specified constraints; signals.1.stopLoss must be a number conforming to the specified constraints","error":"Bad Request","timestamp":"2026-07-08T08:56:59.092Z","path":"/api/v1/portfolios"}`

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
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"planId phải là số nguyên; Ngày công bố không hợp lệ; stocks.0.Ngày mua không hợp lệ; stocks.0.Giá mua không được âm; stocks.0.costBasis must be a number conforming to the specified constraints; stocks.0.Giá thị trường không được âm; stocks.0.marketPrice must be a number conforming to the specified constraints; stocks.0.Số lượng không được âm; stocks.0.quantity must be an integer number; stocks.1.Ngày mua không hợp lệ; stocks.1.Giá mua không được âm; stocks.1.costBasis must be a number conforming to the specified constraints; stocks.1.Giá thị trường không được âm; stocks.1.marketPrice must be a number conforming to the specified constraints; stocks.1.Số lượng không được âm; stocks.1.quantity must be an integer number; information.0.vnindexReturn must be a number conforming to the specified constraints; information.0.recommendReturn must be a number conforming to the specified constraints; information.1.vnindexReturn must be a number conforming to the specified constraints; information.1.recommendReturn must be a number conforming to the specified constraints; signals.0.targetPrice must be a number conforming to the specified constraints; signals.0.stopLoss must be a number conforming to the specified constraints; signals.1.targetPrice must be a number conforming to the specified constraints; signals.1.stopLoss must be a number conforming to the specified constraints","error":"Bad Request","timestamp":"2026-07-08T08:56:59.183Z","path":"/api/v1/portfolios/%3Cnumber%3E"}`

---
### Xóa danh mục đầu tư
- **Method**: DELETE
- **Endpoint**: `/api/v1/portfolios/%3Cnumber%3E`
- **Body**: `undefined`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Validation failed (numeric string is expected)","error":"Bad Request","timestamp":"2026-07-08T08:56:59.264Z","path":"/api/v1/portfolios/%3Cnumber%3E"}`

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
- **Response Thực Tế**: `{"statusCode":404,"message":"Cannot POST /api/v1/uploads/presign","error":"Not Found","timestamp":"2026-07-08T08:56:59.352Z","path":"/api/v1/uploads/presign"}`

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
- **Status**: 200
- **Kết quả**: ✅ PASS

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
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Slug không hợp lệ","error":"Bad Request","timestamp":"2026-07-08T08:56:59.712Z","path":"/api/v1/tags"}`

---
### Tags Controller update
- **Method**: PATCH
- **Endpoint**: `/api/v1/tags/%3Cstring%3E`
- **Body**: `{
  "name": "<string>",
  "slug": "<string>"
}`
- **Status**: 400
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 400 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":400,"message":"Slug không hợp lệ","error":"Bad Request","timestamp":"2026-07-08T08:56:59.808Z","path":"/api/v1/tags/%3Cstring%3E"}`

---
### Tags Controller remove
- **Method**: DELETE
- **Endpoint**: `/api/v1/tags/%3Cstring%3E`
- **Body**: `undefined`
- **Status**: 404
- **Kết quả**: ❌ FAIL
- **Lỗi Assertion**: expected 404 to be one of [ 200, 201, 204 ]
- **Response Thực Tế**: `{"statusCode":404,"message":"Không tìm thấy thẻ","error":"Not Found","timestamp":"2026-07-08T08:56:59.898Z","path":"/api/v1/tags/%3Cstring%3E"}`

---

**Tổng kết**: 18 PASS / 58 TOTAL
