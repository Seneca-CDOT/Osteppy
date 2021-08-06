import { SchemaDefinition } from 'mongoose';

export type Eod = {
  date: number;
  tasks: string[];
  slackEmoji?: string;
};

export const EodSchemaDefinition: SchemaDefinition = {
  date: { type: Number, required: true },
  tasks: { type: [String], required: true },
  slackEmoji: { type: String },
};
