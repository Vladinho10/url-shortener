import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { jwt_secret } from 'src/configs';


let counter = 0;
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);    
    
    console.log('*******************************counter', counter+=1);
    console.log('token in canActivate', token, jwt_secret);
    
    if (!token) {      
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwt_secret,
      });
      
      // Verify user still exists
      console.log('payload in canActivate', payload);

      const user = await this.usersService.findOne(payload.sub);

      console.log('user in canActivate', user);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach user to request
      request.user = {
        id: user.id,
        email: user.email,
      };
    } catch (err) {
      console.log('error in in canActivate', err.message);
      
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Check Authorization header
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    console.log({type, token}, request.headers);
    
    if (type === 'Bearer') return token;
  
    return undefined;
  }
}