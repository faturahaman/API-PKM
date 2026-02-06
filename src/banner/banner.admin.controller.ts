import {
  Controller, Get, Post, Body, Param, Delete, Put, UseGuards,
  UseInterceptors, UploadedFile, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { AuthGuard } from '@nestjs/passport';
import { createMulterOptions } from '../common/multer.utils';

@UseGuards(AuthGuard('jwt')) // Guard Global untuk Class ini
@Controller('admin/banner')
export class BannerAdminController {
  constructor(private readonly bannerService: BannerService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', createMulterOptions('banner')))
  create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Gambar banner wajib diupload!');
    }
    return this.bannerService.create(createBannerDto, file);
  }

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', createMulterOptions('banner')))
  update(
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.bannerService.update(id, updateBannerDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}