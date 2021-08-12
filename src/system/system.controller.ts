import { Controller, Get, UseGuards } from '@nestjs/common';
import DevelopmentModeGuard from '../development_mode.guard';
import SystemService from './system.service';

@Controller('system')
@UseGuards(DevelopmentModeGuard)
export default class SystemController {
  constructor(private systemService: SystemService) {}

  @Get()
  async sendMessage() {
    return this.systemService.sendMessage();
  }
}
