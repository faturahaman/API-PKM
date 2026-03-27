import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - allow multiple origins from environment
  const defaultOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://pkm-bogor-tengah.localhost:3000',
    'http://pkm-bogor-utara.localhost:3000',
    'http://pkm-bogor-selatan.localhost:3000'
  ];

  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : process.env.NODE_ENV === 'production'
      ? []
      : defaultOrigins;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      const isLocalhostSubdomain = origin.endsWith('.localhost:3000')

      if (allowedOrigins.includes(origin) || isLocalhostSubdomain) {
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

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    xFrameOptions: false,
    contentSecurityPolicy: false,
  }));

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // Global Transform Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('PKM API Documentation')
    .setDescription(`
    ## API Documentation for PKM (Puskesmas) System
    
    This API provides endpoints for managing:
    - Admin management (authentication, authorization)
    - Puskesmas (health center) management
    - Content management (pages, articles, banners, galleries, videos, albums)
    - User interactions (consultations, reviews, visitor tracking)
    - Kritik & saran (feedback)
    - Activity logging
    
    ## Authentication
    Most endpoints require JWT authentication. Use the login endpoint to get a token,
    then include it in the Authorization header: 'Authorization: Bearer <token>'
    
    ## Rate Limiting
    The API implements rate limiting to prevent abuse:
    - Short-term: 10 requests per second
    - Medium-term: 100 requests per minute
    - Long-term: 1000 requests per hour
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Health Check', 'Server health and status endpoints')
    .addTag('Authentication', 'Login and token management')
    .addTag('Admin Management', 'Admin user management (Super Admin only)')
    .addTag('Puskesmas Management', 'Puskesmas CRUD operations')
    .addTag('Admin Album', 'Album management (Admin)')
    .addTag('Public Album', 'Public album access')
    .addTag('Admin Banner', 'Banner management (Admin)')
    .addTag('Public Banner', 'Public banner access')
    .addTag('Admin Video', 'Video management (Admin)')
    .addTag('Public Video', 'Public video access')
    .addTag('Admin Gallery', 'Gallery management (Admin)')
    .addTag('Public Gallery', 'Public gallery access')
    .addTag('Admin Consultation', 'Consultation management (Admin)')
    .addTag('Public Consultation', 'Public consultation submission')
    .addTag('Admin Menu', 'Navigation menu management (Admin)')
    .addTag('Public Menu', 'Public menu access')
    .addTag('Admin Pages', 'Page management (Admin)')
    .addTag('Public Pages', 'Public page access')
    .addTag('Admin Static Pages', 'Static page management (Admin)')
    .addTag('Public Static Pages', 'Public static page access')
    .addTag('Admin Reviews', 'Review management (Admin)')
    .addTag('Public Reviews', 'Public review submission')
    .addTag('Criticism & Suggestions', 'Kritik dan saran endpoints')
    .addTag('Activity Logs', 'System activity logging')
    .addTag('Email', 'Email sending functionality')
    .addTag('Admin Puskesmas Info', 'Puskesmas information management')
    .addTag('Public Puskesmas Info', 'Public puskesmas information')
    .addTag('Admin Agenda', 'Agenda/Event management (Admin)')
    .addTag('Public Agenda', 'Public agenda/event access')
    .addTag('Visitor Tracking', 'Visitor tracking and analytics')
    .addTag('Test', 'Test endpoints')
    .addTag('Storage & Files', 'Secure file storage and retrieval')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { font-size: 2.5em; }
    `,
  });

  await app.listen(process.env.PORT || 3002);
}
bootstrap();
