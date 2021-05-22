import { Injectable } from '@nestjs/common';
import SlackRequestDto from '../dto/slack_request.dto';

@Injectable()
export default class EodService {
  create(slackRequestDto: SlackRequestDto) {
    return '';
  }
}
