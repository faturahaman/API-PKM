import { IsString, MinLength, IsOptional, IsEnum, Matches, IsNotEmpty } from "class-validator";
import { SanitizeText } from "../../common/decorators/sanitize.decorator";
import { AdminRole } from "../entity/admin.entity";

export class CreateUserDto {
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

    // Recaptcha token for authentication (used in auth.service.ts)
    @IsOptional()
    @IsString()
    recaptchaToken?: string;
}
