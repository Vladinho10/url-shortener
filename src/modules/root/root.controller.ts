import { Controller, Get, Render } from '@nestjs/common';
import { RootService } from './root.service';

@Controller()
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Get()
  @Render('index')
  getHello() {
    console.log('Rendering index page');
  }
}
