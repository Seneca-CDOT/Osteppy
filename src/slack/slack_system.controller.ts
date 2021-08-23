import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import SlackGuard from './slack.guard';
import SlackSystemService from './slack_system.service';
import SlackRequestDto from './slack_request.dts';

@Controller('slack/system')
@UseGuards(SlackGuard)
export default class SlackEodsController {
  constructor(private slackSystemService: SlackSystemService) {}

  @Post('list-ports')
  async update(@Body() slackRequestDto: SlackRequestDto) {
    return this.slackSystemService.listPorts(slackRequestDto);
  }
}
