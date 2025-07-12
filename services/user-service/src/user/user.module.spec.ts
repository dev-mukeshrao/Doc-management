import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

describe('UserModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'super-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        UsersService,
        JwtAuthGuard,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          }, // mock only what you need
        },
      ],
      controllers: [UsersController, AuthController],
    }).compile();
  });

  it('should compile UserModule with all providers/controllers', () => {
    const userService = module.get<UsersService>(UsersService);
    const userController = module.get<UsersController>(UsersController);
    const authController = module.get<AuthController>(AuthController);
    const jwtGuard = module.get<JwtAuthGuard>(JwtAuthGuard);

    expect(userService).toBeDefined();
    expect(userController).toBeDefined();
    expect(authController).toBeDefined();
    expect(jwtGuard).toBeDefined();
  });
});
