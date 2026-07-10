import { PORTFOLIO_TIERS } from "@/lib/constants/portfolio";
import PortfolioClientBlocks from "../_components/portfolioClientBlocks";

export default function GoldPortfolioPage() {
  return <PortfolioClientBlocks fixedTier={PORTFOLIO_TIERS.GOLD} showTabs={false} />;
}
