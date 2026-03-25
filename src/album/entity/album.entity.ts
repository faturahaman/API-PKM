import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gallery } from '../../gallery/entity/gallery.entity';

@Entity('albums')
@Index('idx_album_puskesmas_created', ['puskesmas_id', 'created_at'])
export class Album {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    puskesmas_id: string;

    @ApiProperty({ example: 'Album Foto Kesehatan' })
    @Column()
    album_title: string;

    @ApiPropertyOptional({ example: 'Deskripsi album...' })
    @Column({ nullable: true, type: 'text' })
    description: string;

    @ApiPropertyOptional({ example: '/uploads/album/cover.jpg' })
    @Column({ nullable: true })
    album_cover: string;

    @ApiProperty({ example: 5 })
    @Column({ default: 0 })
    count: number;

    @ApiPropertyOptional({ type: () => [Gallery] })
    @OneToMany(() => Gallery, (gallery) => gallery.album)
    galleries: Gallery[];

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @UpdateDateColumn()
    updated_at: Date;
}
