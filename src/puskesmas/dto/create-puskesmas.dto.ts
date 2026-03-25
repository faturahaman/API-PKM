import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PuskesmasStatus } from '../entity/puskesmas.entity';

/**
 * Data Transfer Object for creating a new Puskesmas
 * 
 * Required fields:
 * - name: Name of the health center
 * - slug: Unique URL-friendly identifier
 * 
 * Optional fields:
 * - status: Current operational status (defaults to ACTIVE)
 * - suspended_reason: Reason for suspension (when status is SUSPENDED)
 * - maintenance_message: Message shown during maintenance mode
 * - deactivated_reason: Reason for deactivation (when status is INACTIVE)
 */
export class CreatePuskesmasDto {
    @ApiProperty({
        example: 'Puskesmas Bogor Tengah',
        description: 'Official name of the health center. Max 255 characters.',
        required: true,
        type: String,
        maxLength: 255
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'pkm-bogor-tengah',
        description: 'Unique URL-friendly identifier (slug). Used for tenant identification. Must be lowercase with hyphens allowed. Max 100 characters.',
        required: true,
        type: String,
        maxLength: 100,
        pattern: '^[a-z0-9-]+$'
    })
    @IsString()
    slug: string;

    @ApiPropertyOptional({
        enum: PuskesmasStatus,
        example: PuskesmasStatus.ACTIVE,
        description: 'Operational status of the health center. Defaults to ACTIVE.',
        required: false,
        enumName: 'PuskesmasStatus',
        default: PuskesmasStatus.ACTIVE
    })
    @IsEnum(PuskesmasStatus)
    @IsOptional()
    status?: PuskesmasStatus;

    @ApiPropertyOptional({
        example: 'Violation of terms of service',
        description: 'Reason for suspension. Required when setting status to SUSPENDED. Max 500 characters.',
        required: false,
        type: String,
        maxLength: 500
    })
    @IsString()
    @IsOptional()
    suspended_reason?: string;

    @ApiPropertyOptional({
        example: 'System upgrade in progress',
        description: 'Custom message displayed to users during maintenance mode. Max 500 characters.',
        required: false,
        type: String,
        maxLength: 500
    })
    @IsString()
    @IsOptional()
    maintenance_message?: string;

    @ApiPropertyOptional({
        example: 'Contract ended',
        description: 'Reason for deactivation. Required when setting status to INACTIVE. Max 500 characters.',
        required: false,
        type: String,
        maxLength: 500
    })
    @IsString()
    @IsOptional()
    deactivated_reason?: string;
}
