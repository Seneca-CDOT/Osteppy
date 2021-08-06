import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { PORT } from './configuration';

let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();

export default () => app;
