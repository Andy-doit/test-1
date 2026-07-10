"use client";

import { useAuthStore } from "@/stores/authStore";
import { logger } from "@/lib/utils/logger";
import { clearAuthCookies } from "@/lib/utils/cookies";

let isHandlingExpiredToken = false;

/**
 * Xử lý khi token hết hạn
 * Tự động logout và redirect về trang login
 */
export async function handleExpiredToken(): Promise<void> {
  // Tránh xử lý nhiều lần khi có nhiều request cùng lúc
  if (isHandlingExpiredToken) {
    return;
  }

  isHandlingExpiredToken = true;

  try {
    // Clear auth store (xoá trạng thái client)
    const { isAuthenticated, logout } = useAuthStore.getState();
    const wasAuthenticated = isAuthenticated;
    logout();

    // Clear cookies, localStorage & sessionStorage ở client
    if (typeof window !== "undefined") {
      // Xoá triệt để các cookies liên quan đến auth
      clearAuthCookies();

      // Xoá dữ liệu lưu trữ
      localStorage.removeItem("auth-storage");
      sessionStorage.clear();

      const currentPath = window.location.pathname;
      const protectedRoutes = ["/admin", "/profile"];
      const isProtected = protectedRoutes.some((route) => currentPath.startsWith(route));
      
      if (isProtected) {
        const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
        window.location.href = redirectUrl;
      } else if (wasAuthenticated) {
        // Trang công cộng: chỉ tải lại trang nếu trước đó người dùng thực sự đã đăng nhập (tránh vòng lặp tải lại liên tục)
        window.location.href = currentPath;
      }
    }
  } catch (error) {
    // Log error (logger tự xử lý development/production)
    logger.error("Error handling expired token:", error);
  } finally {
    // Reset flag sau 1 giây để cho phép xử lý lại nếu cần
    setTimeout(() => {
      isHandlingExpiredToken = false;
    }, 1000);
  }
}

