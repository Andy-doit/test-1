import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export type MockPrismaService = DeepMockProxy<PrismaClient>;

export const createMockPrisma = (): MockPrismaService => mockDeep<PrismaClient>();

export const createMockRedis = () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  incr: jest.fn(),
  scan: jest.fn().mockResolvedValue(['0', []]),
  pipeline: jest.fn().mockReturnValue({
    set: jest.fn(),
    get: jest.fn(),
    exec: jest.fn().mockResolvedValue([]),
  }),
});

export const createMockConfig = () => ({
  get: jest.fn().mockImplementation((key, defaultValue) => {
    if (key === 'jwt.refreshExpiresIn') return '7d';
    return defaultValue;
  }),
});

export const createMockQueue = () => ({
  add: jest.fn().mockReturnValue({
    catch: jest.fn().mockResolvedValue(undefined),
  }),
});

export const createMockJwt = () => ({
  sign: jest.fn().mockReturnValue('mock_jwt_token'),
  verify: jest.fn(),
});
