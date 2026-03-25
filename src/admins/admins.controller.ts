import {
  Controller, Get, Patch, UseGuards, Request, UseInterceptors,
  UploadedFile, Body, Param, Delete, Query, Post
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiCommonParams,
  ApiSuccessResponse,
  ApiCreatedResponseDoc,
  ApiOperationDetailed,
  ApiUuidParam,
  ApiPaginationParams
} from '../common/decorators/api-docs.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminsService } from './admins.service';
import { createMulterOptions } from '../common/multer.utils';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminRole } from './entity/admin.entity';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
    email: string;
    name?: string;
    password?: string;
  };
}

@ApiTags('Admin Management')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminsController {

  constructor(private adminsService: AdminsService) { }

  @Get('profile')
  @ApiOperationDetailed({
    summary: 'Get Current Admin Profile',
    description: 'Returns the profile information of the currently authenticated admin user.',
    useCases: [
      'Displaying user profile in frontend',
      'Getting current user information',
      'Profile customization'
    ],
    behavior: [
      'Retrieves profile based on JWT token',
      'Excludes sensitive data (password, token)',
      'Includes puskesma information for OPERATORS'
    ]
  })
  @ApiStandardResponse({ description: 'Current admin profile data' })
  @ApiErrorResponses()
  getProfile(@Request() req: AuthenticatedRequest) {
    const { password, ...user } = req.user;
    return user;
  }

  @Get('dashboard')
  @ApiOperationDetailed({
    summary: 'Get Admin Dashboard Data',
    description: 'Returns essential statistics and data for the admin dashboard view.',
    useCases: [
      'Dashboard overview',
      'Statistics display',
      'Quick access metrics'
    ],
    behavior: [
      'Returns data based on admin role',
      'OPERATOR sees single puskesma stats',
      'SUPER_ADMIN sees system-wide stats'
    ]
  })
  @ApiStandardResponse({ description: 'Dashboard statistics and data' })
  @ApiErrorResponses()
  getDashboard(@Request() req: AuthenticatedRequest) {
    const { password, ...user } = req.user;
    return user;
  }

  @Get('admins')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperationDetailed({
    summary: 'List All Admins (Super Admin)',
    description: 'Returns a paginated list of all admin users in the system.',
    useCases: [
      'Admin management interface',
      'User administration',
      'Access control management'
    ],
    behavior: [
      'Only accessible to SUPER_ADMIN',
      'Supports filtering by role',
      'Supports search by username',
      'Supports pagination'
    ],
    notes: [
      'Requires SUPER_ADMIN role',
      'Default page size is 10',
      'Maximum limit is 100'
    ]
  })
  @ApiCommonParams()
  @ApiQuery({
    name: 'role',
    required: false,
    enum: AdminRole,
    description: 'Filter admins by role (OPERATOR or SUPER_ADMIN)'
  })
  @ApiPaginatedResponse({ description: 'Paginated list of all admins' })
  @ApiErrorResponses()
  getAllAdmins(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    return this.adminsService.findAll(
      search,
      role,
      limit ? parseInt(limit) : 10,
      offset ? parseInt(offset) : 0
    );
  }

  @Post('admins')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperationDetailed({
    summary: 'Create New Admin (Super Admin)',
    description: 'Creates a new admin or operator account.',
    useCases: [
      'Onboarding new operators',
      'Creating additional super admins',
      'Assigning puskesma management'
    ],
    behavior: [
      'Only accessible to SUPER_ADMIN',
      'Validates username uniqueness',
      'Hashes password before storage',
      'Associates puskesma for OPERATOR role'
    ],
    notes: [
      'Requires SUPER_ADMIN role',
      'Username must be unique',
      'OPERATOR requires puskesmas_id',
      'Password minimum 8 characters'
    ]
  })
  @ApiBody({ type: CreateAdminDto, description: 'Admin creation data' })
  @ApiCreatedResponseDoc('Admin created successfully', 'New admin account has been created')
  @ApiErrorResponses()
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminsService.create(dto.name, dto.password, dto.role as string, dto.puskesmas_id);
  }

  @Get('admins/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperationDetailed({
    summary: 'Get Admin Details by ID',
    description: 'Returns full details of a specific admin user.',
    useCases: [
      'Admin profile viewing',
      'User details verification',
      'Account management'
    ],
    behavior: [
      'Only accessible to SUPER_ADMIN',
      'Returns complete admin information',
      'Includes puskesma relation for operators'
    ]
  })
  @ApiUuidParam('id', 'UUID of the admin to retrieve')
  @ApiStandardResponse({ description: 'Admin user details' })
  @ApiErrorResponses()
  getAdminById(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @Patch('admins/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperationDetailed({
    summary: 'Update Admin Details',
    description: 'Updates a specific admin user details.',
    useCases: [
      'Changing admin role',
      'Updating puskesma assignment',
      'Modifying account settings'
    ],
    behavior: [
      'Only accessible to SUPER_ADMIN',
      'Supports partial updates',
      'Validates role and puskesma changes'
    ],
    notes: [
      'Requires SUPER_ADMIN role',
      'Password changes require separate endpoint',
      'Role changes take effect immediately'
    ]
  })
  @ApiUuidParam('id', 'UUID of the admin to update')
  @ApiBody({ type: UpdateAdminDto, description: 'Fields to update' })
  @ApiStandardResponse({ description: 'Admin updated successfully' })
  @ApiErrorResponses()
  updateAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateAdminDto
  ) {
    return this.adminsService.update(id, dto);
  }

  @Delete('admins/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperationDetailed({
    summary: 'Delete Admin',
    description: 'Permanently removes an admin user from the system.',
    useCases: [
      'Removing terminated employees',
      'Cleaning up test accounts',
      'Revoking access'
    ],
    behavior: [
      'Only accessible to SUPER_ADMIN',
      'Admin cannot delete themselves',
      'Permanently removes the account'
    ],
    notes: [
      'This action is irreversible',
      'Current admin cannot delete their own account',
      'Consider deactivating instead'
    ]
  })
  @ApiUuidParam('id', 'UUID of the admin to delete')
  @ApiSuccessResponse('Admin deleted successfully', 'Admin account has been permanently removed')
  @ApiErrorResponses()
  deleteAdmin(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const currentAdminId = req.user.id;
    return this.adminsService.delete(id, currentAdminId);
  }

  @Patch('profile')
  @UseInterceptors(FileInterceptor('photo', createMulterOptions('profile')))
  @ApiOperationDetailed({
    summary: 'Update Own Profile',
    description: 'Allows the current admin to update their own name and profile photo.',
    useCases: [
      'Updating display name',
      'Changing profile picture',
      'Profile customization'
    ],
    behavior: [
      'Updates based on JWT token',
      'Photo is uploaded and stored',
      'Name is sanitized before storage'
    ],
    notes: [
      'Requires authentication',
      'Photo is optional - can update name only',
      'Photo should be image file (jpg, png, etc.)'
    ]
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'New Name',
          description: 'Updated display name',
          maxLength: 50
        },
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file (optional)'
        }
      }
    }
  })
  @ApiStandardResponse({ description: 'Profile updated successfully' })
  @ApiErrorResponses()
  async updateProfile(
    @Request() req: any,
    @Body() body: { name: string },
    @UploadedFile() file?: Express.Multer.File
  ) {
    const adminId = req.user.id;
    const slug = req.tenantId || (req.user?.role === 'SUPER_ADMIN' ? req.user.active_tenant : req.user?.puskesmas_id) || 'shared';
    const photoPath = file ? `/${slug}/profile/${file.filename}` : undefined;
    return this.adminsService.updateProfile(adminId, photoPath, body.name);
  }

  @Get('available-puskes')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperationDetailed({
    summary: 'Get Available Puskesmas for Operators',
    description: 'Returns a list of puskesma that can be assigned to new operators.',
    useCases: [
      'Creating new operator accounts',
      'Viewing unassigned puskesma',
      'Operator assignment interface'
    ],
    behavior: [
      'Only returns puskesma without operators',
      'Used when creating new OPERATOR accounts',
      'Helps prevent duplicate assignments'
    ]
  })
  @ApiStandardResponse({ description: 'List of available puskesma' })
  @ApiErrorResponses()
  getAvailablePuskesForOperators() {
    return this.adminsService.getAvailablePuskesmasForOperators();
  }

  @Get('operators')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperationDetailed({
    summary: 'Get All Operators',
    description: 'Returns all operators with their assigned puskesma information.',
    useCases: [
      'Viewing all operators',
      'Operator management',
      'Access control overview'
    ]
  })
  @ApiStandardResponse({ description: 'List of all operators with puskesma data' })
  @ApiErrorResponses()
  getAllOperators() {
    return this.adminsService.getAllOperatorsWithPuskes();
  }

  @Get('operators/:puskesId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiOperationDetailed({
    summary: 'Get Operators by Puskesmas',
    description: 'Returns all operators assigned to a specific puskesma.',
    useCases: [
      'Viewing puskesma staff',
      'Managing puskesma access',
      'Contact information retrieval'
    ]
  })
  @ApiUuidParam('puskesId', 'UUID of the puskesma')
  @ApiStandardResponse({ description: 'List of operators for the specified puskesma' })
  @ApiErrorResponses()
  getOperatorsByPuskes(@Param('puskesId') puskesId: string) {
    return this.adminsService.getOperatorsByPuskes(puskesId);
  }
}
