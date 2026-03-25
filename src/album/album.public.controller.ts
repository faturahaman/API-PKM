import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiOperationDetailed,
  ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { AlbumService } from './album.service';

@ApiTags('Public Album')
@Controller('album')
export class AlbumPublicController {
  constructor(private readonly albumService: AlbumService) { }

  @Get()
  @ApiOperationDetailed({
    summary: 'List All Published Albums',
    description: 'Returns a list of all published albums available for public viewing.',
    useCases: [
      'Displaying album gallery on website',
      'Photo collection browsing',
      'Finding specific album'
    ],
    behavior: [
      'Returns only published albums',
      'Supports pagination with max 50 items per page'
    ],
    notes: [
      'This is a public endpoint - no authentication required',
      'Maximum limit is 50 to prevent large payloads'
    ]
  })
  @ApiPaginationParams()
  @ApiPaginatedResponse({ description: 'List of published albums' })
  @ApiErrorResponses()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const p = parseInt(page) || 1;
    const l = Math.min(parseInt(limit) || 10, 50);
    return this.albumService.findAll(p, l);
  }

  @Get(':id')
  @ApiOperationDetailed({
    summary: 'Get Album Details',
    description: 'Returns detailed information about a specific album including its photos.',
    useCases: [
      'Viewing album with photos',
      'Album detail page',
      'Photo gallery navigation'
    ],
    behavior: [
      'Returns album with associated photos',
      'Returns 404 if album not found'
    ],
    notes: [
      'This is a public endpoint - no authentication required'
    ]
  })
  @ApiParam({ name: 'id', description: 'Album UUID or identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiStandardResponse({ description: 'Album details with photos' })
  @ApiErrorResponses()
  async findOne(@Param('id') id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) throw new NotFoundException('Album tidak ditemukan');
    return album;
  }
}