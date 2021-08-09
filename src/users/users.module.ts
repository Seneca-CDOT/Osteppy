import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import UsersController from './users.controller';
import UsersService from './users.service';
import UsersEodsService from './users_eods.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersEodsService],
  exports: [UsersService, UsersEodsService],
})
export default class UsersModule {}
