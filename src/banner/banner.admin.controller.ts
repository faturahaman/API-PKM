import {
  Controller, Get, Post, Body, Param, Delete, Patch, UseGuards,
  UseInterceptors, UploadedFile, BadRequestException, Query, Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { AuthGuard } from '@nestjs/passport';
import { createMulterOptions } from '../common/multer.utils';
import { extractRequestMeta } from '../common/dto/request-meta.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('admin/banner')
export class BannerAdminController {
  constructor(private readonly bannerService: BannerService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', createMulterOptions('banner')))
  create(
    @Request() req: any,
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Gambar banner wajib diupload!');
    }
    return this.bannerService.create(createBannerDto, file, extractRequestMeta(req));
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    return this.bannerService.findAll(parseInt(page) || 1, parseInt(limit) || 10);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', createMulterOptions('banner')))
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.bannerService.update(id, updateBannerDto, file, extractRequestMeta(req));
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.bannerService.remove(id, extractRequestMeta(req));
  }
}