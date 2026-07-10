import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FastifyRequest } from 'fastify';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  const mockArticlesService = {
    findAll: jest.fn(),
    findAllAdmin: jest.fn(),
    findBySlugAdmin: jest.fn(),
    findBySlug: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockGuard = { canActivate: () => true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        { provide: ArticlesService, useValue: mockArticlesService },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue(mockGuard)
      .overrideGuard(OptionalJwtAuthGuard).useValue(mockGuard)
      .overrideGuard(RolesGuard).useValue(mockGuard)
      .compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call articlesService.findAll', async () => {
      const query = { limit: 10 };
      const expectedResult = { data: [], total: 0 };
      mockArticlesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllAdmin', () => {
    it('should call articlesService.findAllAdmin', async () => {
      const query = { limit: 10 };
      const expectedResult = { data: [], total: 0 };
      mockArticlesService.findAllAdmin.mockResolvedValue(expectedResult);

      const result = await controller.findAllAdmin(query);

      expect(service.findAllAdmin).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findBySlugAdmin', () => {
    it('should call articlesService.findBySlugAdmin', async () => {
      const expectedResult = { id: 1, title: 'Draft' };
      mockArticlesService.findBySlugAdmin.mockResolvedValue(expectedResult);

      const result = await controller.findBySlugAdmin('draft-slug');

      expect(service.findBySlugAdmin).toHaveBeenCalledWith('draft-slug');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findBySlug', () => {
    it('should call articlesService.findBySlug with user planLevel if present', async () => {
      const req = { user: { planLevel: 2 } } as unknown as FastifyRequest;
      const expectedResult = { id: 1, title: 'Premium Article' };
      mockArticlesService.findBySlug.mockResolvedValue(expectedResult);

      const result = await controller.findBySlug('premium-slug', req);

      expect(service.findBySlug).toHaveBeenCalledWith('premium-slug', 2, false);
      expect(result).toEqual(expectedResult);
    });

    it('should call articlesService.findBySlug with planLevel 0 if no user present', async () => {
      const req = {} as unknown as FastifyRequest;
      const expectedResult = { id: 1, title: 'Free Article' };
      mockArticlesService.findBySlug.mockResolvedValue(expectedResult);

      const result = await controller.findBySlug('free-slug', req);

      expect(service.findBySlug).toHaveBeenCalledWith('free-slug', 0, false);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should throw an error if request.user is not set', async () => {
      const req = {} as unknown as FastifyRequest;
      const dto = { title: 'Test Article', content: 'Test Content', categoryId: 1 } as any;

      await expect(controller.create(dto, req)).rejects.toThrow('Authentication required');
    });

    it('should call articlesService.create if request.user is set', async () => {
      const req = { user: { sub: 10 } } as unknown as FastifyRequest;
      const dto = { title: 'Test Article', content: 'Test Content', categoryId: 1 } as any;
      const expectedResult = { id: 1, ...dto, authorId: 10 };

      mockArticlesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto, req);

      expect(service.create).toHaveBeenCalledWith(dto, 10);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call articlesService.update', async () => {
      const dto = { title: 'Updated Title' };
      const expectedResult = { id: 1, title: 'Updated Title' };
      mockArticlesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('some-slug', dto);

      expect(service.update).toHaveBeenCalledWith('some-slug', dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return success message', async () => {
      mockArticlesService.remove.mockResolvedValue(undefined);
      const req = { user: { sub: 1, role: 'admin' } } as any;

      const result = await controller.remove('some-slug', req);

      expect(service.remove).toHaveBeenCalledWith('some-slug', 1, 'admin');
      expect(result).toEqual({ message: 'Bài viết đã được xóa' });
    });
  });
});