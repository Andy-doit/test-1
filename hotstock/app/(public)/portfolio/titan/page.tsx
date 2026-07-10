import { PORTFOLIO_TIERS } from "@/lib/constants/portfolio";
import PortfolioClientBlocks from "../_components/portfolioClientBlocks";

export default function TitanPortfolioPage() {
  return <PortfolioClientBlocks fixedTier={PORTFOLIO_TIERS.TITAN} showTabs={false} />;
}
