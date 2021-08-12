import { Controller, Post, UseGuards } from '@nestjs/common';
import SlackGuard from '../slack/slack.guard';
import SystemService from './system.service';

@Controller('system')
@UseGuards(SlackGuard)
export default class SystemController {
  constructor(private systemService: SystemService) {}

  @Post('message')
  async sendMessage() {
    return this.systemService.sendMessage();
  }
}
