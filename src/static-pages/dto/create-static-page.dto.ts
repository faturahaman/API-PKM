import { IsString, IsNotEmpty, IsOptional, Allow } from 'class-validator';
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

    @Allow()
    @Transform(({ value }) => (value === '0' || value === '' || value === 'null' || value === 'undefined') ? null : value)
    menu_id?: string | null;
}
