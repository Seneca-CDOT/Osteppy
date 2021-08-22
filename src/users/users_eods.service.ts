import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export default class UsersEodsService {
  private readonly logger = new Logger(UsersEodsService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async archiveAllUsersEods() {
    this.logger.log('Archive EOD for all users');

    const result = await this.userModel
      .updateMany({ 'eod.tasks': { $ne: [] } }, [
        {
          $set: {
            eods: { $concatArrays: ['$eods', ['$eod']] },
            eod: {
              date: '$$NOW',
              tasks: [],
              slackEmoji: '',
            },
            eodSlackPost: {
              channelId: '',
              timestamp: '',
            },
          },
        },
      ])
      .exec();

    this.logger.log(`Archived EOD for ${result.nModified} users`);
    return result;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  scheduleArchivingEods() {
    this.archiveAllUsersEods();
  }
}
