import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
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
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Admin Menu')
@ApiBearerAuth('JWT-auth')
@Controller('admin/menus')
@UseGuards(AuthGuard('jwt'))
export class MenusAdminController {
  constructor(private readonly menusService: MenusService) { }

  @Post()
  @ApiOperationDetailed({
    summary: 'Create New Menu',
    description: 'Creates a new navigation menu item.',
    useCases: [
      'Adding new navigation items',
      'Creating menu structure',
      'Setting up website navigation'
    ],
    behavior: [
      'Creates menu with specified type',
      'Can link to pages, static pages, or external URLs',
      'Validates parent menu if provided'
    ]
  })
  @ApiBody({ type: CreateMenuDto, description: 'Menu creation data' })
  @ApiCreatedResponseDoc('Menu created successfully', 'New menu has been created')
  @ApiErrorResponses()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  @ApiOperationDetailed({
    summary: 'List All Menus (Admin)',
    description: 'Returns a list of all menus with optional search and filtering.',
    useCases: [
      'Menu management interface',
      'Admin dashboard',
      'Menu reorganization'
    ],
    behavior: [
      'Supports pagination',
      'Supports search by menu name',
      'Can filter by menu type'
    ]
  })
  @ApiPaginationParams()
  @ApiQuery({ name: 'search', required: false, description: 'Search term for menu name' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by menu type' })
  @ApiPaginatedResponse({ description: 'Paginated list of menus' })
  @ApiErrorResponses()
  findAll(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('type') type?: string,
  ) {
    return this.menusService.findAllAdmin(search, Number(page), Number(limit), type);
  }

  @Get(':id')
  @ApiOperationDetailed({
    summary: 'Get Menu Details',
    description: 'Returns detailed information about a specific menu.',
    useCases: [
      'Viewing menu details',
      'Editing menu',
      'Menu configuration'
    ]
  })
  @ApiParam({ name: 'id', description: 'Menu UUID' })
  @ApiStandardResponse({ description: 'Menu details' })
  @ApiErrorResponses()
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(id);
  }

  @Patch(':id')
  @ApiOperationDetailed({
    summary: 'Update Menu',
    description: 'Updates menu information such as name, URL, or order.',
    useCases: [
      'Editing menu details',
      'Changing menu link',
      'Reordering menus'
    ],
    behavior: [
      'Supports partial updates',
      'Validates link if provided'
    ]
  })
  @ApiParam({ name: 'id', description: 'Menu UUID' })
  @ApiBody({ type: UpdateMenuDto, description: 'Fields to update' })
  @ApiStandardResponse({ description: 'Menu updated successfully' })
  @ApiErrorResponses()
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperationDetailed({
    summary: 'Delete Menu',
    description: 'Permanently removes a menu. Child menus will become root-level.',
    useCases: [
      'Removing unused menus',
      'Cleaning up navigation structure',
      'Menu management'
    ],
    behavior: [
      'Removes menu record',
      'Child menus become root-level items'
    ],
    notes: [
      'This action is irreversible',
      'Child menus are not deleted but become orphans'
    ]
  })
  @ApiParam({ name: 'id', description: 'Menu UUID' })
  @ApiSuccessResponse('Menu deleted successfully', 'Menu has been removed')
  @ApiErrorResponses()
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }

  @Patch(':id/toggle-status')
  @ApiOperationDetailed({
    summary: 'Toggle Menu Status',
    description: 'Toggles menu between active and inactive status.',
    useCases: [
      'Hiding menu temporarily',
      'Enabling disabled menu',
      'Quick status change'
    ],
    behavior: [
      'Toggles is_active field',
      'No data modification required'
    ]
  })
  @ApiParam({ name: 'id', description: 'Menu UUID' })
  @ApiStandardResponse({ description: 'Menu status toggled successfully' })
  @ApiErrorResponses()
  toggleStatus(@Param('id') id: string) {
    return this.menusService.toggleStatus(id)
  }
}