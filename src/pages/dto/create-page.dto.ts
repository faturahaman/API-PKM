import { IsString, IsNotEmpty, IsOptional, IsInt, Allow, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { SanitizeHtml, SanitizeText } from '../../common/decorators/sanitize.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new Page
 * 
 * Required fields:
 * - title: Title of the page
 * 
 * Optional fields:
 * - dynamic_content: HTML content of the page
 * - image: Image URL/path
 * - file: File URL/path
 * - type: Type of page (pdf, halaman, kartu)
 * - menu_id: UUID of the menu to link with
 * - status: Page status (1 = aktif, 0 = nonaktif)
 */
export class CreatePageDto {
    @ApiPropertyOptional({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of the admin user creating this page',
        required: false,
        type: String,
        format: 'uuid'
    })
    @SanitizeText()
    @IsString()
    @IsOptional()
    user_id?: string;

    @ApiProperty({
        example: 'Tentang Kami',
        description: 'Title of the page',
        required: true,
        type: String,
        maxLength: 255
    })
    @SanitizeText()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({
        example: '<p>Selamat datang di halaman tentang kami...</p>',
        description: 'HTML content of the page',
        required: false,
        type: String
    })
    @SanitizeHtml()
    @IsString()
    @IsOptional()
    dynamic_content?: string;

    @ApiPropertyOptional({
        example: '/uploads/pages/image.jpg',
        description: 'URL path to the page image',
        required: false,
        type: String
    })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiPropertyOptional({
        example: '/uploads/pages/file.pdf',
        description: 'URL path to the page file',
        required: false,
        type: String
    })
    @IsString()
    @IsOptional()
    file?: string;

    @ApiPropertyOptional({
        enum: ['pdf', 'halaman', 'kartu'],
        example: 'halaman',
        description: 'Type of page: pdf, halaman, or kartu',
        required: false,
        enumName: 'PageType'
    })
    @IsEnum(['pdf', 'halaman', 'kartu'])
    @IsOptional()
    type?: 'pdf' | 'halaman' | 'kartu';

    @ApiPropertyOptional({
        example: false,
        description: 'If true, system will unlink other pages connected to this menu (for type=halaman)',
        required: false,
        type: Boolean,
        default: false
    })
    // Jika true: sistem akan melepas tautan page lain yang sudah terhubung ke menu ini
    // (khusus untuk aturan 1 menu = 1 page tipe 'halaman').
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
        description: 'UUID of the menu to link with this page',
        required: false,
        type: String,
        format: 'uuid',
        nullable: true
    })
    @Allow()
    @Transform(({ value }) => (value === '0' || value === '' || value === 'null' || value === 'undefined') ? null : value)
    menu_id?: string | null;

    @ApiPropertyOptional({
        example: 1,
        description: 'Status of the page: 1 = active, 0 = inactive',
        required: false,
        type: Number,
        default: 1
    })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value && !isNaN(Number(value)) ? Number(value) : undefined)
    status?: number;
}
