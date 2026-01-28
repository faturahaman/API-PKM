import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Album, AlbumSchema } from './schemas/album.schema';
import { GalleryModule } from 'src/gallery/gallery.module'; // 👈 Import ini

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    GalleryModule, // 👈 Masukkan disini supaya AlbumService bisa pake GalleryService
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}