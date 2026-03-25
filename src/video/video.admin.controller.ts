import {
    Controller, Get, Post, Body, Query,
    UseInterceptors, UploadedFile, UseGuards,
    Delete, Param, Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiStandardResponse,
    ApiPaginatedResponse,
    ApiErrorResponses,
    ApiSuccessResponse,
    ApiCreatedResponseDoc,
    ApiOperationDetailed,
    ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { createMulterOptions } from 'src/common/multer.utils';
import { extractRequestMeta } from 'src/common/dto/request-meta.dto';

@ApiTags('Admin Video')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt')) // Guard Global untuk Class ini
@Controller('admin/video')   // Endpoint: /api/v1/admin/video
export class VideoAdminController {
    constructor(private readonly videoService: VideoService) { }

    @Post()
    @UseInterceptors(FileInterceptor('video_file', createMulterOptions('video')))
    @ApiOperationDetailed({
        summary: 'Upload New Video',
        description: 'Uploads and creates a new video entry.',
        useCases: [
            'Adding health education videos',
            'Uploading puskesma promotional videos',
            'Creating video content library'
        ],
        behavior: [
            'Requires video file upload',
            'Stores video in storage',
            'Creates database entry with metadata'
        ],
        notes: [
            'Video file is required',
            'Supported formats: mp4, webm, mov'
        ]
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Tutorial Pemeriksaan Kesehatan', description: 'Video title' },
                description: { type: 'string', example: 'Video tutorial pemeriksaan kesehatan', description: 'Video description' },
                video_file: { type: 'string', format: 'binary', description: 'Video file' }
            },
            required: ['title', 'video_file']
        }
    })
    @ApiCreatedResponseDoc('Video uploaded successfully', 'New video has been uploaded')
    @ApiErrorResponses()
    create(
        @Request() req: any,
        @UploadedFile() file: Express.Multer.File,
        @Body() createVideoDto: CreateVideoDto
    ) {
        return this.videoService.create(createVideoDto, file, extractRequestMeta(req));
    }

    // Admin perlu lihat list untuk tahu mana yang mau dihapus
    @Get()
    @ApiOperationDetailed({
        summary: 'List All Videos (Admin)',
        description: 'Returns a paginated list of all videos for management.',
        useCases: [
            'Video management interface',
            'Admin dashboard',
            'Video administration'
        ],
        behavior: [
            'Supports pagination',
            'Returns all videos'
        ]
    })
    @ApiPaginationParams()
    @ApiPaginatedResponse({ description: 'Paginated list of videos' })
    @ApiErrorResponses()
    findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ) {
        const p = parseInt(page) || 1;
        const l = parseInt(limit) || 10;
        return this.videoService.findAll(p, l);
    }

    @Delete(':id')
    @ApiOperationDetailed({
        summary: 'Delete Video',
        description: 'Permanently removes a video and its file from the system.',
        useCases: [
            'Removing old videos',
            'Cleaning up test content',
            'Video management'
        ],
        behavior: [
            'Removes video record',
            'Deletes video file from storage'
        ],
        notes: [
            'This action is irreversible',
            'Video file will be deleted permanently'
        ]
    })
    @ApiParam({ name: 'id', description: 'Video UUID' })
    @ApiSuccessResponse('Video deleted successfully', 'Video has been removed')
    @ApiErrorResponses()
    remove(@Request() req: any, @Param('id') id: string) {
        return this.videoService.remove(id, extractRequestMeta(req));
    }
}