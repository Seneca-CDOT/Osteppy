import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { assignDefined } from '../helpers/assign_defined';
import { EodSlackPost } from './schemas/eod_slack_post.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export default class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private async findOrCreateDoc(
    slackUserId: string,
    projection?: string,
    lean?: boolean,
  ) {
    return this.userModel
      .findOneAndUpdate(
        { slackUserId },
        {},
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          projection,
          lean,
        },
      )
      .exec();
  }

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

  async findOrCreate(slackUserId: string): Promise<User> {
    return this.findOrCreateDoc(slackUserId, undefined, true);
  }

  async updateEod(
    slackUserId: string,
    eodFields?: {
      tasks?: string[];
      slackEmoji?: string;
    },
    userFields?: {
      slackUsername?: string;
    },
  ) {
    this.logger.log(`Update EOD for user [${slackUserId}]`);

    const userDoc = await this.findOrCreateDoc(slackUserId, 'eod');
    userDoc.eod.date = new Date();
    assignDefined(userDoc.eod, eodFields);
    assignDefined(userDoc, userFields);
    await userDoc.save();

    return userDoc.toObject().eod;
  }

  async pushEodTasks(
    slackUserId: string,
    tasks: string[] = [],
    userFields?: {
      slackUsername?: string;
    },
  ) {
    this.logger.log(`Push EOD tasks for user [${slackUserId}]`);

    const userDoc = await this.findOrCreateDoc(slackUserId, 'eod');
    userDoc.eod.date = new Date();
    userDoc.eod.tasks.push(...tasks);
    assignDefined(userDoc, userFields);
    await userDoc.save();

    return userDoc.toObject().eod;
  }

  async popEodTasks(
    slackUserId: string,
    numTasks = 0,
    userFields?: {
      slackUsername?: string;
    },
  ) {
    this.logger.log(`Pop EOD tasks for user [${slackUserId}]`);

    const userDoc = await this.findOrCreateDoc(slackUserId, 'eod');
    userDoc.eod.tasks.splice(Math.max(userDoc.eod.tasks.length - numTasks, 0));
    assignDefined(userDoc, userFields);
    await userDoc.save();

    return userDoc.toObject().eod;
  }

  async updateEodSlackPost(slackUserId: string, eodSlackPost: EodSlackPost) {
    this.logger.log(`Update EOD Slack post for user [${slackUserId}]`);

    const userDoc = await this.findOrCreateDoc(slackUserId, 'eodSlackPost');
    userDoc.eod.date = new Date();
    const oldEodSlackPost = userDoc.toObject().eodSlackPost;

    assignDefined(userDoc.eodSlackPost, eodSlackPost);
    await userDoc.save();

    return oldEodSlackPost;
  }
}
