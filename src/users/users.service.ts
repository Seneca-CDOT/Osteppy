import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Eod } from './schemas/eod.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export default class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findAll(): Promise<User[]> {
    this.logger.log('Find all users');
    return this.userModel.find().exec();
  }

  deleteAll() {
    this.logger.log('Delete all users');
    return this.userModel.deleteMany({}).exec();
  }

  find(slackUserId: string): Promise<User | null> {
    this.logger.log(`Find user [${slackUserId}]`);
    return this.userModel.findOne({ slackUserId }).exec();
  }

  create(slackUserId: string, slackUsername: string): Promise<User> {
    return this.userModel.create({
      slackUserId,
      slackUsername,
      eods: [],
      eod: null,
    });
  }

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
