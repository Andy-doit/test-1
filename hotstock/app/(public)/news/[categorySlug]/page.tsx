import { Suspense } from "react";
import { NewsLayout } from "@/components/user/newsLayout";
import { getCategories } from "@/lib/services/categoriesService";


import { connection } from "next/server";

async function CategoryData({ params }: { params: Promise<{ categorySlug: string }> }) {
  await connection();
  const { categorySlug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  const title = category ? category.name : "Tin tức";

  return <NewsLayout title={title} category={categorySlug} />;
}

export default function DynamicCategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-center min-h-screen">Đang tải dữ liệu...</div>}>
      <CategoryData params={params} />
    </Suspense>
  );
}
