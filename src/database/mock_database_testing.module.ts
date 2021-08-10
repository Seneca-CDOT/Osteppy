/* eslint-disable import/no-extraneous-dependencies */
import { Abstract, ModuleMetadata } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { DATABASE_OPTIONS } from './database.module';

export class MockDatabaseTestingModule {
  constructor(
    private mongod: MongoMemoryServer,
    private testingModule: TestingModule,
  ) {}

  async stop() {
    const connection = this.testingModule.get<Connection>(getConnectionToken());
    await connection.close();
    await this.mongod.stop();
  }

  get<T>(params: Abstract<T>) {
    return this.testingModule.get<T>(params);
  }
}

export const createMockDatabaseTestingModule = async (
  imports: ModuleMetadata['imports'],
) => {
  const mongod = await MongoMemoryServer.create();
  const testingModule = await Test.createTestingModule({
    imports: [
      MongooseModule.forRoot(mongod.getUri(), DATABASE_OPTIONS),
      ...(imports ?? []),
    ],
  }).compile();

  return new MockDatabaseTestingModule(mongod, testingModule);
};
