import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let usersService: UsersService;

  const mockUsersService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return user data', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123'
      };

      const expectedResult = { id: 1, ...dto };
      mockUsersService.register.mockResolvedValue(expectedResult);

      const result = await authController.register(dto);
      expect(result).toEqual(expectedResult);
      expect(mockUsersService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login a user and return access token', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const expectedResult = { accessToken: 'fake.jwt.token' };
      mockUsersService.login.mockResolvedValue(expectedResult);

      const result = await authController.login(dto);
      expect(result).toEqual(expectedResult);
      expect(mockUsersService.login).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });
});
