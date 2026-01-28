import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { Gallery, GallerySchema } from './schemas/gallery.schema';
import { Album, AlbumSchema } from '../album/schemas/album.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gallery.name, schema: GallerySchema },
      { name: Album.name, schema: AlbumSchema },
    ]),
  ],
  controllers: [GalleryController],
  providers: [GalleryService],

  exports: [GalleryService],
})
export class GalleryModule {}