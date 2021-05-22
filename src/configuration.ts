import * as dotenv from 'dotenv';

dotenv.config();

const { env } = process;

export const PORT = env.PORT || 3000;

export const MONGO = {
  HOST: env.MONGO_HOST || 'localhost',
  USER: env.MONGO_USER || 'admin',
  PASS: env.MONGO_PASS || 'admin',
} as const;

export const SLACK = {
  SIGNING_SECRET: env.SLACK_SIGNING_SECRET || '',
  TEAM_ID: env.SLACK_TEAM_ID || '',
} as const;
