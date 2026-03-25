import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ReviewCategory } from '../entity/review.entity';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new Review
 * 
 * Required fields:
 * - message: Review message content
 * - category: Category of the review
 * - recaptchaToken: reCAPTCHA verification token
 * 
 * Optional fields:
 * - username: Name of the reviewer (optional, auto-generated if not provided)
 */
export class CreateReviewDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Name of the reviewer. If not provided, system will auto-generate.',
    required: false,
    type: String,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @SanitizeText()
  username?: string;

  @ApiProperty({
    example: 'Pelayanan sangat memuaskan, staff ramah dan profesional',
    description: 'Review message content',
    required: true,
    type: String,
    maxLength: 1000
  })
  @IsNotEmpty({ message: 'Isi pesan review wajib diisi' })
  @IsString()
  @SanitizeText()
  message: string;

  @ApiProperty({
    enum: ReviewCategory,
    example: ReviewCategory.PELAYANAN,
    description: 'Category of the review',
    required: true,
    enumName: 'ReviewCategory'
  })
  @IsNotEmpty({ message: 'Kategori wajib dipilih' })
  @IsEnum(ReviewCategory, { message: 'Kategori tidak valid' })
  category: ReviewCategory;

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