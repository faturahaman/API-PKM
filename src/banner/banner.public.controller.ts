import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiErrorResponses,
  ApiOperationDetailed
} from '../common/decorators/api-docs.decorator';
import { BannerService } from './banner.service';

@ApiTags('Public Banner')
@Controller('banner')
export class BannerPublicController {
  constructor(private readonly bannerService: BannerService) { }

  @Get()
  @ApiOperationDetailed({
    summary: 'List Active Banners',
    description: 'Returns a list of all active banners for public display (carousel, hero section).',
    useCases: [
      'Displaying carousel on homepage',
      'Hero banner section',
      'Promotional slides'
    ],
    behavior: [
      'Returns only active banners',
      'Ordered by display order or creation date'
    ],
    notes: [
      'This is a public endpoint - no authentication required',
      'Used for public website banner display'
    ]
  })
  @ApiStandardResponse({ isArray: true, description: 'List of active banners' })
  @ApiErrorResponses()
  findAll() {
    return this.bannerService.findAll();
  }
}