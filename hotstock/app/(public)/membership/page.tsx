import { Metadata } from "next";
import MembershipClientBlocks from "./_components/membershipClientBlocks";

export const metadata: Metadata = {
  title: "Gói hội viên",
  description: "Nâng cấp hội viên HotStock, mở khoá mọi tính năng phân tích đầu tư với chi phí cạnh tranh nhất thị trường.",
};

export default function MembershipPage() {
  return <MembershipClientBlocks />;
}
