import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockRedis } from '../../common/test/mock.utils';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';

const createPrismaMock = () => {
  const mock: any = {
    article: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
    articlePlan: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  mock.$transaction.mockImplementation((cb: any) => {
    if (typeof cb === 'function') {
      return cb(mock);
    }
    // If it's an array of promises
    if (Array.isArray(cb)) {
      return Promise.all(cb);
    }
    return Promise.resolve();
  });

  return mock;
};

describe('ArticlesService', () => {
  let service: ArticlesService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let redis: ReturnType<typeof createMockRedis>;

  const mockArticle = (overrides = {}) => ({
    id: 1,
    title: 'Test Article',
    slug: 'test-article',
    description: 'A test article',
    coverUrl: null,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: 1, slug: 'news', name: 'News' },
    tags: [],
    author: { id: 1, username: 'testuser' },
    plans: [{ plan: { id: 1, level: 0 } }],
    ...overrides,
  });

  beforeEach(async () => {
    prisma = createPrismaMock();
    const mockRedis = createMockRedis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: PrismaService, useValue: prisma },
        { provide: 'REDIS_CLIENT', useValue: mockRedis },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    redis = module.get('REDIS_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return cached paginated response on cache hit', async () => {
      const cached = { data: [mockArticle()], hasNextPage: false, nextCursor: null };
      (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(cached));

      const result = await service.findAll({ limit: 10 });
      expect(redis.get).toHaveBeenCalled();
      expect(result.data).toHaveLength(1);
    });

    it('should return empty list if category does not exist', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      prisma.category.findUnique.mockResolvedValueOnce(null);

      const result = await service.findAll({ category: 'nonexistent' });
      expect(result.data).toHaveLength(0);
    });

    it('should fall through to DB and return paginated data', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      prisma.article.findMany.mockResolvedValueOnce([mockArticle({ id: 1 }), mockArticle({ id: 2 })]);

      const result = await service.findAll({ limit: 1 });
      
      // Since take is limit + 1 = 2, and returned length is 2, hasNextPage = true
      expect(result.hasNextPage).toBe(true);
      expect(result.data).toHaveLength(1); // sliced
      expect(prisma.article.findMany).toHaveBeenCalled();
    });
  });

  describe('findAllAdmin', () => {
    it('should return paginated data without checking cache', async () => {
      prisma.article.findMany.mockResolvedValueOnce([mockArticle({ id: 1 })]);

      const result = await service.findAllAdmin({ limit: 10 });
      
      expect(result.hasNextPage).toBe(false);
      expect(result.data).toHaveLength(1);
      expect(prisma.article.findMany).toHaveBeenCalled();
      expect(redis.get).not.toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('should return cached article if available', async () => {
      const cached = mockArticle();
      (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(cached));

      const result = await service.findBySlug('test', 1);
      expect(result.slug).toBe('test-article');
    });

    it('should throw NotFoundException if article not found in DB', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      prisma.article.findFirst.mockResolvedValueOnce(null);

      await expect(service.findBySlug('nonexistent', 0)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user plan level is lower than article plan level', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      prisma.article.findFirst.mockResolvedValueOnce(mockArticle({
        plans: [{ plan: { level: 3 } }]
      }));

      await expect(service.findBySlug('premium', 1)).rejects.toThrow(ForbiddenException);
    });

    it('should return article if user has sufficient plan level', async () => {
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      prisma.article.findFirst.mockResolvedValueOnce(mockArticle({
        plans: [{ plan: { level: 1 } }]
      }));

      const result = await service.findBySlug('titan', 2);
      expect(result).toBeDefined();
      expect(redis.set).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const createDto = {
      title: 'New Article',
      description: 'A test article',
      slug: 'new-article',
      contentBlocks: [],
      categoryId: 1,
      planIds: [1],
    };

    it('should throw ConflictException if slug already exists', async () => {
      prisma.article.findUnique.mockResolvedValueOnce({ id: 1 } as any);

      await expect(service.create(createDto, 1)).rejects.toThrow(ConflictException);
      expect(prisma.article.findUnique).toHaveBeenCalledWith({ where: { slug: createDto.slug } });
    });

    it('should successfully create an article and clear cache', async () => {
      prisma.article.findUnique.mockResolvedValueOnce(null);
      prisma.article.create.mockResolvedValueOnce(mockArticle());

      const result = await service.create(createDto, 1);

      expect(prisma.article.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(redis.scan).toHaveBeenCalled(); // Invalidates cache
    });
  });

  describe('update', () => {
    const updateDto = { title: 'Updated Title', slug: 'updated-slug', planIds: [2] };

    it('should throw NotFoundException if article not found', async () => {
      prisma.article.findUnique.mockResolvedValueOnce(null);
      await expect(service.update('old-slug', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new slug is taken', async () => {
      prisma.article.findUnique.mockResolvedValueOnce(mockArticle());
      prisma.article.findUnique.mockResolvedValueOnce({ id: 2 }); // new slug lookup

      await expect(service.update('old-slug', updateDto)).rejects.toThrow(ConflictException);
    });

    it('should update article inside transaction and clear cache', async () => {
      prisma.article.findUnique.mockResolvedValueOnce(mockArticle()); // existing
      prisma.article.findUnique.mockResolvedValueOnce(null); // new slug check
      prisma.article.update.mockResolvedValueOnce(mockArticle({ title: 'Updated' }));

      const result = await service.update('old-slug', updateDto);

      expect(result).toBeDefined();
      expect(prisma.articlePlan.deleteMany).toHaveBeenCalled();
      expect(prisma.article.update).toHaveBeenCalled();
      expect(redis.scan).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if article not found', async () => {
      prisma.article.findUnique.mockResolvedValueOnce(null);
      await expect(service.remove('slug')).rejects.toThrow(NotFoundException);
    });

    it('should remove article in transaction and clear cache', async () => {
      prisma.article.findUnique.mockResolvedValueOnce(mockArticle({ id: 1 }));
      prisma.articlePlan.deleteMany.mockResolvedValueOnce({ count: 1 });
      prisma.article.delete.mockResolvedValueOnce(mockArticle());

      await service.remove('slug');

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(redis.scan).toHaveBeenCalled();
    });
  });
});