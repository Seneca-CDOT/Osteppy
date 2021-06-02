import { Module } from '@nestjs/common';
import SlackModule from '../slack/slack.module';
import UserModule from '../user/user.module';
import EodController from './eod.controller';
import EodService from './eod.service';

@Module({
  imports: [UserModule, SlackModule],
  controllers: [EodController],
  providers: [EodService],
})
export default class EodModule {}
