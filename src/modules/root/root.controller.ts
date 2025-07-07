import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { RootService } from './root.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { port } from 'src/configs';
import { RequestWithUser } from '../auth/request-with-user.interface';

@Controller()
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Get('login')
  @Render('login')
  loginPage() {
    return { port };
  }

  @Get()
  @Render('register')
  registerPage() {
    return { port };
  }

  @Get('dashboard')
  @Render('dashboard')
  dashboard() {
    return { port };
  }
}
