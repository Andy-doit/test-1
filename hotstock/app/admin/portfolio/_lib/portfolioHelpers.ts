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
  weight: number | "";
  stopLoss: number | "";
  targetPrice: number | "";
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
  managerName: string;
  website: string;
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
    managerName: "",
    website: "",
    information: [],
    stocks: [],
    reasons: [],
    signals: [],
  };
}

interface StockNote {
  text?: string;
  note?: string;
  weight?: number | string;
  stopLoss?: number | string;
  targetPrice?: number | string;
  beta?: number | string;
  mdd?: number | string;
  managerName?: string;
  website?: string;
}

function parseStockNote(note: string | null | undefined): StockNote {
  if (!note || !note.trim().startsWith("{")) return {};
  try {
    return JSON.parse(note) as StockNote;
  } catch {
    // Treat malformed JSON notes as plain text.
    return {};
  }
}

function numberOrEmpty(raw: number | string | undefined): number | "" {
  if (typeof raw === "number") return raw;
  if (typeof raw === "string" && raw !== "") return Number(raw);
  return "";
}

export function mapPortfolioToForm(
  portfolio: PortfolioWithPlan,
  tier: PortfolioTier,
): EditablePortfolioForm {
  const parsedNotes = (portfolio.stocks ?? []).map((stock) => parseStockNote(stock.note));
  const firstNoteWithManager = parsedNotes.find((n) => n.managerName || n.website);

  return {
    tier,
    portfolioId: portfolio.id,
    planId: portfolio.planId,
    publishedAt: portfolio.publishedAt ? portfolio.publishedAt.slice(0, 10) : "",
    managerName: firstNoteWithManager?.managerName ?? "",
    website: firstNoteWithManager?.website ?? "",
    information: (portfolio.information ?? []).map((item) => ({
      id: createId("info"),
      month: item.month,
      vnindexReturn: item.vnindexReturn,
      recommendReturn: item.recommendReturn,
    })),
    stocks: (portfolio.stocks ?? []).map((stock, index) => {
      const parsedNote = parsedNotes[index];
      const isJsonNote = stock.note && stock.note.trim().startsWith("{");
      const noteText = isJsonNote
        ? parsedNote.text ?? parsedNote.note ?? ""
        : stock.note ?? "";

      return {
        id: createId("stock"),
        symbol: stock.symbol,
        sector: stock.sector ?? "",
        purchaseDate: stock.purchaseDate ? stock.purchaseDate.slice(0, 10) : "",
        costBasis: stock.costBasis,
        marketPrice: stock.marketPrice,
        quantity: stock.quantity,
        weight: numberOrEmpty(parsedNote.weight),
        stopLoss: numberOrEmpty(parsedNote.stopLoss),
        targetPrice: numberOrEmpty(parsedNote.targetPrice),
        beta: numberOrEmpty(parsedNote.beta),
        mdd: numberOrEmpty(parsedNote.mdd),
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
      // sector lives only in the `sector` column above — not duplicated into note.
      note: JSON.stringify({
        text: stock.note.trim(),
        weight: stock.weight === "" ? undefined : Number(stock.weight),
        stopLoss: stock.stopLoss === "" ? undefined : Number(stock.stopLoss),
        targetPrice: stock.targetPrice === "" ? undefined : Number(stock.targetPrice),
        beta: stock.beta === "" ? 0 : Number(stock.beta),
        mdd: stock.mdd === "" ? 0 : Number(stock.mdd),
        managerName: form.managerName.trim() || undefined,
        website: form.website.trim() || undefined,
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
