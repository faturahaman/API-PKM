import { Controller, Get, Param, Query } from '@nestjs/common';
import { AgendaService } from './agenda.service';

@Controller('agenda') 
export class AgendaPublicController {
  constructor(private readonly agendaService: AgendaService) {}

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const p = page ? parseInt(page) : 1;
    const l = limit ? parseInt(limit) : 10;
    return this.agendaService.findAll(p, l); 
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendaService.findOne(id);
  }
}