import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { ConfigModule } from '@nestjs/config';
import { GalleryModule } from './gallery/gallery.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AlbumModule } from './album/album.module';
import { BannerModule } from './banner/banner.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/pkm-api'),
    AdminsModule,
    AuthModule,
    GalleryModule,
    
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'), 
    }),
    
    AlbumModule,
    
    BannerModule,
    
    VideoModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }