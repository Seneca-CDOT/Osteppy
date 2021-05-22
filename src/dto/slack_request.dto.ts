export default class SlackRequestDto {
  constructor(
    public headers: {
      'x-slack-request-timestamp': string;
      'x-slack-signature': string;
    },
    public rawBody: string,
    public body: {
      text: string;
      user_id: string;
      use_name: string;
      team_id: string;
    },
  ) {}
}
