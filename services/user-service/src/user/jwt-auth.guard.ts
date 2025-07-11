import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthenticatedRequest } from './interface/authenticated-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token not found');
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = this.jwtService.verify(token, {
                secret: 'super-secret',
            });
            req.user = payload;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
