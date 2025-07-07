import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { RootService } from './root.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Get('login')
  @Render('login')
  loginPage() {
    return {};
  }

  @Get('register')
  @Render('register')
  registerPage() {
    return {};
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @Render('dashboard')
  dashboard() {
    return {};
  }

  @Get()
  @Render('index')
  getHello() {
    console.log('Rendering index page');
  }
}
