import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumService } from './album.service';
import { AlbumAdminController } from './album.admin.controller'; // Import baru
import { AlbumPublicController } from './album.public.controller'; // Import baru
import { Album, AlbumSchema } from './schemas/album.schema';
import { GalleryModule } from '../gallery/gallery.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    GalleryModule, // Import GalleryModule untuk akses GalleryService
  ],
  controllers: [AlbumAdminController, AlbumPublicController], // Register keduanya
  providers: [AlbumService],
})
export class AlbumModule { }