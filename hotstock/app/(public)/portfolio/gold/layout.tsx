import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh mục Gold",
  description: "Danh mục đầu tư Gold với các mã cổ phiếu được chọn lọc bởi đội ngũ chuyên gia HotStock.",
};

export default function GoldPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}