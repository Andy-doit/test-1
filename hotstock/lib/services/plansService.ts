import { backendClient } from "@/lib/http/httpClient";

export type PlanTheme = "dark" | "purple" | "gold";

export type PlanFieldVisibility = {
  dashboardTitle?: string | null;
  dashboardDescription?: string | null;
  performanceTitle?: string | null;
  performanceDescription?: string | null;
  portfolioCompositionTitle?: string | null;
  portfolioCompositionDescription?: string | null;
  targetInfoTitle?: string | null;
  targetInfoDescription?: string | null;
  analysisTitle?: string | null;
  analysisDescription?: string | null;
  portfolioTableTitle?: string | null;
  portfolioTableDescription?: string | null;
};

export type PlanApiResponse = {
  id: number;
  name: string;
  slug: string;
  level: number;
  tagline?: string | null;
  icon?: string | null;
  theme?: PlanTheme | string | null;
  badge?: string | null;
  monthlyPrice: number;
  semiAnnualPrice?: number | null;
  originalPrice?: number | null;
  discountPercent?: number | null;
  description?: string | null;
  features: string[];
  ctaLabel?: string | null;
  isPopular?: boolean;
  highlighted?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  fieldVisibilities?: PlanFieldVisibility | null;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Fetch active plans from backend API.
 * Returns all active plans including the Free plan (level 0).
 */
export const getPlans = async (): Promise<PlanApiResponse[]> => {
  const { data } = await backendClient.get<PlanApiResponse[]>("/plans");

  if (!data) {
    return [];
  }

  return data;
};

export const updatePlanFieldVisibility = async (
  slug: string,
  payload: PlanFieldVisibility,
): Promise<PlanFieldVisibility> => {
  const { data } = await backendClient.patch<PlanFieldVisibility>(
    `/plans/${slug}/field-visibility`,
    payload,
  );

  return data;
};
