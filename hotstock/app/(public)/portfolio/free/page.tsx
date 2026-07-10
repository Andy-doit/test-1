import { PORTFOLIO_TIERS } from "@/lib/constants/portfolio";
import PortfolioClientBlocks from "../_components/portfolioClientBlocks";

export default function FreePortfolioPage() {
  return <PortfolioClientBlocks fixedTier={PORTFOLIO_TIERS.COMMUNITY} showTabs={false} />;
}
