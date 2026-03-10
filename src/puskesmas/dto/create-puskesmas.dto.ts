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
}
