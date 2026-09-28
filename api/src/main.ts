import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 5050;

  app.use(cookieParser());

  // Behind Render (or any proxy) Express must trust the proxy for
  // `Secure` cookies to work correctly over TLS-terminated connections.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin:
      process.env.CORS_ORIGIN?.split(',')
        .map((o) => o.trim().replace(/\/+$/, ''))
        .filter(Boolean) ?? ['http://localhost:3000'],
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  });

  app.enableShutdownHooks();

  await app.listen(PORT);
  logger.log(`API started on: http://localhost:${PORT}/`);
}
void bootstrap();
