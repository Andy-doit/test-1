import { Test, TestingModule } from '@nestjs/testing';
import { PortfoliosService } from './portfolios.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockRedis } from '../../common/test/mock.utils';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

/** Plain jest mocks — avoids type conflicts with jest-mock-extended's DeepMockProxy. */
const createPrismaMock = () => {
  const mock: any = {
    portfolio: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    plan: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    portfolioStock: {
      deleteMany: jest.fn(),
    },
    portfolioInformation: {
      deleteMany: jest.fn(),
    },
    portfolioReason: {
      deleteMany: jest.fn(),
    },
    portfolioSignal: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  mock.$transaction.mockImplementation((cb: any) => cb(mock));
  return mock;
};

describe('PortfoliosService', () => {
  let service: PortfoliosService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let redis: ReturnType<typeof createMockRedis>;

  const mockPortfolio = (overrides = {}) => ({
    id: 1,
    planId: 1,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    stocks: [],
    information: [],
    reasons: [],
    signals: [],
    plan: { id: 1, slug: 'free', name: 'Free', level: 0 },
    ...overrides,
  });

  beforeEach(async () => {
    prisma = createPrismaMock();
    const mockRedis = createMockRedis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfoliosService,
        { provide: PrismaService, useValue: prisma },
        { provide: 'REDIS_CLIENT', useValue: mockRedis },
      ],
    }).compile();

    service = module.get<PortfoliosService>(PortfoliosService);
    redis = module.get('REDIS_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findLatestByPlan', () => {
    it('should return cached portfolio on cache hit', async () => {
      const cached = mockPortfolio();
      (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(cached));

      const result = await service.findLatestByPlan('free', 0);

      expect(redis.get).toHaveBeenCalledWith('portfolio:free:level:0');
      expect(result.id).toBe(cached.id);
      expect(prisma.plan.findUnique).not.toHaveBeenCalled();
    });

    it('should fall through to DB on corrupted cache', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce('not valid json {{{');
      prisma.plan.findUnique.mockResolvedValueOnce({ id: 1, level: 0 });
      prisma.portfolio.findFirst.mockResolvedValueOnce(mockPortfolio());

      const result = await service.findLatestByPlan('free', 0);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when plan not found', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      prisma.plan.findUnique.mockResolvedValueOnce(null);

      await expect(service.findLatestByPlan('nonexistent', 0)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user plan level is insufficient', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      prisma.plan.findUnique.mockResolvedValueOnce({ id: 1, level: 3 });

      await expect(service.findLatestByPlan('premium', 0)).rejects.toThrow(ForbiddenException);
    });

    it('should return portfolio when user has sufficient plan level', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      prisma.plan.findUnique.mockResolvedValueOnce({ id: 1, level: 1 });
      prisma.portfolio.findFirst.mockResolvedValueOnce(mockPortfolio({ planId: 1 }));

      const result = await service.findLatestByPlan('titan', 1);

      expect(result.planId).toBe(1);
      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all portfolios', async () => {
      const portfolios = [mockPortfolio({ id: 1 }), mockPortfolio({ id: 2 })];
      prisma.portfolio.findMany.mockResolvedValueOnce(portfolios);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(prisma.portfolio.findMany).toHaveBeenCalledWith({
        orderBy: { publishedAt: 'desc' },
        include: { stocks: true, information: true, reasons: true, signals: true, plan: true },
      });
    });
  });

  describe('create', () => {
    const createDto = {
      planId: 1,
      publishedAt: new Date().toISOString(),
      stocks: [{ symbol: 'AAPL', purchaseDate: new Date().toISOString(), costBasis: 150, marketPrice: 160, quantity: 10, note: 'Apple' }],
      information: [{ month: '2023-01', vnindexReturn: 5, recommendReturn: 8 }],
      reasons: [{ type: 'BUY', symbol: 'AAPL', content: 'Good earning' }],
      signals: [{ symbol: 'AAPL', signalType: 'BUY', description: 'Strong buy', targetPrice: 180, stopLoss: 140 }],
    };

    it('should throw NotFoundException if plan does not exist', async () => {
      prisma.plan.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      expect(prisma.plan.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should successfully create a portfolio and invalidate cache', async () => {
      prisma.plan.findUnique.mockResolvedValueOnce({ id: 1 } as any);
      prisma.portfolio.create.mockResolvedValueOnce(mockPortfolio());

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(prisma.portfolio.create).toHaveBeenCalled();
      expect(redis.scan).toHaveBeenCalled(); // Cache invalidation uses scan
    });
  });

  describe('update', () => {
    const updateDto = {
      planId: 2,
      stocks: [],
      information: [],
      reasons: [],
      signals: [],
    };

    it('should throw NotFoundException if portfolio to update does not exist', async () => {
      prisma.portfolio.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should update portfolio nested fields in a transaction and invalidate cache', async () => {
      prisma.portfolio.findUnique.mockResolvedValueOnce(mockPortfolio({ id: 1 }));
      prisma.portfolio.update.mockResolvedValueOnce(mockPortfolio({ id: 1, planId: 2 }));

      const result = await service.update(1, updateDto);

      expect(result).toBeDefined();
      expect(prisma.portfolioStock.deleteMany).toHaveBeenCalled();
      expect(prisma.portfolioInformation.deleteMany).toHaveBeenCalled();
      expect(prisma.portfolioReason.deleteMany).toHaveBeenCalled();
      expect(prisma.portfolio.update).toHaveBeenCalled();
      expect(redis.scan).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when portfolio not found', async () => {
      prisma.portfolio.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should delete portfolio and invalidate cache', async () => {
      prisma.portfolio.findUnique.mockResolvedValueOnce(mockPortfolio({ id: 5 }));
      prisma.portfolio.delete.mockResolvedValueOnce(mockPortfolio({ id: 5 }));

      await service.remove(5);

      expect(prisma.portfolio.delete).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(redis.scan).toHaveBeenCalled();
    });
  });
});