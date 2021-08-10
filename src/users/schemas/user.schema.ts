import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongooseDocument } from '../../helpers/mongoose_document';
import { Eod, EodSchemaDefinition } from './eod.schema';
import {
  EodSlackPost,
  EodSlackPostSchemaDefinition,
} from './eod_slack_post.schema';

export type UserDocument = MongooseDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, index: { unique: true } })
  slackUserId!: string;

  @Prop({ type: String, default: '' })
  slackUsername!: string;

  @Prop(raw([EodSchemaDefinition]))
  eods!: Eod[];

  @Prop(raw(EodSchemaDefinition))
  eod!: Eod;

  @Prop(raw(EodSlackPostSchemaDefinition))
  eodSlackPost!: EodSlackPost;
}

export const UserSchema = SchemaFactory.createForClass(User);
