import { Module } from '@nestjs/common';
import SystemModule from '../system/system.module';
import UsersModule from '../users/users.module';
import SlackService from './slack.service';
import SlackEodsController from './slack_eods.controller';
import SlackEodsService from './slack_eods.service';
import SlackSystemController from './slack_system.controller';
import SlackSystemService from './slack_system.service';

@Module({
  imports: [UsersModule, SystemModule],
  controllers: [SlackEodsController, SlackSystemController],
  providers: [SlackService, SlackEodsService, SlackSystemService],
  exports: [SlackService],
})
export default class SlackModule {}
