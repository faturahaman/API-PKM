import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationService } from './consultation.service';
import { ConsultationAdminController } from './consultation.admin.controller';
import { ConsultationPublicController } from './consultation.public.controller';
import { Consultation } from './entity/consultation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation])
  ],
  controllers: [ConsultationAdminController, ConsultationPublicController],
  providers: [ConsultationService],
})
export class ConsultationModule { }