// src/banner/banner.controller.ts
import { 
  Controller, Get, Post, Body, Param, Delete, Put, UseGuards 
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
// Import Guard jika ada (misal JwtAuthGuard)
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/banner') // Endpoint: /admin/banner
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // Buka komen jika butuh login
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
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
  // @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.update(id, updateBannerDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}