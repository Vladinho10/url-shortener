import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../../modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid credentials',
        });
      }

      const token = await this.authService.login(user);
      res.cookie('jwt', token.access_token, { httpOnly: true, secure: true });

      return res.json({
        access_token: token.access_token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Login failed',
      });
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      // Check if user already exists
      const existingUser = await this.usersService.findOneByEmail(registerDto.email);
      if (existingUser) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Email already in use',
        });
      }

      console.log('beginning of register', {existingUser});
      
      const user = await this.authService.register(registerDto.email, registerDto.password);
      const token = await this.authService.login(user);

      console.log('user and token in auth ctrl', {user, token});
      
      return res.status(HttpStatus.CREATED).json({
        access_token: token.access_token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Registration failed',
      });
    }
  }
}