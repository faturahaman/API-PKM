import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('kritik_saran')
@Index('idx_kritik_saran_puskesmas_created', ['puskesmas_id', 'created_at'])
export class KritikSaran {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'John Doe' })
    @Column()
    nama: string;

    @ApiPropertyOptional({ example: 'john@example.com' })
    @Column({ nullable: true })
    email: string;

    @ApiProperty({ example: '081234567890' })
    @Column()
    no_hp: string;

    @ApiProperty({ example: 'Mohon ditambahkan layanan poliklinik anak pada hari Senin' })
    @Column({ type: 'text' })
    pesan: string;

    @ApiProperty({ enum: ['kritik', 'saran'], example: 'saran' })
    @Column({ type: 'enum', enum: ['kritik', 'saran'], default: 'saran' })
    kategori: string;

    @ApiProperty({ example: 0, description: '0 = baru, 1 = dibaca/diproses, 2 = ditindaklanjuti' })
    @Column({ type: 'int', default: 0 })
    status: number;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    puskesmas_id: string;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @UpdateDateColumn()
    updated_at: Date;
}
