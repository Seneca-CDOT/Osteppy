import { SchemaDefinition } from 'mongoose';

const ServiceSchemaDefinition: SchemaDefinition = {
  port: { type: Number, default: 0 },
  service: { type: String, default: '' },
};

export default ServiceSchemaDefinition;
