import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/services/categoriesService";

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
