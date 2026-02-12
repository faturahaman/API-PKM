import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });


  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Enable class-transformer decorators
    whitelist: true, // Strip properties not defined in DTO
    forbidNonWhitelisted: true, // Throw error on unknown properties
  }));

  await app.listen(process.env.PORT || 3002);
}
bootstrap();
