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
    GalleryModule // If circular dependency exists, use forwardRef
  ],
  controllers: [AlbumAdminController, AlbumPublicController],
  providers: [AlbumService],
  exports: [TypeOrmModule], // Export TypeOrmModule so other modules can use repository
})
export class AlbumModule { }