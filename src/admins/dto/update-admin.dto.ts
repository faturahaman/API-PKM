import { IsOptional, IsString, MinLength, IsEnum, Matches } from 'class-validator';
import { AdminRole } from '../entity/admin.entity';

export class UpdateAdminDto {
    @IsOptional()
    @IsString()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Nama hanya boleh huruf dan angka, tanpa spasi atau karakter khusus' })
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @IsOptional()
    @IsString()
    photo?: string;

    @IsOptional()
    @IsEnum(AdminRole)
    level?: AdminRole;
}
