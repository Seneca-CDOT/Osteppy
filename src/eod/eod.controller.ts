import { Controller, Post, Req } from '@nestjs/common';
import SlackRequestDto from '../dto/slack_request.dto';
import EodService from './eod.service';

@Controller('eod')
export default class EodController {
  constructor(private eodService: EodService) {}

  @Post('create')
  create(@Req() slackRequestDto: SlackRequestDto) {
    return this.eodService.create(slackRequestDto);
  }
}
