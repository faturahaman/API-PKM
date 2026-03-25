import {
  Controller, Get, Post, Body, Param, Delete, Patch, UseGuards,
  UseInterceptors, UploadedFile, BadRequestException, Query, Request
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiSuccessResponse,
  ApiCreatedResponseDoc,
  ApiOperationDetailed,
  ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { AuthGuard } from '@nestjs/passport';
import { createMulterOptions } from '../common/multer.utils';
import { extractRequestMeta } from '../common/dto/request-meta.dto';

@ApiTags('Admin Banner')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
@Controller('admin/banner')
export class BannerAdminController {
  constructor(private readonly bannerService: BannerService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', createMulterOptions('banner')))
  @ApiOperationDetailed({
    summary: 'Create New Banner',
    description: 'Creates a new banner with an uploaded image.',
    useCases: [
      'Adding new promotional banner',
      'Creating hero image for website',
      'Adding carousel slide'
    ],
    behavior: [
      'Requires image file upload',
      'Validates image format',
      'Stores image in banner directory'
    ],
    notes: [
      'Image file is required',
      'Supported formats: jpg, jpeg, png, webp'
    ]
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Promo Kesehatan', description: 'Banner title' },
        link: { type: 'string', example: '/pages/berita-1', description: 'Optional redirect URL' },
        is_active: { type: 'boolean', example: true, description: 'Active status' },
        image: { type: 'string', format: 'binary', description: 'Image file' }
      },
      required: ['image']
    }
  })
  @ApiCreatedResponseDoc('Banner created successfully', 'New banner has been created')
  @ApiErrorResponses()
  create(
    @Request() req: any,
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Gambar banner wajib diupload!');
    }
    return this.bannerService.create(createBannerDto, file, extractRequestMeta(req));
  }

  @Get()
  @ApiOperationDetailed({
    summary: 'List All Banners (Admin)',
    description: 'Returns a paginated list of all banners.',
    useCases: [
      'Banner management interface',
      'Viewing all banners',
      'Banner administration'
    ],
    behavior: [
      'Supports pagination',
      'Returns all banners (active and inactive)'
    ]
  })
  @ApiPaginationParams()
  @ApiPaginatedResponse({ description: 'Paginated list of banners' })
  @ApiErrorResponses()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    return this.bannerService.findAll(parseInt(page) || 1, parseInt(limit) || 10);
  }

  @Get(':id')
  @ApiOperationDetailed({
    summary: 'Get Banner Details',
    description: 'Returns detailed information about a specific banner.',
    useCases: [
      'Viewing banner details',
      'Editing banner information',
      'Banner preview'
    ]
  })
  @ApiParam({ name: 'id', description: 'Banner UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiStandardResponse({ description: 'Banner details' })
  @ApiErrorResponses()
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', createMulterOptions('banner')))
  @ApiOperationDetailed({
    summary: 'Update Banner',
    description: 'Updates banner information. Can optionally upload a new image.',
    useCases: [
      'Editing banner details',
      'Changing banner image',
      'Updating banner status'
    ],
    behavior: [
      'Image is optional - existing image kept if not provided',
      'Supports partial updates'
    ]
  })
  @ApiParam({ name: 'id', description: 'Banner UUID' })
  @ApiBody({ type: UpdateBannerDto, description: 'Fields to update' })
  @ApiStandardResponse({ description: 'Banner updated successfully' })
  @ApiErrorResponses()
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.bannerService.update(id, updateBannerDto, file, extractRequestMeta(req));
  }

  @Delete(':id')
  @ApiOperationDetailed({
    summary: 'Delete Banner',
    description: 'Permanently removes a banner from the system.',
    useCases: [
      'Removing unused banners',
      'Cleaning up old promotions',
      'Banner management'
    ],
    behavior: [
      'Permanently removes banner record',
      'Also removes associated image file'
    ],
    notes: [
      'This action is irreversible',
      'Image file will be deleted from storage'
    ]
  })
  @ApiParam({ name: 'id', description: 'Banner UUID' })
  @ApiSuccessResponse('Banner deleted successfully', 'Banner has been removed')
  @ApiErrorResponses()
  remove(@Request() req: any, @Param('id') id: string) {
    return this.bannerService.remove(id, extractRequestMeta(req));
  }
}