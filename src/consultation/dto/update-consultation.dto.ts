import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultationDto } from './create-consultation.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating a Consultation request
 * 
 * Extends CreateConsultationDto with additional fields for admin response.
 */
export class UpdateConsultationDto extends PartialType(CreateConsultationDto) {
  @ApiPropertyOptional({
    example: 'Terima kasih atas pertanyaan Anda. Layanan puskesma buka setiap hari Senin-Jumat pukul 07:00-14:00.',
    description: 'Answer/response to the consultation request',
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  @SanitizeText()
  answer?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the consultation has been answered',
    required: false,
    type: Boolean,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  is_answer?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the consultation answer should be published publicly',
    required: false,
    type: Boolean,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  is_publish?: boolean;
}