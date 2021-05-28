import { Controller, Post, Request } from '@nestjs/common';
import SlackRequestDto from '../dto/slack_request.dto';
import EodService from './eod.service';

@Controller('eod')
export default class EodController {
  constructor(private readonly eodService: EodService) {}

  @Post('get-current-or-submit')
  getCurrentOrSubmit(@Request() slackRequestDto: SlackRequestDto) {
    this.eodService.getCurrentOrSubmitEod(slackRequestDto);
  }
}
