import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    changePassword: jest.fn(),
    forgotPassword: jest.fn(),
    verifyOtp: jest.fn(),
    resetPassword: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const req = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'Jest' },
      } as unknown as FastifyRequest;
      const expectedResult = { access_token: 'access', refresh_token: 'refresh', user: {} as any };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto, req);

      expect(service.login).toHaveBeenCalledWith(loginDto, '127.0.0.1', 'Jest');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      const registerDto = { email: 'test@example.com', password: 'password', username: 'test', confirmPassword: 'password' };
      const expectedResult = { access_token: 'access', refresh_token: 'refresh', user: {} as any };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refresh', () => {
    it('should call authService.refresh and return result', async () => {
      const refreshDto = { refresh_token: 'refresh' };
      const req = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'Jest' },
      } as unknown as FastifyRequest;
      const expectedResult = { access_token: 'access', refresh_token: 'new_refresh' };

      mockAuthService.refresh.mockResolvedValue(expectedResult);

      const result = await controller.refresh(refreshDto, req);

      expect(service.refresh).toHaveBeenCalledWith('refresh', '127.0.0.1', 'Jest');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('logout', () => {
    it('should call authService.logout and return success message', async () => {
      const user = { sub: 1 } as any;
      const refreshDto = { refresh_token: 'refresh' };

      const result = await controller.logout(user, refreshDto);

      expect(service.logout).toHaveBeenCalledWith(1, 'refresh');
      expect(result).toEqual({ message: 'Đăng xuất thành công' });
    });
  });

  describe('changePassword', () => {
    it('should call authService.changePassword and return success message', async () => {
      const user = { sub: 1 } as any;
      const changePasswordDto = { oldPassword: 'old', newPassword: 'new' };

      const result = await controller.changePassword(user, changePasswordDto);

      expect(service.changePassword).toHaveBeenCalledWith(1, changePasswordDto);
      expect(result).toEqual({ message: 'Đổi mật khẩu thành công' });
    });
  });

  describe('forgotPassword', () => {
    it('should call authService.forgotPassword and return success message', async () => {
      const forgotPasswordDto = { email: 'test@example.com' };
      const expectedResult = { message: 'OTP sent' };

      mockAuthService.forgotPassword.mockResolvedValue(expectedResult);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(service.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('verifyOtp', () => {
    it('should call authService.verifyOtp and return reset token', async () => {
      const verifyOtpDto = { email: 'test@example.com', otp: '123456' };
      const expectedResult = { reset_token: 'reset' };

      mockAuthService.verifyOtp.mockResolvedValue(expectedResult);

      const result = await controller.verifyOtp(verifyOtpDto);

      expect(service.verifyOtp).toHaveBeenCalledWith('test@example.com', '123456');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('resetPassword', () => {
    it('should call authService.resetPassword and return success message', async () => {
      const resetPasswordDto = { resetToken: 'reset', newPassword: 'new' };

      const result = await controller.resetPassword(resetPasswordDto);

      expect(service.resetPassword).toHaveBeenCalledWith('reset', 'new');
      expect(result).toEqual({ message: 'Đặt lại mật khẩu thành công' });
    });
  });
});