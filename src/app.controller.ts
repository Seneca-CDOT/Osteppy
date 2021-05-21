import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import AppService from './app.service';
import AuthenticationGuard from './authentication.guard';

@Controller()
@UseGuards(AuthenticationGuard)
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  postHello(): string {
    return this.appService.getHello();
  }
}

export default AppController;
