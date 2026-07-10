import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendClient } from '@/lib/http/httpClient';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
}

export function useAdminTags() {
  const queryClient = useQueryClient();

  // Fetch tags
  const tagsQuery = useQuery({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const res = await backendClient.get<Tag[]>('/tags');
      return res.data;
    },
  });

  // Create tag
  const createTag = useMutation({
    mutationFn: async (data: { name: string; slug?: string }) => {
      const res = await backendClient.post<Tag>('/tags', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
    },
  });

  // Update tag
  const updateTag = useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: { name: string; slug?: string } }) => {
      const res = await backendClient.patch<Tag>(`/tags/${slug}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
    },
  });

  // Delete tag
  const deleteTag = useMutation({
    mutationFn: async (slug: string) => {
      await backendClient.delete(`/tags/${slug}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
    },
  });

  return {
    tags: tagsQuery.data || [],
    isLoading: tagsQuery.isLoading,
    error: tagsQuery.error,
    createTag,
    updateTag,
    deleteTag,
    refetch: tagsQuery.refetch,
  };
}
