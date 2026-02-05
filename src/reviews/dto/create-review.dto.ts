import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ReviewCategory } from '../schemas/review.schema';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty({ message: 'Isi pesan review wajib diisi' })
  @IsString()
  message: string;

  @IsNotEmpty({ message: 'Kategori wajib dipilih' })
  @IsEnum(ReviewCategory, { message: 'Kategori tidak valid' })
  category: ReviewCategory;
}