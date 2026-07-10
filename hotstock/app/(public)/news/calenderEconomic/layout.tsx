import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch kinh tế toàn cầu",
  description: "Theo dõi lịch phát hành dữ liệu vĩ mô quan trọng, đánh giá mức độ ảnh hưởng đến thị trường tài chính.",
};

export default function EconomicCalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}