import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  username: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  subject: string;

  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  message: string;

  @IsNotEmpty({ message: 'Mohon centang reCAPTCHA' })
  @IsString()
  recaptchaToken: string;
}