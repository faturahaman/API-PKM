import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiErrorResponses,
  ApiOperationDetailed
} from '../common/decorators/api-docs.decorator';
import { MenusService } from './menus.service';

@ApiTags('Public Menu')
@Controller('menus')
export class MenusPublicController {
  constructor(private readonly menusService: MenusService) { }

  @Get()
  @ApiOperationDetailed({
    summary: 'Get Public Menu Tree',
    description: 'Returns the complete navigation menu structure as a tree for public display.',
    useCases: [
      'Building website navigation',
      'Rendering menu on frontend',
      'Generating sitemap'
    ],
    behavior: [
      'Returns only active menus',
      'Organized as hierarchical tree structure',
      'Sorted by order field'
    ],
    notes: [
      'This is a public endpoint - no authentication required',
      'Only shows published (active) menus'
    ]
  })
  @ApiStandardResponse({ isArray: true, description: 'Menu tree structure' })
  @ApiErrorResponses()
  findPublicTree() {
    return this.menusService.findPublicTree();
  }

  @Get(':slug')
  @ApiOperationDetailed({
    summary: 'Get Menu by Slug',
    description: 'Returns a specific menu item by its URL-friendly slug.',
    useCases: [
      'Direct menu navigation',
      'Menu link resolution',
      'Page routing'
    ],
    behavior: [
      'Returns menu with all details',
      'Includes linked page or static page data'
    ],
    notes: [
      'This is a public endpoint - no authentication required'
    ]
  })
  @ApiParam({ name: 'slug', description: 'Menu URL slug', example: 'pelayanan' })
  @ApiStandardResponse({ description: 'Menu details' })
  @ApiErrorResponses()
  findBySlug(@Param('slug') slug: string) {
    return this.menusService.findBySlug(slug);
  }
}