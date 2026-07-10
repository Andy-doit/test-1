import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/lib/http/httpClient";

// Queue stats from BullMQ Redis — fetched via backend API
export interface QueueStats {
  name: string;
  active: number;
  waiting: number;
  completed: number;
  failed: number;
}

export const useQueueStats = () => {
  return useQuery<QueueStats[]>({
    queryKey: ["queue-stats"],
    queryFn: async () => {
      const { data } = await backendClient.get<QueueStats[]>("/dashboard/queues");
      return data ?? [];
    },
    staleTime: 30 * 1000, // Refresh every 30s
    retry: 1,
  });
};
