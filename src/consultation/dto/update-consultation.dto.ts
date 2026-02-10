import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultationDto } from './create-consultation.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateConsultationDto extends PartialType(CreateConsultationDto) {
  @IsOptional()
  @IsBoolean()
  is_answer?: boolean;

  @IsOptional()
  @IsBoolean()
  is_publish?: boolean;
}