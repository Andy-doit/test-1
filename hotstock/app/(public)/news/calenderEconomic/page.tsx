"use client";

import Link from "next/link";

export default function EconomicCalendarPage() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden py-25">
      <div className="absolute inset-0 -z-10" />
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 space-y-8">
        <nav className="text-sm">
          <ol className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <li>
              <Link
                href="/"
                className="hover:text-[#6B21A8] dark:hover:text-[#A78BFA] transition-colors"
              >
                Trang chủ
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href="/phan-tich"
                className="hover:text-[#6B21A8] dark:hover:text-[#A78BFA] transition-colors"
              >
                Tin tức
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-[#6B21A8] dark:text-[#A78BFA] font-medium">
              Lịch kinh tế
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-4 md:gap-5">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] bg-gradient-to-tr from-[#5C278B] to-[#A084FB] bg-clip-text text-transparent">
              Lịch kinh tế toàn cầu
            </h1>
          </div>
          <p className="text-base sm:text-lg text-foreground/70 max-w-3xl">
            Theo dõi lịch phát hành dữ liệu vĩ mô quan trọng, đánh giá mức độ ảnh hưởng
            đến thị trường và chuẩn bị chiến lược giao dịch cho từng phiên.
          </p>
        </div>

        <section className="relative overflow-hidden rounded-[32px] border border-[rgba(112,66,225,0.22)] bg-white/90 px-3 py-3 shadow-[0_10px_35px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] dark:border-[rgba(160,132,251,0.6)] dark:bg-[rgba(5,3,18,0.92)] dark:px-4 dark:py-4 dark:shadow-[0_0_20px_rgba(160,132,251,0.35)]">
          <div className="px-4 py-6 sm:px-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-base sm:text-lg text-[#5B21B6] dark:text-[#C084FC] dark:drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]">
                  Lịch kinh tế
                </p>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl dark:text-white">
                  Sự kiện vĩ mô trong tuần
                </h2>
              </div>
              <div className="text-sm text-muted-foreground dark:text-white/70">
                Dữ liệu nhúng trực tiếp từ Investing.com Việt Nam
              </div>
            </div>
          </div>

          <div className="px-4 pb-6 sm:px-6 md:px-8">
            <div className="rounded-[28px] border border-[rgba(112,66,225,0.22)] bg-white shadow-[0_10px_35px_rgba(15,23,42,0.08)] dark:border-[rgba(160,132,251,0.6)] dark:bg-black/40 dark:shadow-[0_0_20px_rgba(160,132,251,0.35)]">
              <iframe
                src="https://sslecal2.investing.com?defaultFont=%230d0000&columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=33,14,4,34,38,32,6,11,51,5,39,72,60,110,43,35,71,22,36,26,12,9,37,25,178,10,17&calType=week&timeZone=27&lang=52"
                width="100%"
                height="467"
                frameBorder="0"
              
                marginWidth={0}
                marginHeight={0}
                className="w-full rounded-[24px]"
              />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground dark:text-white/70">
              Lịch Kinh Tế theo Thời Gian Thực được cung cấp bởi{" "}
              <Link
                href="https://vn.Investing.com/"
                rel="nofollow"
                target="_blank"
                className="font-semibold text-[#5B21B6] underline hover:text-[#4c1d95] dark:text-[#C084FC]"
              >
                Investing.com Việt Nam
              </Link>
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}

