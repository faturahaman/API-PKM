import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PuskesmasStatus } from '../entity/puskesmas.entity';

export class CreatePuskesmasDto {
    @IsString()
    name: string;

    @IsString()
    slug: string;

    @IsEnum(PuskesmasStatus)
    @IsOptional()
    status?: PuskesmasStatus;

    @IsString()
    @IsOptional()
    suspended_reason?: string;

    @IsString()
    @IsOptional()
    maintenance_message?: string;

    @IsString()
    @IsOptional()
    deactivated_reason?: string;
}
