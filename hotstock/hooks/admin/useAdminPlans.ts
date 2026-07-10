import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/lib/http/httpClient";
import { toast } from "sonner";

export type AdminPlanTheme = "dark" | "purple" | "gold";

export interface AdminPlanFieldVisibility {
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
}

export interface AdminPlan {
  id: number;
  name: string;
  slug: string;
  level: number;
  tagline?: string | null;
  icon?: string | null;
  theme: AdminPlanTheme;
  badge?: string | null;
  monthlyPrice: number;
  semiAnnualPrice?: number | null;
  originalPrice?: number | null;
  discountPercent?: number | null;
  description?: string | null;
  features: string[];
  ctaLabel?: string | null;
  isPopular: boolean;
  highlighted: boolean;
  isActive: boolean;
  sortOrder: number;
  fieldVisibilities?: AdminPlanFieldVisibility | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPlanPayload {
  name: string;
  slug: string;
  level: number;
  tagline?: string | null;
  icon?: string | null;
  theme: AdminPlanTheme;
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
  fieldVisibility?: AdminPlanFieldVisibility;
}

const normalizePlansResponse = (data: unknown): AdminPlan[] => {
  if (Array.isArray(data)) {
    return data as AdminPlan[];
  }

  if (data && typeof data === "object") {
    const candidate = data as { items?: AdminPlan[]; data?: AdminPlan[] };

    if (Array.isArray(candidate.items)) {
      return candidate.items;
    }

    if (Array.isArray(candidate.data)) {
      return candidate.data;
    }
  }

  return [];
};

export const useAdminPlans = () => {
  const queryClient = useQueryClient();

  const { data: plans, isLoading, error } = useQuery<AdminPlan[]>({
    queryKey: ["admin-plans"],
    queryFn: async () => {
      const { data } = await backendClient.get("/plans/admin");
      return normalizePlansResponse(data);
    },
    staleTime: 10 * 60 * 1000,
  });

  const createPlanMutation = useMutation({
    mutationFn: async (payload: AdminPlanPayload) => {
      const { data } = await backendClient.post("/plans", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan created successfully");
    },
    onError: (err: Error) => {
      toast.error(`Failed to create plan: ${err.message}`);
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ slug, payload }: { slug: string; payload: Partial<AdminPlanPayload> }) => {
      const { data } = await backendClient.patch(`/plans/${slug}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan updated successfully");
    },
    onError: (err: Error) => {
      toast.error(`Failed to update plan: ${err.message}`);
    },
  });

  const updateFieldVisibilityMutation = useMutation({
    mutationFn: async ({ slug, payload }: { slug: string; payload: AdminPlanFieldVisibility }) => {
      const { data } = await backendClient.patch(`/plans/${slug}/field-visibility`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Field visibility updated successfully");
    },
    onError: (err: Error) => {
      toast.error(`Failed to update field visibility: ${err.message}`);
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (slug: string) => {
      const { data } = await backendClient.delete(`/plans/${slug}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan deleted successfully");
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete plan: ${err.message}`);
    },
  });

  return {
    plans,
    isLoading,
    error,
    createPlan: createPlanMutation.mutateAsync,
    isCreating: createPlanMutation.isPending,
    updatePlan: updatePlanMutation.mutateAsync,
    isUpdating: updatePlanMutation.isPending,
    updateFieldVisibility: updateFieldVisibilityMutation.mutateAsync,
    isUpdatingFieldVisibility: updateFieldVisibilityMutation.isPending,
    deletePlan: deletePlanMutation.mutateAsync,
    isDeleting: deletePlanMutation.isPending,
  };
};
