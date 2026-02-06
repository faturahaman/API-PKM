import { Controller, Get, Query } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('video') // Endpoint: /api/v1/video
export class VideoPublicController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  findAll(
    @Query('page') page: string, 
    @Query('limit') limit: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    return this.videoService.findAll(p, l);
  }
}