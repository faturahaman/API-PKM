import { IsString, IsNotEmpty, IsOptional, IsInt, Allow, IsEnum } from 'class-validator';
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

    @Allow()
    @Transform(({ value }) => (value === '0' || value === '' || value === 'null' || value === 'undefined') ? null : value)
    menu_id?: string | null;

    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value && !isNaN(Number(value)) ? Number(value) : undefined)
    status?: number;
}
