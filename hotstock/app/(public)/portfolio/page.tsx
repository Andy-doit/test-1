import { Metadata } from "next";
import PortfolioClientBlocks from "./_components/portfolioClientBlocks";

export const metadata: Metadata = {
  title: "Danh mục đầu tư",
  description: "Theo dõi danh mục đầu tư chứng khoán, crypto, vàng và theo dõi hiệu suất đầu tư.",
};

export default function PortfolioPage() {
  return <PortfolioClientBlocks />;
}
