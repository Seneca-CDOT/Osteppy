import { Module } from '@nestjs/common';
import SlackService from '../slack/slack.service';
import SystemController from './system.controller';
import SystemService from './system.service';

@Module({
  controllers: [SystemController],
  providers: [SystemService, SlackService],
  exports: [SystemService],
})
export default class SystemModule {}
