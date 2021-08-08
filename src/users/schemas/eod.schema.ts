import { SchemaDefinition } from 'mongoose';

export type Eod = {
  date: Date;
  tasks: string[];
  slackEmoji: string;
};

export const EodSchemaDefinition: SchemaDefinition = {
  date: { type: Date },
  tasks: { type: [String] },
  slackEmoji: { type: String },
};
