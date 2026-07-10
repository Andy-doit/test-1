"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/utils/logger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appClient } from "@/lib/http/httpClient";

type ContactFormFields = {
  fullname: string;
  email: string;
  message: string;
  optIn: boolean;
};

type HttpErrorLike = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ContactFormFields>({
    defaultValues: { fullname: "", email: "", message: "", optIn: false },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { data } = await appClient.post<{ success: boolean; message: string }>("/contact", {
        fullname: values.fullname,
        email: values.email,
        message: values.message,
        optIn: values.optIn,
      });

      if (data?.success) {
        toast.success(data.message || "Đã gửi liên hệ thành công");
        reset();
      } else {
        toast.error("Có lỗi xảy ra khi gửi liên hệ");
      }
    } catch (error: unknown) {
      const httpError = error as HttpErrorLike;
      const message =
        httpError.response?.data?.message ||
        httpError.message ||
        "Có lỗi xảy ra khi gửi liên hệ";
      toast.error(message);
      logger.error("[ContactForm] Error:", error);
    }
  });

  return (
    <Card className="relative overflow-hidden border border-white/60 bg-white/85 backdrop-blur-lg shadow-[0_20px_60px_rgba(112,66,225,0.12)] dark:border-white/10 dark:bg-white/5">
      <div className="absolute inset-x-0 -top-28 h-56 bg-gradient-to-b from-purple-300/30 via-transparent to-transparent blur-3xl dark:from-purple-900/40 dark:via-transparent dark:to-transparent pointer-events-none" />

      <CardHeader className="relative space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold text-foreground sm:text-3xl">
          Kết nối cùng chuyên gia HotStock
        </CardTitle>
        <CardDescription className="text-base text-foreground/70">
          Mọi thông tin được bảo mật và chỉ dùng cho mục đích tư vấn.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullname">Họ và tên</Label>
            <Input
              id="fullname"
              placeholder="Nhập họ và tên của bạn"
              required
              {...register("fullname", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              required
              {...register("email", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Lời nhắn</Label>
            <textarea
              id="message"
              rows={4}
              placeholder="Bạn cần HotStock hỗ trợ về sản phẩm hay thị trường?"
              className="min-h-[140px] w-full rounded-md border border-input bg-transparent px-3 py-3 text-base text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30"
              required
              {...register("message", { required: true })}
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-foreground/80">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border border-input bg-background/80 text-[#5C278B] accent-[#5C278B] shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              {...register("optIn")}
            />
            <span>
              Tôi muốn nhận thông tin liên quan đến sản phẩm và thị trường từ HotStock.
            </span>
          </label>

          <Button
            type="submit"
            variant="brand"
            className="mt-2 w-full h-12 text-base font-semibold shadow-[0_12px_35px_rgba(92,39,139,0.35)]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Đăng ký"}
          </Button>

          <p className="text-center text-xs text-foreground/60">
            Bằng việc gửi mẫu này, bạn xác nhận đồng ý để HotStock sử dụng dữ liệu cho mục đích liên hệ và tư vấn, tuân thủ
            <span className="font-semibold text-purple-700 dark:text-purple-200"> chính sách bảo mật</span>.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

