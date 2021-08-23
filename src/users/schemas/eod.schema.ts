import { SchemaDefinition } from 'mongoose';

export type Eod = {
  date: Date;
  tasks: string[];
  slackEmoji: string;
};

export const EodSchemaDefinition: SchemaDefinition = {
  date: { type: Date, default: new Date(0) },
  tasks: [String],
  slackEmoji: { type: String, default: '' },
};
