import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdminDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @IsOptional()
    @IsString()
    photo?: string;
}
