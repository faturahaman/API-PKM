import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationService } from './consultation.service';
import { ConsultationAdminController } from './consultation.admin.controller';
import { ConsultationPublicController } from './consultation.public.controller';
import { Consultation } from './entity/consultation.entity';
import { EmailModule } from '../email/email.module';
import { LogactivityModule } from '../logactivity/logactivity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation]),
    EmailModule,
    LogactivityModule,
  ],
  controllers: [ConsultationAdminController, ConsultationPublicController],
  providers: [ConsultationService],
})
export class ConsultationModule { }