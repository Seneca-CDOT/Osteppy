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
      .find({}, 'userId username currentEod')
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

    await Promise.all(archivingPromise);
    this.logger.log("Archived all users' current EODs");
  }

  // If Slack command has content, submit EOD with that
  // content, else return the current EOD
  async getCurrentOrSubmitEod(slackRequestDto: SlackRequestDto) {
    const { user_id, user_name, text, response_url } = slackRequestDto.body;

    let slackResponseDto: SlackResponseDto;

    if (text === 'help') {
      slackResponseDto = {
        text: EodService.CMD_HELP_GET_CURRENT_OR_SUBMIT_EOD,
      };
    } else if (text) {
      slackResponseDto = await this.submitEod(user_id, user_name, text);
    } else {
      slackResponseDto = await this.getCurrentEod(user_id, user_name);
    }

    this.httpService.post(response_url, slackResponseDto).subscribe();
  }

  private async getCurrentEod(
    userId: string,
    username: string,
  ): Promise<SlackResponseDto> {
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

    return {
      text: currentEod
        ? EodService.formatEod(userId, currentEod)
        : "You haven't submitted EOD for today yet",
    };
  }

  // Submit EOD; update if existing
  private async submitEod(
    userId: string,
    username: string,
    text: string,
  ): Promise<SlackResponseDto> {
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

    return {
      response_type: 'in_channel',
      text: EodService.formatEod(userId, currentEod),
    };
  }

  static formatEod(userId: string, eod: Eod) {
    const { text, date } = eod;

    const regex = /[^:]*(:[^\s]*:)?(.*)/s;

    const tokens = text.match(regex);
    const emoji = tokens?.[1] || EodService.DEFAULT_EMOJI;
    const tasks = tokens?.[1] ? tokens[2] : tokens?.[0];

    const formattedTasks = `>${tasks?.trim()?.replace(/\n/g, '\n>')}`;
    const formattedDate = `<!date^${date}^{date_num}| >`;
    const header = `${emoji} EOD was submitted by <@${userId}> on ${formattedDate}`;
    const formattedText = `${header}\n${formattedTasks}`;

    return formattedText;
  }

  static DEFAULT_EMOJI = ':clock5:';

  static CMD_HELP_GET_CURRENT_OR_SUBMIT_EOD = `\`\`\`
# Print today EOD
  /eod
  
# Submit/update today EOD
  /eod :emoji: (optional)
  - task1
  - task2
  - task3\`\`\``;
}
