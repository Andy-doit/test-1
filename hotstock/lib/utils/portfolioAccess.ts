/**
 * Utility functions for portfolio access control
 */
import { TIER_ALLOWED_PLANS, type PortfolioTier } from "@/lib/constants/portfolio";

/**
 * Check if user's plan can access a specific tier page
 */
export function canAccessTierPage(userPlan: PortfolioTier | null, targetTier: PortfolioTier): boolean {
  if (!userPlan) return false;
  const allowedPlans = TIER_ALLOWED_PLANS[targetTier];
  return allowedPlans.includes(userPlan);
}

/**
 * Get allowed plans for a tier page
 */
export function getAllowedPlansForTier(tier: PortfolioTier): PortfolioTier[] {
  return TIER_ALLOWED_PLANS[tier];
}

