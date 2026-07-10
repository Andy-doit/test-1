import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/lib/http/httpClient";

export interface Category {
  id: number;
  name: string;
  slug: string;
  isVisibleOnUI?: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    articles: number;
  };
}

export const useAdminCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data } = await backendClient.get("/categories");
      return data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; slug: string; isVisibleOnUI?: boolean }) => {
      const { data } = await backendClient.post("/categories", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // the mutation payload should pass the original slug to put in the URL
    mutationFn: async ({ originalSlug, ...payload }: { originalSlug: string; name: string; slug: string; isVisibleOnUI?: boolean }) => {
      const { data } = await backendClient.patch(`/categories/${originalSlug}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      await backendClient.delete(`/categories/${slug}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
};
