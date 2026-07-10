import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SupportReasons } from '@/components/portfolio/supportReasons';

describe('SupportReasons', () => {
  it('should render rows with buy type and correct badge', () => {
    const rows = [
      {
        ticker: 'VNM',
        sector: 'FMCG',
        type: 'buy' as const,
        reason: 'MA200 support confirmed',
        stop: 70,
        goal: 100,
        beta: 0.8,
        mdd: -0.15,
      },
    ];
    render(<SupportReasons rows={rows} />);

    expect(screen.getByText('VNM')).toBeInTheDocument();
    expect(screen.getByText(/Mua/)).toBeInTheDocument();
  });

  it('should render rows with sell type', () => {
    const rows = [
      {
        ticker: 'VNM',
        sector: 'FMCG',
        type: 'sell' as const,
        reason: 'Overvalued',
        stop: 70,
        goal: 100,
        beta: 0.8,
        mdd: -0.15,
      },
    ];
    render(<SupportReasons rows={rows} />);

    expect(screen.getByText('VNM')).toBeInTheDocument();
    expect(screen.getByText(/Bán/)).toBeInTheDocument();
  });

  it('should render with multiple rows', () => {
    const rows = [
      { ticker: 'VNM', sector: 'FMCG', type: 'buy' as const, reason: 'R1', stop: 70, goal: 100, beta: 0.8, mdd: -0.15 },
      { ticker: 'FPT', sector: 'Tech', type: 'sell' as const, reason: 'R2', stop: 60, goal: 90, beta: 1.2, mdd: -0.2 },
    ];
    render(<SupportReasons rows={rows} />);

    expect(screen.getByText('VNM')).toBeInTheDocument();
    expect(screen.getByText('FPT')).toBeInTheDocument();
  });

  it('should use reason text when provided', () => {
    const rows = [
      { ticker: 'VNM', sector: 'FMCG', type: 'buy' as const, reason: 'Custom reason text', stop: 70, goal: 100, beta: 0.8, mdd: -0.15 },
    ];
    render(<SupportReasons rows={rows} />);

    expect(screen.getByText('Custom reason text')).toBeInTheDocument();
  });
});
