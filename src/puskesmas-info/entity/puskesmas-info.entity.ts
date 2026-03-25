import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('web_info')
@Index('idx_puskesmas_info_puskesmas', ['puskesmas_id'])
export class PuskesmasInfo {
    @ApiProperty({ example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    puskesmas_id: string;

    @ApiProperty({ example: 'Puskesmas Bogor Tengah' })
    @Column()
    web_title: string;

    @ApiPropertyOptional({ example: '/uploads/logo.png' })
    @Column({ nullable: true })
    logo: string;

    @ApiPropertyOptional({ example: '#3b82f6' })
    @Column({ nullable: true, default: '#3b82f6' })
    theme_color: string;

    @ApiPropertyOptional({ example: 'Jl. Raya Bogor No. 123' })
    @Column({ type: 'text', nullable: true })
    location: string;

    @ApiPropertyOptional({ description: 'Social media links object' })
    @Column({ type: 'json', nullable: true })
    social_links: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        youtube?: string;
        [key: string]: any;
    };

    @ApiPropertyOptional({ example: -6.595038 })
    @Column({ type: 'double', nullable: true })
    lantitude: number;

    @ApiPropertyOptional({ example: 106.816666 })
    @Column({ type: 'double', nullable: true })
    longtitude: number;

    @ApiPropertyOptional({ example: 'info@puskesmastengah.co.id' })
    @Column({ nullable: true })
    email: string;

    @ApiPropertyOptional({ example: '(0251) 123456' })
    @Column({ nullable: true })
    contact: string;

    @ApiPropertyOptional({ example: 'Dr. Ahmad Fauzi, M.Kes' })
    @Column({ nullable: true })
    kepala_puskesmas: string;

    @ApiPropertyOptional({ example: '/uploads/kepala.jpg' })
    @Column({ nullable: true })
    kepala_foto: string;

    @ApiPropertyOptional({ example: '<p>Selamat datang di Puskesmas Bogor Tengah...</p>' })
    @Column({ type: 'text', nullable: true })
    Sambutan_konten: string;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @CreateDateColumn()
    created_at: Date;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @UpdateDateColumn()
    updated_at: Date;
}
