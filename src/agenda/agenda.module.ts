import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaService } from './agenda.service';
import { AgendaAdminController } from './agenda.admin.controller';
import { AgendaPublicController } from './agenda.public.controller';
import { Agenda } from './entity/agenda.entity';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agenda]),
    LogactivityModule,
  ],
  controllers: [AgendaAdminController, AgendaPublicController],
  providers: [AgendaService],
  exports: [AgendaService],
})
export class AgendaModule { }