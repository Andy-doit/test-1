import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockRedis } from '../../common/test/mock.utils';

/** Plain jest mocks — avoids type conflicts with jest-mock-extended's DeepMockProxy. */
const createPrismaMock = () => ({
  article: {
    count: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
  user: {
    count: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  },
  category: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  portfolio: {
    count: jest.fn(),
  },
});

describe('DashboardService', () => {
  let service: DashboardService;
  let redis: ReturnType<typeof createMockRedis>;

  beforeEach(async () => {
    const prismaMock = createPrismaMock();
    const mockRedis = createMockRedis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: 'REDIS_CLIENT', useValue: mockRedis },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    redis = module.get('REDIS_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return cached data on cache hit', async () => {
      const cachedStats = {
        overview: {
          totalArticles: 5,
          publishedArticles: 3,
          draftArticles: 2,
          totalUsers: 10,
          totalCategories: 4,
          totalPortfolios: 2,
        },
        usersByRole: [],
        articlesByCategory: [],
        recentArticles: [],
        recentUsers: [],
      };
      (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(cachedStats));

      const result = await service.getStats();

      expect(redis.get).toHaveBeenCalledWith('dashboard:stats');
      expect(result).toEqual(cachedStats);
    });

    it('should query DB and cache on cache miss', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);

      const prisma = (service as unknown as { prisma: ReturnType<typeof createPrismaMock> }).prisma;
      prisma.article.count.mockResolvedValue(10);
      prisma.user.count.mockResolvedValue(5);
      prisma.category.count.mockResolvedValue(4);
      prisma.portfolio.count.mockResolvedValue(2);
      prisma.user.groupBy.mockResolvedValue([]);
      prisma.article.groupBy.mockResolvedValue([]);
      prisma.category.findMany.mockResolvedValue([{ id: 1, name: 'News' }]);
      prisma.article.findMany.mockResolvedValue([]);
      prisma.user.findMany.mockResolvedValue([]);

      const result = await service.getStats();

      expect(result.overview.totalArticles).toBe(10);
      expect(result.overview.totalUsers).toBe(5);
      expect(redis.set).toHaveBeenCalled();
    });

    it('should fall through to DB on corrupted cache JSON', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce('not valid json {{{');

      const prisma = (service as unknown as { prisma: ReturnType<typeof createPrismaMock> }).prisma;
      prisma.article.count.mockResolvedValue(10);
      prisma.user.count.mockResolvedValue(5);
      prisma.category.count.mockResolvedValue(4);
      prisma.portfolio.count.mockResolvedValue(2);
      prisma.user.groupBy.mockResolvedValue([]);
      prisma.article.groupBy.mockResolvedValue([]);
      prisma.category.findMany.mockResolvedValue([]);
      prisma.article.findMany.mockResolvedValue([]);
      prisma.user.findMany.mockResolvedValue([]);

      const result = await service.getStats();

      expect(result.overview.totalArticles).toBe(10);
    });

    it('should correctly count published vs draft articles', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);

      const prisma = (service as unknown as { prisma: ReturnType<typeof createPrismaMock> }).prisma;
      prisma.article.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(80)
        .mockResolvedValueOnce(20);
      prisma.user.count.mockResolvedValue(5);
      prisma.category.count.mockResolvedValue(4);
      prisma.portfolio.count.mockResolvedValue(2);
      prisma.user.groupBy.mockResolvedValue([]);
      prisma.article.groupBy.mockResolvedValue([]);
      prisma.category.findMany.mockResolvedValue([]);
      prisma.article.findMany.mockResolvedValue([]);
      prisma.user.findMany.mockResolvedValue([]);

      const result = await service.getStats();

      expect(result.overview.totalArticles).toBe(100);
      expect(result.overview.publishedArticles).toBe(80);
      expect(result.overview.draftArticles).toBe(20);
    });
  });
});
