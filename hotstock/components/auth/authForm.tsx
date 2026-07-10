"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { createSafeZodResolver } from "@/lib/utils/safeZodResolver";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  baseSchema,
  registerSchema,
  type AuthFormValues,
  type AuthFormProps,
} from "@/types/iAccount";

export type { AuthFormValues };

export function AuthForm({
  submitLabel,
  switchText,
  switchHref,
  showUsernameField = false,
  showProviders = true,
  onSubmit,
}: AuthFormProps) {
  const schema = showUsernameField ? registerSchema : baseSchema;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: createSafeZodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      email: "",
      password: "",
      remember: true,
      username: showUsernameField ? "" : undefined,
    },
  });

  const onInternalSubmit = async (values: AuthFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit?.(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [primarySwitchText, secondarySwitchText] = switchText?.split("?") ?? [];
  const hasSecondary = typeof secondarySwitchText !== "undefined";

  return (
    <div className="space-y-6">
      <form className="space-y-5" onSubmit={handleSubmit(onInternalSubmit)} noValidate>
        {showUsernameField && (
          <>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input id="username" placeholder="username" className="pl-10" {...register("username")} />
              </div>
              {errors.username && <p className="text-sm text-rose-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input id="fullName" placeholder="Nguyễn Văn A" className="pl-10" {...register("fullName")} />
              </div>
              {errors.fullName && <p className="text-sm text-rose-500">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                </span>
                <Input id="phoneNumber" type="tel" placeholder="0912345678" className="pl-10" {...register("phoneNumber")} />
              </div>
              {errors.phoneNumber && <p className="text-sm text-rose-500">{errors.phoneNumber.message}</p>}
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mật khẩu</Label>
            {!showUsernameField && (
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                tabIndex={-1}
              >
                Quên mật khẩu?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              autoComplete={showUsernameField ? "new-password" : "current-password"}
              {...register("password")}
            />
          </div>
          {errors.password && <p className="text-sm text-rose-500">{errors.password.message}</p>}
        </div>

        {showUsernameField && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && <p className="text-sm text-rose-500">{errors.confirmPassword.message}</p>}
          </div>
        )}

        <Button type="submit" className="mt-2 w-full rounded-full font-semibold" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>

      {showProviders && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            hoặc
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}

      {switchText && switchHref && (
        <p className="text-center text-sm text-muted-foreground">
          {hasSecondary ? `${primarySwitchText}?` : switchText}
          <Link href={switchHref} className="ml-1 font-semibold text-[color:var(--title)] hover:underline">
            {hasSecondary ? secondarySwitchText?.trim() : "Tạo tài khoản"}
          </Link>
        </p>
      )}
    </div>
  );
}

