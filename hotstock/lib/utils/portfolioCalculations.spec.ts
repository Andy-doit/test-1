import { describe, it, expect } from 'vitest';
import {
  calculateTargetPrice,
  calculateStopLoss,
  calculateStandardDeviation,
  sumProduct,
  calculatePortfolioMetrics,
} from './portfolioCalculations';

describe('portfolioCalculations', () => {
  describe('calculateTargetPrice', () => {
    it('should return 0 when costBasis is <= 0', () => {
      expect(calculateTargetPrice(0)).toBe(0);
      expect(calculateTargetPrice(-5)).toBe(0);
    });

    it('should round to 1 decimal place when basePrice > 50', () => {
      // In JS, 45 * 1.15 = 51.74999999999999 -> rounded to 51.7
      expect(calculateTargetPrice(45)).toBe(51.7);
    });

    it('should round to 2 decimal places when basePrice < 10', () => {
      // basePrice = 8 * 1.15 = 9.2 -> rounded to 9.2
      // basePrice = 7.15 * 1.15 = 8.2225 -> rounded to 8.22
      expect(calculateTargetPrice(8)).toBe(9.2);
      expect(calculateTargetPrice(7.15)).toBe(8.22);
    });

    it('should round to multiple of 0.05 when 10 <= basePrice <= 50', () => {
      // basePrice = 20 * 1.15 = 23 -> 23.00
      // basePrice = 12 * 1.15 = 13.8 -> 13.80
      expect(calculateTargetPrice(20)).toBe(23.0);
      expect(calculateTargetPrice(12)).toBe(13.8);
    });
  });

  describe('calculateStopLoss', () => {
    it('should return 0 when costBasis is <= 0', () => {
      expect(calculateStopLoss(0)).toBe(0);
      expect(calculateStopLoss(-10)).toBe(0);
    });

    it('should round to multiple of 0.01 when basePrice < 10', () => {
      // basePrice = 10 * 0.95 = 9.5 < 10 -> rounded to multiple of 0.01
      expect(calculateStopLoss(10)).toBe(9.5);
    });

    it('should round to multiple of 0.05 when 10 <= basePrice <= 50', () => {
      // basePrice = 40 * 0.95 = 38 -> multiple of 0.05
      expect(calculateStopLoss(40)).toBe(38);
    });

    it('should round to multiple of 0.1 when basePrice > 50', () => {
      // basePrice = 60 * 0.95 = 57 > 50 -> multiple of 0.1
      expect(calculateStopLoss(60)).toBe(57);
    });
  });

  describe('calculateStandardDeviation', () => {
    it('should return 0 for an empty array', () => {
      expect(calculateStandardDeviation([])).toBe(0);
    });

    it('should calculate standard deviation correctly', () => {
      const values = [2, 4, 4, 4, 5, 5, 7, 9];
      // mean = 5
      // variances = [9, 1, 1, 1, 0, 0, 4, 16] -> sum = 32 -> mean variance = 4 -> sqrt = 2
      expect(calculateStandardDeviation(values)).toBe(2);
    });
  });

  describe('sumProduct', () => {
    it('should return 0 when arrays have different lengths or are empty', () => {
      expect(sumProduct([], [])).toBe(0);
      expect(sumProduct([1], [1, 2])).toBe(0);
    });

    it('should calculate sum product correctly', () => {
      expect(sumProduct([1, 2, 3], [4, 5, 6])).toBe(4 + 10 + 18);
    });
  });

  describe('calculatePortfolioMetrics', () => {
    it('should return default metrics when totalWeight is 0 or returns are empty', () => {
      const result = calculatePortfolioMetrics([], []);
      expect(result).toEqual({
        sharpeRatio: 0,
        beta: 0,
        alpha: 0,
        risk: 0,
        maxDrawdown: 0,
        portfolioReturn: 0,
        vnindexReturn: 0,
      });
    });

    it('should calculate metrics using Excel-style data structure', () => {
      const stocks = [
        { Weight: 0.4, Beta: 1.2, MDD: 0.15 },
        { Weight: 0.6, Beta: 0.8, MDD: 0.10 },
      ];
      const info = [
        { RecommendReturn: 10, VNINDEXReturn: 8 },
        { RecommendReturn: 12, VNINDEXReturn: 6 },
      ];

      const result = calculatePortfolioMetrics(stocks, info);
      expect(result.beta).toBe(0.96); // 1.2 * 0.4 + 0.8 * 0.6 = 0.48 + 0.48 = 0.96
      expect(result.maxDrawdown).toBe(0.12); // 0.15 * 0.4 + 0.10 * 0.6 = 0.06 + 0.06 = 0.12
      expect(result.portfolioReturn).toBe(11.2); // (10 * 0.4 + 12 * 0.6) / 1.0 = 4 + 7.2 = 11.2
      expect(result.vnindexReturn).toBe(7); // (8 + 6) / 2 = 7
    });

    it('should calculate metrics using API-style data structure', () => {
      const stocks = [
        { quantity: 100, marketPrice: 10, Beta: 1.1, MDD: 0.2 }, // weight = 1000
        { quantity: 200, marketPrice: 15, Beta: 0.9, MDD: 0.1 }, // weight = 3000 -> total weight = 4000
      ];
      const info = [
        { recommendReturn: 8, vnindexReturn: 5 },
        { recommendReturn: 10, vnindexReturn: 7 },
      ];

      const result = calculatePortfolioMetrics(stocks, info);
      // beta = (1.1 * 1000 + 0.9 * 3000) / 4000 = (1100 + 2700) / 4000 = 0.95
      expect(result.beta).toBe(0.95);
      // maxDrawdown = (0.2 * 1000 + 0.1 * 3000) / 4000 = (200 + 300) / 4000 = 0.125 -> 0.13
      expect(result.maxDrawdown).toBe(0.13);
      // portfolioReturn = (8 * 1000 + 10 * 3000) / 4000 = (8000 + 30000) / 4000 = 9.5
      expect(result.portfolioReturn).toBe(9.5);
    });

    it('should parse beta and mdd from note JSON if they are missing on stock object', () => {
      const stocks = [
        { Weight: 1.0, note: '{"beta":1.5,"mdd":0.25}' },
      ];
      const info = [
        { RecommendReturn: 10, VNINDEXReturn: 8 },
      ];

      const result = calculatePortfolioMetrics(stocks, info);
      expect(result.beta).toBe(1.5);
      expect(result.maxDrawdown).toBe(0.25);
    });
  });
});