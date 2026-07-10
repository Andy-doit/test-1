import { Suspense } from "react";
import { EditArticleClient } from "./editArticleClient";

async function ArticleData({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EditArticleClient slug={slug} />;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleData params={params} />
    </Suspense>
  );
}
