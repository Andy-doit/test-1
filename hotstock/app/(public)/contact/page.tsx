import { Metadata } from "next";
import { ContactForm } from "@/components/contact/contactForm";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ ngay với HotStock để được tư vấn và giải đáp thắc mắc về nền tảng phân tích tài chính.",
};

export default function ContactPage() {
  return (
    <div className="relative py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 -top-10 h-48 bg-gradient-to-b from-purple-200/30 via-white/40 to-transparent blur-3xl dark:from-purple-700/30 dark:via-purple-500/10 dark:to-transparent pointer-events-none" />

      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 sm:px-6">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-700 dark:text-purple-200">
            Đăng ký tư vấn
          </p>
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Liên hệ ngay
          </h1>
          <p className="text-base text-foreground/70 sm:text-lg">
            Để lại thông tin, đội ngũ HotStock sẽ chủ động liên hệ và tư vấn giải pháp phù hợp cho bạn.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}