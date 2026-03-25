import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Album } from '../../album/entity/album.entity';

@Entity('gallery')
@Index('idx_gallery_puskesmas_created', ['puskesmas_id', 'upload_date'])
export class Gallery {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    puskesmas_id: string;

    @ApiProperty({ example: 'Judul Foto' })
    @Column()
    image_title: string;

    @ApiProperty({ example: '/uploads/gallery/photo.jpg' })
    @Column()
    image: string;

    @ApiPropertyOptional({ example: 'Deskripsi foto...' })
    @Column({ nullable: true })
    description: string;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    album_id: string;

    @ApiPropertyOptional({ type: () => Album })
    @ManyToOne(() => Album, (album) => album.galleries, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'album_id' })
    album: Album;

    @ApiProperty({ example: false })
    @Column({ default: false })
    is_deleted: boolean;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @CreateDateColumn()
    upload_date: Date;
}
