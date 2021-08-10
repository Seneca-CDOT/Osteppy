import { SchemaDefinition } from 'mongoose';

export type EodSlackPost = {
  channelId: string;
  timestamp: string;
};

export const EodSlackPostSchemaDefinition: SchemaDefinition = {
  channelId: { type: String, default: '' },
  timestamp: { type: String, default: '' },
};
