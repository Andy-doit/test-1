"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Save, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { AdminPageHeader } from "@/components/admin/shared/adminPageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PORTFOLIO_TIERS, TIER_LABELS, type PortfolioTier } from "@/lib/constants/portfolio";
import { logger } from "@/lib/utils/logger";
import {
  createPortfolio,
  deletePortfolio,
  getAllPortfolios,
  updatePortfolio,
  type PortfolioWithPlan,
} from "@/lib/services/portfolioService";
import { getPlans, type PlanApiResponse } from "@/lib/services/plansService";
import {
  type EditableInformation,
  type EditablePortfolioForm,
  type EditableReason,
  type EditableSignal,
  type EditableStock,
  buildPortfolioPayload,
  createEmptyForm,
  createId,
  mapPortfolioToForm,
  TIER_SLUG_MAP,
} from "./_lib/portfolioHelpers";
import { PortfolioHeader } from "./_components/portfolioHeader";
import { PerformanceSection } from "./_components/performanceSection";
import { ReasonSection } from "./_components/reasonSection";
import { SignalSection } from "./_components/signalSection";
import { StockTableSection } from "./_components/stockTableSection";

const TIERS = [
  PORTFOLIO_TIERS.COMMUNITY,
  PORTFOLIO_TIERS.TITAN,
  PORTFOLIO_TIERS.GOLD,
  PORTFOLIO_TIERS.PREMIUM,
] as const;

const createInitialForms = (): Record<PortfolioTier, EditablePortfolioForm> => ({
  community: createEmptyForm(PORTFOLIO_TIERS.COMMUNITY),
  titan: createEmptyForm(PORTFOLIO_TIERS.TITAN),
  gold: createEmptyForm(PORTFOLIO_TIERS.GOLD),
  premium: createEmptyForm(PORTFOLIO_TIERS.PREMIUM),
});

export default function AdminPortfolioPage() {
  const [activeTier, setActiveTier] = useState<PortfolioTier>(PORTFOLIO_TIERS.COMMUNITY);
  const [formsByTier, setFormsByTier] =
    useState<Record<PortfolioTier, EditablePortfolioForm>>(createInitialForms);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = formsByTier[activeTier];

  const totalMarketValue = useMemo(
    () => form.stocks.reduce((sum, stock) => sum + stock.marketPrice * stock.quantity, 0),
    [form.stocks],
  );

  const loadPortfolios = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allPlans, allPortfolios]: [PlanApiResponse[], PortfolioWithPlan[]] =
        await Promise.all([getPlans(), getAllPortfolios()]);

      const latestByTier: Partial<Record<PortfolioTier, PortfolioWithPlan>> = {};
      for (const portfolio of allPortfolios) {
        const slug = portfolio.plan?.slug?.toLowerCase();
        const tier = slug ? TIER_SLUG_MAP[slug] : undefined;
        if (!tier) continue;

        const existing = latestByTier[tier];
        if (!existing || new Date(portfolio.publishedAt) > new Date(existing.publishedAt)) {
          latestByTier[tier] = portfolio;
        }
      }

      const planByTier = new Map<PortfolioTier, PlanApiResponse>();
      for (const plan of allPlans) {
        const tier = TIER_SLUG_MAP[(plan.slug ?? "").toLowerCase()];
        if (tier) planByTier.set(tier, plan);
      }

      const newForms = createInitialForms();
      for (const tier of TIERS) {
        const portfolio = latestByTier[tier];
        const planId = planByTier.get(tier)?.id ?? null;
        newForms[tier] = portfolio ? mapPortfolioToForm(portfolio, tier) : createEmptyForm(tier, planId);
        if (!newForms[tier].planId) newForms[tier].planId = planId;
      }

      setFormsByTier(newForms);
    } catch (error) {
      logger.error("[AdminPortfolio] Failed to load portfolios:", error);
      toast.error("Khong the tai danh muc tu server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  const updateCurrentForm = (updater: (current: EditablePortfolioForm) => EditablePortfolioForm) => {
    setFormsByTier((prev) => ({
      ...prev,
      [activeTier]: updater(prev[activeTier]),
    }));
  };

  const handleCopySectionFromTier = (
    fromTier: PortfolioTier,
    section: "information" | "stocks" | "reasons" | "signals",
  ) => {
    const sourceForm = formsByTier[fromTier];
    if (!sourceForm) return;

    setFormsByTier((prev) => {
      const currentForm = prev[activeTier];
      const copiedData =
        section === "information"
          ? sourceForm.information.map((item) => ({ ...item, id: createId("info") }))
          : section === "stocks"
            ? sourceForm.stocks.map((item) => ({ ...item, id: createId("stock") }))
            : section === "reasons"
              ? sourceForm.reasons.map((item) => ({ ...item, id: createId("reason") }))
              : sourceForm.signals.map((item) => ({ ...item, id: createId("signal") }));

      return {
        ...prev,
        [activeTier]: {
          ...currentForm,
          [section]: copiedData,
        },
      };
    });

    toast.success(`Da dong bo ${section} tu ${TIER_LABELS[fromTier]}`);
  };

  const updateInfo = (id: string, field: keyof EditableInformation, value: string) => {
    updateCurrentForm((current) => ({
      ...current,
      information: current.information.map((item) =>
        item.id === id ? { ...item, [field]: field === "month" ? value : Number(value) } : item,
      ),
    }));
  };

  const updateStock = (id: string, field: keyof EditableStock, value: string) => {
    updateCurrentForm((current) => ({
      ...current,
      stocks: current.stocks.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "symbol" || field === "sector" || field === "purchaseDate" || field === "note"
                  ? value
                  : Number(value),
            }
          : item,
      ),
    }));
  };

  const updateReason = (id: string, field: keyof EditableReason, value: string) => {
    updateCurrentForm((current) => ({
      ...current,
      reasons: current.reasons.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const updateSignal = (id: string, field: keyof EditableSignal, value: string) => {
    updateCurrentForm((current) => ({
      ...current,
      signals: current.signals.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "targetPrice" || field === "stopLoss"
                  ? value === ""
                    ? ""
                    : Number(value)
                  : value,
            }
          : item,
      ),
    }));
  };

  const removeInformation = (id: string) => {
    updateCurrentForm((current) => ({
      ...current,
      information: current.information.filter((item) => item.id !== id),
    }));
  };

  const removeStock = (id: string) => {
    updateCurrentForm((current) => {
      const removedSymbol = current.stocks.find((stock) => stock.id === id)?.symbol;
      return {
        ...current,
        stocks: current.stocks.filter((item) => item.id !== id),
        reasons: current.reasons.filter((item) => item.symbol !== removedSymbol),
        signals: current.signals.filter((item) => item.symbol !== removedSymbol),
      };
    });
  };

  const removeReason = (id: string) => {
    updateCurrentForm((current) => ({
      ...current,
      reasons: current.reasons.filter((item) => item.id !== id),
    }));
  };

  const removeSignal = (id: string) => {
    updateCurrentForm((current) => ({
      ...current,
      signals: current.signals.filter((item) => item.id !== id),
    }));
  };

  const clearSection = (section: "information" | "stocks" | "reasons" | "signals") => {
    if (!window.confirm(`Xoa toan bo data block ${section}? Block nay se an sau khi luu.`)) return;

    updateCurrentForm((current) => ({
      ...current,
      [section]: [],
      ...(section === "stocks" ? { reasons: [], signals: [] } : {}),
    }));
  };

  const addInformation = () => {
    updateCurrentForm((current) => ({
      ...current,
      information: [
        ...current.information,
        { id: createId("info"), month: "", vnindexReturn: 0, recommendReturn: 0 },
      ],
    }));
  };

  const addStock = () => {
    updateCurrentForm((current) => ({
      ...current,
      stocks: [
        ...current.stocks,
        {
          id: createId("stock"),
          symbol: "",
          sector: "",
          purchaseDate: current.publishedAt,
          costBasis: 0,
          marketPrice: 0,
          quantity: 0,
          weight: "",
          stopLoss: "",
          targetPrice: "",
          beta: "",
          mdd: "",
          note: "",
        },
      ],
    }));
  };

  const addReason = () => {
    updateCurrentForm((current) => ({
      ...current,
      reasons: [
        ...current.reasons,
        {
          id: createId("reason"),
          type: "buy",
          symbol: current.stocks[0]?.symbol ?? "",
          content: "",
        },
      ],
    }));
  };

  const addSignal = () => {
    updateCurrentForm((current) => ({
      ...current,
      signals: [
        ...current.signals,
        {
          id: createId("signal"),
          symbol: current.stocks[0]?.symbol ?? "",
          signalType: "BUY",
          description: "",
          targetPrice: "",
          stopLoss: "",
        },
      ],
    }));
  };

  const handleSavePortfolio = async () => {
    if (isSaving) return;

    try {
      if (!form.publishedAt) {
        toast.error("Vui long nhap ngay cong bo danh muc");
        return;
      }

      if (!form.planId) {
        toast.error("Khong tim thay planId cho goi nay. Vui long tai lai trang.");
        return;
      }

      setIsSaving(true);
      const payload = buildPortfolioPayload(form);

      if (form.portfolioId) {
        await updatePortfolio(form.portfolioId, payload);
      } else {
        await createPortfolio(payload);
      }

      await loadPortfolios();
      toast.success(`Da luu danh muc ${TIER_LABELS[form.tier]}`);
    } catch (error) {
      let message = "Co loi xay ra khi luu danh muc";

      if (error instanceof Error) {
        message = error.message;
      }

      if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string | string[] } };
        };
        const backendMessage = apiError.response?.data?.message;
        if (Array.isArray(backendMessage)) {
          message = backendMessage.join(", ");
        } else if (backendMessage) {
          message = backendMessage;
        }
      }

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePortfolio = async () => {
    if (isDeleting || !form.portfolioId) return;

    if (
      !window.confirm(
        `Xoa toan bo danh muc ${TIER_LABELS[form.tier]} (portfolio #${form.portfolioId})? Hanh dong nay khong the hoan tac.`,
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await deletePortfolio(form.portfolioId);
      await loadPortfolios();
      toast.success(`Da xoa danh muc ${TIER_LABELS[form.tier]}`);
    } catch (error) {
      let message = "Co loi xay ra khi xoa danh muc";

      if (error instanceof Error) {
        message = error.message;
      }

      if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string | string[] } };
        };
        const backendMessage = apiError.response?.data?.message;
        if (Array.isArray(backendMessage)) {
          message = backendMessage.join(", ");
        } else if (backendMessage) {
          message = backendMessage;
        }
      }

      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#c084fc]" />
          <p className="text-sm font-medium uppercase tracking-widest text-[#888]">
            Dang tai danh muc tu server...
          </p>
        </div>
      </div>
    );
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="show" className="space-y-8 pb-12">
      <AdminPageHeader
        title="Quan tri danh muc dau tu"
        description="Xoa data cua block nao thi block do se an tren trang portfolio sau khi luu."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={loadPortfolios}
            className="h-9 rounded-none border-[#222] bg-[#111] text-[11px] font-bold uppercase tracking-widest text-white shadow-[2px_2px_0_#222] transition-colors hover:border-[#c084fc] hover:bg-[#c084fc]/10 hover:text-[#c084fc] hover:shadow-[2px_2px_0_#c084fc] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Tai lai
          </Button>
        }
      />

      <PortfolioHeader
        activeTier={activeTier}
        handleTierChange={setActiveTier}
        formsByTier={formsByTier}
        form={form}
        updateCurrentForm={updateCurrentForm}
        totalMarketValue={totalMarketValue}
      />

      <PerformanceSection
        information={form.information}
        addInformation={addInformation}
        updateInfo={updateInfo}
        removeInformation={removeInformation}
        clearInformation={() => clearSection("information")}
        activeTier={activeTier}
        handleCopySectionFromTier={(tier) => handleCopySectionFromTier(tier, "information")}
      />

      <StockTableSection
        stocks={form.stocks}
        addStock={addStock}
        updateStock={updateStock}
        removeStock={removeStock}
        clearStocks={() => clearSection("stocks")}
        activeTier={activeTier}
        handleCopySectionFromTier={(tier) => handleCopySectionFromTier(tier, "stocks")}
      />

      <ReasonSection
        reasons={form.reasons}
        addReason={addReason}
        updateReason={updateReason}
        removeReason={removeReason}
        clearReasons={() => clearSection("reasons")}
        activeTier={activeTier}
        handleCopySectionFromTier={(tier) => handleCopySectionFromTier(tier, "reasons")}
      />

      <SignalSection
        signals={form.signals}
        addSignal={addSignal}
        updateSignal={updateSignal}
        removeSignal={removeSignal}
        clearSignals={() => clearSection("signals")}
        activeTier={activeTier}
        handleCopySectionFromTier={(tier) => handleCopySectionFromTier(tier, "signals")}
      />

      <motion.div variants={itemVariants}>
        <Card className="rounded-none border border-[#222] bg-[#000000] p-0 shadow-[4px_4px_0_#222]">
          <div className="border-b border-[#222] p-5">
            <h2 className="text-[14px] font-bold uppercase tracking-widest text-white">Payload preview</h2>
            <p className="mt-1 text-[12px] font-medium text-[#888]">
              Preview nay la data se luu. Mang rong se xoa data block tuong ung.
            </p>
          </div>
          <div className="p-5">
            <pre className="max-h-[360px] overflow-auto border border-[#333] bg-[#111] p-4 font-mono text-[12px] text-[#c084fc]">
              {JSON.stringify(
                form.planId ? buildPortfolioPayload(form) : { error: "planId chua co - can tai lai data" },
                null,
                2,
              )}
            </pre>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end gap-3 pt-4">
        {form.portfolioId && (
          <Button
            variant="outline"
            onClick={handleDeletePortfolio}
            disabled={isDeleting || isSaving}
            className="h-10 rounded-none border-red-900 bg-[#111] text-[12px] font-black uppercase tracking-widest text-red-400 shadow-[4px_4px_0_#450a0a] transition-all hover:bg-red-950/40 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Dang xoa...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Xoa danh muc nay
              </>
            )}
          </Button>
        )}
        <Button
          onClick={handleSavePortfolio}
          className="h-10 min-w-44 rounded-none bg-[#c084fc] text-[12px] font-black uppercase tracking-widest text-black shadow-[4px_4px_0_#a855f7] transition-all hover:bg-[#a855f7] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          disabled={isSaving || isDeleting}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Dang luu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {form.portfolioId ? "Cap nhat danh muc" : "Tao danh muc moi"}
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
