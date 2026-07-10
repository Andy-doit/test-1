import { describe, expect, it } from "vitest";
import {
  buildPortfolioPayload,
  createEmptyForm,
  mapPortfolioToForm,
} from "@/app/admin/portfolio/_lib/portfolioHelpers";
import { PORTFOLIO_TIERS } from "@/lib/constants/portfolio";

describe("portfolioHelpers", () => {
  it("creates an empty form without visibility checkbox state", () => {
    const form = createEmptyForm(PORTFOLIO_TIERS.GOLD, 2);

    expect(form.tier).toBe(PORTFOLIO_TIERS.GOLD);
    expect(form.planId).toBe(2);
    expect(form.portfolioId).toBeNull();
    expect(form.stocks).toEqual([]);
    expect(form.information).toEqual([]);
    expect(form.reasons).toEqual([]);
    expect(form.signals).toEqual([]);
    expect(Object.keys(form)).toEqual([
      "tier",
      "portfolioId",
      "planId",
      "publishedAt",
      "information",
      "stocks",
      "reasons",
      "signals",
    ]);
  });

  it("maps portfolio data to editable form", () => {
    const portfolio = {
      id: 10,
      planId: 3,
      publishedAt: "2024-06-01T00:00:00.000Z",
      stocks: [
        {
          id: 1,
          symbol: "VNM",
          sector: "FMCG",
          purchaseDate: "2024-01-01T00:00:00.000Z",
          costBasis: 70,
          marketPrice: 85,
          quantity: 100,
          note: '{"text":"note","beta":1.2,"mdd":-0.1}',
        },
      ],
      information: [{ id: 1, month: "2024-01", vnindexReturn: 5, recommendReturn: 8 }],
      reasons: [{ id: 1, type: "buy", symbol: "VNM", content: "Strong support" }],
      signals: [
        {
          id: 1,
          symbol: "VNM",
          signalType: "BUY",
          description: "Buy signal",
          targetPrice: 100,
          stopLoss: 65,
        },
      ],
    } as never;

    const form = mapPortfolioToForm(portfolio, PORTFOLIO_TIERS.GOLD);

    expect(form.portfolioId).toBe(10);
    expect(form.planId).toBe(3);
    expect(form.publishedAt).toBe("2024-06-01");
    expect(form.stocks[0].symbol).toBe("VNM");
    expect(form.stocks[0].beta).toBe(1.2);
    expect(form.stocks[0].mdd).toBe(-0.1);
    expect(form.information).toHaveLength(1);
    expect(form.reasons).toHaveLength(1);
    expect(form.signals).toHaveLength(1);
  });

  it("builds payloads with empty arrays so saving clears deleted blocks", () => {
    const form = createEmptyForm(PORTFOLIO_TIERS.GOLD, 2);
    form.publishedAt = "2024-06-15";
    form.stocks = [
      {
        id: "new-1",
        symbol: "vnm",
        sector: "FMCG",
        purchaseDate: "2024-01-15",
        costBasis: 70,
        marketPrice: 85,
        quantity: 100,
        beta: 1.2,
        mdd: -0.1,
        note: "My note",
      },
    ];

    const payload = buildPortfolioPayload(form);

    expect(payload.planId).toBe(2);
    expect(payload.stocks).toHaveLength(1);
    expect(payload.stocks[0].symbol).toBe("VNM");
    expect(payload.information).toEqual([]);
    expect(payload.reasons).toEqual([]);
    expect(payload.signals).toEqual([]);
  });
});
