import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Eod, EodSchemaDefinition } from './eod.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, index: { unique: true } })
  slackUserId!: string;

  @Prop({ type: String, required: true })
  slackUsername!: string;

  @Prop({ type: [EodSchemaDefinition], required: true, default: [] })
  eods!: Eod[];

  @Prop({ type: EodSchemaDefinition })
  currentEod?: Eod;
}

export const UserSchema = SchemaFactory.createForClass(User);
