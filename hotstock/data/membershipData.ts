import type { PlanApiResponse, PlanTheme } from "@/lib/services/plansService";

export type TierId = "titan" | "gold" | "premium";

export type PricingTier = {
  id: TierId;
  name: string;
  label: string;
  monthlyPrice: number;
  monthlyPriceLabel: string;
  originalSixMonthPrice: number;
  sixMonthPrice: number;
  sixMonthPriceLabel: string;
  badge?: string;
  description?: string;
  ctaLabel?: string;
  theme: PlanTheme;
  highlighted: boolean;
  sortOrder: number;
  highlightFeatures: string[];
};

const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const normalizeTheme = (theme?: string | null): PlanTheme => {
  if (theme === "purple" || theme === "gold" || theme === "dark") {
    return theme;
  }

  return "dark";
};

const normalizeTierId = (plan: PlanApiResponse): TierId | null => {
  const key = (plan.slug || plan.name || "").toLowerCase();

  if (key.includes("titan")) return "titan";
  if (key.includes("premium")) return "premium";
  if (key.includes("gold")) return "gold";

  return null;
};

/**
 * Map API plan response to PricingTier.
 * UI text/features/prices now come from backend data.
 */
export const mapPlanToPricingTier = (plan: PlanApiResponse): PricingTier | null => {
  const tierId = normalizeTierId(plan);

  if (!tierId) {
    return null;
  }

  const monthlyPrice = plan.monthlyPrice;
  const originalSixMonthPrice = plan.originalPrice ?? monthlyPrice * 6;
  const sixMonthPrice =
    plan.semiAnnualPrice ??
    (plan.discountPercent
      ? Math.round(originalSixMonthPrice * (1 - plan.discountPercent / 100))
      : Math.round(originalSixMonthPrice * 0.66));

  return {
    id: tierId,
    name: plan.name,
    label: plan.tagline ?? "",
    monthlyPrice,
    monthlyPriceLabel: `${formatPrice(monthlyPrice)} VND/tháng`,
    originalSixMonthPrice,
    sixMonthPrice,
    sixMonthPriceLabel: `${formatPrice(sixMonthPrice)} VND/6 tháng`,
    badge: plan.badge ?? undefined,
    description: plan.description ?? undefined,
    ctaLabel: plan.ctaLabel ?? undefined,
    theme: normalizeTheme(plan.theme),
    highlighted: plan.highlighted ?? plan.isPopular ?? false,
    sortOrder: plan.sortOrder ?? 0,
    highlightFeatures: Array.isArray(plan.features) ? plan.features : [],
  };
};

/**
 * Map array of API plans to PricingTier array.
 */
export const mapPlansToPricingTiers = (plans: PlanApiResponse[]): PricingTier[] => {
  return plans
    .map(mapPlanToPricingTier)
    .filter((tier): tier is PricingTier => tier !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

// Fallback data (for backward compatibility or when API fails)
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "titan",
    name: "Titan",
    label: "Gói khởi đầu",
    monthlyPrice: 1_500_000,
    monthlyPriceLabel: "1,500,000 VND/tháng",
    originalSixMonthPrice: 9_000_000,
    sixMonthPrice: 5_940_000,
    sixMonthPriceLabel: "5,940,000 VND/6 tháng",
    description: "Truy cập tin tức, biểu đồ cơ bản cùng báo cáo hiệu quả hàng tháng để xây nền tảng đầu tư vững chắc.",
    ctaLabel: "Chọn Titan",
    theme: "dark",
    highlighted: false,
    sortOrder: 1,
    highlightFeatures: [
      "3–5 mã/tháng, có điểm mua bán, stop-loss",
      "Báo cáo hiệu quả hàng tháng",
      "Email/Zalo hỗ trợ, trả lời trong 24h",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    label: "Gói chuyên sâu",
    monthlyPrice: 15_000_000,
    monthlyPriceLabel: "15,000,000 VND/tháng",
    originalSixMonthPrice: 90_000_000,
    sixMonthPrice: 59_400_000,
    sixMonthPriceLabel: "59,400,000 VND/6 tháng",
    badge: "Phổ biến nhất",
    description: "Toàn bộ đặc quyền cao cấp: livestream phiên giao dịch, coaching 1-1 và phân tích cá nhân hoá.",
    ctaLabel: "Nâng cấp ngay",
    theme: "purple",
    highlighted: true,
    sortOrder: 3,
    highlightFeatures: [
      "Khuyến nghị danh mục, phân tích chi tiết từng cổ phiếu",
      "Báo cáo tuần & tháng, phân tích cá nhân hóa",
      "Coaching 1–1, tư vấn riêng qua Zoom",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    label: "Gói nâng cao",
    monthlyPrice: 8_000_000,
    monthlyPriceLabel: "8,000,000 VND/tháng",
    originalSixMonthPrice: 48_000_000,
    sixMonthPrice: 29_400_000,
    sixMonthPriceLabel: "29,400,000 VND/6 tháng",
    description: "Nhận cập nhật chiến lược linh hoạt, báo cáo chuyên sâu và hỗ trợ trực tiếp từ đội ngũ HotStock.",
    ctaLabel: "Chọn Gold",
    theme: "gold",
    highlighted: false,
    sortOrder: 2,
    highlightFeatures: [
      "5–8 mã/tháng, cập nhật linh hoạt",
      "Báo cáo tuần + tháng, Dashboard lợi nhuận tháng",
      "Webinar hàng tháng, hotline giờ hành chính",
    ],
  },
];