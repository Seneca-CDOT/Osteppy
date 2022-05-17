import { Controller, Get } from '@nestjs/common';
import SystemService from './system.service';

@Controller('system')
export default class SystemController {
  constructor(private systemService: SystemService) {}

  @Get('portchecking')
  async sendMessage() {
    return this.systemService.portCheck();
  }

  @Get('load-domains')
  loadDomains() {
    this.systemService.loadDomains();
  }
}
