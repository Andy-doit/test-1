// hotstock/types/portfolio.ts

export type Stock = {
  id: string                  // uuid, client-generated khi thêm mới
  ticker: string              // Mã cổ phiếu, uppercase
  sector: string              // Ngành
  buyDate: string             // ISO date, "YYYY-MM-DD"
  costPrice: number           // Giá vốn (nghìn đồng)
  marketPrice: number         // Giá thị trường
  weight: number              // Tỷ trọng 0–1
  targetPrice: number         // Giá mục tiêu
  beta: number                // Beta
  mdd: number                 // Maximum Drawdown 0–1
}

export type DerivedStock = Stock & {
  returnRate: number          // Tự tính
  stopLoss: number            // Tự tính
}

export type PortfolioMeta = {
  managerName: string
  website: string
  weekDate: string            // Ngày cập nhật, ISO date
  vnindexReturn: number       // Nhập tay, dạng thập phân (VD: 0.0337)
}

export type PortfolioMetrics = {
  portfolioReturn: number
  portfolioBeta: number
  portfolioRisk: number
  sharpeRatio: number
  alpha: number
  mddPortfolio: number
}