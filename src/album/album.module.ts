import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumService } from './album.service';
import { AlbumAdminController } from './album.admin.controller';
import { AlbumPublicController } from './album.public.controller';
import { Album } from './entity/album.entity';
import { GalleryModule } from '../gallery/gallery.module';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    GalleryModule,
    LogactivityModule,
  ],
  controllers: [AlbumAdminController, AlbumPublicController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule { }