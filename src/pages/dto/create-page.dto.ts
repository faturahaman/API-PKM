import { IsString, IsNotEmpty, IsOptional, IsInt, Allow, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { SanitizeHtml, SanitizeText } from '../../common/decorators/sanitize.decorator';

export class CreatePageDto {
    @SanitizeText()
    @IsString()
    @IsOptional()
    user_id?: string;

    @SanitizeText()
    @IsString()
    @IsNotEmpty()
    title: string;

    @SanitizeHtml()
    @IsString()
    @IsOptional()
    dynamic_content?: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    file?: string;

    @IsEnum(['pdf', 'halaman', 'kartu'])
    @IsOptional()
    type?: 'pdf' | 'halaman' | 'kartu';

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

    @Allow()
    @Transform(({ value }) => (value === '0' || value === '' || value === 'null' || value === 'undefined') ? null : value)
    menu_id?: string | null;

    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value && !isNaN(Number(value)) ? Number(value) : undefined)
    status?: number;
}
