import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumService } from './album.service';
import { AlbumAdminController } from './album.admin.controller';
import { AlbumPublicController } from './album.public.controller';
import { Album } from './entity/album.entity';
import { GalleryModule } from '../gallery/gallery.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    GalleryModule,
  ],
  controllers: [AlbumAdminController, AlbumPublicController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule { }