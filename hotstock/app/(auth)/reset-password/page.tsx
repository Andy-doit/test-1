"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Loader2, Lock, KeyRound, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthServer } from "@/hooks/useAuthServer";
import ThemeToggle from "@/components/common/themeSwitch";
import { UserBackground } from "@/components/user/userBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  otp: z.string().length(6, "Mã OTP phải có đúng 6 chữ số"),
  // FIX: Increased password min length from 6 to 8 per OWASP recommendation
  newPassword: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string().min(8, "Mật khẩu xác nhận phải có ít nhất 8 ký tự"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resetPassword } = useAuthServer();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // FIX: Get email from sessionStorage (set by forgot-password page) instead of URL
  const [emailFromSession] = useState(() => {
    const sessionEmail = typeof window !== "undefined"
      ? sessionStorage.getItem("reset_email") ?? ""
      : "";
    return searchParams.get("email") || sessionEmail;
  });

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("reset_email")) {
      sessionStorage.removeItem("reset_email");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromSession,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const verifyResult = await verifyOtp(values.email, values.otp);

    if (!verifyResult.success || !verifyResult.reset_token) {
      setError(verifyResult.error || "Mã OTP không hợp lệ hoặc đã hết hạn");
      setIsSubmitting(false);
      return;
    }

    const resetResult = await resetPassword(verifyResult.reset_token, values.newPassword);

    setIsSubmitting(false);

    if (resetResult.success) {
      setSuccessMessage("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setError(resetResult.error || "Có lỗi xảy ra khi đổi mật khẩu mới");
    }
  };

  return (
    <div className="w-full max-w-lg space-y-6 rounded-[32px] border border-border/40 bg-card/80 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.15)] backdrop-blur dark:border-white/10 dark:bg-[#050916]/90 dark:shadow-[0_30px_90px_rgba(5,9,22,0.85)]">
      <div className="flex flex-col items-center gap-3 text-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Đặt lại mật khẩu</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Vui lòng nhập mã OTP đã được gửi đến email của bạn và thiết lập mật khẩu mới.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400 text-center">
          {successMessage}
          <div className="mt-2 text-xs opacity-80">
            Hệ thống đang chuyển hướng bạn về trang đăng nhập...
          </div>
        </div>
      )}

      {!successMessage && (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="email"
                type="email"
                readOnly={!!emailFromSession}
                className={`pl-10 ${!!emailFromSession ? "bg-muted/50 opacity-70" : ""}`}
                autoComplete="email"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp">Mã OTP (6 số)</Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                className="pl-10 tracking-[0.5em] font-mono text-center"
                {...register("otp")}
              />
            </div>
            {errors.otp && <p className="text-sm text-rose-500">{errors.otp.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="pl-10"
                {...register("newPassword")}
              />
            </div>
            {errors.newPassword && <p className="text-sm text-rose-500">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="pl-10"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && <p className="text-sm text-rose-500">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="mt-2 w-full rounded-full font-semibold" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đổi mật khẩu"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <UserBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <Link
          href="/forgot-password"
          className="absolute top-6 left-6 z-20 inline-flex items-center justify-center h-10 w-10 rounded-full border border-border/40 bg-card/80 text-foreground hover:bg-card hover:border-border transition-colors backdrop-blur dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          aria-label="Quay lại"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        <Suspense fallback={
          <div className="w-full max-w-lg space-y-6 rounded-[32px] border border-border/40 bg-card/80 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.15)] backdrop-blur dark:border-white/10 dark:bg-[#050916]/90 dark:shadow-[0_30px_90px_rgba(5,9,22,0.85)] flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
