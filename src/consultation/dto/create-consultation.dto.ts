import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  username: string;

  @IsOptional()
  @IsString()
  @SanitizeText()
  phone_number?: string;

  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  subject: string;

  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  message: string;
}