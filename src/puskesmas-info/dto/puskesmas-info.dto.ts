import { IsString, IsOptional, IsObject, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePuskesmasInfoDto {
    @IsString()
    web_title: string;

    @IsString()
    @IsOptional()
    logo?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch (e) {
                return {};
            }
        }
        return value;
    })
    @IsObject()
    social_links?: any;

    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsNumber()
    @Type(() => Number)
    lantitude?: number;

    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsNumber()
    @Type(() => Number)
    longtitude?: number;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    contact?: string;
}

export class UpdatePuskesmasInfoDto extends CreatePuskesmasInfoDto { }
