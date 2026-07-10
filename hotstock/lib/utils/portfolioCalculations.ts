/**
 * Tính giá mục tiêu theo công thức Excel:
 * IF(D5*1.15 > 50, ROUND(D5*1.15, 1), IF(D5*1.15 < 10, ROUND(D5*1.15, 2), MROUND(D5*1.15, 0.05)))
 * @param costBasis - Giá vốn (D5)
 * @returns Giá mục tiêu đã được làm tròn theo quy tắc
 */
export function calculateTargetPrice(costBasis: number): number {
  if (costBasis <= 0) return 0;
  
  const basePrice = costBasis * 1.15;
  
  if (basePrice > 50) {
    // ROUND(basePrice, 1) - làm tròn đến 1 chữ số thập phân
    return Math.round(basePrice * 10) / 10;
  } else if (basePrice < 10) {
    // ROUND(basePrice, 2) - làm tròn đến 2 chữ số thập phân
    return Math.round(basePrice * 100) / 100;
  } else {
    // MROUND(basePrice, 0.05) - làm tròn đến bội số của 0.05
    return Math.round(basePrice / 0.05) * 0.05;
  }
}

/**
 * Tính giá dừng lỗ theo công thức Excel:
 * IF(D7*0.95 < 10, MROUND(D7*0.95, 0.01), IF(D7*0.95 <= 50, MROUND(D7*0.95, 0.05), MROUND(D7*0.95, 0.1)))
 * @param costBasis - Giá vốn (D7)
 * @returns Giá dừng lỗ đã được làm tròn theo quy tắc
 */
export function calculateStopLoss(costBasis: number): number {
  if (costBasis <= 0) return 0;
  
  const basePrice = costBasis * 0.95;
  
  if (basePrice < 10) {
    // MROUND(basePrice, 0.01) - làm tròn đến bội số của 0.01
    return Math.round(basePrice / 0.01) * 0.01;
  } else if (basePrice <= 50) {
    // MROUND(basePrice, 0.05) - làm tròn đến bội số của 0.05
    return Math.round(basePrice / 0.05) * 0.05;
  } else {
    // MROUND(basePrice, 0.1) - làm tròn đến bội số của 0.1
    return Math.round(basePrice / 0.1) * 0.1;
  }
}

/**
 * Tính standard deviation (STDEVA) của một mảng số
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  return Math.sqrt(variance);
}

/**
 * Tính SUMPRODUCT - tổng của tích các phần tử tương ứng
 */
export function sumProduct(array1: number[], array2: number[]): number {
  if (array1.length !== array2.length || array1.length === 0) return 0;
  
  return array1.reduce((sum, val, idx) => sum + val * (array2[idx] ?? 0), 0);
}

/**
 * Tính các chỉ số tài chính của danh mục.
 *
 * Hỗ trợ cả 2 dạng input:
 *  - Dạng cũ (Excel-style): { Weight, Beta, MDD } / { RecommendReturn, VNINDEXReturn }
 *  - Dạng API (backend):    { quantity, marketPrice, costBasis } / { recommendReturn, vnindexReturn }
 *
 * Weight sẽ được tính tự động từ quantity * marketPrice nếu không có sẵn.
 */
export function calculatePortfolioMetrics(
  stocks: Array<{
    Weight?: number | null;
    Beta?: number | null;
    MDD?: number | null;
    quantity?: number | null;
    marketPrice?: number | null;
    costBasis?: number | null;
    note?: string | null;
  }>,
  information: Array<{
    RecommendReturn?: number | null;
    VNINDEXReturn?: number | null;
    recommendReturn?: number | null;
    vnindexReturn?: number | null;
  }>,
) {
  // Tính weight cho mỗi stock: dùng Weight nếu có, nếu không tính từ quantity * marketPrice
  const stocksWithWeight = stocks.map((s) => {
    const w = s.Weight ?? ((s.quantity ?? 0) * (s.marketPrice ?? 0));
    
    // Thử parse note để lấy beta và mdd nếu s.Beta/s.MDD không có
    let parsedNote: Record<string, unknown> = {};
    try {
      if (s.note && s.note.trim().startsWith("{")) {
        parsedNote = JSON.parse(s.note);
      }
    } catch {
      // ignore
    }

    return { 
      ...s, 
      _weight: w,
      _beta: s.Beta ?? (parsedNote.beta as number) ?? null,
      _mdd: s.MDD ?? (parsedNote.mdd as number) ?? null,
    };
  });

  const weights = stocksWithWeight
    .filter((s) => s._weight > 0)
    .map((s) => s._weight);

  // Lấy RecommendReturn (hỗ trợ cả 2 dạng)
  const returns = information
    .map((info) => info.RecommendReturn ?? info.recommendReturn ?? null)
    .filter((v): v is number => v != null);

  // Lấy VNINDEXReturn (hỗ trợ cả 2 dạng)
  const vnindexReturns = information
    .map((info) => info.VNINDEXReturn ?? info.vnindexReturn ?? null)
    .filter((v): v is number => v != null);

  // Lấy Beta từ stocks
  const betaEntries = stocksWithWeight.filter((s) => s._beta != null && s._weight > 0);
  const betas = betaEntries.map((s) => s._beta as number);
  const betaWeights = betaEntries.map((s) => s._weight);

  // Lấy MDD từ stocks
  const mddEntries = stocksWithWeight.filter((s) => s._mdd != null && s._weight > 0);
  const mdds = mddEntries.map((s) => s._mdd as number);
  const mddWeights = mddEntries.map((s) => s._weight);

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  if (totalWeight === 0 || returns.length === 0) {
    return {
      sharpeRatio: 0,
      beta: 0,
      alpha: 0,
      risk: 0,
      maxDrawdown: 0,
      portfolioReturn: 0,
      vnindexReturn: 0,
    };
  }

  // Lợi nhuận danh mục: SUMPRODUCT(returns, weights) / SUM(weights)
  const portfolioReturn = sumProduct(returns, weights.slice(0, returns.length)) / totalWeight;

  // Beta trung bình trọng số
  const beta =
    betaWeights.length > 0
      ? sumProduct(betas, betaWeights) / betaWeights.reduce((sum, w) => sum + w, 0)
      : 0;

  // Rủi ro: STDEVA(returns)
  const risk = calculateStandardDeviation(returns);

  // Tỷ số Sharpe: (portfolioReturn - riskFreeRate) / risk
  const riskFreeRate = 4; // 4%
  const sharpeRatio = risk > 0 ? (portfolioReturn - riskFreeRate) / risk : 0;

  // Max Drawdown trung bình trọng số
  const maxDrawdown =
    mddWeights.length > 0
      ? sumProduct(mdds, mddWeights) / mddWeights.reduce((sum, w) => sum + w, 0)
      : 0;

  // Alpha: portfolioReturn - (riskFreeRate + (2.27 - 4)) * beta
  const alpha = portfolioReturn - (riskFreeRate + (2.27 - 4)) * beta;

  // Lợi nhuận VNINDEX trung bình
  const vnindexReturn =
    vnindexReturns.length > 0
      ? vnindexReturns.reduce((sum, val) => sum + val, 0) / vnindexReturns.length
      : 0;

  const round2 = (v: number) => (isNaN(v) || !isFinite(v) ? 0 : Math.round(v * 100) / 100);

  return {
    sharpeRatio: round2(sharpeRatio),
    beta: round2(beta),
    alpha: round2(alpha),
    risk: round2(risk),
    maxDrawdown: round2(maxDrawdown),
    portfolioReturn: round2(portfolioReturn),
    vnindexReturn: round2(vnindexReturn),
  };
}

