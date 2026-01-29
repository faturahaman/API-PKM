import { 
  Controller, Get, Post, Body, Query, 
  UseInterceptors, UploadedFile, UseGuards, 
  Delete, Param 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { videoMulterOptions } from 'src/common/video-multer.config'; 

@Controller('admin/video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UseInterceptors(FileInterceptor('video_file', videoMulterOptions))
  create(
    @UploadedFile() file: Express.Multer.File, 
    @Body() createVideoDto: CreateVideoDto
  ) {
    return this.videoService.create(createVideoDto, file);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Query('page') page: string, 
    @Query('limit') limit: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    return this.videoService.findAll(p, l);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(id);
  }
}