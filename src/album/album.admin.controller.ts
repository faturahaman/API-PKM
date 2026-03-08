import {
  Controller, Post, Body, Get, Param, Delete, UseGuards, NotFoundException, Query, Patch
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) // Guard level clas  
@Controller('admin/album')   // Endpoint: /api/v1/admin/album
export class AlbumAdminController {
  constructor(private readonly albumService: AlbumService) { }

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('status') status: string,
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    // forward search and status (status is currently unused) to service
    return this.albumService.findAll(p, l, search || '', status || 'all');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) throw new NotFoundException('Album tidak ditemukan');
    return album;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    // Idealnya ganti 'any' dengan UpdateAlbumDto
    return this.albumService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumService.remove(id);
  }
}