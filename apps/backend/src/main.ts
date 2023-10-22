import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.BACKEND_INTERNAL_PORT || 5000;
  await app.listen(port);
  Logger.log(`Backend is listening on http://localhost:${port}`);
}
bootstrap();
