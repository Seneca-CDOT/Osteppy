import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MONGO } from '../configuration';

export const DATABASE_OPTIONS: MongooseModuleOptions = {
  useFindAndModify: false,
  useCreateIndex: true,
} as const;

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${MONGO.HOST}`, {
      dbName: 'osteppy',
      user: MONGO.USER,
      pass: MONGO.PASS,
      ...DATABASE_OPTIONS,
    }),
  ],
})
export class DatabaseModule {}
