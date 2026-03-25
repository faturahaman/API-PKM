import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('videos')
@Index('idx_video_puskesmas_created', ['puskesmas_id', 'upload_date'])
export class Video {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    puskesmas_id: string;

    @ApiProperty({ example: 'Judul Video' })
    @Column()
    video_title: string;

    @ApiPropertyOptional({ example: 'Deskripsi video...' })
    @Column({ nullable: true })
    video_desc: string;

    @ApiProperty({ example: 'https://youtube.com/embed/xxx' })
    @Column()
    embed: string;

    @ApiProperty({ example: false, description: 'Whether video uses embed URL' })
    @Column({ default: false })
    is_embed: boolean;

    @ApiProperty({ example: false })
    @Column({ default: false })
    is_deleted: boolean;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @CreateDateColumn()
    upload_date: Date;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @UpdateDateColumn()
    updated_at: Date;
}
