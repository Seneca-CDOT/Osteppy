import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import AppController from './app.controller';
import AppService from './app.service';
import BodyParserMiddleware from './body_parser.middleware';
import { User, UserSchema } from './Users/schemas/user.schema';
import UserService from './Users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_HOST || 'localhost'}/users`,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
class AppModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BodyParserMiddleware).forRoutes('');
  }
}

export default AppModule;
