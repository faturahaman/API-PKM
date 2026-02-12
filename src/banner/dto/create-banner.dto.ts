import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBannerDto {
  // Kita buat optional di validasi, karena path-nya akan di-isi otomatis dari Controller hasil upload
  @IsString()
  @IsOptional()
  image_path?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1' || value === 1) return true;
    if (value === 'false' || value === '0' || value === 0) return false;
    return value;
  })
  @IsBoolean()
  is_publish?: boolean;
}