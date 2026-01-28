import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  album_title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  album_cover?: string;

  @IsArray()
  @IsOptional()
  photo_ids: string[];
}