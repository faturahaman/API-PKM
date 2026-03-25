import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new Consultation request
 * 
 * Required fields:
 * - username: Name of the person requesting consultation
 * - subject: Subject/topic of consultation
 * - message: Detailed message describing the consultation request
 * - recaptchaToken: reCAPTCHA verification token
 * 
 * Optional fields:
 * - email: Email address for response
 * 
 * @example
 * {
 *   username: "John Doe",
 *   email: "john@example.com",
 *   subject: "Informasi Layanan",
 *   message: "Saya ingin bertanya tentang jam layanan puskesma",
 *   recaptchaToken: "03AGdBq25..."
 * }
 */
export class CreateConsultationDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the person requesting consultation',
    required: true,
    type: String,
    maxLength: 100
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @SanitizeText()
  username: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Email address for response (optional)',
    required: false,
    type: String,
    format: 'email',
    maxLength: 100
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'Informasi Layanan',
    description: 'Subject or topic of the consultation request',
    required: true,
    type: String,
    maxLength: 200
  })
  @IsNotEmpty({ message: 'Subject is required' })
  @IsString()
  @SanitizeText()
  subject: string;

  @ApiProperty({
    example: 'Saya ingin bertanya tentang jam layanan dan prosedur berobat di puskesma',
    description: 'Detailed message describing the consultation request',
    required: true,
    type: String,
    maxLength: 2000
  })
  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  @SanitizeText()
  message: string;

  @ApiProperty({
    example: '03AGdBq25...',
    description: 'reCAPTCHA v3 verification token. Required to prevent spam submissions.',
    required: true,
    type: String,
    writeOnly: true
  })
  @IsNotEmpty({ message: 'Mohon centang reCAPTCHA' })
  @IsString()
  recaptchaToken: string;
}
