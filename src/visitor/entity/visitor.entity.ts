import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('visitors')
@Index('IDX_UNIQUE_VISITOR', ['ip_address', 'visit_date', 'puskesmas_id'], { unique: true })
export class Visitor {
    @ApiProperty({ example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Index('IDX_VISITOR_PUSKESMAS')
    @Column({ nullable: true })
    puskesmas_id: string;

    @ApiProperty({ example: '192.168.1.1' })
    @Column()
    ip_address: string;

    @ApiPropertyOptional({ example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...' })
    @Column({ type: 'text', nullable: true })
    user_agent: string;

    @ApiPropertyOptional({ example: '/home' })
    @Column({ nullable: true })
    path: string;

    @ApiProperty({ example: '2026-03-25' })
    @Index('IDX_VISITOR_DATE')
    @Column({ type: 'date' })
    visit_date: string;

    @ApiProperty({ example: '2026-03-25T00:00:00Z' })
    @CreateDateColumn()
    created_at: Date;
}