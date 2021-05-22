import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import AppController from './app.controller';
import AppService from './app.service';
import DevModule from './dev/dev.module';
import { User, UserSchema } from './user/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_HOST || 'localhost'}/users`,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    DevModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

export default AppModule;
