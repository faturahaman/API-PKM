import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-album')
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    return this.albumService.findAll(p, l);
  }
}