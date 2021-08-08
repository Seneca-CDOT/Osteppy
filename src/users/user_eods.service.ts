import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Eod } from './schemas/eod.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export default class UserEodsService {
  private logger = new Logger(UserEodsService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async updateEod(
    slackUserId: string,
    tasks: string[],
    slackEmoji: string,
    additionalUpdates?: {
      slackUsername?: string;
    },
  ) {
    this.logger.log(`Update EOD for user [${slackUserId}]`);
    const { eod } = await this.userModel
      .findOneAndUpdate(
        { slackUserId },
        {
          ...additionalUpdates,
          eod: { date: new Date(), tasks, slackEmoji },
        },
        { new: true, upsert: true, omitUndefined: true, projection: 'eod' },
      )
      .exec();
    return eod as Eod;
  }

  async pushEodTasks(
    slackUserId: string,
    tasks: string[],
    additionalUpdates?: {
      slackUsername?: string;
    },
  ) {
    this.logger.log(`Push EOD tasks for user [${slackUserId}]`);
    const { eod } = await this.userModel
      .findOneAndUpdate(
        { slackUserId },
        {
          ...additionalUpdates,
          'eod.date': new Date(),
          $push: { 'eod.tasks': { $each: tasks } },
        },
        { new: true, upsert: true, omitUndefined: true, projection: 'eod' },
      )
      .exec();
    return eod as Eod;
  }

  async popEodTasks(
    slackUserId: string,
    numTasks: number,
    additionalUpdates?: {
      slackUsername?: string;
    },
  ) {
    this.logger.log(`Pop EOD tasks for user [${slackUserId}]`);
    const { eod } = await this.userModel
      .findOneAndUpdate(
        { slackUserId },
        [
          { $set: { 'eod.tasks': { $ifNull: ['$eod.tasks', []] } } },
          {
            $set: {
              ...additionalUpdates,
              'eod.date': new Date(),
              'eod.tasks': {
                $let: {
                  vars: {
                    finalLen: {
                      $subtract: [{ $size: '$eod.tasks' }, numTasks],
                    },
                  },
                  in: {
                    $cond: [
                      { $gt: ['$$finalLen', 0] },
                      { $slice: ['$eod.tasks', 0, '$$finalLen'] },
                      [],
                    ],
                  },
                },
              },
            },
          },
        ],
        { new: true, upsert: true, omitUndefined: true, projection: 'eod' },
      )
      .exec();
    return eod as Eod;
  }

  async updateEodSlackEmoji(
    slackUserId: string,
    slackEmoji: string,
    additionalUpdates?: {
      slackUsername?: string;
    },
  ) {
    this.logger.log(`Update EOD Slack emoji for user [${slackUserId}]`);
    const { eod } = await this.userModel
      .findOneAndUpdate(
        { slackUserId },
        {
          ...additionalUpdates,
          'eod.date': new Date(),
          'eod.slackEmoji': slackEmoji,
          $push: { 'eod.tasks': { $each: [] } },
        },
        { new: true, upsert: true, omitUndefined: true, projection: 'eod' },
      )
      .exec();
    return eod as Eod;
  }
}
