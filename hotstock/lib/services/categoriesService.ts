import { backendClient } from "@/lib/http/httpClient";
import { logger } from "@/lib/utils/logger";

export type Category = {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  isVisibleOnUI?: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await backendClient.get<Category[]>("/categories");
    return data ?? [];
  } catch (error) {
    logger.error("[Categories] Failed to fetch categories:", error);
    return [];
  }
};
