import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - allow multiple origins from environment
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : process.env.NODE_ENV === 'production'
<<<<<<< HEAD
      ? []  // Block in production if not configured
      : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://pkm-bogor-tengah.localhost:3000', 'http://pkm-bogor-utara.localhost:3000', 'http://pkm-bogor-selatan.localhost:3000'];
=======
      ? ['http://localhost:3000']  // Fallback ke localhost di production (harus di-override)
      : ['http://localhost:3000', 'http://127.0.0.1:3000'];
>>>>>>> cafcb402ff2cde802e013ed8809868a228e4af88

  app.enableCors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    const allowed = [
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ]

    const isLocalhostSubdomain = origin.endsWith('.localhost:3000')

    if (allowed.includes(origin) || isLocalhostSubdomain) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
})

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

