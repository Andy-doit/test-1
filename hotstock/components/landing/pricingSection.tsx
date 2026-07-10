"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mapPlansToPricingTiers } from "@/data/membershipData";
import { usePlansQuery } from "@/hooks/usePlansQuery";

const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

export function PricingSection() {
  const [isSixMonth, setIsSixMonth] = useState<Record<string, boolean>>({
    titan: false,
    premium: false,
    gold: false,
  });

  // Fetch plans from API
  const { data: plansData = [] } = usePlansQuery();
  
  const pricingTiers = React.useMemo(() => {
    return mapPlansToPricingTiers(plansData);
  }, [plansData]);

  return (
    <div className="py-8 sm:py-12 md:py-16 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
      {/* Title Description */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto">
        <p className="text-base sm:text-lg md:text-xl text-black/80 dark:text-white/80 leading-relaxed">
          Với các gói hội viên linh hoạt (Titan, Gold, Premium), bạn có thể chọn mức truy cập phù hợp — từ tin tức, biểu đồ, báo cáo chuyên sâu đến trải nghiệm tư vấn trực tiếp cùng chuyên gia.
        </p>
      </div>

      {/* Membership Cards - Premium ở giữa - Simple UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
        {pricingTiers.map((tier) => {
          const isPremium = tier.highlighted || tier.theme === "purple";
          const tierIsSixMonth = isSixMonth[tier.id] || false;
          const currentPrice = tierIsSixMonth ? tier.sixMonthPrice : tier.monthlyPrice;
          const billingLabel = tierIsSixMonth ? "đ/6 tháng" : "đ/tháng";
          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl p-8 sm:p-10 flex flex-col overflow-hidden ${isPremium
                ? "bg-white text-black border border-purple-200 shadow-[0_0_40px_rgba(112,66,225,0.08)] dark:bg-[#0a0a0a] dark:text-white dark:border-purple-500/30"
                : "bg-white text-black border border-gray-200 shadow-sm dark:bg-[#0a0a0a] dark:text-white dark:border-gray-800/50"
                }`}
              style={isPremium ? {
                boxShadow: '0 0 40px rgba(112, 66, 225, 0.15), inset 0 -80px 100px -50px rgba(112, 66, 225, 0.2)'
              } : {}}
            >
              {/* Purple glow effect for Premium - only at bottom and edges */}
              {isPremium && (
                <>
                  {/* Bottom glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#6D28D9]/30 via-[#6D28D9]/10 to-transparent pointer-events-none rounded-b-2xl" />
                  {/* Edge glow */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                    boxShadow: 'inset 0 0 60px rgba(112, 66, 225, 0.1)'
                  }} />
                </>
              )}
              {/* Title with Badge and Toggle */}
              <div className="mb-8 flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white">{tier.name}</h3>
                  {isPremium && tier.badge && (
                    <span className="inline-flex items-center rounded-md px-3 py-1 text-xs font-bold uppercase bg-[#7042E1] text-white">
                      {tier.badge}
                    </span>
                  )}
                </div>
                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setIsSixMonth({ ...isSixMonth, [tier.id]: !tierIsSixMonth })}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${isPremium
                    ? tierIsSixMonth
                      ? "bg-[#7042E1] focus:ring-[#7042E1]"
                      : "bg-gray-700/50 focus:ring-white/40"
                    : tierIsSixMonth
                      ? "bg-[#D7FE02] focus:ring-[#D7FE02]"
                      : "bg-gray-700/50 focus:ring-white/40"
                    }`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ease-in-out ${tierIsSixMonth ? "translate-x-7" : "translate-x-0.5"
                      }`}
                    style={{
                      boxShadow: tierIsSixMonth
                        ? isPremium
                          ? "0 2px 8px rgba(112, 66, 225, 0.5), 0 0 12px rgba(112, 66, 225, 0.3)"
                          : "0 2px 8px rgba(215, 254, 2, 0.5), 0 0 12px rgba(215, 254, 2, 0.3)"
                        : "0 2px 4px rgba(0, 0, 0, 0.3)"
                    }}
                  />
                </button>
              </div>

              {/* Price */}
              <div className="mb-6 relative z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-black dark:text-white">{formatPrice(currentPrice)}</span>
                  <span className={`text-lg font-medium ${isPremium ? "text-black/70 dark:text-white/80" : "text-black/60 dark:text-white/70"}`}>
                    {billingLabel}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className={`text-base mb-8 flex-1 relative z-10 ${isPremium ? "text-black/80 dark:text-white/90" : "text-black/70 dark:text-gray-400"} leading-relaxed`}>
                {tier.description}
              </p>

              {/* Button */}
              <Link href="/goi-hoi-vien" className="mt-auto relative z-10">
                <Button
                  className={`w-full rounded-full font-bold text-base sm:text-lg py-6 transition-all ${isPremium
                    ? "bg-[#4c1d95] text-white shadow-[0_20px_50px_rgba(76,29,149,0.4)] hover:bg-[#5b21b6] border-2 border-purple-600 dark:border-transparent"
                    : "bg-[#e8d8ff] text-[#32105d] hover:bg-[#ddd0ff] dark:bg-[#2a1b4c] dark:text-white dark:hover:bg-[#3a2667] border-2 border-purple-600 dark:border-transparent"
                    }`}
                >
                  {tier.ctaLabel || "Xem chi tiết"}
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
