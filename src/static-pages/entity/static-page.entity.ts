import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Menu } from '../../menus/entity/menu.entity';

@Entity('static_pages')
@Index('idx_static_page_puskesmas_created', ['puskesmas_id', 'createdAt'])
export class StaticPage {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @Column({ nullable: true })
    puskesmas_id: string;

    @ApiProperty({ example: 'Tentang Kami' })
    @Column()
    title: string;

    @ApiPropertyOptional({ example: '<p>Konten HTML...</p>' })
    @Column({ type: 'text', nullable: true })
    static_content: string;

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
