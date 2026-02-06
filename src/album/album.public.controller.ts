import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { AlbumService } from './album.service';

@Controller('album')
export class AlbumPublicController {
  constructor(private readonly albumService: AlbumService) { }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    return this.albumService.findAll(p, l);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) throw new NotFoundException('Album tidak ditemukan');
    return album;
  }
}