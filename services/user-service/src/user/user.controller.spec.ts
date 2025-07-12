import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedRequest } from './interface/authenticated-request.interface';

const mockReq = {
  user: {
    sub: 1,
    email: 'admin@test.com',
    role: 'admin',
  },
} as Partial<AuthenticatedRequest> as AuthenticatedRequest;


describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, email: 'admin@test.com', role: 'admin' }]),
    findById: jest.fn().mockResolvedValue({ id: 2, email: 'user@test.com' }),
    updateUser: jest.fn().mockResolvedValue({ affected: 1 }),
    deleteUser: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user from request', () => {
      expect(controller.getProfile(mockReq)).toEqual(mockReq.user);
    });
  });

  describe('findAll', () => {

    it('should return all users if admin', async () => {
      const result = await controller.findAll(mockReq);
      expect(result).toEqual([{ id: 1, email: 'admin@test.com', role: 'admin' }]);
    });

    it('should throw ForbiddenException if not admin', async () => {
      const mockReq = {
        user: {
          sub: 1,
          email: 'admin@test.com',
          role: 'user',
        },
      } as Partial<AuthenticatedRequest> as AuthenticatedRequest;
      await expect(async () => {
        await controller.findAll(mockReq);
      }).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteUser', () => {
    it('should throw ForbiddenException when user tries to delete self', () => {

      expect(() => controller.deleteuser(1, mockReq)).toThrow(ForbiddenException);
    });

    it('should delete user if not self', async () => {

      const result = await controller.deleteuser(2, mockReq);
      expect(result).toEqual({ affected: 1 });
    });

  });
});
