import { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import ServiceSchemaDefinition from './service.schema';
import Service from '../system_services';

export type DomainDocument = Domain & Document;

@Schema()
export class Domain {
  @Prop({ type: String, index: { unique: true } })
  domain!: string;

  @Prop(raw([ServiceSchemaDefinition]))
  services!: Service[];
}

export const DomainSchema = SchemaFactory.createForClass(Domain);
