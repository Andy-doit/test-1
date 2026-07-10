import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/lib/http/httpClient";
import { toast } from "sonner";

export interface AdminArticle {
  id: number;
  title: string;
  slug: string;
  description?: string;
  contentBlocks?: unknown;
  coverUrl?: string;
  categoryId?: number;
  tagIds?: number[];
  tags?: { id: number; name: string; slug: string }[];
  readPermission?: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  category?: { id: number; name: string; slug: string };
  author?: { id: number; name: string };
}

export const useAdminArticles = () => {
  const queryClient = useQueryClient();

  const { data: articles, isLoading, error } = useQuery<AdminArticle[]>({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data } = await backendClient.get("/articles/admin/list");
      return data.items || data.data || data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const createArticleMutation = useMutation({
    mutationFn: async (payload: Partial<AdminArticle>) => {
      const { data } = await backendClient.post(`/articles`, payload);
      return data;
    },
    onSuccess: (createdArticle) => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      if (createdArticle?.slug) {
        queryClient.setQueryData(["admin-article", createdArticle.slug], createdArticle);
      }
      toast.success("Article created successfully");
    },
    onError: (err: Error) => {
      toast.error(`Failed to create article: ${err.message}`);
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ slug, payload }: { slug: string; payload: Partial<AdminArticle> }) => {
      const { data } = await backendClient.patch(`/articles/${slug}`, payload);
      return data;
    },
    onSuccess: (updatedArticle, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-article", variables.slug] });
      if (updatedArticle?.slug) {
        queryClient.setQueryData(["admin-article", updatedArticle.slug], updatedArticle);
      }
      toast.success("Article updated successfully");
    },
    onError: (err: Error) => {
      toast.error(`Failed to update article: ${err.message}`);
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (slug: string) => {
      const { data } = await backendClient.delete(`/articles/${slug}`);
      return data;
    },
    onSuccess: (_data, slug) => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.removeQueries({ queryKey: ["admin-article", slug] });
      toast.success("Article deleted successfully");
    },
    onError: (err: Error) => {
      toast.error(`Failed to delete article: ${err.message}`);
    },
  });

  return {
    articles,
    isLoading,
    error,
    createArticle: createArticleMutation.mutateAsync,
    isCreating: createArticleMutation.isPending,
    updateArticle: updateArticleMutation.mutateAsync,
    isUpdating: updateArticleMutation.isPending,
    deleteArticle: deleteArticleMutation.mutateAsync,
    isDeleting: deleteArticleMutation.isPending,
  };
};

export const useAdminArticle = (slug: string) => {
  return useQuery<AdminArticle>({
    queryKey: ["admin-article", slug],
    queryFn: async () => {
      const { data } = await backendClient.get(`/articles/admin/${slug}`);
      return data.item || data.data || data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};
