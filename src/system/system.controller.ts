import { Controller, Get, UseGuards } from '@nestjs/common';
import SystemService from './system.service';
import DevelopmentModeGuard from '../development_mode.guard';

@Controller('system')
@UseGuards(DevelopmentModeGuard)
export default class SystemController {
  constructor(private systemService: SystemService) {}

  @Get('portchecking')
  async sendMessage() {
    return this.systemService.portCheck();
  }
}
