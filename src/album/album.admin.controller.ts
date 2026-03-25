import {
  Controller, Post, Body, Get, Param, Delete, UseGuards, NotFoundException, Query, Patch, Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiSuccessResponse,
  ApiCreatedResponseDoc,
  ApiOperationDetailed,
  ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AuthGuard } from '@nestjs/passport';
import { extractRequestMeta } from '../common/dto/request-meta.dto';

@ApiTags('Admin Album')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('admin/album')   // Endpoint: /api/v1/admin/album
export class AlbumAdminController {
  constructor(private readonly albumService: AlbumService) { }

  @Post()
  @ApiOperationDetailed({
    summary: 'Create New Album',
    description: 'Creates a new photo album for organizing gallery photos.',
    useCases: [
      'Creating a new album for event documentation',
      'Organizing photos by category',
      'Creating photo collections for puskesma'
    ],
    behavior: [
      'Generates unique album ID',
      'Records creation metadata',
      'Initializes with empty photo list'
    ],
    notes: [
      'Requires authentication',
      'Album will be created in current tenant context'
    ]
  })
  @ApiBody({ type: CreateAlbumDto, description: 'Album creation data' })
  @ApiCreatedResponseDoc('Album created successfully', 'New album has been created')
  @ApiErrorResponses()
  create(@Request() req: any, @Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto, extractRequestMeta(req));
  }

  @Get()
  @ApiOperationDetailed({
    summary: 'List All Albums (Admin)',
    description: 'Returns a paginated list of all albums with optional search and filtering.',
    useCases: [
      'Album management interface',
      'Searching for specific albums',
      'Album administration'
    ],
    behavior: [
      'Supports pagination',
      'Supports search by album name',
      'Filters by status if provided'
    ]
  })
  @ApiPaginationParams()
  @ApiQuery({ name: 'search', required: false, description: 'Search term for album name' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (all, active, inactive)' })
  @ApiPaginatedResponse({ description: 'Paginated list of albums' })
  @ApiErrorResponses()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('status') status: string,
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    // forward search and status (status is currently unused) to service
    return this.albumService.findAll(p, l, search || '', status || 'all');
  }

  @Get(':id')
  @ApiOperationDetailed({
    summary: 'Get Album Details',
    description: 'Returns detailed information about a specific album.',
    useCases: [
      'Viewing album details',
      'Album management',
      'Editing album information'
    ],
    behavior: [
      'Returns complete album information',
      'Includes all metadata fields'
    ]
  })
  @ApiParam({ name: 'id', description: 'Album UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiStandardResponse({ description: 'Album details' })
  @ApiErrorResponses()
  async findOne(@Param('id') id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) throw new NotFoundException('Album tidak ditemukan');
    return album;
  }

  @Patch(':id')
  @ApiOperationDetailed({
    summary: 'Update Album',
    description: 'Updates album information such as name, description, or cover image.',
    useCases: [
      'Editing album details',
      'Updating album metadata',
      'Changing album cover'
    ],
    behavior: [
      'Supports partial updates',
      'Records modification metadata'
    ],
    notes: [
      'All fields are optional for partial updates'
    ]
  })
  @ApiParam({ name: 'id', description: 'Album UUID' })
  @ApiBody({ description: 'Fields to update', schema: { example: { name: 'Updated Album Name' } } })
  @ApiStandardResponse({ description: 'Album updated successfully' })
  @ApiErrorResponses()
  update(@Request() req: any, @Param('id') id: string, @Body() updateData: any) {
    return this.albumService.update(id, updateData, extractRequestMeta(req));
  }

  @Delete(':id')
  @ApiOperationDetailed({
    summary: 'Delete Album',
    description: 'Permanently removes an album. Note: photos in the album will not be deleted.',
    useCases: [
      'Removing unused albums',
      'Cleaning up test data',
      'Album management'
    ],
    behavior: [
      'Removes album record only',
      'Photos remain in gallery with album_id set to null'
    ],
    notes: [
      'This action is irreversible',
      'Photos in this album will become unassigned'
    ]
  })
  @ApiParam({ name: 'id', description: 'Album UUID' })
  @ApiSuccessResponse('Album deleted successfully', 'Album has been removed')
  @ApiErrorResponses()
  remove(@Request() req: any, @Param('id') id: string) {
    return this.albumService.remove(id, extractRequestMeta(req));
  }
}