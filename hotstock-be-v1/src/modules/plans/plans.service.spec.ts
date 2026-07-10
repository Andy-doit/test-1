import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockRedis } from '../../common/test/mock.utils';

/** Plain jest mocks. */
const createPrismaMock = () => ({
  plan: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('PlansService', () => {
  let service: PlansService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let redis: ReturnType<typeof createMockRedis>;

  const mockPlan = (overrides = {}) => ({
    id: 1,
    name: 'Free',
    slug: 'free',
    level: 0,
    isActive: true,
    monthlyPrice: 0,
    features: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    prisma = createPrismaMock();
    const mockRedis = createMockRedis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        { provide: PrismaService, useValue: prisma },
        { provide: 'REDIS_CLIENT', useValue: mockRedis },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
    redis = module.get('REDIS_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return cached plans on cache hit', async () => {
      const cachedPlans = [
        mockPlan(),
        mockPlan({ id: 2, name: 'Premium', slug: 'premium', level: 1 }),
      ];
      (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(cachedPlans));

      const result = await service.findAll();

      expect(redis.get).toHaveBeenCalledWith('plans:active:v3');
      expect(result).toHaveLength(2);
      expect(prisma.plan.findMany).not.toHaveBeenCalled();
    });

    it('should query DB and cache on cache miss', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      prisma.plan.findMany.mockResolvedValueOnce([mockPlan()]);

      const result = await service.findAll();

      expect(prisma.plan.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: { fieldVisibilities: true },
        orderBy: { sortOrder: 'asc' },
      });
      expect(redis.set).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('should fall through to DB on corrupted cache JSON', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce('corrupted {{{');
      prisma.plan.findMany.mockResolvedValueOnce([mockPlan()]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
    });
  });

  describe('findBySlug', () => {
    it('should return plan when found', async () => {
      const plan = mockPlan({ slug: 'gold', level: 2 });
      prisma.plan.findUnique.mockResolvedValueOnce(plan);

      const result = await service.findBySlug('gold');

      expect(result.slug).toBe('gold');
    });

    it('should throw NotFoundException when plan not found', async () => {
      prisma.plan.findUnique.mockResolvedValueOnce(null);

      await expect(service.findBySlug('nonexistent')).rejects.toThrow();
    });
  });
});
