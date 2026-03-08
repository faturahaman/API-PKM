import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      /^http:\/\/.*\.localhost:3000$/,  // Allow all subdomains on localhost
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });


  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));


  await app.listen(process.env.PORT || 3002);
}
bootstrap();

