"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { PremiumCardProps } from "@/types/iAccount";

const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const iconWrapperStyles = {
  titan: "bg-white/10 border-white/20",
  gold: "bg-gradient-to-r from-[#fff3c4]/40 via-[#ffd766]/40 to-[#f0b547]/40 border-[#ffd87b]/60 backdrop-blur",
  premium: "bg-white/10 border-white/20",
} as const;

const iconColorStyles = {
  titan: "text-white",
  gold: "text-[#3e2600]",
  premium: "text-white",
} as const;

export const PremiumCard = ({
  variant,
  title,
  label,
  monthlyPrice,
  originalSixMonthPrice,
  sixMonthPrice,
  description,
  buttonText,
  badge,
  features,
  icon: Icon,
  onAction,
}: PremiumCardProps) => {
  const isPremium = variant === "premium";
  const isTitan = variant === "titan";
  const isGold = variant === "gold";
  const [billingCycle, setBillingCycle] = useState<"monthly" | "six-month">("monthly");
  const isSixMonth = billingCycle === "six-month";

  const sixMonthBasePrice = originalSixMonthPrice ?? monthlyPrice * 6;
  const sixMonthDiscountedPrice = sixMonthPrice ?? Math.round(sixMonthBasePrice * 0.7);

  const currentPrice = isSixMonth ? sixMonthDiscountedPrice : monthlyPrice;
  const billingLabel = isSixMonth ? "/6 tháng" : "/tháng";
  const discountPercentage =
    sixMonthBasePrice > 0 ? Math.max(0, Math.round(100 - (sixMonthDiscountedPrice / sixMonthBasePrice) * 100)) : 0;
  const showDiscount = isSixMonth && sixMonthBasePrice > sixMonthDiscountedPrice;

  return (
    <div
      className={`relative h-full rounded-[32px] p-8 flex flex-col border ${
        isPremium
          ? "bg-gradient-to-br from-[#5E3BF4] via-[#7C5CFA] to-[#B798FF] text-white border-white/30 shadow-[0px_25px_80px_rgba(109,76,242,0.35)]"
          : isGold
            ? "bg-gradient-to-br from-[#fff7d6] via-[#f7cf73] to-[#d4a546] text-[#3c2600] border-[#f6d585]/60 shadow-[0_30px_70px_rgba(212,165,70,0.5)]"
            : "bg-gradient-to-br from-[#050505] via-[#0f0f0f] to-[#1f1f1f] text-white border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
      }`}
    >
      {isTitan && (
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none" />
      )}
      {isGold && (
        <div className="absolute inset-1 rounded-[30px] opacity-60 pointer-events-none" style={{ background: "radial-gradient(140% 80% at 30% 0%, rgba(255,255,255,0.75), transparent 55%)" }} />
      )}
      {isPremium && (
        <div className="absolute -top-12 inset-x-10 h-24 bg-gradient-to-r from-[#A06BFF]/40 to-transparent blur-3xl rounded-full pointer-events-none" />
      )}

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl font-semibold uppercase tracking-[0.4em] ${iconColorStyles[variant]}`}>{title}</div>
            {label && (
              <p
                className={`mt-2 text-lg font-medium ${
                  isPremium ? "text-white/90" : isGold ? "text-[#725100]" : "text-white/70"
                }`}
              >
                {label}
              </p>
            )}
          </div>
          {Icon && (
            <span className={`h-11 w-11 rounded-2xl backdrop-blur flex items-center justify-center border ${iconWrapperStyles[variant]}`}>
              <Icon className={`h-6 w-6 ${iconColorStyles[variant]}`} />
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-start">
          <div className={`inline-flex rounded-2xl p-1 gap-1 ${isGold ? "bg-white/30" : "bg-white/12"}`}>
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-xl transition-all ${
                !isSixMonth
                  ? `${isGold ? "bg-white/90 text-[#3c2400]" : "bg-white text-gray-900"} shadow`
                  : isGold
                    ? "text-[#6f4300] hover:text-[#3c2400]"
                    : "text-white/80 hover:text-white"
              }`}
            >
              Giá tháng
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("six-month")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-xl transition-all ${
                isSixMonth
                  ? `${isGold ? "bg-white/90 text-[#3c2400]" : "bg-white text-gray-900"} shadow`
                  : isGold
                    ? "text-[#6f4300] hover:text-[#3c2400]"
                    : "text-white/80 hover:text-white"
              }`}
            >
              6 tháng
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-black">{`đ${formatPrice(currentPrice)}`}</span>
          <span className={`text-base font-medium ${isGold ? "text-[#6f4300]" : "text-white/80"}`}>{billingLabel}</span>
        </div>

        {showDiscount && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className={isGold ? "text-[#765100] line-through" : "text-white/70 line-through"}>{`đ${formatPrice(sixMonthBasePrice)}`}</span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                isGold ? "bg-emerald-500/25 text-emerald-800" : "bg-emerald-400/15 text-emerald-200"
              }`}
            >
              {`Giảm ${discountPercentage}%`}
            </span>
          </div>
        )}

        {badge && (
          <p
            className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              isGold ? "bg-white/40 text-[#3c2600]" : "bg-white/15"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isGold ? "bg-[#3c2600]" : "bg-white"}`} /> {badge}
          </p>
        )}
        <p className={`mt-4 text-sm leading-relaxed ${isGold ? "text-[#432b00]" : "text-white/85"}`}>{description}</p>
      </div>

      <div className="relative mt-6 space-y-3 flex-1">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className={isGold ? "text-[#4a2f00]" : "text-white/85"}>{feature}</span>
          </div>
        ))}
      </div>

      <Button
        className={`mt-8 w-full rounded-full font-semibold ${
          isPremium
            ? "bg-white text-[#5A35D4] hover:bg-white/90"
            : isGold
              ? "bg-white/80 text-[#3c2400] hover:bg-white"
              : "bg-white/10 text-white hover:bg-white/20"
        }`}
        type="button"
        onClick={onAction}
      >
        {buttonText}
      </Button>
    </div>
  );
};
