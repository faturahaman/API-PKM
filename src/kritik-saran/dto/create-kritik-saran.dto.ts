import { IsString, IsOptional, IsEmail, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateKritikSaranDto {
    @IsString()
    @Transform(({ value }) => value?.trim())
    nama: string;

    @IsOptional()
    @IsEmail()
    @Transform(({ value }) => value?.trim())
    email?: string;

    @IsString()
    @Transform(({ value }) => value?.trim())
    no_hp: string;

    @IsString()
    @Transform(({ value }) => value?.trim())
    pesan: string;

    @IsOptional()
    @IsEnum(['kritik', 'saran'])
    kategori?: string = 'saran';
}

export class UpdateKritikSaranDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(2)
    status?: number;
}

export class KritikSaranQueryDto {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    limit?: number = 10;

    @IsOptional()
    @IsEnum(['kritik', 'saran'])
    kategori?: string;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    status?: number;
}
