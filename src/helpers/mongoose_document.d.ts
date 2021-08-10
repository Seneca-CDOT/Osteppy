import { Document } from 'mongoose';

export type MongooseDocument<T> = T &
  Omit<Document, 'toObject'> & {
    toObject(): T;
  };
