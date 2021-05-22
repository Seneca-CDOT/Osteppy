import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ type: String, unique: true, index: true })
  userId = '';

  @Prop()
  userName = '';

  @Prop()
  eods: Array<{
    date: string;
    text: string;
    slackResponseUrl: string;
  }> = [];

  @Prop()
  eodStatus = true;
}

export const UserSchema = SchemaFactory.createForClass(User);
