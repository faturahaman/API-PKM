import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Puskesmas status enumeration
 * Represents the operational state of a health center
 */
export enum PuskesmasStatus {
    /** Active and fully operational */
    ACTIVE = 'ACTIVE',
    /** Inactive/deactivated - not accessible to users */
    INACTIVE = 'INACTIVE',
    /** Suspended due to policy violations or other issues */
    SUSPENDED = 'SUSPENDED',
    /** Under maintenance - limited access for users */
    MAINTENANCE = 'MAINTENANCE',
}

/**
 * Puskesmas entity representing a health center (Puskesmas)
 * 
 * Each puskesmas operates as a separate tenant in the multi-tenant system.
 * The slug is used as the tenant identifier in URLs.
 * 
 * Status transitions:
 * - ACTIVE: Normal operation
 * - MAINTENANCE: Temporary restricted access (users see maintenance message)
 * - SUSPENDED: Restricted access due to policy violation (users see suspension message)
 * - INACTIVE: Permanently deactivated (no access)
 */
@Entity('puskesmas')
export class Puskesmas {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Unique identifier (UUID)',
        type: String,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Puskesmas Bogor Tengah',
        description: 'Official name of the health center',
        type: String,
        maxLength: 255
    })
    @Column()
    name: string;

    @ApiProperty({
        example: 'pkm-bogor-tengah',
        description: 'URL-friendly unique identifier used for tenant routing',
        type: String,
        maxLength: 100
    })
    @Column({ unique: true, length: 100 })
    slug: string;

    @ApiProperty({
        enum: PuskesmasStatus,
        example: PuskesmasStatus.ACTIVE,
        description: 'Current operational status of the health center',
        enumName: 'PuskesmasStatus'
    })
    @Column({
        type: 'enum',
        enum: PuskesmasStatus,
        default: PuskesmasStatus.ACTIVE,
    })
    status: string;

    @ApiPropertyOptional({
        example: 'Violation of terms',
        description: 'Reason for suspension. Populated when status is SUSPENDED.',
        type: String,
        maxLength: 500,
        nullable: true
    })
    @Column({ nullable: true, length: 500 })
    suspended_reason: string;

    @ApiPropertyOptional({
        example: '2026-03-24T21:19:36Z',
        description: 'Timestamp when the puskesmas was suspended. Populated when status changes to SUSPENDED.',
        type: String,
        format: 'date-time',
        nullable: true
    })
    @Column({ type: 'datetime', nullable: true })
    suspended_at: Date;

    @ApiPropertyOptional({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of admin who suspended the puskesmas',
        type: String,
        format: 'uuid',
        nullable: true
    })
    @Column({ nullable: true })
    suspended_by: string;

    @ApiPropertyOptional({
        example: '2026-03-24T21:19:36Z',
        description: 'Timestamp when the puskesmas was deactivated. Populated when status changes to INACTIVE.',
        type: String,
        format: 'date-time',
        nullable: true
    })
    @Column({ type: 'datetime', nullable: true })
    deactivated_at: Date;

    @ApiPropertyOptional({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of admin who deactivated the puskesmas',
        type: String,
        format: 'uuid',
        nullable: true
    })
    @Column({ nullable: true })
    deactivated_by: string;

    @ApiPropertyOptional({
        example: 'Contract ended',
        description: 'Reason for deactivation. Populated when status is INACTIVE.',
        type: String,
        maxLength: 500,
        nullable: true
    })
    @Column({ nullable: true })
    deactivated_reason: string;

    @ApiPropertyOptional({
        example: '2026-03-24T21:19:36Z',
        description: 'Timestamp when the puskesmas was last activated',
        type: String,
        format: 'date-time',
        nullable: true
    })
    @Column({ type: 'datetime', nullable: true })
    activated_at: Date;

    @ApiPropertyOptional({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of admin who activated the puskesmas',
        type: String,
        format: 'uuid',
        nullable: true
    })
    @Column({ nullable: true })
    activated_by: string;

    @ApiPropertyOptional({
        example: '2026-03-24T21:19:36Z',
        description: 'Timestamp when maintenance mode was started',
        type: String,
        format: 'date-time',
        nullable: true
    })
    @Column({ type: 'datetime', nullable: true })
    maintenance_started_at: Date;

    @ApiPropertyOptional({
        example: 'Regular server maintenance',
        description: 'Custom message displayed to users during maintenance mode. Shown when status is MAINTENANCE.',
        type: String,
        maxLength: 500,
        nullable: true
    })
    @Column({ nullable: true })
    maintenance_message: string;

    @ApiProperty({
        example: '2026-03-24T21:19:36Z',
        description: 'Timestamp when the record was created',
        type: String,
        format: 'date-time'
    })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({
        example: '2026-03-24T21:19:36Z',
        description: 'Timestamp when the record was last updated',
        type: String,
        format: 'date-time'
    })
    @UpdateDateColumn()
    updated_at: Date;
}
