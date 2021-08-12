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
      const removedList = line.replace(/^\s*[•-]\s*/, '');
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

  private async updateSlackPost(
    slackUserId: string,
    slackChannelId: string,
    eod: Eod,
  ) {
    this.logger.log(`Update EOD Slack post for user [${slackUserId}]`);

    // post EOD to Slack
    const eodText = SlackEodsService.formatEodToText(slackUserId, eod);
    let eodSlackPostTimestamp = '';
    try {
      const eodPosting = await this.slackService.web.chat.postMessage({
        channel: slackChannelId,
        text: eodText,
      });
      eodSlackPostTimestamp = eodPosting.ts || '';
    } catch {
      this.logger.warn(`Failed to post EOD to channel [${slackChannelId}]`);
      this.logger.warn(`Reply EOD directly instead`);
      return eodText;
    }

    // delete old EOD Slack post
    const oldEodSlackPost = await this.usersService.updateEodSlackPost(
      slackUserId,
      { channelId: slackChannelId, timestamp: eodSlackPostTimestamp },
    );
    if (oldEodSlackPost.timestamp) {
      await this.slackService.web.chat.delete({
        channel: oldEodSlackPost.channelId,
        ts: oldEodSlackPost.timestamp,
      });
    }

    return null;
  }

  async update({ text, user_id, user_name, channel_id }: SlackRequestDto) {
    this.logger.log(`Update EOD for user [${user_id}]`);

    const parsedEod = SlackEodsService.parseEodFromText(text);
    const eod = await this.usersService.updateEod(user_id, parsedEod, {
      slackUsername: user_name,
    });

    return this.updateSlackPost(user_id, channel_id, eod);
  }

  async pushTasks({ text, user_id, user_name, channel_id }: SlackRequestDto) {
    this.logger.log(`Push EOD tasks for user [${user_id}]`);

    const { tasks } = SlackEodsService.parseEodFromText(text);
    const eod = await this.usersService.pushEodTasks(user_id, tasks, {
      slackUsername: user_name,
    });

    return this.updateSlackPost(user_id, channel_id, eod);
  }

  async popTasks({ text, user_id, user_name, channel_id }: SlackRequestDto) {
    this.logger.log(`Pop EOD tasks for user [${user_id}]`);

    const numTasks = Number.parseInt(text, 10);
    if (!(numTasks > 0)) {
      return `Input should be a positive number`;
    }

    const eod = await this.usersService.popEodTasks(user_id, numTasks, {
      slackUsername: user_name,
    });

    return this.updateSlackPost(user_id, channel_id, eod);
  }
}
