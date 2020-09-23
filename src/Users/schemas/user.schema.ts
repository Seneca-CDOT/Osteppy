import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  user_id = '';

  @Prop()
  user_name = '';

  @Prop()
  eods: string[] = [];

  @Prop()
  eod_status = true;
}

export const UserSchema = SchemaFactory.createForClass(User);
