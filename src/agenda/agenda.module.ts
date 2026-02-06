import { Module } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { AgendaAdminController } from './agenda.admin.controller';
import { AgendaPublicController } from './agenda.public.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Agenda, AgendaSchema } from './schemas/agenda.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Agenda.name, schema: AgendaSchema }]),
  ],
  controllers: [AgendaAdminController, AgendaPublicController], 
  providers: [AgendaService],
})
export class AgendaModule {}