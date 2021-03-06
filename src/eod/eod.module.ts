import { HttpModule, Module } from '@nestjs/common';
import UserModule from '../user/user.module';
import EodController from './eod.controller';
import EodService from './eod.service';

@Module({
  imports: [UserModule, HttpModule],
  controllers: [EodController],
  providers: [EodService],
})
export default class EodModule {}
