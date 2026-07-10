import { getCategories } from "@/lib/services/categoriesService";
import { NewsPageClient } from "./_components/newsClientBlocks";
import { connection } from "next/server";

export const metadata = {
  title: "Phân tích và báo cáo",
  description: "Cập nhật phân tích thị trường chứng khoán, crypto, forex và các báo cáo chuyên sâu từ HotStock.",
};

export default async function NewsPage() {
  await connection();
  const categories = await getCategories();
  
  return <NewsPageClient initialCategories={categories} />;
}
