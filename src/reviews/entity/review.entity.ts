
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReviewCategory {
    PELAYANAN = 'Pelayanan',
    FASILITAS = 'Fasilitas',
    TENAGA_MEDIS = 'Tenaga Medis',
    LAINNYA = 'Lainnya',
}

@Entity('reviews')
@Index('idx_review_puskesmas_created', ['puskesmas_id', 'created_at'])
export class Review {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tenant isolation
    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    puskesmas_id: string;

    @ApiProperty({ example: 'Anonim' })
    @Column({ default: 'Anonim' })
    username: string;

    @ApiProperty({ example: 'Pelayanan sangat memuaskan!' })
    @Column({ type: 'text' })
    message: string;

    @ApiProperty({ enum: ReviewCategory, example: 'Pelayanan' })
    @Column({
        type: 'enum',
        enum: ReviewCategory,
    })
    category: string;

    @ApiProperty({ example: false })
    @Column({ default: false })
    is_publish: boolean;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @UpdateDateColumn()
    updated_at: Date;
}
