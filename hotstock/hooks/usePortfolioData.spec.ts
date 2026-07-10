import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePortfolioData } from './usePortfolioData';
import type { PortfolioItem } from '@/lib/services/portfolioService';

// Mock the portfolioCalculations module to simplify assertions
vi.mock('@/lib/utils/portfolioCalculations', () => ({
  calculateTargetPrice: vi.fn((cost) => cost * 1.15),
  calculateStopLoss: vi.fn((cost) => cost * 0.95),
}));

describe('usePortfolioData', () => {
  it('should return empty data structures when portfolio is null or undefined', () => {
    const { result } = renderHook(() => usePortfolioData(null));

    expect(result.current.performanceData).toEqual({
      categories: [],
      reco: [],
      index: [],
    });
    expect(result.current.weightData).toEqual([]);
    expect(result.current.stopLossItems).toEqual([]);
    expect(result.current.tableRows).toEqual([]);
    expect(result.current.supportReasonsData).toEqual([]);
    expect(result.current.signalsData).toEqual([]);
  });

  it('should calculate performanceData correctly and sort by month', () => {
    const portfolio = {
      information: [
        { month: '12', recommendReturn: 5, vnindexReturn: 2 },
        { month: '10', recommendReturn: 3, vnindexReturn: 1 },
        { month: 'T11', recommendReturn: 4, vnindexReturn: -1 },
      ],
    } as unknown as PortfolioItem;

    const { result } = renderHook(() => usePortfolioData(portfolio));

    // Sort order: 10, 11, 12
    expect(result.current.performanceData).toEqual({
      categories: ['T10', 'T11', 'T12'],
      reco: [3, 4, 5],
      index: [1, -1, 2],
    });
  });

  it('should calculate weightData correctly based on total value', () => {
    const portfolio = {
      stocks: [
        { symbol: 'AAA', quantity: 100, marketPrice: 10 }, // Value: 1000
        { symbol: 'BBB', quantity: 200, marketPrice: 15 }, // Value: 3000 -> Total: 4000
      ],
    } as unknown as PortfolioItem;

    const { result } = renderHook(() => usePortfolioData(portfolio));

    expect(result.current.weightData).toEqual([
      { name: 'AAA', value: 25 },
      { name: 'BBB', value: 75 },
    ]);
  });

  it('should calculate tableRows and format purchase date', () => {
    const portfolio = {
      stocks: [
        {
          id: '1',
          symbol: 'AAA',
          sector: 'Tech',
          purchaseDate: '2023-05-12T00:00:00.000Z',
          costBasis: 100,
          marketPrice: 110,
          quantity: 10, // weight = 1100 / 1100 = 100%
          note: '{"beta":1.2,"mdd":0.1}',
        },
      ],
    } as unknown as PortfolioItem;

    const { result } = renderHook(() => usePortfolioData(portfolio));

    const rows = result.current.tableRows;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(expect.objectContaining({
      id: '1',
      ticker: 'AAA',
      sector: 'Tech',
      purchaseDate: '12/05/2023',
      cost: 100,
      marketPrice: 110,
      weight: undefined,
      pnl: 10, // (110 - 100) / 100 * 100
      stop: undefined,
      goal: undefined,
      beta: 1.2,
      mdd: 0.1,
    }));
  });

  it('should generate supportReasonsData with mapped prices from stocks', () => {
    const portfolio = {
      stocks: [
        { symbol: 'AAA', costBasis: 100, sector: 'Tech' },
      ],
      reasons: [
        { symbol: 'AAA', type: 'buy', content: 'Good financials' },
        { symbol: 'BBB', type: 'sell', content: 'Bad news' }, // No stock match
      ],
    } as unknown as PortfolioItem;

    const { result } = renderHook(() => usePortfolioData(portfolio));

    const reasons = result.current.supportReasonsData;
    expect(reasons).toHaveLength(2);
    
    expect(reasons[0]).toEqual(expect.objectContaining({
      ticker: 'AAA',
      sector: 'Tech',
      type: 'buy',
      reason: 'Good financials',
      stop: 95, // matched from stock
      goal: 115,
      beta: 0,
      mdd: 0,
    }));

    expect(reasons[1]).toEqual(expect.objectContaining({
      ticker: 'BBB',
      sector: '',
      type: 'sell',
      reason: 'Bad news',
      stop: 0, // no stock match
      goal: 0,
    }));
  });

  it('should generate signalsData formatting buy/sell messages', () => {
    const portfolio = {
      stocks: [
        { symbol: 'AAA', sector: 'Tech' },
      ],
      signals: [
        { symbol: 'AAA', signalType: 'BUY', description: 'Breakout' },
        { symbol: 'BBB', signalType: 'SELL', description: 'Downtrend' },
      ],
    } as unknown as PortfolioItem;

    const { result } = renderHook(() => usePortfolioData(portfolio));

    const signals = result.current.signalsData;
    expect(signals).toHaveLength(2);

    expect(signals[0]).toEqual({
      ticker: 'AAA',
      sector: 'Tech',
      buy: 'Breakout',
      sell: '',
    });

    expect(signals[1]).toEqual({
      ticker: 'BBB',
      sector: '',
      buy: '',
      sell: 'Downtrend',
    });
  });
});
