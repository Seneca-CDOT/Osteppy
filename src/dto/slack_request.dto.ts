import SlackRequestBodyDto from './slack_request_body.dto';

export default class SlackRequestDto {
  constructor(
    public headers: {
      'x-slack-request-timestamp': string;
      'x-slack-signature': string;
    },
    public rawBody: string,
    public body: SlackRequestBodyDto,
  ) {}
}
