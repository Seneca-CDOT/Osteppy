import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Eod = {
  date: number;
  text: string;
};

@Schema()
export class User extends Document {
  @Prop({ type: String, unique: true, index: true })
  userId = '';

  @Prop()
  username = '';

  @Prop()
  eods: Eod[] = [];

  @Prop()
  currentEod?: Eod;

  @Prop()
  eodStatus = true;
}

export const UserSchema = SchemaFactory.createForClass(User);
