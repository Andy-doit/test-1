import { useMemo } from "react";
import type { PortfolioItem, PortfolioStock } from "@/lib/services/portfolioService";
import { calculateTargetPrice, calculateStopLoss } from "@/lib/utils/portfolioCalculations";

/**
 * Format ngày từ YYYY-MM-DD sang DD/MM/YYYY
 */
function formatPurchaseDate(dateString: string | null | undefined): string | undefined {
  if (!dateString) return undefined;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Tính stop loss và target price từ stock, làm tròn 2 chữ số
 */
function getStockPrices(stock: { costBasis?: number | null }) {
  const cost = stock.costBasis ?? 0;
  const stopLoss = cost > 0 ? calculateStopLoss(cost) : 0;
  const targetPrice = cost > 0 ? calculateTargetPrice(cost) : 0;
  
  return {
    stop: Math.round(stopLoss * 100) / 100,
    goal: Math.round(targetPrice * 100) / 100,
  };
}

/**
 * Custom hook để xử lý và tính toán tất cả dữ liệu portfolio
 */
export function usePortfolioData(portfolio: PortfolioItem | null | undefined) {
  // Lấy dữ liệu performance theo công thức SERIES Excel
  const performanceData = useMemo(() => {
    if (!portfolio?.information?.length) {
      return {
        categories: [],
        reco: [],
        index: [],
      };
    }

    const sortedInfo = [...portfolio.information]
      .filter((info) => info.month != null)
      .sort((a, b) => {
        // Cố gắng parse month thành số để sort, nếu không được sort theo chuỗi
        const numA = parseInt(a.month.replace(/\D/g, ""), 10);
        const numB = parseInt(b.month.replace(/\D/g, ""), 10);
        return (isNaN(numA) ? 0 : numA) - (isNaN(numB) ? 0 : numB);
      });

    return {
      categories: sortedInfo.map((info) => info.month.startsWith("T") ? info.month : `T${info.month}`),
      reco: sortedInfo.map((info) => info.recommendReturn ?? 0),
      index: sortedInfo.map((info) => info.vnindexReturn ?? 0),
    };
  }, [portfolio]);

  const weightData = useMemo(() => {
    if (!portfolio?.stocks?.length) return [];
    
    // Tính tổng giá trị danh mục
    const totalValue = portfolio.stocks.reduce((sum, s) => sum + (s.quantity * s.marketPrice), 0);
    if (totalValue === 0) return [];
    
    return portfolio.stocks.map((stock) => ({
      name: stock.symbol,
      value: ((stock.quantity * stock.marketPrice) / totalValue) * 100,
    }));
  }, [portfolio]);

  // Tạo Map để lookup stock nhanh hơn
  const stockMap = useMemo(() => {
    if (!portfolio?.stocks?.length) return new Map<string, PortfolioStock>();
    const stocks = portfolio.stocks;
    return new Map(stocks.map((s) => [s.symbol, s]));
  }, [portfolio]);

  const stopLossItems = useMemo(() => {
    if (!portfolio?.stocks?.length) return [];
    
    return portfolio.stocks
      .filter((s) => s.costBasis != null)
      .slice(0, 4)
      .map((s) => {
        const prices = getStockPrices(s);
        return {
          ticker: s.symbol,
          ...prices,
        };
      });
  }, [portfolio]);

  const tableRows = useMemo(() => {
    if (!portfolio?.stocks?.length) return [];
    
    return portfolio.stocks.map((s) => {
      const cost = s.costBasis ?? 0;
      const market = s.marketPrice ?? 0;
      const pnl = cost ? ((market - cost) / cost) * 100 : 0;
      
      let parsedNote: Record<string, unknown> = {};
      try {
        if (s.note && s.note.trim().startsWith("{")) {
          parsedNote = JSON.parse(s.note);
        }
      } catch {
        // ignore
      }

      const parsedNoteWeight = typeof parsedNote.weight === 'number' ? parsedNote.weight : undefined;
      const parsedNoteStopLoss = typeof parsedNote.stopLoss === 'number' ? parsedNote.stopLoss : undefined;
      const parsedNoteTargetPrice = typeof parsedNote.targetPrice === 'number' ? parsedNote.targetPrice : undefined;
      const parsedNoteBeta = typeof parsedNote.beta === 'number' ? parsedNote.beta : undefined;
      const parsedNoteMdd = typeof parsedNote.mdd === 'number' ? parsedNote.mdd : undefined;

      return {
        id: s.id,
        ticker: s.symbol,
        sector: s.sector ?? undefined,
        purchaseDate: s.purchaseDate ? formatPurchaseDate(s.purchaseDate) : undefined,
        cost,
        marketPrice: market,
        weight: parsedNoteWeight !== undefined ? parsedNoteWeight * 100 : undefined,
        pnl,
        stop: parsedNoteStopLoss ?? undefined,
        goal: parsedNoteTargetPrice ?? undefined,
        beta: parsedNoteBeta,
        mdd: parsedNoteMdd,
      };
    });
  }, [portfolio]);

  const supportReasonsData = useMemo(() => {
    if (!portfolio?.reasons?.length) return [];
    
    return portfolio.reasons.map((r) => {
      const stock = stockMap.get(r.symbol);
      const prices = stock ? getStockPrices(stock) : { stop: 0, goal: 0 };
      
      return {
        ticker: r.symbol,
        sector: stock?.sector ?? "",
        type: (r.type ?? "buy") as "buy" | "sell",
        reason: r.content ?? "",
        ...prices,
        beta: 0,
        mdd: 0,
      };
    });
  }, [portfolio, stockMap]);

  const signalsData = useMemo(() => {
    if (!portfolio?.signals?.length) return [];
    
    return portfolio.signals
      .map((s) => {
        const stock = stockMap.get(s.symbol);
        return {
          ticker: s.symbol,
          sector: stock?.sector ?? "",
          buy: s.signalType === "BUY" ? s.description : "",
          sell: s.signalType === "SELL" ? s.description : "",
        };
      });
  }, [portfolio, stockMap]);

  return {
    performanceData,
    weightData,
    stopLossItems,
    tableRows,
    supportReasonsData,
    signalsData,
  };
}


