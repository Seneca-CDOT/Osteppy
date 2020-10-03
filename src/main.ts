import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT || 3000);
}
bootstrap();
