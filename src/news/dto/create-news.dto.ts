import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { SanitizeHtml, SanitizeText } from '../../common/decorators/sanitize.decorator';

export class CreateNewsDto {
  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  username: string;

  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  title: string;

  @IsNotEmpty()
  @IsString()
  @SanitizeHtml()
  content: string;

  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  day: string;

  @IsNotEmpty()
  @IsDateString()
  date: string; // Ubah ke string dulu untuk validasi input

  @IsNotEmpty()
  @IsString()
  @SanitizeText()
  clock: string;

  @IsOptional()
  @IsString()
  image?: string;
}