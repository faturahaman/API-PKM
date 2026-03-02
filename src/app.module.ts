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
import { LogactivityModule } from './logactivity/logactivity.module';

@Module({
  imports: [
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
  ],
  controllers: [AppController, UploadAdminController],
  providers: [AppService],
})
export class AppModule { }