import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh mục Premium",
  description: "Danh mục đầu tư Premium với phân tích chuyên sâu và chiến lược đầu tư từ HotStock.",
};

export default function PremiumPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}