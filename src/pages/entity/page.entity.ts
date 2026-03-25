import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Menu } from '../../menus/entity/menu.entity';

@Entity('pages')
@Index('idx_pages_puskesmas_created', ['puskesmas_id', 'createdAt'])
export class Page {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    user_id: string;

    // Tenant isolation - required for multi-tenancy
    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    puskesmas_id: string;

    @ApiProperty({ example: 'Layanan Publik' })
    @Column()
    title: string;

    @ApiPropertyOptional({ example: '<p>Konten halaman...</p>' })
    @Column({ type: 'text', nullable: true })
    dynamic_content: string;

    @ApiPropertyOptional({ example: '/uploads/pages/image.jpg' })
    @Column({ nullable: true })
    image: string;

    @ApiPropertyOptional({ example: '/uploads/pages/file.pdf' })
    @Column({ nullable: true })
    file: string;

    @ApiProperty({ enum: ['pdf', 'halaman', 'kartu'], example: 'halaman' })
    @Column({ type: 'enum', enum: ['pdf', 'halaman', 'kartu'], default: 'halaman' })
    type: 'pdf' | 'halaman' | 'kartu';

    @ApiProperty({ example: 1, description: '1 = aktif, 0 = nonaktif' })
    @Column({ type: 'int', default: 1 })
    status: number;

    @ApiPropertyOptional({ type: () => Menu })
    @ManyToOne(() => Menu, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'menu_id' })
    menu: Menu | null;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ example: '2026-03-24T21:19:36Z' })
    @UpdateDateColumn()
    updatedAt: Date;
}
