import {
  Controller, Get, Param, Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ApiStandardResponse, ApiPaginatedResponse, ApiErrorResponses } from '../common/decorators/api-docs.decorator';
import { AgendaService } from './agenda.service';
import { Agenda } from './entity/agenda.entity';

@ApiTags('Public Agenda')
@Controller('agenda')
export class AgendaPublicController {
  constructor(private readonly agendaService: AgendaService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all public agenda items',
    description: 'Returns a paginated list of upcoming activities and events. Filterable by Puskesmas.'
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'puskesmas_id', required: false, description: 'Filter by Puskesmas UUID' })
  @ApiPaginatedResponse({ type: Agenda, description: 'Agenda items retrieved successfully' })
  @ApiErrorResponses()
  findAllPublic(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('puskesmas_id') puskesmasId: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;

    return this.agendaService.findAll(p, l, puskesmasId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get agenda item details',
    description: 'Returns specific data for a single agenda activity.'
  })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiStandardResponse({ type: Agenda, description: 'Agenda item details found' })
  @ApiErrorResponses()
  findOnePublic(@Param('id') id: string) {
    return this.agendaService.findOne(id);
  }
}