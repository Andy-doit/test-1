import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/lib/http/httpClient";
import { toast } from "sonner";

export interface AdminUserPlan {
  id: number;
  name: string;
  slug: string;
  level: number;
}

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  fullName: string | null;
  phoneNumber: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  plan: AdminUserPlan | null;
}

export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await backendClient.get("/users");
      const items = data.items || data.data || data;

      return (items || []).map((user: AdminUser & { blocked?: boolean }) => ({
        ...user,
        isActive: typeof user.isActive === "boolean" ? user.isActive : !user.blocked,
        plan: user.plan ?? null,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const { data } = await backendClient.patch(`/users/${id}/role`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated successfully");
    },
    onError: (err: Error) => {
      toast.error(`Failed to update user role: ${err.message}`);
    },
  });

  const toggleBlockMutation = useMutation({
    mutationFn: async ({ id, isBlocked }: { id: number; isBlocked: boolean }) => {
      const endpoint = isBlocked ? `/users/${id}/block` : `/users/${id}/unblock`;
      const { data } = await backendClient.patch(endpoint);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`User has been ${variables.isBlocked ? "blocked" : "unblocked"}`);
    },
    onError: (err: Error) => {
      toast.error(`Failed to update user status: ${err.message}`);
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, planId }: { id: number; planId: number }) => {
      const { data } = await backendClient.patch(`/users/${id}/plan`, { planId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User plan updated successfully");
    },
    onError: (err: Error) => {
      toast.error(`Failed to update user plan: ${err.message}`);
    },
  });

  return {
    users,
    isLoading,
    error,
    updateRole: updateRoleMutation.mutateAsync,
    isUpdatingRole: updateRoleMutation.isPending,
    toggleBlock: toggleBlockMutation.mutateAsync,
    isTogglingBlock: toggleBlockMutation.isPending,
    updatePlan: updatePlanMutation.mutateAsync,
    isUpdatingPlan: updatePlanMutation.isPending,
  };
};
