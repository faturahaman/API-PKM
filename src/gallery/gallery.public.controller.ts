import {
  Controller, Get, Param, Query
} from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryPublicController {
  constructor(private readonly galleryService: GalleryService) { }

  // PUBLIC
  @Get()
  findAllPublic(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('no_album') noAlbum: string,
    @Query('album_id') albumId: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 12;
    const isNoAlbum = noAlbum === 'true';

    return this.galleryService.findAll(p, l, isNoAlbum, albumId);
  }

  @Get(':id')
  findOnePublic(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }
}