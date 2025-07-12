import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const createMockExecutionContext = (authHeader?: string): ExecutionContext => {
    const mockRequest = {
      headers: {
        authorization: authHeader ?? '',
      },
    } as Partial<Request>;

    const httpArgumentsHost = {
      getRequest: () => mockRequest,
      getResponse: jest.fn(),
      getNext: jest.fn(),
    };

    return {
      switchToHttp: () => httpArgumentsHost,
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    jwtService = mockJwtService as unknown as JwtService;
    guard = new JwtAuthGuard(jwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true for valid token', () => {
    const payload = { sub: 1, email: 'user@test.com', role: 'user' };
    mockJwtService.verify.mockReturnValue(payload);

    const context = createMockExecutionContext('Bearer valid.jwt.token');
    const result = guard.canActivate(context);
    expect(result).toBe(true);
    expect(mockJwtService.verify).toHaveBeenCalledWith('valid.jwt.token', { secret: 'super-secret' });
  });

  it('should throw UnauthorizedException if token is missing', () => {
    const context = createMockExecutionContext();
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    mockJwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const context = createMockExecutionContext('Bearer invalid.token');
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
