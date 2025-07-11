import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./user.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController{
    constructor(private userService: UsersService){}

    @Post('register')
        register(@Body() userDetails: RegisterDto){
            return this.userService.register(userDetails);
        }
        
        @Post('login')
        login(@Body() userDetails: LoginDto){
            return this.userService.login(userDetails.email, userDetails.password); 
        }
}