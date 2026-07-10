import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleAccessOverlay } from './articleAccessOverlay';
import * as planAccess from '@/lib/utils/planAccess';
import { useRouter } from 'next/navigation';
import type { Plan } from '@/types/iAccount';
import type { ArticlePlan } from '@/types/iReport';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/lib/utils/planAccess', () => ({
  canUserAccessArticle: vi.fn(),
  getArticleMaxPlanLevel: vi.fn(),
}));

describe('ArticleAccessOverlay', () => {
  const mockBack = vi.fn();
  const plan = (overrides: Partial<Plan>): Plan => ({
    id: 1,
    name: 'Premium',
    slug: 'premium',
    level: 1,
    ...overrides,
  });
  const articlePlan = (overrides: Partial<ArticlePlan>): ArticlePlan => ({
    id: 1,
    documentId: 'plan-doc',
    name: 'Premium',
    level: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    publishedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ back: mockBack } as unknown as ReturnType<typeof useRouter>);
  });

  it('should not render if article max plan level is 0', () => {
    vi.mocked(planAccess.getArticleMaxPlanLevel).mockReturnValue(0);

    const { container } = render(
      <ArticleAccessOverlay
        userPlan={null}
        articlePlans={[]}
        isAuthenticated={false}
        articleTitle="Free Article"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should not render if user has access', () => {
    vi.mocked(planAccess.getArticleMaxPlanLevel).mockReturnValue(1);
    vi.mocked(planAccess.canUserAccessArticle).mockReturnValue(true);

    const { container } = render(
      <ArticleAccessOverlay
        userPlan={plan({ name: 'Premium', slug: 'premium', level: 1 })}
        articlePlans={[articlePlan({ name: 'Premium', level: 1 })]}
        isAuthenticated={true}
        articleTitle="Premium Article"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render upgrade message if authenticated but no access', () => {
    vi.mocked(planAccess.getArticleMaxPlanLevel).mockReturnValue(2);
    vi.mocked(planAccess.canUserAccessArticle).mockReturnValue(false);

    render(
      <ArticleAccessOverlay
        userPlan={plan({ name: 'Free', slug: 'free', level: 0 })}
        articlePlans={[articlePlan({ id: 2, name: 'Titan', level: 2 })]}
        isAuthenticated={true}
        articleTitle="Titan Article"
      />
    );

    expect(screen.getByText('Nâng cấp gói để xem nội dung này')).toBeInTheDocument();
    expect(screen.getByText(/yêu cầu gói Titan trở lên/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Nâng cấp ngay/i })).toHaveAttribute('href', '/goi-hoi-vien');
  });

  it('should render login message if not authenticated', () => {
    vi.mocked(planAccess.getArticleMaxPlanLevel).mockReturnValue(1);
    vi.mocked(planAccess.canUserAccessArticle).mockReturnValue(false);

    render(
      <ArticleAccessOverlay
        userPlan={null}
        articlePlans={[articlePlan({ name: 'Premium', level: 1 })]}
        isAuthenticated={false}
        articleTitle="Premium Article"
      />
    );

    expect(screen.getByText('Đăng nhập để xem nội dung')).toBeInTheDocument();
    expect(screen.getByText('Vui lòng đăng nhập để tiếp tục xem nội dung')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Đăng nhập/i })).toHaveAttribute('href', '/login');
  });

  it('should call router.back when go back button is clicked', () => {
    vi.mocked(planAccess.getArticleMaxPlanLevel).mockReturnValue(1);
    vi.mocked(planAccess.canUserAccessArticle).mockReturnValue(false);

    render(
      <ArticleAccessOverlay
        userPlan={null}
        articlePlans={[articlePlan({ name: 'Premium', level: 1 })]}
        isAuthenticated={false}
        articleTitle="Premium Article"
      />
    );

    const backButton = screen.getByRole('button', { name: /Quay lại/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalled();
  });
});
