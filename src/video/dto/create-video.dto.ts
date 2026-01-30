import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVideoDto {
    @IsNotEmpty()
    @IsString()
    video_title: string;

    @IsOptional()
    @IsString()
    video_desc?: string;

    @IsOptional()
    @IsString()
    embed_url?: string;

    @IsNotEmpty()
    @Transform(({ value }) => {
        if (value === '1' || value === 1) return true;
        if (value === '0' || value === 0) return false;

        return value === 'true' ? true : value === 'false' ? false : value;
    })
    @IsBoolean()
    is_embed: boolean;
}