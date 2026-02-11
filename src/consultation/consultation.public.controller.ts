import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Controller('consultation')
export class ConsultationPublicController {
  constructor(private readonly consultationService: ConsultationService) {}
  @Post()
  create(@Body() createDto: CreateConsultationDto) {
    return this.consultationService.create(createDto);
  }
}