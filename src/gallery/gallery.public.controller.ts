import {
  Controller, Get, Param, Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ApiStandardResponse, ApiPaginatedResponse, ApiErrorResponses } from '../common/decorators/api-docs.decorator';
import { GalleryService } from './gallery.service';

@ApiTags('Public Gallery')
@Controller('gallery')
export class GalleryPublicController {
  constructor(private readonly galleryService: GalleryService) { }

  // PUBLIC
  @Get()
  @ApiOperation({
    summary: 'Get all gallery items',
    description: 'Returns a paginated list of images and videos in the gallery. Supports filtering by album or items with no album.'
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 12 })
  @ApiQuery({ name: 'no_album', required: false, type: Boolean, description: 'Filter items that do not belong to any album' })
  @ApiQuery({ name: 'album_id', required: false, description: 'Filter by specific album ID' })
  @ApiPaginatedResponse({ description: 'Gallery items retrieved successfully' })
  @ApiErrorResponses()
  findAllPublic(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('no_album') noAlbum: string,
    @Query('album_id') albumId: string
  ) {
    const p = parseInt(page) || 1;
    const l = Math.min(parseInt(limit) || 12, 50);
    const isNoAlbum = noAlbum === 'true';

    return this.galleryService.findAll(p, l, isNoAlbum, albumId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get gallery item details',
    description: 'Returns specific data for a single gallery item (image or video).'
  })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiStandardResponse({ description: 'Gallery item details found' })
  @ApiErrorResponses()
  findOnePublic(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }
}