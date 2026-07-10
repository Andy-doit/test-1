"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { backendClient } from "@/lib/http/httpClient";
import { logger } from "@/lib/utils/logger";
import { setAuthCookies, clearAuthCookies, getClientCookie } from "@/lib/utils/cookies";
import type { LoginRequest, RegisterRequest } from "@/types/iAccount";

export const useAuthServer = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: clearAuth } =
    useAuthStore();
  const queryClient = useQueryClient();

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await backendClient.get("/users/me");
      return data;
    } catch (error) {
      const err = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      if (err.response?.status === 401) {
        clearAuthCookies();
        const throwErr = new Error("Phiên đăng nhập đã hết hạn") as Error & { status?: number };
        throwErr.status = 401;
        throw throwErr;
      }
      const throwErr = new Error(err.response?.data?.message || "Không thể lấy thông tin người dùng") as Error & { status?: number };
      throwErr.status = err.response?.status;
      throw throwErr;
    }
  }, []);

  const checkProfile = useCallback(async () => {
    // Nếu không có cookie auth_token ở client, ta biết chắc chắn chưa đăng nhập, trả về ngay không gọi API
    if (typeof window !== "undefined" && !getClientCookie("auth_token")) {
      clearAuth();
      return { success: false, error: "Chưa đăng nhập" };
    }

    try {
      setLoading(true);
      const currentUser = await queryClient.fetchQuery({
        queryKey: ["user-profile"],
        queryFn: fetchProfile,
        staleTime: 0, // Force refetch to ensure we get latest data (e.g., plan upgrades)
        gcTime: 10 * 60 * 1000,
      });

      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (error) {
      queryClient.removeQueries({ queryKey: ["user-profile"] });
      
      const err = error as { status?: number };
      // Chỉ xoá trạng thái đăng nhập nếu server trả về lỗi liên quan đến xác thực (Unauthorized / Forbidden)
      if (err.status === 401 || err.status === 403) {
        clearAuth();
        clearAuthCookies();
      }
      
      const message = error instanceof Error ? error.message : "Có lỗi xảy ra khi kiểm tra profile";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, queryClient, setLoading, setUser, clearAuth]);

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true);
        // Map identifier to email if needed
        const payload = {
          email: credentials.identifier,
          password: credentials.password
        };
        
        const { data } = await backendClient.post("/auth/login", payload);
        const { accessToken, refreshToken, user: loggedInUser } = data;

        const finalAccessToken = accessToken || data.access_token;
        const finalRefreshToken = refreshToken || data.refresh_token;

        if (!finalAccessToken || !loggedInUser) {
          return { success: false, error: "Phản hồi đăng nhập không hợp lệ" };
        }

        setAuthCookies(finalAccessToken, finalRefreshToken);
        queryClient.setQueryData(["user-profile"], loggedInUser);

        setUser(loggedInUser);
        if (loggedInUser.role === 'admin') {
          router.push("/admin");
        } else {
          router.push("/");
        }
        router.refresh();
        return { success: true, user: loggedInUser };
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        const message = err.response?.data?.message || err.message || "Có lỗi xảy ra khi đăng nhập";
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [queryClient, setUser, setLoading, router]
  );

  const handleRegister = useCallback(
    async (credentials: RegisterRequest) => {
      try {
        setLoading(true);
        const { data } = await backendClient.post("/auth/register", credentials);
        const { accessToken, refreshToken, user: registeredUser } = data;

        const finalAccessToken = accessToken || data.access_token;
        const finalRefreshToken = refreshToken || data.refresh_token;

        if (!finalAccessToken || !registeredUser) {
          return { success: false, error: "Phản hồi đăng ký không hợp lệ" };
        }

        setAuthCookies(finalAccessToken, finalRefreshToken);
        queryClient.setQueryData(["user-profile"], registeredUser);

        setUser(registeredUser);
        router.push("/");
        router.refresh();
        return { success: true, user: registeredUser };
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        const message = err.response?.data?.message || err.message || "Có lỗi xảy ra khi đăng ký";
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [queryClient, setUser, setLoading, router]
  );

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      await backendClient.post("/auth/logout", {
        refresh_token: document.cookie.match(/(?:^|; )refresh_token=([^;]+)/)?.[1]
      });
    } catch (error) {
      logger.error("Logout error:", error);
    } finally {
      clearAuth();
      queryClient.clear(); // Xoá toàn bộ cache của react-query để đảm bảo không rò rỉ dữ liệu
      clearAuthCookies();
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage"); // Đảm bảo xoá triệt để local storage của zustand
        sessionStorage.clear(); // Xoá toàn bộ session storage
        
        setLoading(false);
        
        const currentPath = window.location.pathname;
        const protectedRoutes = ["/admin", "/profile"];
        const isProtected = protectedRoutes.some((route) => currentPath.startsWith(route));
        
        if (isProtected) {
          window.location.href = "/login";
        } else {
          // Trang public: chỉ cần tải lại trang hiện tại dưới vai trò khách
          window.location.href = currentPath;
        }
      } else {
        setLoading(false);
        router.push("/login");
      }
    }
  }, [clearAuth, queryClient, router, setLoading]);

  const handleForgotPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const { data } = await backendClient.post("/auth/forgot-password", { email });
      return { success: true, message: data.message };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message = err.response?.data?.message || err.message || "Có lỗi xảy ra khi gửi yêu cầu quên mật khẩu";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const handleVerifyOtp = useCallback(async (email: string, otp: string) => {
    try {
      setLoading(true);
      const { data } = await backendClient.post("/auth/verify-otp", { email, otp });
      return { success: true, reset_token: data.reset_token };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message = err.response?.data?.message || err.message || "Mã OTP không hợp lệ hoặc đã hết hạn";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const handleResetPassword = useCallback(async (resetToken: string, newPassword: string) => {
    try {
      setLoading(true);
      const { data } = await backendClient.post("/auth/reset-password", { resetToken, newPassword });
      return { success: true, message: data.message };
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message = err.response?.data?.message || err.message || "Có lỗi xảy ra khi đổi mật khẩu mới";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkProfile,
    forgotPassword: handleForgotPassword,
    verifyOtp: handleVerifyOtp,
    resetPassword: handleResetPassword,
  };
};

