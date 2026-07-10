"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { logger } from "@/lib/utils/logger";

export function ContactFormSection() {
  const [formData, setFormData] = useState({ fullname: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#5b1d7a] via-[#7d2ca4] to-[#d04cd5] p-6 sm:p-10 shadow-[0_25px_80px_rgba(91,29,122,0.45)]">
          <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)] pointer-events-none" />
          <div className="relative flex flex-col items-center gap-4 text-center text-white">
            <div className="inline-block rounded-full px-4 py-3 sm:px-6 sm:py-3  border border-white/45 mb-4">
              <span className="inline-flex items-center  uppercase tracking-[0.3em]">
                Kiến tạo tăng trưởng
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-relaxed font-bold text-white">
              Hiểu thị trường. Đón cơ hội. Cùng <span className="text-[#fddcff]">HotStock.</span>
            </h2>
            <p className="text-lg text-white/85">Đăng ký ngay hôm nay</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (isSubmitting) return;

                // Validate
                if (!formData.fullname.trim()) {
                  toast.error("Vui lòng điền họ tên");
                  return;
                }

                if (!formData.phone.trim()) {
                  toast.error("Vui lòng điền số điện thoại");
                  return;
                }

                setIsSubmitting(true);
                try {
                  const response = await fetch("/api/v1/contact", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      fullname: formData.fullname.trim(),
                      email: `noreply-${Date.now()}@hotstock.vn`, // Email placeholder
                      message: `Đăng ký từ trang chủ. Số điện thoại: ${formData.phone.trim()}`,
                      optIn: true,
                    }),
                  });

                  const result = await response.json();

                  if (result.success) {
                    toast.success(result.message ?? "Đã gửi đăng ký thành công");
                    setFormData({ fullname: "", phone: "" });
                  } else {
                    toast.error(result.error ?? "Có lỗi xảy ra khi gửi đăng ký");
                  }
                } catch (error) {
                  const message = error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi đăng ký";
                  toast.error(message);
                  logger.error("[ContactForm] Form error:", error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="mt-4 w-full flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch"
            >
              <input
                type="text"
                placeholder="Họ & Tên"
                value={formData.fullname ?? ""}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                required
                className="w-full lg:flex-1 rounded-full border border-white/35 bg-white/10 px-4 sm:px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white/70 transition"
              />
              <input
                type="tel"
                placeholder="Số Điện Thoại"
                value={formData.phone ?? ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full lg:flex-1 rounded-full border border-white/35 bg-white/10 px-4 sm:px-5 py-3 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white/70 transition"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full lg:flex-1 rounded-full bg-white text-black font-semibold px-6 py-3 text-sm sm:text-base shadow-[0_12px_35px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 text-center border-2 border-purple-600 dark:border-transparent flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? "Đang gửi..." : "Khám Phá Ngay →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
