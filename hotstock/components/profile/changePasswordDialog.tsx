"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { createSafeZodResolver } from "@/lib/utils/safeZodResolver";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/lib/env";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    password: z.string().min(6, "Mật khẩu mới tối thiểu 6 ký tự"),
    passwordConfirmation: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
    path: ["passwordConfirmation"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSuccess,
}: ChangePasswordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  // Global error handler để catch unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Nếu là ZodError, prevent default để không hiển thị trong console
      if (event.reason instanceof z.ZodError) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordValues>({
    resolver: createSafeZodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        currentPassword: "",
        password: "",
        passwordConfirmation: "",
      });
    }
  }, [open, reset]);

  const onSubmit = async (values: ChangePasswordValues) => {
    try {
      setIsSubmitting(true);

      const token = (() => {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(/(?:^|; )auth_token=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
      })();

      if (!token) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }

      const apiBaseUrl = env.apiBaseUrl;
      const cmsBase = apiBaseUrl.replace(/\/$/, "");
      const changePasswordUrl = `${cmsBase}/api/auth/change-password`;

      const response = await fetch(changePasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          password: values.password,
          passwordConfirmation: values.passwordConfirmation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage =
          result?.error?.message ||
          result?.message ||
          "Đổi mật khẩu thất bại";
        throw new Error(errorMessage);
      }

      toast.success("Đổi mật khẩu thành công!");
      
      // Reset form và đóng dialog
      reset();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi đổi mật khẩu";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Đổi mật khẩu
          </DialogTitle>
          <DialogDescription>
            Thay đổi mật khẩu của bạn để bảo mật tài khoản tốt hơn
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, () => {
            // Validation errors sẽ tự động hiển thị dưới các input fields
            // Không cần xử lý gì thêm ở đây
          })}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-rose-500">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-rose-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation">Xác nhận mật khẩu mới</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="passwordConfirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register("passwordConfirmation")}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswordConfirmation ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.passwordConfirmation && (
              <p className="text-sm text-rose-500">{errors.passwordConfirmation.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

