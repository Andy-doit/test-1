/**
 * Portfolio tier constants
 * Centralized constants để tránh magic strings trong code
 */
export const PORTFOLIO_TIERS = {
  COMMUNITY: 'community',
  TITAN: 'titan',
  GOLD: 'gold',
  PREMIUM: 'premium',
} as const;

export type PortfolioTier = typeof PORTFOLIO_TIERS[keyof typeof PORTFOLIO_TIERS];

/**
 * Portfolio tier priority for access control
 */
export const TIER_PRIORITY: Record<PortfolioTier, number> = {
  [PORTFOLIO_TIERS.COMMUNITY]: 0,
  [PORTFOLIO_TIERS.TITAN]: 1,
  [PORTFOLIO_TIERS.GOLD]: 2,
  [PORTFOLIO_TIERS.PREMIUM]: 3,
};

/**
 * Portfolio tier routes mapping
 */
export const TIER_ROUTES: Record<PortfolioTier, string> = {
  [PORTFOLIO_TIERS.COMMUNITY]: '/portfolio/free',
  [PORTFOLIO_TIERS.TITAN]: '/portfolio/titan',
  [PORTFOLIO_TIERS.GOLD]: '/portfolio/gold',
  [PORTFOLIO_TIERS.PREMIUM]: '/portfolio/premium',
};

/**
 * Portfolio tier display labels
 */
export const TIER_LABELS: Record<PortfolioTier, string> = {
  [PORTFOLIO_TIERS.COMMUNITY]: 'Danh mục cộng đồng',
  [PORTFOLIO_TIERS.TITAN]: 'Danh mục Titan',
  [PORTFOLIO_TIERS.GOLD]: 'Danh mục Gold',
  [PORTFOLIO_TIERS.PREMIUM]: 'Danh mục Premium',
};

/**
 * Portfolio tier descriptions
 */
export const TIER_DESCRIPTIONS: Record<PortfolioTier, string> = {
  [PORTFOLIO_TIERS.COMMUNITY]: 'Ý tưởng mở, ai cũng xem được',
  [PORTFOLIO_TIERS.TITAN]: 'Chiến lược phòng thủ, ổn định',
  [PORTFOLIO_TIERS.GOLD]: 'Tăng trưởng cân bằng, rủi ro vừa',
  [PORTFOLIO_TIERS.PREMIUM]: 'High conviction, yêu cầu cao nhất',
};

/**
 * Whether a tier's portfolio page shows charts (performance/weight/stop-loss)
 * or just the holdings table. Free/community is table-only; paid tiers get charts.
 */
export const TIER_SHOW_CHARTS: Record<PortfolioTier, boolean> = {
  [PORTFOLIO_TIERS.COMMUNITY]: false,
  [PORTFOLIO_TIERS.TITAN]: true,
  [PORTFOLIO_TIERS.GOLD]: true,
  [PORTFOLIO_TIERS.PREMIUM]: true,
};

/**
 * Allowed plans for each tier page
 */
export const TIER_ALLOWED_PLANS: Record<PortfolioTier, PortfolioTier[]> = {
  [PORTFOLIO_TIERS.COMMUNITY]: [PORTFOLIO_TIERS.COMMUNITY, PORTFOLIO_TIERS.TITAN, PORTFOLIO_TIERS.GOLD, PORTFOLIO_TIERS.PREMIUM],
  [PORTFOLIO_TIERS.TITAN]: [PORTFOLIO_TIERS.TITAN, PORTFOLIO_TIERS.GOLD, PORTFOLIO_TIERS.PREMIUM],
  [PORTFOLIO_TIERS.GOLD]: [PORTFOLIO_TIERS.GOLD, PORTFOLIO_TIERS.PREMIUM],
  [PORTFOLIO_TIERS.PREMIUM]: [PORTFOLIO_TIERS.PREMIUM],
};

/**
 * Check if a plan can access a target tier
 */
export function canAccessTier(plan: PortfolioTier, target: PortfolioTier): boolean {
  if (plan === PORTFOLIO_TIERS.PREMIUM) return true;
  if (plan === PORTFOLIO_TIERS.GOLD) return TIER_PRIORITY[target] <= TIER_PRIORITY[PORTFOLIO_TIERS.GOLD];
  if (plan === PORTFOLIO_TIERS.TITAN) return TIER_PRIORITY[target] <= TIER_PRIORITY[PORTFOLIO_TIERS.TITAN];
  return target === PORTFOLIO_TIERS.COMMUNITY;
}

/**
 * Map PortfolioTier to PortfolioPlanName for API calls
 */
export function tierToPlanName(tier: PortfolioTier): "Free" | "Titan" | "Gold" | "Premium" | null {
  if (tier === PORTFOLIO_TIERS.COMMUNITY) return "Free";
  if (tier === PORTFOLIO_TIERS.TITAN) return "Titan";
  if (tier === PORTFOLIO_TIERS.GOLD) return "Gold";
  if (tier === PORTFOLIO_TIERS.PREMIUM) return "Premium";
  return null;
}

