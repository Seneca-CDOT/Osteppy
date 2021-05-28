import { Injectable, Logger } from '@nestjs/common';
import { createSlackResponseDto } from '../dto/create_slack_response_dto';
import SlackRequestDto from '../dto/slack_request.dto';
import { CurrentEod, Eod } from '../user/schemas/user.schema';
import UserService from '../user/user.service';

@Injectable()
export default class EodService {
  private readonly logger = new Logger(EodService.name);

  constructor(private readonly userService: UserService) {}

  async getCurrentOrSubmit(slackRequestDto: SlackRequestDto) {
    const { user_id, user_name, text, response_url } = slackRequestDto.body;

    return text
      ? this.submit(user_id, user_name, text, response_url)
      : this.getCurrent(user_id, user_name);
  }

  private async getCurrent(userId: string, username: string) {
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

    return createSlackResponseDto(
      currentEod
        ? EodService.format(username, currentEod)
        : "You haven't submitted EOD for today yet",
    );
  }

  // Submit EOD; update if existing
  private async submit(
    userId: string,
    username: string,
    eodText: string,
    slackResponseUrl: string,
  ) {
    this.logger.log(`${username}'s submitting EOD`);

    const currentEod: CurrentEod = {
      date: new Date().getTime(),
      text: eodText,
      slackResponseUrl,
    };

    await this.userService.userModel.updateOne(
      { userId },
      { username, currentEod },
      { upsert: true },
    );

    // TODO: remove old message using slack response_url

    return createSlackResponseDto(EodService.format(username, currentEod));
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
