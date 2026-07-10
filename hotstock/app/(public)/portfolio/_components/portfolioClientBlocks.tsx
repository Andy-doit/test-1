"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PortfolioSectionCard } from "@/components/portfolio/portfolioSectionCard";
import { PortfolioAccessDenied } from "@/components/portfolio/portfolioAccessDenied";
import { PortfolioErrorState } from "@/components/portfolio/portfolioErrorState";
import { PortfolioLoadingState } from "@/components/portfolio/portfolioLoadingState";
import { PortfolioTable } from "@/components/portfolio/portfolioTable";
import { Signals } from "@/components/portfolio/signals";
import { SupportReasons } from "@/components/portfolio/supportReasons";
import { getPlanName } from "@/components/user/header/planBadge";
import { useAuthServer } from "@/hooks/useAuthServer";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { usePortfolioQuery } from "@/hooks/usePortfolioQuery";
import {
  canAccessTier,
  PORTFOLIO_TIERS,
  TIER_DESCRIPTIONS,
  TIER_LABELS,
  TIER_SHOW_CHARTS,
  tierToPlanName,
  type PortfolioTier,
} from "@/lib/constants/portfolio";
import { getPlans, type PlanApiResponse, type PlanFieldVisibility } from "@/lib/services/plansService";

// Chart components pull in echarts (heavy) as a module-level side effect, so they're
// loaded on demand only for tiers that actually show charts (see TIER_SHOW_CHARTS).
const PerformanceChart = dynamic(
  () => import("@/components/portfolio/performanceChart").then((mod) => mod.PerformanceChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-md bg-muted/20" /> }
);
const WeightPieChart = dynamic(
  () => import("@/components/portfolio/weightPieChart").then((mod) => mod.WeightPieChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-md bg-muted/20" /> }
);
const StopLossTargetChart = dynamic(
  () => import("@/components/portfolio/stopLossTargetChart").then((mod) => mod.StopLossTargetChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-md bg-muted/20" /> }
);

const TAB_CONFIG: Array<{
  key: PortfolioTier;
  label: string;
  description: string;
}> = [
  {
    key: PORTFOLIO_TIERS.COMMUNITY,
    label: TIER_LABELS[PORTFOLIO_TIERS.COMMUNITY],
    description: TIER_DESCRIPTIONS[PORTFOLIO_TIERS.COMMUNITY],
  },
  {
    key: PORTFOLIO_TIERS.TITAN,
    label: TIER_LABELS[PORTFOLIO_TIERS.TITAN],
    description: TIER_DESCRIPTIONS[PORTFOLIO_TIERS.TITAN],
  },
  {
    key: PORTFOLIO_TIERS.GOLD,
    label: TIER_LABELS[PORTFOLIO_TIERS.GOLD],
    description: TIER_DESCRIPTIONS[PORTFOLIO_TIERS.GOLD],
  },
  {
    key: PORTFOLIO_TIERS.PREMIUM,
    label: TIER_LABELS[PORTFOLIO_TIERS.PREMIUM],
    description: TIER_DESCRIPTIONS[PORTFOLIO_TIERS.PREMIUM],
  },
];

const DEFAULT_TEXT = {
  dashboardTitle: "Danh muc dau tu",
  dashboardDescription: "Theo doi du lieu danh muc theo tung goi.",
  performanceTitle: "Hieu suat danh muc vs VNINDEX",
  performanceDescription: "Bieu do hieu suat danh muc so voi VNINDEX.",
  portfolioCompositionTitle: "Ty trong danh muc",
  portfolioCompositionDescription: "Phan bo ty trong cac ma trong danh muc.",
  targetInfoTitle: "Tin hieu mua/ban",
  targetInfoDescription: "Cac diem nhan giao dich gan nhat theo danh muc.",
  analysisTitle: "Ly do ho tro",
  analysisDescription: "Luan diem dau tu va ghi chu phan tich theo tung ma.",
  portfolioTableTitle: "Bang danh muc",
  portfolioTableDescription: "Chi tiet danh muc hien tai.",
} satisfies Required<Pick<
  PlanFieldVisibility,
  | "dashboardTitle"
  | "dashboardDescription"
  | "performanceTitle"
  | "performanceDescription"
  | "portfolioCompositionTitle"
  | "portfolioCompositionDescription"
  | "targetInfoTitle"
  | "targetInfoDescription"
  | "analysisTitle"
  | "analysisDescription"
  | "portfolioTableTitle"
  | "portfolioTableDescription"
>>;

type PortfolioClientBlocksProps = {
  fixedTier?: PortfolioTier;
  showTabs?: boolean;
};

function normalizePlanTier(raw: string | null | undefined): PortfolioTier {
  if (raw === "titan" || raw === "gold" || raw === "premium") return raw;
  return PORTFOLIO_TIERS.COMMUNITY;
}

function getPlanText(plan?: PlanApiResponse): typeof DEFAULT_TEXT {
  const text = plan?.fieldVisibilities;
  return {
    dashboardTitle: text?.dashboardTitle || DEFAULT_TEXT.dashboardTitle,
    dashboardDescription: text?.dashboardDescription || DEFAULT_TEXT.dashboardDescription,
    performanceTitle: text?.performanceTitle || DEFAULT_TEXT.performanceTitle,
    performanceDescription: text?.performanceDescription || DEFAULT_TEXT.performanceDescription,
    portfolioCompositionTitle:
      text?.portfolioCompositionTitle || DEFAULT_TEXT.portfolioCompositionTitle,
    portfolioCompositionDescription:
      text?.portfolioCompositionDescription || DEFAULT_TEXT.portfolioCompositionDescription,
    targetInfoTitle: text?.targetInfoTitle || DEFAULT_TEXT.targetInfoTitle,
    targetInfoDescription: text?.targetInfoDescription || DEFAULT_TEXT.targetInfoDescription,
    analysisTitle: text?.analysisTitle || DEFAULT_TEXT.analysisTitle,
    analysisDescription: text?.analysisDescription || DEFAULT_TEXT.analysisDescription,
    portfolioTableTitle: text?.portfolioTableTitle || DEFAULT_TEXT.portfolioTableTitle,
    portfolioTableDescription:
      text?.portfolioTableDescription || DEFAULT_TEXT.portfolioTableDescription,
  };
}

function EmptyPortfolioState({ title }: { title: string }) {
  return (
    <Card className="p-8 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Chua co du lieu danh muc. Admin se cap nhat som nhat co the.
      </p>
    </Card>
  );
}

export default function PortfolioClientBlocks({
  fixedTier,
  showTabs = true,
}: PortfolioClientBlocksProps) {
  const { user, checkProfile } = useAuthServer();
  const userTier = useMemo(() => normalizePlanTier(getPlanName(user?.plan ?? null)), [user?.plan]);
  const [activeTab, setActiveTab] = useState<PortfolioTier>(fixedTier ?? PORTFOLIO_TIERS.COMMUNITY);

  useEffect(() => {
    checkProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fixedTier) {
      setActiveTab(fixedTier);
      return;
    }

    const matchingTab = TAB_CONFIG.find((tab) => tab.key === userTier);
    if (matchingTab) {
      setActiveTab(matchingTab.key);
      return;
    }

    const firstAllowed = TAB_CONFIG.find((tab) => canAccessTier(userTier, tab.key));
    if (firstAllowed) setActiveTab(firstAllowed.key);
  }, [fixedTier, userTier]);

  const { data: plans = [] } = useQuery<PlanApiResponse[]>({
    queryKey: ["plans"],
    queryFn: getPlans,
    staleTime: 10 * 60 * 1000,
  });

  const planByTier = useMemo(() => {
    const map = new Map<PortfolioTier, PlanApiResponse>();
    for (const plan of plans) {
      const slug = (plan.slug ?? "").toLowerCase().trim();
      if (slug === "free" || slug === "community") map.set(PORTFOLIO_TIERS.COMMUNITY, plan);
      if (slug === "titan") map.set(PORTFOLIO_TIERS.TITAN, plan);
      if (slug === "gold") map.set(PORTFOLIO_TIERS.GOLD, plan);
      if (slug === "premium") map.set(PORTFOLIO_TIERS.PREMIUM, plan);
    }
    return map;
  }, [plans]);

  const planName = useMemo(() => tierToPlanName(activeTab), [activeTab]);
  const shouldFetch = planName !== null;
  const hasAccess = canAccessTier(userTier, activeTab);

  const {
    data: portfolio,
    isLoading,
    error,
  } = usePortfolioQuery(planName ?? "Free", { enabled: shouldFetch && hasAccess });

  const {
    performanceData,
    weightData,
    stopLossItems,
    tableRows,
    supportReasonsData,
    signalsData = [],
  } = usePortfolioData(portfolio);

  const activePlan = planByTier.get(activeTab);
  const text = getPlanText(activePlan);
  const showCharts = TIER_SHOW_CHARTS[activeTab];

  const hasStocks = Array.isArray(portfolio?.stocks);
  const hasInformation = Array.isArray(portfolio?.information);
  const hasReasons = Array.isArray(portfolio?.reasons);
  const hasSignals = Array.isArray(portfolio?.signals);
  const hasAnyBlock = hasStocks || hasInformation || hasReasons || hasSignals;

  const renderContent = () => {
    if (!shouldFetch) return <PortfolioErrorState />;
    if (!hasAccess) return <PortfolioAccessDenied tier={activeTab} />;
    if (isLoading) return <PortfolioLoadingState />;
    if (error) return <PortfolioErrorState />;
    if (!portfolio || !hasAnyBlock) {
      return <EmptyPortfolioState title={activePlan?.name || TIER_LABELS[activeTab]} />;
    }

    const performanceReady =
      performanceData.categories.length > 0 &&
      performanceData.reco.length > 0 &&
      performanceData.index.length > 0;

    return (
      <div className="space-y-6">
        {showCharts && hasInformation && (
          <PortfolioSectionCard
            title={text.performanceTitle}
            description={text.performanceDescription}
            hasData={performanceReady}
          >
            <PerformanceChart
              categories={performanceData.categories}
              reco={performanceData.reco}
              index={performanceData.index}
            />
          </PortfolioSectionCard>
        )}

        {hasStocks && (
          <>
            {showCharts && (
              <PortfolioSectionCard
                title={text.portfolioCompositionTitle}
                description={text.portfolioCompositionDescription}
                hasData={weightData.length > 0}
              >
                <WeightPieChart data={weightData} />
              </PortfolioSectionCard>
            )}

            <PortfolioSectionCard
              className="p-6 space-y-4"
              title={text.portfolioTableTitle}
              description={text.portfolioTableDescription}
              hasData={tableRows.length > 0}
            >
              <PortfolioTable rows={tableRows} />
            </PortfolioSectionCard>

            {showCharts && (
              <PortfolioSectionCard
                title="Gia muc tieu vs Gia dung lo"
                className="p-6 space-y-4"
                hasData={stopLossItems.length > 0}
              >
                <StopLossTargetChart items={stopLossItems} />
              </PortfolioSectionCard>
            )}
          </>
        )}

        {hasReasons && (
          <PortfolioSectionCard
            className="p-6 space-y-4"
            title={text.analysisTitle}
            description={text.analysisDescription}
            hasData={supportReasonsData.length > 0}
          >
            <SupportReasons rows={supportReasonsData} />
          </PortfolioSectionCard>
        )}

        {hasSignals && (
          <PortfolioSectionCard
            title={text.targetInfoTitle}
            description={text.targetInfoDescription}
            className="p-6 space-y-4"
            hasData={signalsData.length > 0}
          >
            <Signals items={signalsData} />
          </PortfolioSectionCard>
        )}
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-screen-2xl space-y-8 px-4 pb-16 pt-28 sm:px-6 md:px-10 lg:px-14">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold sm:text-4xl">{text.dashboardTitle}</h1>
        <p className="text-muted-foreground">{text.dashboardDescription}</p>
      </div>

      {showTabs && (
        <div className="inline-flex flex-wrap items-center justify-start gap-2 rounded-2xl border border-border/60 bg-white/80 px-2 py-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          {TAB_CONFIG.map((tab) => {
            const locked = !canAccessTier(userTier, tab.key);
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                disabled={locked}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
                  isActive
                    ? "bg-gradient-to-r from-[#7042E1] to-[#A084FB] text-white shadow-[0_6px_18px_rgba(112,66,225,0.25)]"
                    : "text-foreground/70 hover:text-foreground"
                } ${locked ? "cursor-not-allowed opacity-55" : ""}`}
              >
                {tab.label}
                {locked && <Lock className="h-4 w-4 opacity-70" />}
              </button>
            );
          })}
        </div>
      )}

      {renderContent()}
    </section>
  );
}
