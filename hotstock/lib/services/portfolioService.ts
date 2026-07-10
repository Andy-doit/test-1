import { backendClient } from "@/lib/http/httpClient";

export type PortfolioStock = {
  id: number;
  symbol: string;
  sector?: string | null;
  purchaseDate: string;
  costBasis: number;
  marketPrice: number;
  quantity: number;
  note?: string | null;
};

export type PortfolioInformation = {
  id: number;
  month: string;
  vnindexReturn: number;
  recommendReturn: number;
};

export type PortfolioReason = {
  id: number;
  type: string;
  symbol: string;
  content: string;
};

export type PortfolioSignal = {
  id: number;
  symbol: string;
  signalType: string;
  description: string;
  targetPrice?: number | null;
  stopLoss?: number | null;
};

export type PortfolioItem = {
  id: number;
  planId: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  stocks?: PortfolioStock[];
  information?: PortfolioInformation[];
  reasons?: PortfolioReason[];
  signals?: PortfolioSignal[];
};

export type PortfolioPlanName = "Free" | "Titan" | "Gold" | "Premium";

export const getPortfolioByPlan = async (
  plan: PortfolioPlanName,
): Promise<PortfolioItem | null> => {
  try {
    const { data } = await backendClient.get<PortfolioItem>(
      `/portfolios?plan=${plan.toLowerCase()}`,
    );
    return data ?? null;
  } catch (error) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 404 || err.response?.status === 403) return null;
    throw error;
  }
};

// ─── Admin-only endpoints ─────────────────────────────────────────────────

export type PortfolioWithPlan = PortfolioItem & {
  plan?: { id: number; slug: string; name: string; level: number };
};

/** GET /portfolios/all — fetch every portfolio (admin/editor) */
export const getAllPortfolios = async (): Promise<PortfolioWithPlan[]> => {
  const { data } = await backendClient.get<PortfolioWithPlan[]>("/portfolios/all");
  return data;
};

/** POST /portfolios — create a new portfolio */
export const createPortfolio = async (
  payload: Record<string, unknown>,
): Promise<PortfolioWithPlan> => {
  const { data } = await backendClient.post<PortfolioWithPlan>("/portfolios", payload);
  return data;
};

/** PATCH /portfolios/:id — update an existing portfolio */
export const updatePortfolio = async (
  id: number,
  payload: Record<string, unknown>,
): Promise<PortfolioWithPlan> => {
  const { data } = await backendClient.patch<PortfolioWithPlan>(`/portfolios/${id}`, payload);
  return data;
};

/** DELETE /portfolios/:id — delete a portfolio */
export const deletePortfolio = async (id: number): Promise<void> => {
  await backendClient.delete(`/portfolios/${id}`);
};

