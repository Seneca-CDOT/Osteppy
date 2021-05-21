/* eslint-disable camelcase */
import type { Request } from 'express';

export type CommandRequest = Request & {
  headers: Request['headers'] & {
    'x-slack-request-timestamp': string;
    'x-slack-signature': string;
  };
  body: {
    team_id: string;
  };
  rawBody: string;
};
