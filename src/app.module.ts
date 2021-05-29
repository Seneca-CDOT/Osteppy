import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AppController from './app.controller';
import AppService from './app.service';
import { MONGO } from './configuration';
import DevModule from './dev/dev.module';
import EodModule from './eod/eod.module';
import UserModule from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${MONGO.HOST}`, {
      dbName: 'osteppy',
      user: MONGO.USER,
      pass: MONGO.PASS,
      useFindAndModify: false,
      useCreateIndex: true,
    }),
    DevModule,
    UserModule,
    EodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

export default AppModule;
