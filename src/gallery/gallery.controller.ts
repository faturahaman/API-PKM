import { 
  Controller, Get, Post, Body, Param, Put, 
  UseInterceptors, UploadedFile, BadRequestException, 
  UseGuards,
  Delete
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from 'src/gallery/dto/create-gallery.dto';
import { multerOptions } from 'src/common/multer.config';

@Controller('admin/gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @UseGuards(AuthGuard('jwt')) 
  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(@UploadedFile() file: Express.Multer.File, @Body() createGalleryDto: CreateGalleryDto) {
    if (!file) throw new BadRequestException('File gambar wajib diupload!');
    const imagePath = `/uploads/gallery/${file.filename}`;
    return this.galleryService.create(createGalleryDto, imagePath);
  }
  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}