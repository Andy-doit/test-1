import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/lib/http/httpClient";

export const useAdminPortfolios = () => {
  return useQuery({
    queryKey: ["admin-portfolios"],
    queryFn: async () => {
      const { data } = await backendClient.get("/portfolios/all");
      return data;
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await backendClient.delete(`/portfolios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolios"] });
    },
  });
};
