import { IsString, IsNotEmpty, IsOptional, IsInt, Allow } from 'class-validator';
import { Transform } from 'class-transformer';
import { SanitizeHtml, SanitizeText } from '../../common/decorators/sanitize.decorator';

export class CreatePageDto {
    @SanitizeText()
    @IsString()
    @IsNotEmpty()
    title: string;

    @SanitizeHtml()
    @IsString()
    @IsOptional()
    content?: string;

    @SanitizeText()
    @IsString()
    @IsOptional()
    slug?: string;

    @Allow()
    @Transform(({ value }) => (value === '0' || value === '' || value === 'null' || value === 'undefined') ? null : value)
    menu_id?: string | null;

    @IsString()
    @IsOptional()
    layout?: string;

    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value && !isNaN(Number(value)) ? Number(value) : undefined)
    status?: number;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    file?: string;
}