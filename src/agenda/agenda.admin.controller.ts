import {
  Controller, Get, Post, Body, Param, Delete, Patch, Query, UseGuards, Request
} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { AuthGuard } from '@nestjs/passport';
import { extractRequestMeta } from '../common/dto/request-meta.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('admin/agenda')
export class AgendaAdminController {
  constructor(private readonly agendaService: AgendaService) { }

  @Post()
  create(@Request() req: any, @Body() createAgendaDto: CreateAgendaDto) {
    return this.agendaService.create(createAgendaDto, extractRequestMeta(req));
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    return this.agendaService.findAll(p, l);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendaService.findOne(id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateData: UpdateAgendaDto) {
    return this.agendaService.update(id, updateData, extractRequestMeta(req));
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.agendaService.remove(id, extractRequestMeta(req));
  }
}