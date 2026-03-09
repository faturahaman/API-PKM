import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryService } from './gallery.service';
import { GalleryAdminController } from './gallery.admin.controller';
import { GalleryPublicController } from './gallery.public.controller';
import { Gallery } from './entity/gallery.entity';
import { Album } from '../album/entity/album.entity';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gallery, Album]),
    LogactivityModule,
  ],
  controllers: [GalleryAdminController, GalleryPublicController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule { }