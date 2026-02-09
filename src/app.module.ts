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
import { NewsModule } from './news/news.module';

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
        synchronize: true, // TODO: false di production
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

    NewsModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }