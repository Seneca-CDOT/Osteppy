import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import AppController from './app.controller';
import AppService from './app.service';
import BodyParserMiddleware from './body_parser.middleware';
import DevModule from './dev/dev.module';
import { User, UserSchema } from './Users/schemas/user.schema';
import UserService from './Users/users.service';

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
  providers: [AppService, UserService],
})
class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BodyParserMiddleware).forRoutes('');
  }
}

export default AppModule;
