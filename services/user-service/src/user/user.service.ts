import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>,
    private jwtService: JwtService
){}

     private signedUser(userId: number,email:string, role: string){
        const response = {sub: userId,email, role};
        return {
            access_token: this.jwtService.sign(response)
        } 
    }
    
    async register(userDetails:RegisterDto){
        const usr = await this.repo.findOneBy({email: userDetails.email})
        if(usr) throw new BadRequestException('Email already in use please try another!')
        const hased = await bcrypt.hash(userDetails.password, 10);
        const hasedUser = this.repo.create({ email: userDetails.email, password:hased, role: userDetails.role })
        const user =await this.repo.save(hasedUser)
        return this.signedUser(user.id, user.email, user.role)
    }

    async login(email: string, password: string){
        const usr = await this.repo.findOneBy({email})
        if(!usr) throw new UnauthorizedException(`Unauthorized user: ${email}`)
        let matched = await bcrypt.compare(password, usr?.password)
        if(!matched) throw new UnauthorizedException('Invalid Credentials!')
        return this.signedUser(usr.id, usr.email, usr.role)

    }
    
    async findAll(){
        const usersList = await this.repo.find();
        return usersList;
    }

    async findById(userId: number){
        const user = await this.repo.findOneBy({id: userId})
        if(!user) throw new NotFoundException('No Such user!')
        return user
    }

    async updateUser(userId:number, userdetails:any){
        this.findById(userId)
        const updatedUser =await this.repo.update({id:userId},userdetails);
        console.log("updateduser: ", updatedUser);
        
        return updatedUser
    }

    async deleteUser(userId: number){
        const user = this.findById(userId);
        if(!user) throw new NotFoundException('User is either deleted or not registred with us')
        return this.repo.delete({id:userId})
    }
}
