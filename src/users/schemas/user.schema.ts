import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Eod, EodSchemaDefinition } from './eod.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, index: { unique: true } })
  slackUserId!: string;

  @Prop({ type: String, default: '' })
  slackUsername!: string;

  @Prop({ type: [EodSchemaDefinition], default: [] })
  eods!: Eod[];

  @Prop({ type: EodSchemaDefinition, default: null })
  eod!: Eod | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
