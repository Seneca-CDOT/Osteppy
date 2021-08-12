import { Module } from '@nestjs/common';
// import { User, UserSchema } from './schemas/user.schema';
import SystemController from './system.controller';
import SystemService from './system.service';

@Module({
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService],
})
export default class SystemModule {}
