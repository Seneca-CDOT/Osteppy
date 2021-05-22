import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import AuthenticationGuard from './authentication.guard';

const { PORT } = process.env;
let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    bodyParser: false, // disabled to use custom body parser
  });
  app.useGlobalGuards(new AuthenticationGuard());
  await app.listen(PORT || 3000);
}
bootstrap();

export default () => app;
