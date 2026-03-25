import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsEnum, Matches, IsUUID, ValidateIf } from 'class-validator';
import { SanitizeText } from '../../common/decorators/sanitize.decorator';
import { AdminRole } from '../entity/admin.entity';

/**
 * Data Transfer Object for creating a new Admin user
 * 
 * Required fields:
 * - name: Unique username for the admin
 * - password: Admin password (minimum 8 characters)
 * 
 * Conditional required fields:
 * - puskesmas_id: Required when role is OPERATOR
 * 
 * Optional fields:
 * - role: Role of the admin (defaults to OPERATOR)
 * - puskesmas_id_super: UUID of primary puskesmas for SUPER_ADMIN
 * 
 * @example
 * // Create OPERATOR
 * {
 *   name: "admin123",
 *   password: "password123",
 *   role: "OPERATOR",
 *   puskesmas_id: "550e8400-e29b-41d4-a716-446655440000"
 * }
 * 
 * @example
 * // Create SUPER_ADMIN
 * {
 *   name: "superadmin",
 *   password: "password123",
 *   role: "SUPER_ADMIN",
 *   puskesmas_id_super: "550e8400-e29b-41d4-a716-446655440000"
 * }
 */
export class CreateAdminDto {
    @ApiProperty({
        example: 'admin123',
        description: 'Unique username for the admin. Must contain only letters and numbers, no spaces or special characters.',
        required: true,
        type: String,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9]+$'
    })
    @IsString()
    @SanitizeText()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Nama hanya boleh huruf dan angka, tanpa spasi atau karakter khusus' })
    name: string;

    @ApiProperty({
        example: 'password123',
        description: 'Admin password. Minimum 8 characters. Should be changed after first login.',
        required: true,
        type: String,
        minLength: 8,
        maxLength: 100,
        writeOnly: true
    })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiPropertyOptional({
        enum: AdminRole,
        example: AdminRole.OPERATOR,
        description: 'Role of the admin. OPERATOR manages a single puskesmas, SUPER_ADMIN has system-wide access. Defaults to OPERATOR.',
        required: false,
        enumName: 'AdminRole',
        default: AdminRole.OPERATOR
    })
    @IsOptional()
    @IsEnum(AdminRole)
    role?: AdminRole;

    @ApiPropertyOptional({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of the primary puskesmas to manage. **Required when role is OPERATOR.** Optional for SUPER_ADMIN.',
        required: false,
        type: String,
        format: 'uuid'
    })
    @ValidateIf(o => o.role === AdminRole.OPERATOR)
    @IsUUID()
    puskesmas_id?: string;

    @ApiPropertyOptional({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of the primary puskesmas for SUPER_ADMIN. Used for default tenant context switching.',
        required: false,
        type: String,
        format: 'uuid'
    })
    @ValidateIf(o => !o.role || o.role === AdminRole.SUPER_ADMIN)
    @IsOptional()
    @IsUUID()
    puskesmas_id_super?: string;
}
