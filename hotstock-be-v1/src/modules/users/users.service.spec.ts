import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockPrisma, MockPrismaService } from '../../common/test/mock.utils';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: MockPrismaService;

  const mockUserWithPlan = (overrides = {}) => ({
    id: 1,
    email: 'user@example.com',
    username: 'testuser',
    fullName: 'Test User',
    phoneNumber: null,
    role: 'user' as Role,
    provider: 'local',
    confirmed: true,
    blocked: false,
    passwordChangedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    passwordHash: 'hashedpw',
    resetPasswordOtp: null,
    resetPasswordExpires: null,
    planId: 1,
    plan: { id: 1, name: 'Free', slug: 'free', level: 0 },
    ...overrides,
  });

  beforeEach(async () => {
    const mockPrisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return user when found', async () => {
      const user = mockUserWithPlan();
      prisma.user.findUnique.mockResolvedValueOnce(user);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.email).toBe('user@example.com');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { plan: true },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile for valid userId', async () => {
      const user = mockUserWithPlan({ id: 5, email: 'profile@example.com' });
      prisma.user.findUnique.mockResolvedValueOnce(user);

      const result = await service.getProfile(5);

      expect(result.id).toBe(5);
      expect(result.email).toBe('profile@example.com');
      expect(result.plan).toEqual({ id: 1, name: 'Free', slug: 'free', level: 0 });
    });

    it('should throw NotFoundException for non-existent userId', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.getProfile(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRole', () => {
    it('should throw BadRequestException when admin tries to change own role', async () => {
      await expect(service.updateRole(1, 1, 'admin')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when target user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.updateRole(1, 999, 'admin')).rejects.toThrow(NotFoundException);
    });

    it('should update role and return updated user', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUserWithPlan({ id: 2 }));
      prisma.user.update.mockResolvedValueOnce(mockUserWithPlan({ id: 2, role: 'editor' }));

      const result = await service.updateRole(1, 2, 'editor');

      expect(result.id).toBe(2);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { role: 'editor' },
        include: { plan: true },
      });
    });
  });

  describe('blockUser', () => {
    it('should throw BadRequestException when admin tries to block self', async () => {
      await expect(service.blockUser(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when target user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.blockUser(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should block user and delete their refresh tokens', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUserWithPlan({ id: 2 }));
      // Mock transaction
      prisma.user.update.mockResolvedValueOnce(mockUserWithPlan({ id: 2, blocked: true }));
      prisma.refreshToken.deleteMany.mockResolvedValueOnce({ count: 3 });

      await service.blockUser(1, 2);

      // Should have called user update with blocked: true
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { blocked: true },
      });
      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 2 },
      });
    });
  });

  describe('unblockUser', () => {
    it('should throw NotFoundException if target user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.unblockUser(999)).rejects.toThrow(NotFoundException);
    });

    it('should unblock user successfully', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUserWithPlan({ id: 2, blocked: true }));
      prisma.user.update.mockResolvedValueOnce(mockUserWithPlan({ id: 2, blocked: false }));

      await service.unblockUser(2);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { blocked: false },
      });
    });
  });

  describe('assignPlan', () => {
    it('should throw NotFoundException if target user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.assignPlan(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if plan does not exist', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUserWithPlan({ id: 2 }));
      prisma.plan.findUnique.mockResolvedValueOnce(null);

      await expect(service.assignPlan(2, 999)).rejects.toThrow(NotFoundException);
    });

    it('should successfully assign plan and revoke refresh tokens', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUserWithPlan({ id: 2 }));
      prisma.plan.findUnique.mockResolvedValueOnce({ id: 3, name: 'Gold', slug: 'gold', level: 2 } as any);
      prisma.user.update.mockResolvedValueOnce(mockUserWithPlan({ id: 2, planId: 3, plan: { id: 3, name: 'Gold', slug: 'gold', level: 2 } }));

      const result = await service.assignPlan(2, 3);

      expect(result.plan?.slug).toBe('gold');
      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({ where: { userId: 2 } });
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFoundException if target user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.deleteUser(999)).rejects.toThrow(NotFoundException);
    });

    it('should delete user and clean up relationships in transaction', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUserWithPlan({ id: 2 }));
      
      await service.deleteUser(2);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({ where: { userId: 2 } });
      expect(prisma.auditLog.deleteMany).toHaveBeenCalledWith({ where: { userId: 2 } });
      expect(prisma.article.updateMany).toHaveBeenCalledWith({ where: { authorId: 2 }, data: { authorId: null } });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 2 } });
    });
  });

  describe('updateProfile', () => {
    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.updateProfile(999, { username: 'newname' })).rejects.toThrow(NotFoundException);
    });

    it('should update profile and return updated user response', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUserWithPlan({ id: 2, username: 'oldname' }));
      prisma.user.update.mockResolvedValueOnce(mockUserWithPlan({ id: 2, username: 'newname' }));

      const result = await service.updateProfile(2, { username: 'newname' });

      expect(result.username).toBe('newname');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { username: 'newname' },
        include: { plan: true },
      });
    });
  });

  describe('findAll (paginated)', () => {
    it('should return paginated users', async () => {
      const users = [mockUserWithPlan({ id: 1 }), mockUserWithPlan({ id: 2 })];
      prisma.user.findMany.mockResolvedValueOnce(users);
      prisma.user.count.mockResolvedValueOnce(2);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
    });

    it('should apply role filter', async () => {
      prisma.user.findMany.mockResolvedValueOnce([]);
      prisma.user.count.mockResolvedValueOnce(0);

      await service.findAll({ page: 1, limit: 20, role: 'admin' });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { role: 'admin' },
        }),
      );
    });
  });
});