import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { PORT } from './configuration';
import UsersEodsService from './users/users_eods.service';
import SystemService from './system/system.service';

const logger = new Logger('main.ts');
let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.get(UsersEodsService).scheduleArchivingEods();
  app.get(SystemService).schedulePortWatching();

  await app.listen(PORT);
  logger.log(`Listening on port [${PORT}]`);
}
bootstrap();

export default () => app;
