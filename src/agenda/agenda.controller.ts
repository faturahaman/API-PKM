import { 
  Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards 
} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/agenda') // Prefix URL
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createAgendaDto: CreateAgendaDto) {
    return this.agendaService.create(createAgendaDto);
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

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateAgendaDto) {
    return this.agendaService.update(id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendaService.remove(id);
  }
}