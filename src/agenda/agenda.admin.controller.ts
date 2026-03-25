import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiPaginationParams,
  ApiSuccessResponse,
  ApiCreatedResponseDoc,
  ApiOperationDetailed,
  ApiUuidParam
} from '../common/decorators/api-docs.decorator';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { AuthGuard } from '@nestjs/passport';
import { Agenda } from './entity/agenda.entity';
import { extractRequestMeta } from '../common/dto/request-meta.dto';

@ApiTags('Admin Agenda')
@ApiBearerAuth('JWT-auth')
@Controller('admin/agenda')
@UseGuards(AuthGuard('jwt'))
export class AgendaAdminController {
  constructor(private readonly agendaService: AgendaService) { }

  @Post()
  @ApiOperationDetailed({
    summary: 'Create Agenda Activity',
    description: 'Registers a new community activity or event for the logged-in administrator\'s Puskesmas.',
    useCases: [
      'Creating a new Posyandu schedule',
      'Adding a health campaign event',
      'Scheduling a vaccination program',
      'Adding a health education session'
    ],
    behavior: [
      'Automatically associates the agenda with the admin\'s puskesmas',
      'Validates all required fields (activity_name, date, time, location)',
      'Stores the activity in the database with timestamps'
    ],
    notes: [
      'Requires authentication with valid JWT token',
      'Only OPERATOR role can create agendas for their assigned puskesmas',
      'The date should be in YYYY-MM-DD format'
    ]
  })
  @ApiBody({ type: CreateAgendaDto, description: 'Agenda activity data' })
  @ApiStandardResponse({ type: Agenda, status: 201, description: 'Agenda activity created successfully' })
  @ApiErrorResponses()
  create(@Req() req: any, @Body() createAgendaDto: CreateAgendaDto) {
    return this.agendaService.create(createAgendaDto, extractRequestMeta(req));
  }

  @Get()
  @ApiOperationDetailed({
    summary: 'List All Agenda Activities (Admin)',
    description: 'Returns a paginated list of all activities for the admin\'s puskesmas.',
    useCases: [
      'Viewing all scheduled activities',
      'Checking upcoming events',
      'Admin dashboard activity overview'
    ],
    behavior: [
      'Filters results by the admin\'s puskesmas (tenant isolation)',
      'Supports pagination with page and limit parameters',
      'Excludes soft-deleted activities (is_deleted=true)'
    ],
    notes: [
      'Results are sorted by date in ascending order',
      'Default page is 1, default limit is 10',
      'Maximum limit is 100 items per page'
    ]
  })
  @ApiPaginationParams()
  @ApiPaginatedResponse({ type: Agenda, description: 'Paginated list of agenda activities' })
  @ApiErrorResponses()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    return this.agendaService.findAll(p, l);
  }

  @Get(':id')
  @ApiOperationDetailed({
    summary: 'Get Agenda Activity Details',
    description: 'Returns detailed information for a specific agenda activity.',
    useCases: [
      'Viewing full details of a specific event',
      'Editing an existing activity',
      'Checking activity details before update'
    ],
    behavior: [
      'Validates the agenda belongs to the admin\'s puskesma',
      'Returns 404 if agenda not found or belongs to different puskesma'
    ]
  })
  @ApiUuidParam('id', 'UUID of the agenda activity to retrieve')
  @ApiStandardResponse({ type: Agenda, description: 'Agenda activity details' })
  @ApiErrorResponses()
  findOne(@Param('id') id: string) {
    return this.agendaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperationDetailed({
    summary: 'Update Agenda Activity',
    description: 'Updates an existing agenda activity with new information.',
    useCases: [
      'Changing activity time or location',
      'Updating activity name',
      'Modifying the date of an event'
    ],
    behavior: [
      'Validates the agenda belongs to the admin\'s puskesma',
      'Only updates provided fields (partial update)',
      'Tracks update timestamp automatically'
    ],
    notes: [
      'All fields are optional for partial updates',
      'The effective_date can be modified for recurring events'
    ]
  })
  @ApiUuidParam('id', 'UUID of the agenda activity to update')
  @ApiBody({ type: UpdateAgendaDto, description: 'Fields to update' })
  @ApiStandardResponse({ type: Agenda, description: 'Agenda activity updated successfully' })
  @ApiErrorResponses()
  update(@Req() req: any, @Param('id') id: string, @Body() updateAgendaDto: UpdateAgendaDto) {
    return this.agendaService.update(id, updateAgendaDto, extractRequestMeta(req));
  }

  @Delete(':id')
  @ApiOperationDetailed({
    summary: 'Soft Delete Agenda Activity',
    description: 'Marks an agenda activity as deleted without permanently removing it.',
    useCases: [
      'Cancelling a scheduled event',
      'Removing outdated activities',
      'Hiding activities from public view'
    ],
    behavior: [
      'Sets is_deleted flag to true instead of removing record',
      'Activity will be hidden from public endpoints',
      'Can be restored by updating is_deleted back to false'
    ],
    notes: [
      'This is a soft delete - data is not permanently removed',
      'The activity can be restored manually in the database'
    ]
  })
  @ApiUuidParam('id', 'UUID of the agenda activity to delete')
  @ApiSuccessResponse('Agenda activity deleted successfully', 'Agenda activity has been marked as deleted')
  @ApiErrorResponses()
  remove(@Req() req: any, @Param('id') id: string) {
    return this.agendaService.remove(id, extractRequestMeta(req));
  }
}
