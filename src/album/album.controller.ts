import { 
  Controller, Post, Body, Get, Param, Delete, UseGuards, NotFoundException 
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  // Ambil Semua Album
  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  // 👇 TAMBAHAN 1: Ambil Detail 1 Album (Buat halaman detail nanti)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) throw new NotFoundException('Album tidak ditemukan');
    return album;
  }

  // 👇 TAMBAHAN 2: Hapus Album (Trigger reset album_id di foto)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumService.remove(id);
  }
}