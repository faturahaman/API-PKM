import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new Video
 * 
 * Required fields:
 * - video_title: Title of the video
 * - is_embed: Whether the video uses embed URL
 * 
 * Optional fields:
 * - video_desc: Description of the video
 * - embed_url: Embed URL for the video
 */
export class CreateVideoDto {
    @ApiProperty({
        example: 'PuskesmasHealth Talk',
        description: 'Title of the video',
        required: true,
        type: String,
        maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    @SanitizeText()
    video_title: string;

    @ApiPropertyOptional({
        example: 'Video about health awareness',
        description: 'Description of the video content',
        required: false,
        type: String,
        maxLength: 500
    })
    @IsOptional()
    @IsString()
    @SanitizeText()
    video_desc?: string;

    @ApiPropertyOptional({
        example: 'https://youtube.com/embed/abc123',
        description: 'Embed URL for the video (required if is_embed is true)',
        required: false,
        type: String
    })
    @IsOptional()
    @IsString()
    embed_url?: string;

    @ApiProperty({
        example: true,
        description: 'Whether the video uses embed URL. If true, embed_url is required.',
        required: true,
        type: Boolean
    })
    @IsNotEmpty()
    @Transform(({ value }) => {
        return value === 'true' || value === true || value === '1' || value === 1;
    })
    @IsBoolean()
    is_embed: boolean;
}