import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import SlackGuard from './slack.guard';
import SlackEodsService from './slack_eods.service';
import SlackRequestDto from './slack_request.dts';

@Controller('slack/eods')
@UseGuards(SlackGuard)
export default class SlackEodsController {
  constructor(private slackEodsService: SlackEodsService) {}

  @Post('update')
  async update(@Body() slackRequestDto: SlackRequestDto) {
    return this.slackEodsService.update(slackRequestDto);
  }

  @Post('push-tasks')
  async pushTasks(@Body() slackRequestDto: SlackRequestDto) {
    return this.slackEodsService.pushTasks(slackRequestDto);
  }

  @Post('pop-tasks')
  async popTasks(@Body() slackRequestDto: SlackRequestDto) {
    return this.slackEodsService.popTasks(slackRequestDto);
  }
}
