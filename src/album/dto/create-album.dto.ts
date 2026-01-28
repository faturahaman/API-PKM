import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  album_title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray() // 👈 Pastikan ini array
  @IsOptional()
  photo_ids: string[];
}