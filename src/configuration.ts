import * as dotenv from 'dotenv';

dotenv.config();

const { env } = process;

export const NODE_ENV = env.NODE_ENV || '';

export const PORT = env.PORT || 3000;

export const MONGO = {
  HOST: env.MONGO_HOST || 'localhost',
  USER: env.MONGO_USER,
  PASS: env.MONGO_PASS,
} as const;

export const SLACK = {
  SIGNING_SECRET: env.SLACK_SIGNING_SECRET || '',
  BOT_USER_TOKEN: env.SLACK_BOT_USER_TOKEN || '',
  PORT_CHECKER_CHANNEL: env.PORT_CHECKER_CHANNEL || 'C023BLCKARG',
} as const;
