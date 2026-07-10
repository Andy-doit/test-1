import { PORTFOLIO_TIERS } from "@/lib/constants/portfolio";
import PortfolioClientBlocks from "../_components/portfolioClientBlocks";

export default function PremiumPortfolioPage() {
  return <PortfolioClientBlocks fixedTier={PORTFOLIO_TIERS.PREMIUM} showTabs={false} />;
}
