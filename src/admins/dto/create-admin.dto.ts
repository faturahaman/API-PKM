import { IsString, MinLength, IsOptional, IsEnum, Matches } from 'class-validator';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';
import { AdminRole } from '../entity/admin.entity';

// DTO untuk membuat admin baru (tanpa recaptcha)
export class CreateAdminDto {
    @IsString()
    @SanitizeText()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Nama hanya boleh huruf dan angka, tanpa spasi atau karakter khusus' })
    name: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsEnum(AdminRole)
    level?: AdminRole;
}
