import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repo: ReturnType<typeof mockUserRepository>;
  let jwt: ReturnType<typeof mockJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: JwtService, useFactory: mockJwtService },
        { provide: getRepositoryToken(UserEntity), useFactory: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(UserEntity));
    jwt = module.get(JwtService);
  });

  describe('register()', () => {
    it('should throw error if email already exists', async () => {
      repo.findOneBy.mockResolvedValue({ id: 1, email: 'test@example.com' });
      await expect(service.register({ email: 'test@example.com', password: 'pass', role: 'user' }))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should register a new user and return token', async () => {
      repo.findOneBy.mockResolvedValue(null);
      const hashedPass = await bcrypt.hash('pass', 10);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPass);
      const createdUser = { email: 'test@example.com', password: hashedPass, role: 'user' };
      const savedUser = { id: 1, ...createdUser };
      repo.create.mockReturnValue(createdUser);
      repo.save.mockResolvedValue(savedUser);
      jwt.sign.mockReturnValue('signed-token');

      const result = await service.register({ email: 'test@example.com', password: 'pass', role: 'user' });

      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });

  describe('login()', () => {
    it('should throw if user not found', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.login('not@found.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password mismatch', async () => {
      const user = { email: 'test@example.com', password: 'hashed' };
      repo.findOneBy.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login('test@example.com', 'wrongpass')).rejects.toThrow(UnauthorizedException);
    });

    it('should return token if credentials are valid', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashed', role: 'admin' };
      repo.findOneBy.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jwt.sign.mockReturnValue('signed-token');

      const result = await service.login('test@example.com', 'correctpass');
      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });

  describe('findAll()', () => {
    it('should return list of users', async () => {
      const users = [{ id: 1, email: 'a@a.com' }];
      repo.find.mockResolvedValue(users);
      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });
});
