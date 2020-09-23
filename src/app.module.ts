import { Module } from '@nestjs/common';
import AppController from './app.controller';
import AppService from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './Users/users.service';
import { User, UserSchema } from './Users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/users'), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AppController],
  providers: [AppService, UserService],
})
class AppModule {}

export default AppModule;
