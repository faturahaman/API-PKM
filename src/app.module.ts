import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { ConfigModule } from '@nestjs/config';
import { GalleryModule } from './gallery/gallery.module';
import { AlbumModule } from './album/album.module';
import { BannerModule } from './banner/banner.module';
import { VideoModule } from './video/video.module';
import { AgendaModule } from './agenda/agenda.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ConsultationModule } from './consultation/consultation.module';
import { VisitorModule } from './visitor/visitor.module';
import { MenusModule } from './menus/menus.module';
import { PagesModule } from './pages/pages.module';
import { StaticPagesModule } from './static-pages/static-pages.module';
import { PuskesmasInfoModule } from './puskesmas-info/puskesmas-info.module';
import { UploadAdminController } from './upload/upload.controller';
import { EmailModule } from './email/email.module';
import { RecaptchaModule } from './common/recaptcha/recaptcha.module';
import { LogactivityModule } from './logactivity/logactivity.module';
import { PuskesmasModule } from './puskesmas/puskesmas.module';
import { TenantModule } from './common/tenant/tenant.module';
import { StorageModule } from './common/storage/storage.module';
import { KritikSaranModule } from './kritik-saran/kritik-saran.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    // Serve static files from public folder - untuk akses gambar langsung
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/', // Serve di root URL
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: parseInt(process.env.THROTTLER_SHORT_TTL || '1000'),
        limit: parseInt(process.env.THROTTLER_SHORT_LIMIT || '10'),
      },
      {
        name: 'medium',
        ttl: parseInt(process.env.THROTTLER_MEDIUM_TTL || '60000'),
        limit: parseInt(process.env.THROTTLER_MEDIUM_LIMIT || '100'),
      },
      {
        name: 'long',
        ttl: parseInt(process.env.THROTTLER_LONG_TTL || '3600000'),
        limit: parseInt(process.env.THROTTLER_LONG_LIMIT || '1000'),
      },
    ]),
    RecaptchaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production',
        dropSchema: false, // Waspada jangan asal ubah jadi true, data bisa hilang
      }),
    }),
    AdminsModule,
    AuthModule,
    GalleryModule,
    AlbumModule,
    BannerModule,
    VideoModule,
    AgendaModule,
    ReviewsModule,
    ConsultationModule,
    VisitorModule,
    MenusModule,
    PagesModule,
    StaticPagesModule,
    PuskesmasInfoModule,
    EmailModule,
    LogactivityModule,
    PuskesmasModule,
    TenantModule,
    StorageModule,
    KritikSaranModule,
    CacheModule.register({
      isGlobal: true,
      ttl: parseInt(process.env.CACHE_TTL || '60000'),
      max: parseInt(process.env.CACHE_MAX || '100'),
    }),
    TestModule,
  ],
  controllers: [AppController, UploadAdminController],
  providers: [AppService],
})
export class AppModule { }