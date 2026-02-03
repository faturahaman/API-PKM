import { 
  Controller, Get, Post, Body, Param, Delete, Put, Query, 
  UseGuards, UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { multerOptions } from 'src/common/multer.config'; // Pastikan path ini sesuai config multer kamu

@Controller('admin/news') // Prefix URL
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @UploadedFile() file: Express.Multer.File, 
    @Body() createNewsDto: CreateNewsDto
  ) {
    if (!file) throw new BadRequestException('Cover berita (image) wajib diupload!');
    
    const imagePath = `/uploads/news/${file.filename}`;
    return this.newsService.create(createNewsDto, imagePath);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    return this.newsService.findAll(p, l, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @Param('id') id: string, 
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    // Jika file ada, update path. Jika null, biarkan logic service yang handle (pakai gambar lama)
    const imagePath = file ? `/uploads/news/${file.filename}` : undefined;
    return this.newsService.update(id, updateNewsDto, imagePath);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}