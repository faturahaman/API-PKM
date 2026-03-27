import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Puskesmas } from '../../puskesmas/entity/puskesmas.entity';

/**
 * Admin role enumeration
 * Defines the role levels for admin users in the system
 */
export enum AdminRole {
    /** Operator - manages a single puskesmas */
    OPERATOR = 'OPERATOR',
    /** Super Admin - has system-wide administrative access */
    SUPER_ADMIN = 'SUPER_ADMIN',
}

/**
 * Admin entity representing system administrators
 * 
 * Roles:
 * - OPERATOR: Can manage their assigned puskesmas only
 * - SUPER_ADMIN: Can manage all puskesmas and other admins
 * 
 * Relationships:
 * - Each OPERATOR is linked to one puskesmas via puskesmas_id
 * - SUPER_ADMIN can have a default puskesma for tenant context
 */
@Entity('admins')
export class Admin {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Unique identifier (UUID)',
        type: String,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'admin123',
        description: 'Unique username for authentication',
        type: String
    })
    @Column({ unique: true })
    name: string;

    @ApiPropertyOptional({
        example: '/files/profile/photo.jpg',
        description: 'URL to profile photo. Null if not set.',
        type: String,
        nullable: true
    })
    @Column({ nullable: true })
    photo: string;

    @ApiProperty({
        enum: AdminRole,
        example: AdminRole.OPERATOR,
        description: 'Role determining access level',
        enumName: 'AdminRole'
    })
    @Column({
        type: 'enum',
        enum: AdminRole,
        default: AdminRole.OPERATOR,
    })
    role: string;

    @ApiProperty({
        description: 'Bcrypt hashed password (never exposed in API)',
        type: String,
        writeOnly: true
    })
    @Column()
    password: string;

    @ApiPropertyOptional({
        description: 'Current JWT token for session management. Null if logged out.',
        type: String,
        nullable: true
    })
    @Column({ nullable: true, type: 'text' })
    current_token: string;

    @ApiProperty({
        example: 1,
        description: 'Token version for session invalidation. Incremented on password change or logout.',
        type: Number,
        default: 1
    })
    @Column({ default: 1 })
    token_version: number;

    @ApiPropertyOptional({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of the puskesmas this operator manages. Required for OPERATOR role.',
        type: String,
        format: 'uuid',
        nullable: true
    })
    @Column({ type: 'uuid', nullable: true })
    puskesmas_id: string | null;

    @ApiPropertyOptional({
        description: 'Relation to the puskeswan this admin manages',
        type: () => Puskesmas,
        nullable: true
    })
    @ManyToOne(() => Puskesmas, { nullable: true, eager: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'puskesmas_id' })
    puskesmas: Puskesmas | null;

    @ApiProperty({
        example: '2026-03-24T21:19:36Z',
        description: 'Timestamp when the admin was created',
        type: String,
        format: 'date-time'
    })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({
        example: '2026-03-24T21:19:36Z',
        description: 'Timestamp when the admin was last updated',
        type: String,
        format: 'date-time'
    })
    @UpdateDateColumn()
    updated_at: Date;
}
