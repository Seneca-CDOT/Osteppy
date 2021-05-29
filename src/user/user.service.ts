import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export default class UserService {
  constructor(@InjectModel(User.name) public readonly userModel: Model<User>) {}

  async create(userId: string, username: string) {
    const newUser = await this.userModel.create({
      userId,
      username,
      eods: [],
      eodStatus: true,
    });
    return newUser;
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(userId?: string) {
    return this.userModel.findOne({ userId }).exec();
  }

  deleteAll() {
    return this.userModel.deleteMany({}).exec();
  }
}
