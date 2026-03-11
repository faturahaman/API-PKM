import { IsOptional, IsString, MinLength, IsEnum, Matches, IsUUID } from 'class-validator';
import { AdminRole } from '../entity/admin.entity';
import { ValidateIf } from 'class-validator';
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
    password_confirmation?: string;

    @IsOptional()
    @IsString()
    photo?: string;

    @IsOptional()
    @IsEnum(AdminRole)
    role?: AdminRole;

    // cukup optional saja
    @ValidateIf(o => o.puskesmas_id !== '' && o.puskesmas_id !== null)
    @IsUUID()
    puskesmas_id?: string;
}