import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AppController from './app.controller';
import AppService from './app.service';
import { MONGO } from './configuration';
import UsersModule from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${MONGO.HOST}`, {
      dbName: 'osteppy',
      user: MONGO.USER,
      pass: MONGO.PASS,
      useFindAndModify: false,
      useCreateIndex: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

export default AppModule;
