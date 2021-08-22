import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import AppController from './app.controller';
import AppService from './app.service';
import { DatabaseModule } from './database/database.module';
import SlackModule from './slack/slack.module';
import UsersModule from './users/users.module';
import SystemModule from './system/system.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    UsersModule,
    SlackModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
