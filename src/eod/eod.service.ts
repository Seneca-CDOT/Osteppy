import { Injectable, Logger } from '@nestjs/common';
import { scheduleJob } from 'node-schedule';
import SlackRequestDto from '../dto/slack_request.dto';
import SlackService from '../slack/slack.service';
import { Eod } from '../user/schemas/user.schema';
import UserService from '../user/user.service';

@Injectable()
export default class EodService {
  private readonly logger = new Logger(EodService.name);

  constructor(
    private readonly slackService: SlackService,
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

  // Get info of or submit/update the current EOD of the day
  async getCurrentOrSubmitEod(slackRequestDto: SlackRequestDto) {
    const { user_id, user_name, text, channel_id } = slackRequestDto.body;

    if (text === 'help') {
      this.slackService.web.chat.postEphemeral({
        user: user_id,
        channel: channel_id,
        text: EodService.CMD_HELP_GET_CURRENT_OR_SUBMIT_EOD,
      });
    } else if (text) {
      this.submitEod(user_id, user_name, channel_id, text);
    } else {
      this.getCurrentEod(user_id, user_name, channel_id);
    }
  }

  private async getCurrentEod(
    userId: string,
    username: string,
    channelId: string,
  ) {
    this.logger.log(`${username}'s getting current EOD`);

    // Get current EOD from database; create new user if not exist
    const { currentEod } = await this.userService.userModel
      .findOneAndUpdate(
        { userId },
        { username },
        { new: true, upsert: true, fields: 'currentEod' },
      )
      .exec();

    // Post private EOD message to Slack
    this.slackService.web.chat.postEphemeral({
      user: userId,
      channel: channelId,
      text: currentEod
        ? EodService.formatEod(userId, currentEod)
        : "You haven't submitted EOD for today yet",
    });
  }

  // Submit EOD; update if existing
  private async submitEod(
    userId: string,
    username: string,
    channelId: string,
    text: string,
  ) {
    this.logger.log(`${username}'s submitting EOD`);

    const currentEod: Eod = {
      date: Math.floor(Date.now() / 1000),
      text,
    };

    // Post EOD message to Slack
    const { ts: timestamp } = await this.slackService.web.chat.postMessage({
      channel: channelId,
      text: EodService.formatEod(userId, currentEod),
    });

    // If EOD message is sucessfully posted, store it for later deletion
    if (timestamp) {
      currentEod.message = { channelId, timestamp };
    }

    // Create/update user database with new current EOD
    const oldUser = await this.userService.userModel
      .findOneAndUpdate(
        { userId },
        { username, currentEod },
        { upsert: true, fields: 'currentEod' },
      )
      .exec();

    // Delete old EOD message if exists
    const oldEodMessage = oldUser?.currentEod?.message;
    if (oldEodMessage) {
      this.slackService.web.chat.delete({
        channel: oldEodMessage.channelId,
        ts: oldEodMessage.timestamp,
      });
    }
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
