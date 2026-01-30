// create-album.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateAlbumDto {
    @IsString()
    @IsNotEmpty()
    album_title: string;

    @IsOptional()
    @IsString()
    description?: string;

    // 👇 Tambahkan ini agar tidak error saat diakses (Data.album_cover)
    @IsOptional()
    @IsString()
    album_cover?: string; 

    @IsOptional()
    @IsArray()
    photo_ids?: string[];
}