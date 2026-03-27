import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiSuccessResponse,
  ApiCreatedResponseDoc,
  ApiOperationDetailed,
  ApiUuidParam,
  ApiSlugParam,
  ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { PuskesmasService } from './puskesmas.service';
import { CreatePuskesmasDto } from './dto/create-puskesmas.dto';
import { Puskesmas, PuskesmasStatus } from './entity/puskesmas.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from '../admins/entity/admin.entity';

@ApiTags('Puskesmas Management')
@Controller('puskesmas')
export class PuskesmasController {
  constructor(private readonly puskesmasService: PuskesmasService) { }

  @Get()
  @ApiOperationDetailed({
    summary: 'List All Puskesmas',
    description: 'Returns a list of all active health centers registered in the system.',
    useCases: [
      'Public directory of health centers',
      'Dropdown selection for user registration',
      'Finding nearby puskesma locations'
    ],
    behavior: [
      'Only returns active puskesma by default',
      'Includes basic information (id, name, slug, status)'
    ],
    notes: [
      'This is a public endpoint - no authentication required',
      'Only returns ACTIVE status puskesma for public access'
    ]
  })
  @ApiStandardResponse({ type: Puskesmas, isArray: true, description: 'List of active puskesma' })
  @ApiErrorResponses()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.puskesmasService.findAll(pageNumber, limitNumber, search);
  }

  @Get(':id')
  @ApiOperationDetailed({
    summary: 'Get Puskesmas by ID',
    description: 'Returns detailed information about a specific puskesma using its UUID.',
    useCases: [
      'Viewing full puskesma details',
      'Admin management interface',
      'Integration with external systems'
    ],
    behavior: [
      'Returns complete puskesma information',
      'Includes status, timestamps, and reason fields if applicable'
    ]
  })
  @ApiUuidParam('id', 'UUID of the puskesma to retrieve')
  @ApiStandardResponse({ type: Puskesmas, description: 'Puskesmas details' })
  @ApiErrorResponses()
  findOne(@Param('id') id: string) {
    return this.puskesmasService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperationDetailed({
    summary: 'Get Puskesmas by Slug',
    description: 'Returns puskesma information using its URL-friendly slug. This is the primary method for tenant identification.',
    useCases: [
      'Tenant routing for multi-tenant applications',
      'Custom subdomain handling',
      'Public puskesma profile pages'
    ],
    behavior: [
      'Slug is case-insensitive',
      'Returns 404 if slug does not exist'
    ],
    notes: [
      'This endpoint is used by the frontend for tenant loading',
      'The slug must be unique across the system'
    ]
  })
  @ApiSlugParam('slug', 'URL-friendly identifier (e.g., pkm-bogor-tengah)')
  @ApiStandardResponse({ type: Puskesmas, description: 'Puskesmas data' })
  @ApiErrorResponses()
  findBySlug(@Param('slug') slug: string) {
    return this.puskesmasService.findBySlug(slug);
  }

  @Get('status/:slug')
  @ApiOperationDetailed({
    summary: 'Check Puskesmas Status',
    description: 'Minimal endpoint to check if a tenant is active, suspended, or in maintenance. Essential for frontend routing logic.',
    useCases: [
      'Determining user redirect logic',
      'Showing appropriate error pages (suspended, maintenance)',
      'Health check monitoring'
    ],
    behavior: [
      'Returns minimal response with status only',
      'Fast response for quick status checks'
    ],
    notes: [
      'This is a public endpoint - no authentication required',
      'Used by frontend to determine which page to show'
    ]
  })
  @ApiSlugParam('slug', 'URL-friendly identifier to check status')
  @ApiStandardResponse({ description: 'Tenant status information' })
  @ApiErrorResponses()
  getStatus(@Param('slug') slug: string) {
    return this.puskesmasService.getStatus(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperationDetailed({
    summary: 'Create New Puskesmas',
    description: 'Registers a new puskesma (health center) in the system.',
    useCases: [
      'Onboarding a new puskesma',
      'Setting up multi-tenant environment',
      'Initial system configuration'
    ],
    behavior: [
      'Generates unique UUID for the new puskesma',
      'Sets default status to ACTIVE',
      'Creates unique slug for tenant identification'
    ],
    notes: [
      'Requires authentication with valid JWT token',
      'Only accessible to authenticated users',
      'Slug must be unique - will fail if duplicate'
    ]
  })
  @ApiBody({ type: CreatePuskesmasDto, description: 'Puskesmas creation data' })
  @ApiStandardResponse({ type: Puskesmas, status: 201, description: 'Puskesmas created successfully' })
  @ApiErrorResponses()
  create(@Body() createPuskesmasDto: CreatePuskesmasDto) {
    return this.puskesmasService.create(createPuskesmasDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperationDetailed({
    summary: 'Update Puskesmas',
    description: 'Updates puskesma details. Supports partial updates - only provided fields will be updated.',
    useCases: [
      'Changing puskesma name',
      'Updating slug (URL identifier)',
      'Modifying status or reason fields'
    ],
    behavior: [
      'Only updates fields that are provided and non-empty',
      'Validates slug uniqueness if being changed',
      'Tracks update timestamp automatically'
    ],
    notes: [
      'Requires authentication with valid JWT token',
      'All fields are optional for partial updates'
    ]
  })
  @ApiUuidParam('id', 'UUID of the puskesma to update')
  @ApiBody({ type: CreatePuskesmasDto, description: 'Partial puskesma data (fields to update)' })
  @ApiStandardResponse({ type: Puskesmas, description: 'Puskesmas updated successfully' })
  @ApiErrorResponses()
  update(@Param('id') id: string, @Body() updatePuskesmasDto: any) {
    if (!updatePuskesmasDto) {
      return this.puskesmasService.findOne(id);
    }
    const cleanData: Partial<CreatePuskesmasDto> = {};
    if (updatePuskesmasDto.name !== undefined && updatePuskesmasDto.name !== '') {
      cleanData.name = updatePuskesmasDto.name;
    }
    if (updatePuskesmasDto.slug !== undefined && updatePuskesmasDto.slug !== '') {
      cleanData.slug = updatePuskesmasDto.slug;
    }
    if (updatePuskesmasDto.status !== undefined && updatePuskesmasDto.status !== '') {
      cleanData.status = updatePuskesmasDto.status;
    }
    if (updatePuskesmasDto.suspended_reason !== undefined) {
      cleanData.suspended_reason = updatePuskesmasDto.suspended_reason;
    }
    if (updatePuskesmasDto.maintenance_message !== undefined) {
      cleanData.maintenance_message = updatePuskesmasDto.maintenance_message;
    }
    if (updatePuskesmasDto.deactivated_reason !== undefined) {
      cleanData.deactivated_reason = updatePuskesmasDto.deactivated_reason;
    }
    return this.puskesmasService.update(id, cleanData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperationDetailed({
    summary: 'Delete Puskesmas',
    description: 'Permanently removes a puskesma record from the system.',
    useCases: [
      'Removing test puskesma',
      'Cleaning up duplicate entries',
      'System decommissioning'
    ],
    behavior: [
      'Permanently removes the record from database',
      'Associated data (admins, content, etc.) will be affected'
    ],
    notes: [
      'This action is irreversible',
      'Consider using deactivate instead for soft removal'
    ]
  })
  @ApiUuidParam('id', 'UUID of the puskesma to delete')
  @ApiSuccessResponse('Puskesmas deleted successfully', 'Puskesmas has been permanently removed')
  @ApiErrorResponses()
  remove(@Param('id') id: string) {
    return this.puskesmasService.remove(id);
  }

  // === Status Management Endpoints (Super Admin Only) ===

  @Patch(':id/activate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperationDetailed({
    summary: 'Activate Puskesmas',
    description: 'Changes puskesma status to ACTIVE, allowing full access for users.',
    useCases: [
      'Reactivating a suspended puskesma',
      'Enabling a new puskesma',
      'Restoring access after maintenance'
    ],
    behavior: [
      'Sets status to ACTIVE',
      'Records timestamp and admin who performed the action',
      'Clears suspension-related fields'
    ],
    notes: [
      'Requires SUPER_ADMIN role',
      'Only affects status - does not modify content'
    ]
  })
  @ApiUuidParam('id', 'UUID of the puskesma to activate')
  @ApiSuccessResponse('Puskesmas activated successfully', 'Status changed to ACTIVE')
  @ApiErrorResponses()
  activate(@Param('id') id: string, @Req() req: any) {
    const adminId = req.user.sub;
    return this.puskesmasService.activate(id, adminId);
  }

  @Patch(':id/deactivate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperationDetailed({
    summary: 'Deactivate Puskesmas',
    description: 'Changes puskesma status to INACTIVE, preventing all access.',
    useCases: [
      'Terminating puskesma contract',
      'Permanently disabling access',
      'Removing puskesma from active list'
    ],
    behavior: [
      'Sets status to INACTIVE',
      'Requires a reason for deactivation',
      'Records timestamp and admin who performed the action'
    ],
    notes: [
      'Requires SUPER_ADMIN role',
      'Reason is mandatory and will be stored'
    ]
  })
  @ApiUuidParam('id', 'UUID of the puskesma to deactivate')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          example: 'Contract ended',
          description: 'Reason for deactivation (required)',
          maxLength: 500
        }
      },
      required: ['reason']
    }
  })
  @ApiSuccessResponse('Puskesmas deactivated successfully', 'Status changed to INACTIVE')
  @ApiErrorResponses()
  deactivate(@Param('id') id: string, @Body('reason') reason: string, @Req() req: any) {
    const adminId = req.user.sub;
    return this.puskesmasService.deactivate(id, adminId, reason);
  }

  @Patch(':id/suspend')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperationDetailed({
    summary: 'Suspend Puskesmas',
    description: 'Changes puskesma status to SUSPENDED, temporarily restricting access due to policy violations or other issues.',
    useCases: [
      'Temporarily disabling access due to violations',
      'Pending investigation',
      'Emergency suspension'
    ],
    behavior: [
      'Sets status to SUSPENDED',
      'Requires a reason for suspension',
      'Records timestamp and admin who performed the action'
    ],
    notes: [
      'Requires SUPER_ADMIN role',
      'Users will see suspension message when accessing',
      'Can be reversed by activating the puskesma'
    ]
  })
  @ApiUuidParam('id', 'UUID of the puskesma to suspend')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          example: 'Policy violation',
          description: 'Reason for suspension (required)',
          maxLength: 500
        }
      },
      required: ['reason']
    }
  })
  @ApiSuccessResponse('Puskesmas suspended successfully', 'Status changed to SUSPENDED')
  @ApiErrorResponses()
  suspend(@Param('id') id: string, @Body('reason') reason: string, @Req() req: any) {
    const adminId = req.user.sub;
    return this.puskesmasService.suspend(id, adminId, reason);
  }

  @Patch(':id/maintenance')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperationDetailed({
    summary: 'Set Maintenance Mode',
    description: 'Puts a puskesma into maintenance mode with a custom message.',
    useCases: [
      'Server upgrades',
      'Database migrations',
      'Temporary closure for renovations'
    ],
    behavior: [
      'Sets status to MAINTENANCE',
      'Displays custom message to users',
      'Records timestamp and admin who performed the action'
    ],
    notes: [
      'Requires SUPER_ADMIN role',
      'Users will see the maintenance message',
      'Can be quickly removed to restore access'
    ]
  })
  @ApiUuidParam('id', 'UUID of the puskesma to set maintenance')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Upgrading database',
          description: 'Message to display to users during maintenance',
          maxLength: 500
        }
      }
    }
  })
  @ApiSuccessResponse('Maintenance mode enabled successfully', 'Status changed to MAINTENANCE')
  @ApiErrorResponses()
  setMaintenance(
    @Param('id') id: string,
    @Body('message') message: string,
    @Req() req: any
  ) {
    const adminId = req.user.sub;
    return this.puskesmasService.setMaintenance(id, adminId, message);
  }

  @Patch(':id/maintenance/remove')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperationDetailed({
    summary: 'Remove Maintenance Mode',
    description: 'Brings a puskesma back online from maintenance mode, restoring full access.',
    useCases: [
      'Completing server upgrades',
      'Finishing maintenance tasks',
      'Reopening after temporary closure'
    ],
    behavior: [
      'Sets status back to ACTIVE',
      'Clears maintenance message',
      'Records timestamp'
    ],
    notes: [
      'Requires SUPER_ADMIN role',
      'Restores full access immediately'
    ]
  })
  @ApiUuidParam('id', 'UUID of the puskesma to remove maintenance')
  @ApiSuccessResponse('Maintenance mode removed successfully', 'Status changed to ACTIVE')
  @ApiErrorResponses()
  removeMaintenance(@Param('id') id: string) {
    return this.puskesmasService.removeMaintenance(id);
  }
}
