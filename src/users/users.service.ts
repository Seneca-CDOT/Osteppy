import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export default class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findAll() {
    this.logger.log('Find all users');
    return this.userModel.find().exec();
  }

  deleteAll() {
    this.logger.log('Delete all users');
    return this.userModel.deleteMany({}).exec();
  }

  find(slackUserId: string) {
    this.logger.log(`Find user [${slackUserId}]`);
    return this.userModel.findOne({ slackUserId }).exec();
  }

  createOrUpdate(slackUserId: string, slackUsername: string) {
    this.logger.log(`Create or update user [${slackUserId}]`);
    return this.userModel
      .findOneAndUpdate(
        { slackUserId },
        { slackUsername },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .exec();
  }
}
