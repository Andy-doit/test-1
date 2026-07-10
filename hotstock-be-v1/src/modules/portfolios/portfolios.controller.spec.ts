import { Test, TestingModule } from '@nestjs/testing';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FastifyRequest } from 'fastify';

describe('PortfoliosController', () => {
  let controller: PortfoliosController;
  let service: PortfoliosService;

  const mockPortfoliosService = {
    findAll: jest.fn(),
    findLatestByPlan: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockGuard = { canActivate: () => true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfoliosController],
      providers: [
        { provide: PortfoliosService, useValue: mockPortfoliosService },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue(mockGuard)
      .overrideGuard(OptionalJwtAuthGuard).useValue(mockGuard)
      .overrideGuard(RolesGuard).useValue(mockGuard)
      .compile();

    controller = module.get<PortfoliosController>(PortfoliosController);
    service = module.get<PortfoliosService>(PortfoliosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all portfolios', async () => {
      const expectedResult = [{ id: 1 }, { id: 2 }];
      mockPortfoliosService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findLatestByPlan', () => {
    it('should return portfolio based on plan and user planLevel', async () => {
      const query = { plan: 'gold' };
      const req = { user: { planLevel: 2 } } as unknown as FastifyRequest;
      const expectedResult = { id: 1, name: 'Gold Portfolio' };

      mockPortfoliosService.findLatestByPlan.mockResolvedValue(expectedResult);

      const result = await controller.findLatestByPlan(query, req);

      expect(service.findLatestByPlan).toHaveBeenCalledWith('gold', 2, false);
      expect(result).toEqual(expectedResult);
    });

    it('should default planLevel to 0 if no user exists', async () => {
      const query = { plan: 'free' };
      const req = {} as unknown as FastifyRequest;
      const expectedResult = { id: 2, name: 'Free Portfolio' };

      mockPortfoliosService.findLatestByPlan.mockResolvedValue(expectedResult);

      const result = await controller.findLatestByPlan(query, req);

      expect(service.findLatestByPlan).toHaveBeenCalledWith('free', 0, false);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should create a portfolio', async () => {
      const createDto: any = { name: 'New Portfolio', planId: 1 };
      const expectedResult = { id: 1, ...createDto };

      mockPortfoliosService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a portfolio', async () => {
      const updateDto: any = { name: 'Updated Portfolio' };
      const expectedResult = { id: 1, ...updateDto };

      mockPortfoliosService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should delete a portfolio', async () => {
      mockPortfoliosService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Danh mục đầu tư đã được xóa' });
    });
  });
});