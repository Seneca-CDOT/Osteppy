import { Injectable, Logger } from '@nestjs/common';
import { assignDefined } from '../helpers/assign_defined';
import UsersService from './users.service';

@Injectable()
export default class UserEodsService {
  private logger = new Logger(UserEodsService.name);

  constructor(private usersService: UsersService) {}

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

    const userDoc = await this.usersService.findOrCreate(slackUserId, false);
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

    const user = await this.usersService.findOrCreate(slackUserId, false);
    user.eod.tasks.push(...tasks);
    assignDefined(user, userFields);
    await user.save();

    return user.toObject().eod;
  }

  async popEodTasks(
    slackUserId: string,
    numTasks = 0,
    userFields?: {
      slackUsername?: string;
    },
  ) {
    this.logger.log(`Pop EOD tasks for user [${slackUserId}]`);

    const user = await this.usersService.findOrCreate(slackUserId, false);
    user.eod.tasks.splice(user.eod.tasks.length - numTasks);
    assignDefined(user, userFields);
    await user.save();

    return user.toObject().eod;
  }
}
