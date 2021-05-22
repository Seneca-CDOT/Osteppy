import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export default class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async create(userId: string, userName: string) {
    const newUser = await this.UserModel.create({
      userId,
      userName,
      eods: [],
      eodStatus: true,
    });
    return newUser;
  }

  findAll() {
    return this.UserModel.find().exec();
  }

  findOne(userId?: string) {
    return this.UserModel.findOne({ userId }).exec();
  }

  deleteAll() {
    return this.UserModel.deleteMany({}).exec();
  }
}
