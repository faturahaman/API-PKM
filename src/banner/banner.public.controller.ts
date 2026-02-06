import { Controller, Get } from '@nestjs/common';
import { BannerService } from './banner.service';

@Controller('banner') 
export class BannerPublicController {
  constructor(private readonly bannerService: BannerService) { }

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }
}