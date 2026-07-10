import type {
  AdminPlan,
  AdminPlanFieldVisibility,
  AdminPlanPayload,
  AdminPlanTheme,
} from "@/hooks/admin/useAdminPlans";

export type PlanFormState = {
  name: string;
  slug: string;
  level: string;
  tagline: string;
  icon: string;
  theme: AdminPlanTheme;
  badge: string;
  monthlyPrice: string;
  semiAnnualPrice: string;
  originalPrice: string;
  discountPercent: string;
  description: string;
  featuresText: string;
  ctaLabel: string;
  isPopular: boolean;
  highlighted: boolean;
  isActive: boolean;
  sortOrder: string;
  fieldVisibility: AdminPlanFieldVisibility;
};

export type VisibilityTextKey =
  | "dashboardTitle"
  | "dashboardDescription"
  | "performanceTitle"
  | "performanceDescription"
  | "portfolioCompositionTitle"
  | "portfolioCompositionDescription"
  | "targetInfoTitle"
  | "targetInfoDescription"
  | "analysisTitle"
  | "analysisDescription"
  | "portfolioTableTitle"
  | "portfolioTableDescription";

export const defaultFieldVisibility: AdminPlanFieldVisibility = {
  dashboardTitle: "Danh muc Premium",
  dashboardDescription: "Toan bo dashboard va bang chi tiet cho goi Premium.",
  performanceTitle: "Hieu suat danh muc vs VNINDEX",
  performanceDescription: "Theo doi hieu suat danh muc va so sanh voi chi so tham chieu.",
  portfolioCompositionTitle: "Ty trong danh muc",
  portfolioCompositionDescription: "Phan bo ty trong cua tung ma trong danh muc hien tai.",
  targetInfoTitle: "Thong tin muc tieu va chi so",
  targetInfoDescription: "Gia muc tieu, dung lo va cac chi so hieu qua chinh.",
  analysisTitle: "Ly do ho tro",
  analysisDescription: "Luan diem dau tu va ghi chu theo tung ma co phieu.",
  portfolioTableTitle: "Bang danh muc",
  portfolioTableDescription: "Bang tong hop du lieu danh muc de doi chieu nhanh.",
};

export const defaultFormState: PlanFormState = {
  name: "",
  slug: "",
  level: "1",
  tagline: "",
  icon: "",
  theme: "dark",
  badge: "",
  monthlyPrice: "",
  semiAnnualPrice: "",
  originalPrice: "",
  discountPercent: "",
  description: "",
  featuresText: "",
  ctaLabel: "",
  isPopular: false,
  highlighted: false,
  isActive: true,
  sortOrder: "0",
  fieldVisibility: defaultFieldVisibility,
};

export const visibilityTextFields: Array<{
  titleKey: VisibilityTextKey;
  descriptionKey: VisibilityTextKey;
  label: string;
}> = [
  {
    titleKey: "dashboardTitle",
    descriptionKey: "dashboardDescription",
    label: "Header portfolio",
  },
  {
    titleKey: "performanceTitle",
    descriptionKey: "performanceDescription",
    label: "Hieu suat",
  },
  {
    titleKey: "portfolioCompositionTitle",
    descriptionKey: "portfolioCompositionDescription",
    label: "Ty trong",
  },
  {
    titleKey: "targetInfoTitle",
    descriptionKey: "targetInfoDescription",
    label: "Tin hieu",
  },
  {
    titleKey: "analysisTitle",
    descriptionKey: "analysisDescription",
    label: "Ly do ho tro",
  },
  {
    titleKey: "portfolioTableTitle",
    descriptionKey: "portfolioTableDescription",
    label: "Bang danh muc",
  },
];

export const formatCurrency = (value?: number | null): string =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

export const mergeFieldVisibility = (
  value?: AdminPlanFieldVisibility | null,
): AdminPlanFieldVisibility => ({
  ...defaultFieldVisibility,
  ...(value ?? {}),
});

export const toFormState = (plan?: AdminPlan | null): PlanFormState => {
  if (!plan) return defaultFormState;

  return {
    name: plan.name ?? "",
    slug: plan.slug ?? "",
    level: String(plan.level ?? 1),
    tagline: plan.tagline ?? "",
    icon: plan.icon ?? "",
    theme: plan.theme ?? "dark",
    badge: plan.badge ?? "",
    monthlyPrice: String(plan.monthlyPrice ?? ""),
    semiAnnualPrice: plan.semiAnnualPrice != null ? String(plan.semiAnnualPrice) : "",
    originalPrice: plan.originalPrice != null ? String(plan.originalPrice) : "",
    discountPercent: plan.discountPercent != null ? String(plan.discountPercent) : "",
    description: plan.description ?? "",
    featuresText: Array.isArray(plan.features) ? plan.features.join("\n") : "",
    ctaLabel: plan.ctaLabel ?? "",
    isPopular: Boolean(plan.isPopular),
    highlighted: Boolean(plan.highlighted),
    isActive: Boolean(plan.isActive),
    sortOrder: String(plan.sortOrder ?? 0),
    fieldVisibility: mergeFieldVisibility(plan.fieldVisibilities),
  };
};

export const buildPayload = (form: PlanFormState): Omit<AdminPlanPayload, "fieldVisibility"> => ({
  name: form.name.trim(),
  slug: form.slug.trim(),
  level: Number(form.level || 0),
  tagline: form.tagline.trim() || null,
  icon: form.icon.trim() || null,
  theme: form.theme,
  badge: form.badge.trim() || null,
  monthlyPrice: Number(form.monthlyPrice || 0),
  semiAnnualPrice: form.semiAnnualPrice.trim() ? Number(form.semiAnnualPrice) : null,
  originalPrice: form.originalPrice.trim() ? Number(form.originalPrice) : null,
  discountPercent: form.discountPercent.trim() ? Number(form.discountPercent) : null,
  description: form.description.trim() || null,
  features: form.featuresText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean),
  ctaLabel: form.ctaLabel.trim() || null,
  isPopular: form.isPopular,
  highlighted: form.highlighted,
  isActive: form.isActive,
  sortOrder: Number(form.sortOrder || 0),
});

export const buildUpdatePayload = (form: PlanFormState): Partial<AdminPlanPayload> => {
  const payload: Partial<AdminPlanPayload> = { ...buildPayload(form) };
  delete payload.slug;
  delete payload.level;
  delete payload.fieldVisibility;
  return payload;
};

export const themeBadgeVariant: Record<string, "default" | "secondary"> = {
  dark: "secondary",
  purple: "default",
  gold: "default",
};
