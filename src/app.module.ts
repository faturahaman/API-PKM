import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { ConfigModule } from '@nestjs/config';
import { GalleryModule } from './gallery/gallery.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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

@Module({
  imports: [
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
        synchronize: true,
        dropSchema: false,
      }),
    }),
    AdminsModule,
    AuthModule,
    GalleryModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
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
      isGlobal: true, // <-- Wajib biar gak usah import CacheModule di tiap module
      ttl: 60000, // <-- NestJS Cache v2 ke atas pakai Milliseconds (60000 ms = 1 menit)
      max: 100,
    }),
  ],
  controllers: [AppController, UploadAdminController],
  providers: [AppService],
})
export class AppModule { }