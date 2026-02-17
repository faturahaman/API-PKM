import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
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
}