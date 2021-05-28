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
    scheduleJob('0 0 0 * * *', () => this.archiveAllCurrent());
  }

  // Put into record the current EODs of all users
  private async archiveAllCurrent() {
    this.logger.log("Archiving all users' current EODs");

    const users = await this.userService.userModel
      .find({}, 'userId currentEod')
      .exec();

    const archiveCurrentsPromises = users.map(async (user) => {
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

    Promise.all(archiveCurrentsPromises);
    this.logger.log("Archived all users' current EODs");
  }

  async getCurrentOrSubmit(slackRequestDto: SlackRequestDto) {
    const { user_id, user_name, text, response_url } = slackRequestDto.body;

    return text
      ? this.submit(response_url, user_id, user_name, text)
      : this.getCurrent(response_url, user_id, user_name);
  }

  private async getCurrent(
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
        ? EodService.format(username, currentEod)
        : "You haven't submitted EOD for today yet",
    };

    this.httpService.post(slackResponseUrl, slackResponseDto).subscribe();
  }

  // Submit EOD; update if existing
  private async submit(
    slackResponseUrl: string,
    userId: string,
    username: string,
    eodText: string,
  ) {
    this.logger.log(`${username}'s submitting EOD`);

    const currentEod: Eod = {
      date: new Date().getTime(),
      text: eodText,
    };

    await this.userService.userModel.updateOne(
      { userId },
      { username, currentEod },
      { upsert: true },
    );

    const slackResponseDto: SlackResponseDto = {
      response_type: 'in_channel',
      text: EodService.format(username, currentEod),
    };

    this.httpService.post(slackResponseUrl, slackResponseDto).subscribe();
  }

  static format(username: string, eod: Eod) {
    const { text } = eod;

    // This match will always not be null
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [, ,] = text.match(/([^\n]*)\n?([^\n]*)/)!;

    // TODO: apply formatting
    return text;
  }
}
