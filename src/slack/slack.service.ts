import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SLACK } from '../configuration';

@Injectable()
export default class SlackService {
  readonly web = new WebClient(SLACK.BOT_USER_TOKEN);
}
