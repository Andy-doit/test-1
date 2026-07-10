import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FastifyRequest } from 'fastify';
import { Role } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    deleteUser: jest.fn(),
    findAll: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    findOne: jest.fn(),
    updateRole: jest.fn(),
    assignPlan: jest.fn(),
    blockUser: jest.fn(),
    unblockUser: jest.fn(),
  };

  const mockGuard = { canActivate: () => true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
      .overrideGuard(JwtAuthGuard).useValue(mockGuard)
      .overrideGuard(RolesGuard).useValue(mockGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteUser', () => {
    it('should delete a user and return message', async () => {
      mockUsersService.deleteUser.mockResolvedValue(undefined);

      const result = await controller.deleteUser(1);

      expect(service.deleteUser).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Tài khoản đã bị xóa thành công' });
    });
  });

  describe('findAll', () => {
    it('should call usersService.findAll with normalized query', async () => {
      const expectedResult = { data: [], total: 0 };
      mockUsersService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll({ role: Role.admin, blocked: true });

      expect(service.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        role: Role.admin,
        blocked: true,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should throw Error if req.user is missing', async () => {
      const req = {} as unknown as FastifyRequest;
      await expect(controller.getProfile(req)).rejects.toThrow('Authentication required');
    });

    it('should call usersService.getProfile', async () => {
      const req = { user: { sub: 10 } } as unknown as FastifyRequest;
      const expectedResult = { id: 10, username: 'test' };
      mockUsersService.getProfile.mockResolvedValue(expectedResult);

      const result = await controller.getProfile(req);

      expect(service.getProfile).toHaveBeenCalledWith(10);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateProfile', () => {
    it('should throw Error if req.user is missing', async () => {
      const req = {} as unknown as FastifyRequest;
      await expect(controller.updateProfile(req, {})).rejects.toThrow('Authentication required');
    });

    it('should call usersService.updateProfile', async () => {
      const req = { user: { sub: 10 } } as unknown as FastifyRequest;
      const dto = { username: 'newname' };
      const expectedResult = { id: 10, username: 'newname' };
      mockUsersService.updateProfile.mockResolvedValue(expectedResult);

      const result = await controller.updateProfile(req, dto);

      expect(service.updateProfile).toHaveBeenCalledWith(10, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOne', async () => {
      const expectedResult = { id: 1, username: 'test' };
      mockUsersService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateRole', () => {
    it('should throw Error if req.user is missing', async () => {
      const req = {} as unknown as FastifyRequest;
      await expect(controller.updateRole(req, 2, { role: Role.editor })).rejects.toThrow('Authentication required');
    });

    it('should call usersService.updateRole', async () => {
      const req = { user: { sub: 1 } } as unknown as FastifyRequest;
      const expectedResult = { id: 2, role: Role.editor };
      mockUsersService.updateRole.mockResolvedValue(expectedResult);

      const result = await controller.updateRole(req, 2, { role: Role.editor });

      expect(service.updateRole).toHaveBeenCalledWith(1, 2, Role.editor);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('assignPlan', () => {
    it('should call usersService.assignPlan', async () => {
      const expectedResult = { id: 1, planId: 2 };
      mockUsersService.assignPlan.mockResolvedValue(expectedResult);

      const result = await controller.assignPlan(1, { planId: 2 });

      expect(service.assignPlan).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('blockUser', () => {
    it('should throw Error if req.user is missing', async () => {
      const req = {} as unknown as FastifyRequest;
      await expect(controller.blockUser(req, 2)).rejects.toThrow('Authentication required');
    });

    it('should call usersService.blockUser', async () => {
      const req = { user: { sub: 1 } } as unknown as FastifyRequest;
      mockUsersService.blockUser.mockResolvedValue(undefined);

      const result = await controller.blockUser(req, 2);

      expect(service.blockUser).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual({ message: 'Tài khoản đã bị khóa thành công' });
    });
  });

  describe('unblockUser', () => {
    it('should call usersService.unblockUser', async () => {
      mockUsersService.unblockUser.mockResolvedValue(undefined);

      const result = await controller.unblockUser(2);

      expect(service.unblockUser).toHaveBeenCalledWith(2);
      expect(result).toEqual({ message: 'Tài khoản đã được mở khóa thành công' });
    });
  });
});