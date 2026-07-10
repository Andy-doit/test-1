"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth/authForm";
import ThemeToggle from "@/components/common/themeSwitch";
import { UserBackground } from "@/components/user/userBackground";
import { useAuthServer } from "@/hooks/useAuthServer";

export default function LoginPage() {
  const { login } = useAuthServer();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    setError(null);
    const result = await login({
      identifier: values.email,
      password: values.password,
    });

    if (!result.success) {
      setError(result.error || "Đăng nhập thất bại");
    }
    // Redirect được xử lý trong useAuthServer hook, không cần redirect ở đây
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <UserBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <Link
          href="/"
          className="absolute top-6 left-6 z-20 inline-flex items-center justify-center h-10 w-10 rounded-full border border-border/40 bg-card/80 text-foreground hover:bg-card hover:border-border transition-colors backdrop-blur dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          aria-label="Quay về trang chủ"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-lg space-y-6 rounded-[32px] border border-border/40 bg-card/80 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.15)] backdrop-blur dark:border-white/10 dark:bg-[#050916]/90 dark:shadow-[0_30px_90px_rgba(5,9,22,0.85)]">
          <div className="flex flex-col items-center gap-3 text-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Chào mừng quay trở lại!</h1>
              <p className="text-sm text-muted-foreground">Vui lòng đăng nhập để tiếp tục sử dụng</p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <AuthForm
            title="Đăng nhập"
            subtitle="Nhập email và mật khẩu để vào bảng điều khiển."
            submitLabel="Đăng nhập"
            switchText="Bạn chưa có tài khoản? Đăng ký ngay"
            switchHref="/register"
            showProviders={false}
            onSubmit={handleLogin}
          />
        </div>
      </div>
    </div>
  );
}