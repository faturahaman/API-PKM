import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiOperationDetailed,
  ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { VideoService } from './video.service';

@ApiTags('Public Video')
@Controller('video') // Endpoint: /api/v1/video
export class VideoPublicController {
  constructor(private readonly videoService: VideoService) { }

  @Get()
  @ApiOperationDetailed({
    summary: 'List All Videos',
    description: 'Returns a list of all published videos for public viewing.',
    useCases: [
      'Displaying video gallery on website',
      'Health education video library',
      'Video browsing'
    ],
    behavior: [
      'Returns only published videos',
      'Supports pagination with max 50 items per page'
    ],
    notes: [
      'This is a public endpoint - no authentication required',
      'Maximum limit is 50 to prevent large payloads'
    ]
  })
  @ApiPaginationParams()
  @ApiPaginatedResponse({ description: 'List of published videos' })
  @ApiErrorResponses()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const p = parseInt(page) || 1;
    const l = Math.min(parseInt(limit) || 10, 50);
    return this.videoService.findAll(p, l);
  }
}