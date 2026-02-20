import { IsString, IsNotEmpty, IsOptional, IsInt, Allow } from 'class-validator';
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

    // FIX: Allow null/empty values for menu_id
    @Allow()
    menu_id?: string | null;

    @IsString()
    @IsOptional()
    layout?: string;

    @IsInt()
    @IsOptional()
    status?: number;

    @IsString()
    @IsOptional()
    image?: string;
}