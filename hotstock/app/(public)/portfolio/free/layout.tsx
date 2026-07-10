import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh mục cộng đồng",
  description: "Danh mục đầu tư miễn phí dành cho tất cả mọi người, theo dõi các mã cổ phiếu cộng đồng.",
};

export default function FreePortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}