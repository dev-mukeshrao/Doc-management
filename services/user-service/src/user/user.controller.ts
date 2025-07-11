import { Body, ClassSerializerInterceptor, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './user.entity';
import { AuthenticatedRequest } from './interface/authenticated-request.interface';
import { JwtAuthGuard } from './jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Get('profile')
    getProfile(@Req() request: AuthenticatedRequest){
        return request.user;
    }

    @Get()
    findAll(@Req() req: AuthenticatedRequest){
        if(req.user.role !== 'admin') throw new ForbiddenException('Access Restricted!, Admin Only')
        return this.userService.findAll()
    }

    @Get(':id') 
    findById(@Param('id') userId: number){
        return this.userService.findById(userId)
    }

    @Patch(':id')
    updateUser(@Param('id') id: number, @Body() userDetails: any){
        return this.userService.updateUser(Number(id), userDetails);
    }

    @Delete(':id')
    deleteuser(@Param('id') id: number, @Req() request: AuthenticatedRequest){
        if (request.user.sub === Number(id)) {
            throw new ForbiddenException('You cannot delete your own account.');
        }
        return this.userService.deleteUser(id)
    }
}
