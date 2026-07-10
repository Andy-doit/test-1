import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh mục Titan",
  description: "Danh mục đầu tư Titan - cấp độ cao nhất với chiến lược đầu tư độc quyền từ HotStock.",
};

export default function TitanPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}