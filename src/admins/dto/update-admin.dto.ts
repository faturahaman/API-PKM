import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsEnum, Matches, IsUUID, ValidateIf } from 'class-validator';
import { AdminRole } from '../entity/admin.entity';

/**
 * Data Transfer Object for updating an existing Admin user
 * 
 * All fields are optional - only provided fields will be updated.
 * 
 * Optional fields:
 * - name: Updated username
 * - password: New password (minimum 8 characters)
 * - password_confirmation: Password confirmation (must match password)
 * - photo: Profile photo filename/path
 * - role: Admin role (OPERATOR or SUPER_ADMIN)
 * - puskesmas_id: UUID of assigned puskesma
 * 
 * @example
 * // Update name only
 * {
 *   name: "new_admin_name"
 * }
 * 
 * @example
 * // Update role and puskesma
 * {
 *   role: "SUPER_ADMIN",
 *   puskesmas_id: "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
export class UpdateAdminDto {
    @ApiPropertyOptional({
        example: 'admin_updated',
        description: 'New username. Must contain only letters and numbers, no spaces or special characters.',
        required: false,
        type: String,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9]+$'
    })
    @IsOptional()
    @IsString()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Nama hanya boleh huruf dan angka, tanpa spasi atau karakter khusus' })
    name?: string;

    @ApiPropertyOptional({
        example: 'new_password123',
        description: 'New password. Minimum 8 characters. If provided, password_confirmation is required.',
        required: false,
        type: String,
        minLength: 8,
        maxLength: 100,
        writeOnly: true
    })
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @ApiPropertyOptional({
        example: 'new_password123',
        description: 'Password confirmation. Must match password if password is provided.',
        required: false,
        type: String,
        writeOnly: true
    })
    @IsOptional()
    @IsString()
    password_confirmation?: string;

    @ApiPropertyOptional({
        example: 'profile.jpg',
        description: 'Profile photo filename or path. Upload separately via /admin/profile endpoint.',
        required: false,
        type: String
    })
    @IsOptional()
    @IsString()
    photo?: string;

    @ApiPropertyOptional({
        enum: AdminRole,
        example: AdminRole.SUPER_ADMIN,
        description: 'Updated role. Changing to OPERATOR requires puskesmas_id.',
        required: false,
        enumName: 'AdminRole'
    })
    @IsOptional()
    @IsEnum(AdminRole)
    role?: AdminRole;

    @ApiPropertyOptional({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of the puskesma to assign. Required when changing role to OPERATOR.',
        required: false,
        type: String,
        format: 'uuid'
    })
    @IsOptional()
    @ValidateIf(o => o.puskesmas_id !== '' && o.puskesmas_id !== null)
    @IsUUID()
    puskesmas_id?: string | null;
}
