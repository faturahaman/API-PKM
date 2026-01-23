import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGalleryDto {
  @IsNotEmpty()
  @IsString()
  image_title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  album_id: string;
}