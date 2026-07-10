import React from "react";
import { Shield, Users, PieChart, Brain, Sparkles } from "lucide-react";

export function TeamSection() {
  const teamBullets = [
    "Đằng sau HotStock là đội ngũ chuyên gia tài chính, nhà phân tích giàu kinh nghiệm.",
    "Chúng tôi hiểu rằng nhà đầu tư không chỉ cần dữ liệu – họ cần góc nhìn chính xác, kịp thời và đáng tin cậy.",
    "Mục tiêu: giúp thị trường minh bạch, dễ tiếp cận và hiệu quả hơn cho mọi người.",
    "Từ dòng tiền đến chiến lược – chúng tôi đồng hành cùng nhà đầu tư trên từng quyết định.",
  ];

  const teamStats = [
    { num: "10+", label: "năm kinh nghiệm", icon: Shield },
    { num: "150+", label: "báo cáo/năm", icon: PieChart },
    { num: "20+", label: "chuyên gia & CTV", icon: Users },
  ];

  const teamQualities = [
    { title: "Chuyên gia & cố vấn", desc: "20+ chuyên gia tài chính, mentoring 1-1 theo nhu cầu.", icon: Brain },
    { title: "Kinh nghiệm & phương pháp", desc: "Khung phân tích chuẩn hoá, đào tạo & review định kỳ.", icon: Sparkles },
    { title: "Đạo đức & minh bạch", desc: "Cam kết kiểm chứng thông tin, ưu tiên lợi ích nhà đầu tư.", icon: Shield },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-wrap items-center gap-3 mb-8 sm:mb-10">
          <div className="inline-block rounded-full px-4 py-3 sm:px-6 sm:py-3 bg-white dark:bg-white mb-4">
            <span className="text-sm sm:text-base font-medium text-black">Đội ngũ HotStock</span>
          </div>
          <div className="flex items-center gap-2 text-black/70 dark:text-white/70 text-xs sm:text-sm">
            <div className="flex items-center -space-x-3">
              <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 border border-white/60" />
              <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black border border-white/30" />
            </div>
            20+ chuyên gia & cộng tác viên đồng hành
          </div>
        </div>

        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-black dark:text-white">
            <span className="text-purple-600 dark:text-purple-200">Đội ngũ HotStock</span> – Những người làm thị trường trở nên dễ hiểu hơn.
            <span className="block text-purple-500 dark:text-[#BBA0FF] mt-1 text-lg sm:text-xl">
              Expertise you can trust. Insights you can act on.
            </span>
          </h2>
        </div>

        {/* Bullets list */}
        <ul className="space-y-4 sm:space-y-5 mb-10 sm:mb-12">
          {teamBullets.map((text, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-black dark:text-white"
            >
              <span className="mt-2 inline-block w-2 h-2 rounded-full bg-purple-500 shrink-0" aria-hidden />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
          {teamStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="border border-black/10 dark:border-white/25 rounded-2xl p-6 text-center bg-white/90 dark:bg-black/70 shadow-md dark:shadow-none"
              >
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-white/10 dark:text-purple-200 mb-3">
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-1">
                  {stat.num}
                </div>
                <div className="text-sm text-slate-600 dark:text-white/80">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Qualities grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {teamQualities.map((quality) => {
            const Icon = quality.icon;
            return (
              <div
                key={quality.title}
                className="border border-black/10 dark:border-white/22 rounded-2xl p-5 text-center bg-white/90 dark:bg-black/70 shadow-md dark:shadow-none flex flex-col items-center gap-3"
              >
                <span className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-white shadow-lg shadow-indigo-500/30 dark:bg-white/10 dark:shadow-none">
                  <Icon className="w-6 h-6 text-purple-700 dark:text-purple-200" aria-hidden />
                </span>
                <div className="font-semibold text-base text-slate-900 dark:text-white">
                  {quality.title}
                </div>
                <p className="text-sm text-slate-600 dark:text-white/75 leading-relaxed">
                  {quality.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
