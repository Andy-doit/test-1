"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthServer } from "@/hooks/useAuthServer";
import ThemeToggle from "@/components/common/themeSwitch";
import { UserBackground } from "@/components/user/userBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuthServer();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setError(null);
    setIsSubmitting(true);

    const result = await forgotPassword(values.email);

    setIsSubmitting(false);

    if (result.success) {
      // FIX: Store email in sessionStorage instead of URL to prevent history exposure
      if (typeof window !== "undefined") {
        sessionStorage.setItem("reset_email", values.email);
      }
      router.push("/reset-password");
    } else {
      setError(result.error || "Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <UserBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <Link
          href="/login"
          className="absolute top-6 left-6 z-20 inline-flex items-center justify-center h-10 w-10 rounded-full border border-border/40 bg-card/80 text-foreground hover:bg-card hover:border-border transition-colors backdrop-blur dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          aria-label="Quay lại trang đăng nhập"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-lg space-y-6 rounded-[32px] border border-border/40 bg-card/80 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.15)] backdrop-blur dark:border-white/10 dark:bg-[#050916]/90 dark:shadow-[0_30px_90px_rgba(5,9,22,0.85)]">
          <div className="flex flex-col items-center gap-3 text-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Quên mật khẩu?</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Đừng lo lắng, vui lòng nhập email bạn đã đăng ký. Chúng tôi sẽ gửi mã xác nhận OTP để giúp bạn đặt lại mật khẩu.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email đăng ký</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ban@example.com"
                  className="pl-10"
                  autoComplete="email"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="mt-2 w-full rounded-full font-semibold" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi mã OTP...
                </>
              ) : (
                "Gửi mã xác nhận"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground pt-4">
            Nhớ lại mật khẩu?
            <Link href="/login" className="ml-1 font-semibold text-[color:var(--title)] hover:underline">
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
