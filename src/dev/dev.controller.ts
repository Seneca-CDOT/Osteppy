import { Controller, Post, Req } from '@nestjs/common';
import SlackRequestDto from '../dto/slack_request.dto';
import DevService from './dev.service';

@Controller('dev')
export default class DevController {
  constructor(private devService: DevService) {}

  @Post('go-to-endpoint')
  goToEndpoint(@Req() slackRequestDto: SlackRequestDto) {
    return this.devService.goToEndpoint(slackRequestDto);
  }
}
