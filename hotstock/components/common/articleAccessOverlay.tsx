"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, LogIn, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/types/iAccount";
import type { ArticlePlan } from "@/types/iReport";
import { canUserAccessArticle, getArticleMaxPlanLevel } from "@/lib/utils/planAccess";

interface ArticleAccessOverlayProps {
  userPlan: Plan | null;
  articlePlans: ArticlePlan[];
  isAuthenticated: boolean;
  articleTitle: string;
}

export function ArticleAccessOverlay({
  userPlan,
  articlePlans,
  isAuthenticated,
  articleTitle,
}: ArticleAccessOverlayProps) {
  const router = useRouter();
  
  // Nếu article không có plan yêu cầu → không cần overlay
  const articleMaxLevel = getArticleMaxPlanLevel(articlePlans);
  if (articleMaxLevel === 0) {
    return null;
  }

  // Kiểm tra quyền truy cập
  const hasAccess = canUserAccessArticle(userPlan, articlePlans);

  // Nếu có quyền → không hiển thị overlay
  if (hasAccess) {
    return null;
  }

  // Lấy plan yêu cầu cao nhất
  const requiredPlan = articlePlans
    .sort((a, b) => (b.level || 0) - (a.level || 0))[0];

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 p-8 rounded-3xl border border-border/40 bg-card/90 backdrop-blur-md shadow-2xl">
        {/* Nút Quay lại ở góc trên bên trái */}
    
        
        <div className="text-center space-y-6 pt-2">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="relative p-4 rounded-full bg-primary/10 border-2 border-primary/30">
                {isAuthenticated ? (
                  <Crown className="h-12 w-12 text-primary" />
                ) : (
                  <Lock className="h-12 w-12 text-primary" />
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {isAuthenticated
                ? "Nâng cấp gói để xem nội dung này"
                : "Đăng nhập để xem nội dung"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isAuthenticated
                ? `Bài viết "${articleTitle}" yêu cầu gói ${requiredPlan.name || "Premium"} trở lên`
                : "Vui lòng đăng nhập để tiếp tục xem nội dung"}
            </p>
          </div>

          {/* Plan badges */}
          {articlePlans.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {articlePlans.map((plan) => (
                <span
                  key={plan.id}
                  className="inline-flex items-center rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary bg-primary/10"
                >
                  {plan.name}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 w-full">
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleGoBack}
                  className="border-2 bg-background hover:bg-muted hover:border-primary/50 w-full sm:w-auto sm:min-w-[140px]"
                >
                  Quay lại
                </Button>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto sm:min-w-[180px]">
                  <Link href="/goi-hoi-vien" className="flex items-center justify-center">
                    <Crown className="mr-2 h-5 w-5" />
                    Nâng cấp ngay
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleGoBack}
                >
                  Quay lại
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/">Về trang chủ</Link>
                </Button>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Đăng nhập
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

