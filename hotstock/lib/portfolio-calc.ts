// hotstock/lib/portfolio-calc.ts

import type { Stock, PortfolioMetrics } from "@/types/portfolio"

// Làm tròn theo bậc thang giống MROUND trong Excel
function mround(value: number, step: number): number {
  return Math.round(value / step) * step
}

export function calcStopLoss(costPrice: number): number {
  const raw = costPrice * 0.95
  let step: number
  if (raw < 10) step = 0.01
  else if (raw <= 50) step = 0.05
  else step = 0.1
  return mround(raw, step)
}

export function calcReturnRate(costPrice: number, marketPrice: number): number {
  return (marketPrice - costPrice) / costPrice
}

// Độ lệch chuẩn mẫu (STDEVA, chia N-1)
function stdeva(arr: number[]): number {
  if (arr.length < 2) return 0
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length
  const variance = arr.reduce((s, x) => s + (x - mean) ** 2, 0) / (arr.length - 1)
  return Math.sqrt(variance)
}

const RISK_FREE_RATE = 0.04   // 4%, cố định
const MARKET_RETURN = 0.0227  // 2.27%, cố định từ file gốc

export function calcPortfolioMetrics(stocks: Stock[]): PortfolioMetrics {
  if (stocks.length === 0) {
    return { portfolioReturn: 0, portfolioBeta: 0, portfolioRisk: 0, sharpeRatio: 0, alpha: 0, mddPortfolio: 0 }
  }

  const returns = stocks.map(s => calcReturnRate(s.costPrice, s.marketPrice))

  const portfolioReturn = stocks.reduce((sum, s, i) => sum + returns[i] * s.weight, 0)
  const portfolioBeta   = stocks.reduce((sum, s) => sum + s.beta * s.weight, 0)
  const portfolioRisk   = stdeva(returns)
  const sharpeRatio     = portfolioRisk === 0 ? 0 : (portfolioReturn - RISK_FREE_RATE) / portfolioRisk
  const alpha           = portfolioReturn - (RISK_FREE_RATE + (MARKET_RETURN - RISK_FREE_RATE) * portfolioBeta)
  const mddPortfolio    = stocks.reduce((sum, s) => sum + s.mdd * s.weight, 0)

  return { portfolioReturn, portfolioBeta, portfolioRisk, sharpeRatio, alpha, mddPortfolio }
}