import { IsString, IsNotEmpty, IsOptional, Allow, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { SanitizeHtml, SanitizeText } from '../../common/decorators/sanitize.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new Static Page
 * 
 * Required fields:
 * - title: Title of the static page
 * 
 * Optional fields:
 * - static_content: HTML content of the static page
 * - menu_id: UUID of the menu to link with
 * - force_replace: Whether to replace existing menu links
 */
export class CreateStaticPageDto {
    @ApiProperty({
        example: 'Layanan Kesehatan',
        description: 'Title of the static page',
        required: true,
        type: String,
        maxLength: 255
    })
    @SanitizeText()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({
        example: '<p>Berikut adalah layanan kesehatan yang tersedia...</p>',
        description: 'HTML content of the static page',
        required: false,
        type: String
    })
    @SanitizeHtml()
    @IsString()
    @IsOptional()
    static_content?: string;

    @ApiPropertyOptional({
        example: false,
        description: 'If true, system will unlink other static pages connected to this menu (1 menu = 1 static page)',
        required: false,
        type: Boolean,
        default: false
    })
    // Jika true: sistem akan melepas tautan static page lain yang sudah terhubung ke menu ini
    // (aturan 1 menu = 1 static page).
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === true || value === 'true' || value === 1 || value === '1') return true;
        if (value === false || value === 'false' || value === 0 || value === '0') return false;
        return undefined;
    })
    force_replace?: boolean;

    @ApiPropertyOptional({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of the menu to link with this static page',
        required: false,
        type: String,
        format: 'uuid',
        nullable: true
    })
    @Allow()
    @Transform(({ value }) => (value === '0' || value === '' || value === 'null' || value === 'undefined') ? null : value)
    menu_id?: string | null;
}
