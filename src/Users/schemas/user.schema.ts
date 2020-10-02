import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  userId = '';

  @Prop()
  userName = '';

  @Prop()
  eods: string[] = [];

  @Prop()
  eodStatus = true;
}

export const UserSchema = SchemaFactory.createForClass(User);
