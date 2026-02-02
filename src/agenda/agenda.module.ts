import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgendaController } from './agenda.controller';
import { AgendaService } from './agenda.service';
import { Agenda, AgendaSchema } from './schemas/agenda.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Agenda.name, schema: AgendaSchema }]),
  ],
  controllers: [AgendaController],
  providers: [AgendaService],
})
export class AgendaModule {}