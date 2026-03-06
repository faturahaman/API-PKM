import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PuskesmasStatus } from '../entity/puskesmas.entity';

export class CreatePuskesmasDto {
    @IsString()
    name: string;

    @IsString()
    slug: string;

    @IsString()
    @IsOptional()
    alamat?: string;

    @IsString()
    @IsOptional()
    logo_path?: string;

    @IsString()
    @IsOptional()
    primary_color?: string;

    @IsEnum(PuskesmasStatus)
    @IsOptional()
    status?: PuskesmasStatus;
}
