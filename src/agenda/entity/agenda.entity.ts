import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Agenda entity representing scheduled activities/events at a Puskesmas
 * 
 * Each agenda is associated with a single puskesma (tenant) through puskesma_id.
 * Activities can be one-time events or recurring events with an effective date.
 * 
 * Use cases:
 * - Community health programs (Posyandu, KB, dll)
 * - Health campaigns and promotions
 * - Vaccination schedules
 * - Health education sessions
 * 
 * The entity supports soft delete - deleted items are marked as is_deleted=true
 * rather than being permanently removed from the database.
 */
@Entity('agenda')
@Index('idx_agenda_puskesma_created', ['puskesmas_id', 'created_at'])
export class Agenda {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Unique identifier (UUID)',
        type: String,
        format: 'uuid'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of the puskesma (tenant) this agenda belongs to',
        type: String,
        format: 'uuid'
    })
    @Column({ name: 'puskesmas_id', nullable: true })
    puskesmas_id: string;

    @ApiProperty({
        example: 'Posyandu Lansia',
        description: 'Name/title of the activity or event',
        type: String,
        maxLength: 255
    })
    @Column()
    activity_name: string;

    @ApiProperty({
        example: '2026-03-24',
        description: 'Date of the activity',
        type: String,
        format: 'date'
    })
    @Column()
    date: Date;

    @ApiProperty({
        example: '08:00 - 12:00',
        description: 'Time window of the activity (e.g., "09:00 - 12:00")',
        type: String,
        maxLength: 50
    })
    @Column()
    time: string;

    @ApiProperty({
        example: 'Balai Warga RW 05',
        description: 'Location or address where the activity will be held',
        type: String,
        maxLength: 255
    })
    @Column()
    location: string;

    @ApiPropertyOptional({
        example: '2026-03-24',
        description: 'Effective date for recurring events. If set, the agenda is valid from this date onwards. Null for one-time events.',
        type: String,
        format: 'date',
        nullable: true
    })
    @Column({ nullable: true })
    effective_date: string;

    @ApiProperty({
        example: false,
        description: 'Soft delete flag. True indicates the agenda has been deleted but not permanently removed.',
        type: Boolean,
        default: false
    })
    @Column({ default: false })
    is_deleted: boolean;

    @ApiProperty({
        example: '2026-03-24T21:19:36Z',
        description: 'Timestamp when the agenda was created',
        type: String,
        format: 'date-time'
    })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({
        example: '2026-03-24T21:19:36Z',
        description: 'Timestamp when the agenda was last updated',
        type: String,
        format: 'date-time'
    })
    @UpdateDateColumn()
    updated_at: Date;
}
