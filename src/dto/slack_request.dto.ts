import type { Request } from 'express';

export default class SlackRequestDto {
  constructor(
    public headers: {
      'x-slack-request-timestamp': string;
      'x-slack-signature': string;
    },
    public body: {
      text: string;
      user_id: string;
      user_name: string;
      team_id: string;
      response_url: string;
    },
    // Express Request properties
    public originalUrl: Request['originalUrl'],
  ) {}
}
