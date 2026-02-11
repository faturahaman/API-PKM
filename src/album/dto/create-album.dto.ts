import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';

export class CreateAlbumDto {
    @IsString()
    @IsNotEmpty()
    @SanitizeText()
    album_title: string;

    @IsOptional()
    @IsString()
    @SanitizeText()
    description?: string;

    @IsOptional()
    @IsString()
    album_cover?: string;

    @IsOptional()
    @IsArray()
    photo_ids?: string[];
}