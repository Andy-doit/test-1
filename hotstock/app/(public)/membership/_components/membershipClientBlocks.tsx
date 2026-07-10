"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PremiumCard } from "@/components/user/cardMember";
import { MembershipComparisonTable, COMPARISON_SECTIONS } from "@/components/user/membershipComparisonTable";
import { mapPlansToPricingTiers, type TierId } from "@/data/membershipData";
import { usePlansQuery } from "@/hooks/usePlansQuery";
import { useAuthStore } from "@/stores/authStore";
import type { LucideIcon } from "lucide-react";
import { Crown, Shield, Zap } from "lucide-react";

const tierPresentation: Record<
  TierId,
  {
    variant: "titan" | "gold" | "premium";
    icon: LucideIcon;
  }
> = {
  titan: {
    variant: "titan",
    icon: Shield,
  },
  gold: {
    variant: "gold",
    icon: Crown,
  },
  premium: {
    variant: "premium",
    icon: Zap,
  },
};

export default function MembershipClientBlocks() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleUpgrade = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push("/contact");
  }, [isAuthenticated, router]);

  // Fetch plans from API
  const { data: plansData = [] } = usePlansQuery();
  const pricingTiers = useMemo(() => {
    return mapPlansToPricingTiers(plansData);
  }, [plansData]);

  return (
    <section className="relative min-h-[100vh] overflow-hidden py-25">
      <div className="relative z-10 mx-auto max-w-[1500px] px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-foreground/60">HotStock Membership</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-relaxed">Nâng cấp hội viên</h1>
          <p className="mt-3 text-foreground/70 max-w-3xl mx-auto">
            Trải nghiệm mượt mà, mở khoá mọi tính năng với chi phí cạnh tranh nhất thị trường.
          </p>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-6 w-[520px] h-[140px] rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(closest-side, rgba(167,139,250,.45), transparent 65%)" }}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {pricingTiers.map((tier) => {
              const { variant, icon } = tierPresentation[tier.id];
              const description = tier.description || "";
              const buttonText = tier.ctaLabel || "Xem chi tiết";
              return (
                <motion.div
                  key={tier.id}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="h-full"
                >
                  <PremiumCard
                    variant={variant}
                    title={tier.name}
                    label={tier.label}
                    monthlyPrice={tier.monthlyPrice}
                    originalSixMonthPrice={tier.originalSixMonthPrice}
                    sixMonthPrice={tier.sixMonthPrice}
                    description={description}
                    buttonText={buttonText}
                    badge={tier.badge}
                    features={tier.highlightFeatures}
                    icon={icon}
                    onAction={handleUpgrade}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="max-w-[1700px] mx-auto">
     <MembershipComparisonTable tiers={pricingTiers} sections={COMPARISON_SECTIONS} />
     </div>
      <style jsx>{`
        .animate-float { animation: mf 8s ease-in-out infinite; }
        .animate-drift { animation: md 9s ease-in-out infinite; }
        @keyframes mf { 0% { transform: translate(0,0) } 50% { transform: translate(14px,-16px) } 100% { transform: translate(0,0) } }
        @keyframes md { 0% { transform: translate(0,0) } 50% { transform: translate(-16px,12px) } 100% { transform: translate(0,0) } }
      `}</style>
    </section>
  );
}