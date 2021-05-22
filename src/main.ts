import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import AuthenticationGuard from './authentication.guard';
import { PORT } from './configuration';

let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new AuthenticationGuard());
  await app.listen(PORT);
}
bootstrap();

export default () => app;
