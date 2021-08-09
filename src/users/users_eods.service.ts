import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { scheduleJob } from 'node-schedule';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export default class UsersEodsService {
  private readonly logger = new Logger(UsersEodsService.name);

  private isArchivingEodsScheduled = false;

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

  scheduleArchivingEods() {
    this.logger.log('Schedule archiving EOD for all users');
    if (this.isArchivingEodsScheduled) return;

    // schedule at mid night
    scheduleJob('0 0 0 * * *', () => this.archiveAllUsersEods());
    this.isArchivingEodsScheduled = true;
  }
}
