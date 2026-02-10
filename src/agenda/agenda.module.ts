import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaService } from './agenda.service';
import { AgendaAdminController } from './agenda.admin.controller';
import { AgendaPublicController } from './agenda.public.controller';
import { Agenda } from './entity/agenda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agenda])],
  controllers: [AgendaAdminController, AgendaPublicController],
  providers: [AgendaService],
})
export class AgendaModule { }