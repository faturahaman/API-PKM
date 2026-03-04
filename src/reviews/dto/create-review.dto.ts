import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ReviewCategory } from '../entity/review.entity';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  @SanitizeText()
  username?: string;

  @IsNotEmpty({ message: 'Isi pesan review wajib diisi' })
  @IsString()
  @SanitizeText()
  message: string;

  @IsNotEmpty({ message: 'Kategori wajib dipilih' })
  @IsEnum(ReviewCategory, { message: 'Kategori tidak valid' })
  category: ReviewCategory;

  @IsNotEmpty({ message: 'Mohon centang reCAPTCHA' })
  @IsString()
  recaptchaToken: string;
}