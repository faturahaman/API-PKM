import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultationDto } from './create-consultation.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';

export class UpdateConsultationDto extends PartialType(CreateConsultationDto) {
  @IsOptional()
  @IsString()
  @SanitizeText()
  answer?: string;

  @IsOptional()
  @IsBoolean()
  is_answer?: boolean;

  @IsOptional()
  @IsBoolean()
  is_publish?: boolean;
}