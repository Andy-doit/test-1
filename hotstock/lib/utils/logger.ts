/**
 * Logger utility để quản lý console logs
 * - Trong development: hiển thị tất cả logs
 * - Trong production: chỉ hiển thị errors, ẩn logs/warns
 */

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Log thông tin (chỉ trong development)
   */
  log: (...args: unknown[]): void => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Log lỗi (luôn hiển thị, kể cả production)
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },

  /**
   * Log cảnh báo (chỉ trong development)
   */
  warn: (...args: unknown[]): void => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * Log thông tin debug (chỉ trong development)
   */
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * Log thông tin (chỉ trong development)
   */
  info: (...args: unknown[]): void => {
    if (isDev) {
      console.info(...args);
    }
  },
};

