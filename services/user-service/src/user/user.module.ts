import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),
  JwtModule.register({
    secret: 'super-secret',
    signOptions: { expiresIn: '1h' }
  })],
  providers: [UsersService, JwtAuthGuard],
  controllers: [UsersController, AuthController],
  exports: [UsersService]
})
export class UserModule { }
