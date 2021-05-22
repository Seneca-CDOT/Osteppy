import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AppController from './app.controller';
import AppService from './app.service';
import { MONGO } from './configuration';
import DevModule from './dev/dev.module';
import UserModule from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${MONGO.HOST}`, {
      dbName: 'osteppy',
      user: MONGO.USER,
      pass: MONGO.PASS,
    }),
    DevModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

export default AppModule;
