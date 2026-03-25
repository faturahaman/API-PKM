
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('banners')
@Index('idx_banner_puskesmas_created', ['puskesmas_id', 'created_at'])
export class Banner {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    puskesmas_id: string;

    @ApiProperty({ example: '/uploads/banner/banner-image.jpg' })
    @Column()
    image_path: string;

    @ApiProperty({ example: 'Banner Judul' })
    @Column()
    title: string;

    @ApiPropertyOptional({ example: 'Deskripsi banner...' })
    @Column({ nullable: true })
    description: string;

    @ApiProperty({ example: true })
    @Column({ default: true })
    is_publish: boolean;

    @ApiProperty({ example: 0, description: 'Soft delete flag' })
    @Column({ default: 0, select: false })
    is_deleted: number;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @UpdateDateColumn()
    updated_at: Date;
}
