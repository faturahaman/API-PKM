import { IsString, IsNotEmpty, IsOptional, Allow, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { SanitizeHtml, SanitizeText } from '../../common/decorators/sanitize.decorator';

export class CreateStaticPageDto {
    @SanitizeText()
    @IsString()
    @IsNotEmpty()
    title: string;

    @SanitizeHtml()
    @IsString()
    @IsOptional()
    static_content?: string;

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

    @Allow()
    @Transform(({ value }) => (value === '0' || value === '' || value === 'null' || value === 'undefined') ? null : value)
    menu_id?: string | null;
}
