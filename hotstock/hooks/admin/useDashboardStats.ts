import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/lib/http/httpClient";

export interface DashboardStats {
  overview: {
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    totalUsers: number;
    totalCategories: number;
    totalPortfolios: number;
  };
  usersByRole: { role: string; count: number }[];
  articlesByCategory: { name: string; count: number }[];
  recentArticles: Array<{
    id: number;
    slug: string;
    title: string;
    publishedAt: string | null;
    createdAt: string;
    category?: { name: string };
  }>;
  recentUsers: Array<{
    id: number;
    username: string;
    email: string;
    role: string;
  }>;
}

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data } = await backendClient.get("/dashboard/stats");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
