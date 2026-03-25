import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MinLength, IsOptional, IsEnum, Matches, IsNotEmpty, IsUUID } from "class-validator";
import { SanitizeText } from "../../common/decorators/sanitize.decorator";
import { AdminRole } from "../entity/admin.entity";

export class CreateUserDto {
    @ApiProperty({ example: 'admin123', description: 'Username of the user' })
    @IsString()
    @SanitizeText()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Nama hanya boleh huruf dan angka, tanpa spasi atau karakter khusus' })
    name: string;

    @ApiProperty({ example: 'password123', description: 'User password (min 8 chars)' })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiPropertyOptional({ enum: AdminRole, example: AdminRole.OPERATOR })
    @IsOptional()
    @IsEnum(AdminRole)
    role?: AdminRole;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsOptional()
    @IsUUID()
    puskesmas_id?: string;

    @ApiPropertyOptional({ example: 'v3_recaptcha_token', description: 'Google reCAPTCHA v3 token' })
    @IsOptional()
    @IsString()
    recaptchaToken?: string;
}
