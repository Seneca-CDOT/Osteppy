import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { PORT } from './configuration';

const logger = new Logger('main.ts');
let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);

  await app.listen(PORT);
  logger.log(`Listening on port [${PORT}]`);
}
bootstrap();

export default () => app;
