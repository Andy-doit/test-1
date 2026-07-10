"use client";

import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { type PortfolioTier, TIER_LABELS } from "@/lib/constants/portfolio";

type PortfolioAccessDeniedProps = {
  tier: PortfolioTier;
  requiredTiers?: PortfolioTier[];
};

const TIER_MESSAGES: Record<PortfolioTier, { title: string; description: string }> = {
  community: {
    title: "Chỉ dành cho gói cộng đồng",
    description: "Bạn cần đăng ký gói cộng đồng để xem danh mục này.",
  },
  titan: {
    title: "Chỉ dành cho gói Titan trở lên",
    description: "Bạn cần nâng cấp lên gói Titan, Gold hoặc Premium để xem danh mục này. Tự động chuyển về trang danh mục chính.",
  },
  gold: {
    title: "Chỉ dành cho gói Gold trở lên",
    description: "Bạn cần nâng cấp lên gói Gold hoặc Premium để xem danh mục này. Tự động chuyển về trang danh mục chính.",
  },
  premium: {
    title: "Chỉ dành cho gói Premium",
    description: "Bạn cần nâng cấp lên gói Premium để xem chi tiết danh mục này. Tự động chuyển về trang danh mục chính.",
  },
};

export function PortfolioAccessDenied({ tier, requiredTiers }: PortfolioAccessDeniedProps) {
  const message = requiredTiers
    ? {
        title: `Chỉ dành cho gói ${requiredTiers.map((t) => TIER_LABELS[t]).join(" hoặc ")}`,
        description: `Bạn cần nâng cấp lên một trong các gói trên để xem danh mục này. Tự động chuyển về trang danh mục chính.`,
      }
    : TIER_MESSAGES[tier];

  return (
    <section className="mx-auto max-w-screen-lg px-4 sm:px-6 md:px-10 lg:px-14 pt-28 pb-16 space-y-6">
      <Card className="p-6 flex items-start gap-3">
        <Lock className="h-5 w-5 mt-1 text-amber-500 flex-shrink-0" />
        <div>
          <h1 className="text-xl font-semibold">{message.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{message.description}</p>
        </div>
      </Card>
    </section>
  );
}

