import { Injectable, Logger } from '@nestjs/common';
import { Eod } from '../users/schemas/eod.schema';
import UsersService from '../users/users.service';
import SlackService from './slack.service';
import SlackRequestDto from './slack_request.dts';

@Injectable()
export default class SlackEodsService {
  static parseEodFromText(text: string) {
    const lines: string[] = [];

    text.split('\n').forEach((line) => {
      const removedList = line.replace(/^\s*• /, '');
      const trimmed = removedList.trim();
      if (trimmed) lines.push(trimmed);
    });

    const slackEmoji = lines[0]?.match(/^:[\w-]+:$/)?.[0];
    if (slackEmoji) lines.shift();
    const tasks = lines.length ? lines : undefined;

    return { tasks, slackEmoji };
  }

  static formatEodToText(slackUserId: string, eod: Eod) {
    const slackEmoji = eod.slackEmoji || ':clock5:';
    const unixTimestamp = Math.floor(eod.date.getTime() / 1000);
    const dateCommand = `<!date^${unixTimestamp}^{date_num}| >`;

    const header = `${slackEmoji} EOD was submitted by <@${slackUserId}> on ${dateCommand}`;
    const listedTasks = eod.tasks.map((task) => `>• ${task}`).join('\n');
    const formattedText = `${header}\n${listedTasks || `>No tasks added yet`}`;

    return formattedText;
  }

  private logger = new Logger(SlackEodsService.name);

  constructor(
    private slackService: SlackService,
    private usersService: UsersService,
  ) {}

  async update({ text, user_id, user_name, channel_id }: SlackRequestDto) {
    this.logger.log(`Update EOD for user [${user_id}]`);

    const parsedEodText = SlackEodsService.parseEodFromText(text);
    const eod = await this.usersService.updateEod(user_id, parsedEodText, {
      slackUsername: user_name,
    });

    // post EOD to Slack
    const eodText = SlackEodsService.formatEodToText(user_id, eod);
    const eodPosting = await this.slackService.web.chat.postMessage({
      channel: channel_id,
      text: eodText,
    });
    if (!eodPosting.ts) {
      this.logger.error(`Failed to post Eod to Slack for user [${user_id}]`);
      return;
    }

    // delete old EOD Slack post
    const oldEodSlackPost = await this.usersService.updateEodSlackPost(
      user_id,
      { channelId: channel_id, timestamp: eodPosting.ts },
    );
    if (oldEodSlackPost.timestamp) {
      await this.slackService.web.chat.delete({
        channel: oldEodSlackPost.channelId,
        ts: oldEodSlackPost.timestamp,
      });
    }
  }
}
