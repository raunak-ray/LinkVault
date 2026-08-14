import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger("main");

  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 5050;
  
  await app.listen(PORT);
  logger.log(`Server started on: http://localhost:${PORT}/`)
}
bootstrap();
