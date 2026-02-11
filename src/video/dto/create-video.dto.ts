import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';

export class CreateVideoDto {
    @IsNotEmpty()
    @IsString()
    @SanitizeText()
    video_title: string;

    @IsOptional()
    @IsString()
    @SanitizeText()
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