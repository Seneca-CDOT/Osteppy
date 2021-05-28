import { HttpService, Injectable, Logger } from '@nestjs/common';
import { scheduleJob } from 'node-schedule';
import SlackRequestDto from '../dto/slack_request.dto';
import SlackResponseDto from '../dto/slack_response.dto';
import { Eod } from '../user/schemas/user.schema';
import UserService from '../user/user.service';

@Injectable()
export default class EodService {
  private readonly logger = new Logger(EodService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {
    // Archive all current EODs at midnight
    scheduleJob('0 0 0 * * *', () => this.archiveAllCurrentEods());
  }

  // Put into record the current EODs of all users
  private async archiveAllCurrentEods() {
    this.logger.log("Archiving all users' current EODs");

    const users = await this.userService.userModel
      .find({}, 'userId currentEod')
      .exec();

    const archivingPromise = users.map(async (user) => {
      const { username, currentEod } = user;

      if (currentEod) {
        await user
          .updateOne({
            $push: { eods: currentEod },
            currentEod: undefined,
          })
          .exec();

        this.logger.log(`Archived ${username}'s current EOD`);
      }
    });

    Promise.all(archivingPromise);
    this.logger.log("Archived all users' current EODs");
  }

  // If Slack command has content, submit EOD with that
  // content, else return the current EOD
  async getCurrentOrSubmitEod(slackRequestDto: SlackRequestDto) {
    const { user_id, user_name, text, response_url } = slackRequestDto.body;

    return text
      ? this.submitEod(response_url, user_id, user_name, text)
      : this.getCurrentEod(response_url, user_id, user_name);
  }

  private async getCurrentEod(
    slackResponseUrl: string,
    userId: string,
    username: string,
  ) {
    this.logger.log(`${username}'s getting current EOD`);

    const { currentEod } = await this.userService.userModel
      .findOneAndUpdate(
        { userId },
        { username },
        {
          new: true,
          upsert: true,
          fields: 'currentEod',
        },
      )
      .exec();

    const slackResponseDto: SlackResponseDto = {
      text: currentEod
        ? EodService.formatEod(userId, currentEod)
        : "You haven't submitted EOD for today yet",
    };

    this.httpService.post(slackResponseUrl, slackResponseDto).subscribe();
  }

  // Submit EOD; update if existing
  private async submitEod(
    slackResponseUrl: string,
    userId: string,
    username: string,
    text: string,
  ) {
    this.logger.log(`${username}'s submitting EOD`);

    const currentEod: Eod = {
      date: Math.floor(Date.now() / 1000),
      text,
    };

    await this.userService.userModel.updateOne(
      { userId },
      { username, currentEod },
      { upsert: true },
    );

    const slackResponseDto = {
      response_type: 'in_channel',
      text: EodService.formatEod(userId, currentEod),
    };

    this.httpService.post(slackResponseUrl, slackResponseDto).subscribe();
  }

  // Format EOD; return null if invalid syntax
  static formatEod(userId: string, eod: Eod) {
    const { text, date } = eod;
    const regex = /[^:\n]*(:[^:\n]+:)?[^\n]*\n?(.*)/s;

    const tokens = text.match(regex);
    const emoji = tokens?.[1] || EodService.DEFAULT_EMOJI;
    const tasks = `>${tokens?.[2]?.replace(/\n/g, '\n>')}`;

    const formattedDate = `<!date^${date}^{date_num}| >`;
    const header = `${emoji} EOD was submitted by <@${userId}> on ${formattedDate}`;
    const formattedText = `${header}\n${tasks}`;

    return formattedText;
  }

  static DEFAULT_EMOJI = ':checkered_flag:';
}
