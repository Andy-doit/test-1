"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth/authForm";
import ThemeToggle from "@/components/common/themeSwitch";
import { UserBackground } from "@/components/user/userBackground";
import { useAuthServer } from "@/hooks/useAuthServer";

export default function RegisterPage() {
  const { register: registerUser } = useAuthServer();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (values: {
    username?: string;
    email: string;
    password: string;
    fullName?: string;
    phoneNumber?: string;
    confirmPassword?: string;
  }) => {
    setError(null);

    if (!values.username) {
      setError("Vui lòng nhập username");
      return;
    }

    if (!values.confirmPassword) {
      setError("Vui lòng xác nhận mật khẩu");
      return;
    }

    const result = await registerUser({
      username: values.username,
      email: values.email,
      password: values.password,
      fullName: values.fullName || undefined,
      phoneNumber: values.phoneNumber || undefined,
      confirmPassword: values.confirmPassword,
    });

    if (!result.success) {
      setError(result.error || "Đăng ký thất bại");
    }
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
              <h1 className="text-2xl font-bold text-foreground">Tạo tài khoản mới</h1>
              <p className="text-sm text-muted-foreground">Điền thông tin để bắt đầu hành trình của bạn</p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/50 bg-rose-500/10 p-3 text-sm text-rose-500">
              {error}
            </div>
          )}

          <AuthForm
            title="Đăng ký"
            subtitle="Tạo tài khoản để truy cập dashboard realtime, tín hiệu và báo cáo độc quyền."
            submitLabel="Đăng ký"
            switchText="Đã có tài khoản? Đăng nhập ngay"
            switchHref="/login"
            showUsernameField={true}
            showRememberToggle={false}
            showProviders={false}
            onSubmit={handleRegister}
          />
        </div>
      </div>
    </div>
  );
}
