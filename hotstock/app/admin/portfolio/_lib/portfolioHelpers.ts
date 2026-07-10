import { PORTFOLIO_TIERS, type PortfolioTier } from "@/lib/constants/portfolio";
import { type PortfolioWithPlan } from "@/lib/services/portfolioService";

export type EditableStock = {
  id: string;
  symbol: string;
  sector: string;
  purchaseDate: string;
  costBasis: number;
  marketPrice: number;
  quantity: number;
  beta: number | "";
  mdd: number | "";
  note: string;
};

export type EditableInformation = {
  id: string;
  month: string;
  vnindexReturn: number;
  recommendReturn: number;
};

export type EditableReason = {
  id: string;
  type: "buy" | "sell";
  symbol: string;
  content: string;
};

export type EditableSignal = {
  id: string;
  symbol: string;
  signalType: string;
  description: string;
  targetPrice: number | "";
  stopLoss: number | "";
};

export type EditablePortfolioForm = {
  tier: PortfolioTier;
  portfolioId: number | null;
  planId: number | null;
  publishedAt: string;
  information: EditableInformation[];
  stocks: EditableStock[];
  reasons: EditableReason[];
  signals: EditableSignal[];
};

export const TIER_SLUG_MAP: Record<string, PortfolioTier> = {
  free: PORTFOLIO_TIERS.COMMUNITY,
  titan: PORTFOLIO_TIERS.TITAN,
  gold: PORTFOLIO_TIERS.GOLD,
  premium: PORTFOLIO_TIERS.PREMIUM,
};

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyForm(
  tier: PortfolioTier,
  planId: number | null = null,
): EditablePortfolioForm {
  return {
    tier,
    portfolioId: null,
    planId,
    publishedAt: "",
    information: [],
    stocks: [],
    reasons: [],
    signals: [],
  };
}

export function mapPortfolioToForm(
  portfolio: PortfolioWithPlan,
  tier: PortfolioTier,
): EditablePortfolioForm {
  return {
    tier,
    portfolioId: portfolio.id,
    planId: portfolio.planId,
    publishedAt: portfolio.publishedAt ? portfolio.publishedAt.slice(0, 10) : "",
    information: (portfolio.information ?? []).map((item) => ({
      id: createId("info"),
      month: item.month,
      vnindexReturn: item.vnindexReturn,
      recommendReturn: item.recommendReturn,
    })),
    stocks: (portfolio.stocks ?? []).map((stock) => {
      interface StockNote {
        text?: string;
        note?: string;
        beta?: number | string;
        mdd?: number | string;
      }

      let parsedNote: StockNote = {};
      try {
        if (stock.note && stock.note.trim().startsWith("{")) {
          parsedNote = JSON.parse(stock.note) as StockNote;
        }
      } catch {
        // Treat malformed JSON notes as plain text.
      }

      const isJsonNote = stock.note && stock.note.trim().startsWith("{");
      const noteText = isJsonNote
        ? parsedNote.text ?? parsedNote.note ?? ""
        : stock.note ?? "";
      const betaRaw = parsedNote.beta;
      const mddRaw = parsedNote.mdd;

      return {
        id: createId("stock"),
        symbol: stock.symbol,
        sector: stock.sector ?? "",
        purchaseDate: stock.purchaseDate ? stock.purchaseDate.slice(0, 10) : "",
        costBasis: stock.costBasis,
        marketPrice: stock.marketPrice,
        quantity: stock.quantity,
        beta:
          typeof betaRaw === "number"
            ? betaRaw
            : typeof betaRaw === "string" && betaRaw !== ""
              ? Number(betaRaw)
              : "",
        mdd:
          typeof mddRaw === "number"
            ? mddRaw
            : typeof mddRaw === "string" && mddRaw !== ""
              ? Number(mddRaw)
              : "",
        note: noteText,
      };
    }),
    reasons: (portfolio.reasons ?? []).map((reason) => ({
      id: createId("reason"),
      type: (reason.type?.toLowerCase() === "sell" ? "sell" : "buy") as
        | "buy"
        | "sell",
      symbol: reason.symbol,
      content: reason.content,
    })),
    signals: (portfolio.signals ?? []).map((signal) => ({
      id: createId("signal"),
      symbol: signal.symbol,
      signalType: signal.signalType,
      description: signal.description,
      targetPrice: signal.targetPrice ?? "",
      stopLoss: signal.stopLoss ?? "",
    })),
  };
}

export function buildPortfolioPayload(form: EditablePortfolioForm) {
  return {
    planId: form.planId!,
    publishedAt: new Date(form.publishedAt).toISOString(),
    stocks: form.stocks.map((stock) => ({
      symbol: stock.symbol.trim().toUpperCase(),
      sector: stock.sector.trim() || undefined,
      purchaseDate: new Date(stock.purchaseDate).toISOString(),
      costBasis: Number(stock.costBasis),
      marketPrice: Number(stock.marketPrice),
      quantity: Number(stock.quantity),
      note: JSON.stringify({
        text: stock.note.trim(),
        beta: stock.beta === "" ? 0 : Number(stock.beta),
        mdd: stock.mdd === "" ? 0 : Number(stock.mdd),
      }),
    })),
    information: form.information.map((item) => ({
      month: item.month.trim(),
      vnindexReturn: Number(item.vnindexReturn),
      recommendReturn: Number(item.recommendReturn),
    })),
    reasons: form.reasons.map((item) => ({
      type: item.type.toLowerCase() === "sell" ? "sell" : "buy",
      symbol: item.symbol.trim().toUpperCase(),
      content: item.content.trim(),
    })),
    signals: form.signals.map((item) => ({
      symbol: item.symbol.trim().toUpperCase(),
      signalType: item.signalType.trim(),
      description: item.description.trim(),
      targetPrice: item.targetPrice === "" ? undefined : Number(item.targetPrice),
      stopLoss: item.stopLoss === "" ? undefined : Number(item.stopLoss),
    })),
  };
}
