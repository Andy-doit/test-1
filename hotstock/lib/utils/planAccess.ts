import type { Plan } from "@/types/iAccount";
import type { ArticlePlan } from "@/types/iReport";

/**
 * Lấy plan level của user
 * Plan null = free = level 0
 */
export function getUserPlanLevel(userPlan: Plan | null): number {
  if (!userPlan) return 0; // free
  return userPlan.level || 0;
}

/**
 * Lấy plan level cao nhất của article
 * Nếu article không có plan nào = free = level 0
 */
export function getArticleMaxPlanLevel(articlePlans: ArticlePlan[]): number {
  if (!articlePlans || articlePlans.length === 0) return 0; // free
  return Math.max(...articlePlans.map((p) => p.level || 0));
}

/**
 * Kiểm tra user có quyền xem article không
 * @param userPlan - Plan của user (null = free)
 * @param articlePlans - Danh sách plans của article
 * @returns true nếu user có quyền xem
 */
export function canUserAccessArticle(
  userPlan: Plan | null,
  articlePlans: ArticlePlan[],
): boolean {
  const userLevel = getUserPlanLevel(userPlan);
  const articleMaxLevel = getArticleMaxPlanLevel(articlePlans);
  
  // User cần có level >= level cao nhất của article
  return userLevel >= articleMaxLevel;
}

/**
 * Lấy plan name để hiển thị
 */
export function getPlanDisplayName(plan: Plan | null): string {
  if (!plan) return "free";
  return plan.slug || plan.name?.toLowerCase() || "free";
}

