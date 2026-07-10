import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StockTable } from '@/components/admin/portfolio/stockTable';
import type { DerivedStock } from '@/types/portfolio';

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

// Build a valid DerivedStock — quantity is NOT part of the DerivedStock type
const makeStock = (overrides: Partial<DerivedStock> = {}): DerivedStock => ({
  id: '1',
  ticker: 'VNM',
  sector: 'FMCG',
  buyDate: '2024-01-15',
  costPrice: 70,
  marketPrice: 85,
  weight: 0.3,
  targetPrice: 100,
  beta: 0.8,
  mdd: -0.1,
  returnRate: 0.21,
  stopLoss: 65,
  ...overrides,
});

describe('StockTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty state when stocks array is empty', () => {
    render(<StockTable stocks={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText(/Chưa có cổ phiếu nào/)).toBeInTheDocument();
  });

  it('should render stock rows with correct ticker', () => {
    const stocks = [
      makeStock({ id: '1', ticker: 'VNM', returnRate: 0.15 }),
      makeStock({ id: '2', ticker: 'FPT', returnRate: -0.05 }),
    ];
    render(<StockTable stocks={stocks} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('VNM')).toBeInTheDocument();
    expect(screen.getByText('FPT')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const stocks = [makeStock({ id: '1', ticker: 'VNM' })];
    render(<StockTable stocks={stocks} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should render multiple stocks with different tickers', () => {
    const stocks = [
      makeStock({ id: '1', ticker: 'VNM', weight: 0.3 }),
      makeStock({ id: '2', ticker: 'FPT', weight: 0.7 }),
    ];
    render(<StockTable stocks={stocks} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('VNM')).toBeInTheDocument();
    expect(screen.getByText('FPT')).toBeInTheDocument();
  });
});
