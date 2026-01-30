import {
  Controller, Post, Body, Get, Param, Delete, UseGuards, NotFoundException, Query, Put
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) { }

  // ✅ SEBELUMNYA: @Post('create-album') -> SEKARANG: @Post()
  @UseGuards(AuthGuard('jwt'))
  @Post() 
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) throw new NotFoundException('Album tidak ditemukan');
    return album;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.albumService.update(id, updateData);
  }
}