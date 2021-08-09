import { Module } from '@nestjs/common';
import UsersModule from '../users/users.module';
import SlackService from './slack.service';
import SlackEodsController from './slack_eods.controller';
import SlackEodsService from './slack_eods.service';

@Module({
  imports: [UsersModule],
  controllers: [SlackEodsController],
  providers: [SlackService, SlackEodsService],
})
export default class SlackModule {}
