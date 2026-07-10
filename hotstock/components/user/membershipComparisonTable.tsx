import type { PricingTier } from "@/data/membershipData";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

export type ComparisonRow = {
  key: string;
  label: string;
  helper?: string;
  display?: "rich" | "availability";
  titan?: string;
  gold?: string;
  premium?: string;
};

export type ComparisonSection = {
  key: string;
  title: string;
  rows: ComparisonRow[];
};

export const COMPARISON_SECTIONS: ComparisonSection[] = [
  {
    key: "pricing",
    title: "Giá & ưu đãi",
    rows: [
      {
        key: "price-month",
        label: "Giá theo tháng",
        helper: "Thanh toán linh hoạt, gia hạn tự động",
        display: "rich",
        titan: "1,500,000 VND/tháng",
        gold: "8,000,000 VND/tháng",
        premium: "15,000,000 VND/tháng",
      },
      {
        key: "price-6m",
        label: "Giá ưu đãi 6 tháng",
        helper: "Tiết kiệm tới 34% so với thanh toán lẻ",
        display: "rich",
        titan: "5,940,000 VND",
        gold: "29,400,000 VND",
        premium: "59,400,000 VND",
      },
    ],
  },
  {
    key: "insight",
    title: "Tổng quan thị trường",
    rows: [
      {
        key: "stock-reco",
        label: "Khuyến nghị cổ phiếu",
        helper: "Có điểm mua-bán, stop-loss rõ ràng",
        titan: "3–5 mã/tháng",
        gold: "5–8 mã/tháng",
        premium: "Danh mục tuỳ chỉnh & cập nhật realtime",
      },
      {
        key: "report",
        label: "Báo cáo hiệu quả định kỳ",
        helper: "Theo dõi sát sao từng chiến lược",
        titan: "Báo cáo tháng",
        gold: "Báo cáo tuần + tháng",
        premium: "Báo cáo tuần & tháng, phân tích cá nhân hóa",
      },
      {
        key: "portfolio-report",
        label: "Báo cáo hiệu quả theo danh mục",
        helper: "Đo lường hiệu suất thực chiến",
        titan: "–",
        gold: "–",
        premium: "Thống kê chi tiết, so sánh vốn giả định",
      },
    ],
  },
  {
    key: "tooling",
    title: "Công cụ & cảnh báo",
    rows: [
      {
        key: "dashboard",
        label: "Dashboard lợi nhuận",
        helper: "Cập nhật realtime & xuất dữ liệu",
        titan: "Hàng quý",
        gold: "Hàng tháng",
        premium: "Hàng tuần + snapshot cá nhân",
      },
      {
        key: "alert",
        label: "Cảnh báo thị trường",
        helper: "Bám sát chuyển động thị trường",
        titan: "–",
        gold: "Thông báo email",
        premium: "SMS/Telegram/Zalo Realtime",
      },
    ],
  },
  {
    key: "support",
    title: "Đào tạo & hỗ trợ",
    rows: [
      {
        key: "training",
        label: "Đào tạo",
        helper: "Tài liệu độc quyền từ đội ngũ HotStock",
        titan: "Tự học cơ bản",
        gold: "Webinar nâng cao hàng tháng",
        premium: "Coaching 1-1 + Workshop VIP",
      },
      {
        key: "support",
        label: "Hỗ trợ tư vấn trực tiếp",
        helper: "Đảm bảo phản hồi đúng SLA",
        titan: "Email/Zalo trong 24h",
        gold: "Hotline giờ hành chính",
        premium: "Tư vấn riêng qua Zoom",
      },
      {
        key: "strategy",
        label: "Chiến lược đầu tư dài hạn",
        helper: "Định hướng danh mục 12-24 tháng",
        titan: "–",
        gold: "Khung tham khảo",
        premium: "Tùy chỉnh theo mục tiêu tài chính cá nhân",
      },
    ],
  },
];

interface MembershipComparisonTableProps {
  tiers: PricingTier[];
  sections: ComparisonSection[];
}

export function MembershipComparisonTable({ tiers, sections }: MembershipComparisonTableProps) {
  const highlightedTierIndex = tiers.findIndex((tier) => tier.badge);
  const labelFraction = 1.1;
  const columnFraction = 1;
  const totalFraction = labelFraction + tiers.length * columnFraction;
  const highlightLeftPercent =
    highlightedTierIndex === -1
      ? null
      : ((labelFraction + highlightedTierIndex * columnFraction) / totalFraction) * 100;
  const highlightWidthPercent =
    highlightedTierIndex === -1 ? null : (columnFraction / totalFraction) * 100;
  const highlightBadgeLabel = highlightedTierIndex === -1 ? null : "Tiết kiệm";

  // Update pricing rows dynamically from tiers
  const updatedSections = sections.map((section) => {
    if (section.key === "pricing") {
      const titanTier = tiers.find((t) => t.id === "titan");
      const goldTier = tiers.find((t) => t.id === "gold");
      const premiumTier = tiers.find((t) => t.id === "premium");

      return {
        ...section,
        rows: section.rows.map((row) => {
          if (row.key === "price-month") {
            return {
              ...row,
              titan: titanTier?.monthlyPriceLabel,
              gold: goldTier?.monthlyPriceLabel,
              premium: premiumTier?.monthlyPriceLabel,
            };
          }
          if (row.key === "price-6m") {
            const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN").format(value);
            return {
              ...row,
              titan: titanTier ? `${formatPrice(titanTier.sixMonthPrice)} VND` : undefined,
              gold: goldTier ? `${formatPrice(goldTier.sixMonthPrice)} VND` : undefined,
              premium: premiumTier ? `${formatPrice(premiumTier.sixMonthPrice)} VND` : undefined,
            };
          }
          return row;
        }),
      };
    }
    return section;
  });

  return (
    <section className="mt-24">
      <div className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.45em] text-muted-foreground">So sánh gói hội viên</p>
        <h2 className="text-5xl font-black md:text-6xl leading-relaxed">Bảng quyền lợi đầy đủ</h2>
      
      </div>

      <div className="relative my-12 overflow-hidden">
        {highlightLeftPercent !== null && highlightWidthPercent !== null && (
          <div
            aria-hidden
            className="pointer-events-none overflow-hidden  absolute inset-y-0 z-30 border border-[#a855f7]/18 bg-[#a855f7]/12 opacity-55 shadow-[0_0_35px_rgba(168,85,247,0.28)] backdrop-blur-[0.65px] dark:border-[#d9ceff]/28 dark:bg-[#d9ceff]/14 dark:opacity-60 dark:shadow-[0_0_48px_rgba(201,178,255,0.32)]"
            style={{
              left: `calc(${highlightLeftPercent}% - 0.75%)`,
              width: `calc(${highlightWidthPercent}% + 1.5%)`,
            }}
          >
            {highlightBadgeLabel && (
              <span className="absolute right-[-25] top-20   inline-flex w-[150px] tracking-[1.5] origin-top-right rotate-45 items-center justify-center rounded-md bg-gradient-to-r from-[#fffa73] via-[#ffdc00] to-[#ff9900] py-1 text-[11px] font-black uppercase  text-[#3f2c00] shadow-[0_18px_32px_rgba(0,0,0,0.35)]">
                {highlightBadgeLabel}
              </span>
            )}
          </div>
        )}

        <div className="relative z-10 grid grid-cols-[1.1fr_repeat(3,1fr)]  items-center gap-0  border-y border-border/40  px-6 py-6 text-[12px] font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur md:text-sm">
          <span className="text-sm font-semibold tracking-[0.35em] text-foreground/70">Danh mục</span>
          {tiers.map((tier) => (
            <div key={tier.id} className="relative text-center py-2">
              <p className="text-lg font-bold tracking-[0.3em] text-foreground">{tier.name}</p>
              <p className="text-xs text-muted-foreground">{tier.monthlyPriceLabel}</p>
            </div>
          ))}
        </div>

        {updatedSections.map((section) => (
          <div key={section.key} className="relative z-10 border-t border-border/40 px-6 py-8">
            <p className="pb-4 text-lg font-semibold text-foreground">{section.title}</p>
            {section.rows.map((row, rowIndex) => (
              <div
                key={row.key}
                className={cn(
                  "grid grid-cols-[1.1fr_repeat(3,1fr)] items-center gap-0 py-7",
                  rowIndex !== 0 && "border-t border-border/30"
                )}
              >
                <div className="pr-6">
                  <p className="text-lg font-semibold text-foreground md:text-xl">{row.label}</p>
                  {row.helper && <p className="text-sm text-muted-foreground md:text-base">{row.helper}</p>}
                </div>

                {tiers.map((tier) => (
                  <ComparisonCell
                    key={`${row.key}-${tier.id}`}
                    value={(row as Record<string, string | undefined>)[tier.id]}
                    display={row.display ?? "availability"}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function ComparisonCell({
  value,
  display,
}: {
  value?: string;
  display: "rich" | "availability";
}) {
  const isIncluded = Boolean(value && value !== "–");

  if (display === "rich") {
    return (
      <div className="px-4 text-center">
        {isIncluded ? (
          <div className="space-y-2">
            <p className="text-md text-foreground md:text-xl">{value}</p>
          
          </div>
        ) : (
          <Unavailable />
        )}
      </div>
    );
  }

  return (
    <div className="px-4 text-center">
      {isIncluded ? (
        <div className="flex flex-col items-center gap-2 text-base text-foreground">
          <Check className="h-7 w-7 text-emerald-400" />
          {value && <span className="text-lg text-muted-foreground">{value}</span>}
        </div>
      ) : (
        <Unavailable />
      )}
    </div>
  );
}

function Unavailable() {
  return (
    <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground/70 dark:text-white/40">
      <Minus className="h-4 w-4" />
      <span>Không có</span>
    </div>
  );
}

