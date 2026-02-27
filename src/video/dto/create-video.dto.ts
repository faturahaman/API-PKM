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
        return value === 'true' || value === true || value === '1' || value === 1;
    })
    @IsBoolean()
    is_embed: boolean;
}