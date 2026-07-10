/**
 * Standard error messages cho toàn bộ ứng dụng
 */
export const ERROR_MESSAGES = {
  // Authentication
  AUTH: {
    TOKEN_NOT_FOUND: "Không tìm thấy token",
    TOKEN_INVALID: "Token không hợp lệ",
    SESSION_EXPIRED: "Phiên đăng nhập đã hết hạn",
    LOGIN_FAILED: "Đăng nhập thất bại",
    REGISTER_FAILED: "Đăng ký thất bại",
    LOGOUT_FAILED: "Đăng xuất thất bại",
  },

  // Validation
  VALIDATION: {
    REQUIRED_FIELDS: "Vui lòng điền đầy đủ thông tin",
    INVALID_EMAIL: "Email không hợp lệ",
    INVALID_PASSWORD: "Mật khẩu không hợp lệ",
    USER_ID_REQUIRED: "User ID không được để trống",
  },

  // API
  API: {
    INVALID_RESPONSE: "Phản hồi từ server không hợp lệ",
    NETWORK_ERROR: "Lỗi kết nối mạng",
    SERVER_ERROR: "Có lỗi xảy ra từ server",
    UNKNOWN_ERROR: "Có lỗi xảy ra",
  },

  // User
  USER: {
    NOT_FOUND: "Không tìm thấy người dùng",
    UPDATE_FAILED: "Cập nhật thông tin thất bại",
    GET_PROFILE_FAILED: "Không thể lấy thông tin người dùng",
  },

  // Article
  ARTICLE: {
    NOT_FOUND: "Không tìm thấy bài viết",
    LOAD_FAILED: "Không thể tải bài viết",
  },
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Đăng nhập thành công",
    REGISTER_SUCCESS: "Đăng ký thành công",
    LOGOUT_SUCCESS: "Đăng xuất thành công",
  },
  USER: {
    UPDATE_SUCCESS: "Cập nhật thông tin thành công",
    GET_PROFILE_SUCCESS: "Lấy thông tin user thành công",
  },
} as const;

