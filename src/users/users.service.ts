import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export default class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) public userModel: Model<UserDocument>) {}

  async findAll() {
    this.logger.log('Find all users');
    return this.userModel.find().lean();
  }

  async deleteAll() {
    this.logger.log('Delete all users');
    return this.userModel.deleteMany({}).exec();
  }

  async find(slackUserId: string) {
    this.logger.log(`Find user [${slackUserId}]`);
    return this.userModel.findOne({ slackUserId }).lean();
  }

  async findOrCreate(slackUserId: string, pojo?: true): Promise<User>;

  async findOrCreate(slackUserId: string, pojo: false): Promise<UserDocument>;

  async findOrCreate(slackUserId: string, pojo = true) {
    return this.userModel
      .findOneAndUpdate(
        { slackUserId },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true, lean: pojo },
      )
      .exec();
  }
}
