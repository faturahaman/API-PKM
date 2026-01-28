import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGalleryDto {
  @IsNotEmpty()
  @IsString()
  image_title: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  album_id?: string;
}