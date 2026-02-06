import {
    Controller, Get, Post, Body, Query,
    UseInterceptors, UploadedFile, UseGuards,
    Delete, Param
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { createMulterOptions } from 'src/common/multer.utils';

@UseGuards(AuthGuard('jwt')) // Guard Global untuk Class ini
@Controller('admin/video')   // Endpoint: /api/v1/admin/video
export class VideoAdminController {
    constructor(private readonly videoService: VideoService) { }

    @Post()
    @UseInterceptors(FileInterceptor('video_file', createMulterOptions('video')))
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createVideoDto: CreateVideoDto
    ) {
        // Note: Pastikan service handle validasi jika file tidak terupload
        return this.videoService.create(createVideoDto, file);
    }

    // Admin perlu lihat list untuk tahu mana yang mau dihapus
    @Get()
    findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ) {
        const p = parseInt(page) || 1;
        const l = parseInt(limit) || 10;
        return this.videoService.findAll(p, l);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.videoService.remove(id);
    }
}