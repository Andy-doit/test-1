import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getQueueToken } from '@nestjs/bullmq';
import {
  createMockPrisma,
  MockPrismaService,
  createMockRedis,
  createMockConfig,
  createMockQueue,
  createMockJwt,
} from '../../common/test/mock.utils';
import { ConflictException, UnauthorizedException, BadRequestException, HttpException } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: MockPrismaService;
  let redis: ReturnType<typeof createMockRedis>;
  let jwt: ReturnType<typeof createMockJwt>;
  let emailQueue: ReturnType<typeof createMockQueue>;

  beforeEach(async () => {
    const mockPrisma = createMockPrisma();
    const mockRedis = createMockRedis();
    const mockConfig = createMockConfig();
    const mockQueue = createMockQueue();
    const mockJwt = createMockJwt();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
        { provide: JwtService, useValue: mockJwt },
        { provide: 'REDIS_CLIENT', useValue: mockRedis },
        { provide: getQueueToken('email'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    redis = module.get('REDIS_CLIENT');
    jwt = module.get(JwtService);
    emailQueue = module.get(getQueueToken('email'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      username: 'Test User',
      confirmPassword: 'password123',
    };

    it('should throw BadRequestException if passwords do not match', async () => {
      await expect(service.register({ ...registerDto, confirmPassword: 'wrong' })).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if email is already taken', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 1 } as any);
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should successfully register a new user', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      const mockCreatedUser = {
        id: 1,
        email: registerDto.email,
        username: registerDto.username,
        role: 'user',
        plan: { slug: 'free', level: 0 },
      };
      prisma.user.create.mockResolvedValueOnce(mockCreatedUser as any);
      
      const result = await service.register(registerDto);

      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(service.login(loginDto, '', '')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if account is blocked', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 1, blocked: true } as any);
      await expect(service.login(loginDto, '', '')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 1, passwordHash: 'hash' } as any);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(false);
      await expect(service.login(loginDto, '', '')).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens if login is successful', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: loginDto.email,
        passwordHash: 'hash',
        role: 'user',
      } as any);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);
      
      const result = await service.login(loginDto, '127.0.0.1', 'Mozilla');
      expect(result).toHaveProperty('access_token');
      expect(prisma.refreshToken.create).toHaveBeenCalled();
      expect(emailQueue.add).toHaveBeenCalledWith('audit_log', expect.any(Object), expect.any(Object));
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException if token is invalid or expired', async () => {
      prisma.refreshToken.findFirst.mockResolvedValueOnce(null);
      await expect(service.refresh('token', '', '')).rejects.toThrow(UnauthorizedException);
    });

    it('should revoke all tokens if token reuse is detected', async () => {
      prisma.refreshToken.findFirst.mockResolvedValueOnce({
        userId: 1,
        revokedAt: new Date(),
        user: { blocked: false }
      } as any);
      
      await expect(service.refresh('token', '', '')).rejects.toThrow(UnauthorizedException);
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 1, revokedAt: null },
        data: { revokedAt: expect.any(Date) }
      });
    });

    it('should return new tokens on valid refresh token', async () => {
      prisma.refreshToken.findFirst.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        revokedAt: null,
        expiresAt: new Date(Date.now() + 100000),
        user: { blocked: false, role: 'user' }
      } as any);

      const result = await service.refresh('token', '', '');
      expect(result).toHaveProperty('access_token');
      expect(prisma.refreshToken.update).toHaveBeenCalled();
      expect(prisma.refreshToken.create).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should revoke the specific refresh token and log audit', async () => {
      await service.logout(1, 'token');
      expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
      expect(emailQueue.add).toHaveBeenCalledWith('audit_log', expect.any(Object), expect.any(Object));
    });
  });

  describe('changePassword', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(service.changePassword(1, { oldPassword: 'old', newPassword: 'new' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if old password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 1, passwordHash: 'hash' } as any);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(false);
      await expect(service.changePassword(1, { oldPassword: 'old', newPassword: 'new' })).rejects.toThrow(UnauthorizedException);
    });

    it('should update password and invalidate sessions', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 1, passwordHash: 'hash' } as any);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);
      
      await service.changePassword(1, { oldPassword: 'old', newPassword: 'new' });
      expect(argon2.hash).toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(emailQueue.add).toHaveBeenCalledWith('audit_log', expect.any(Object), expect.any(Object));
    });
  });

  describe('forgotPassword', () => {
    it('should return default message even if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      const result = await service.forgotPassword('test@example.com');
      expect(result.message).toContain('đã được gửi');
    });

    it('should set OTP in redis and queue email if user exists', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 1, email: 'test@example.com' } as any);
      
      // Mock redis pipeline
      const mockPipeline = {
        set: jest.fn(),
        exec: jest.fn().mockResolvedValue([]),
      };
      (redis.pipeline as jest.Mock).mockReturnValue(mockPipeline);

      await service.forgotPassword('test@example.com');
      
      expect(mockPipeline.set).toHaveBeenCalledTimes(2);
      expect(mockPipeline.exec).toHaveBeenCalled();
      expect(emailQueue.add).toHaveBeenCalled();
    });
  });
});