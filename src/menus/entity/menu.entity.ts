import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MenuType } from '../enums/menu-type.enum';

@Entity('menus')
@Index('idx_menu_puskesmas_created', ['puskesmas_id', 'createdAt'])
@Index('idx_menu_puskesmas_slug', ['puskesmas_id', 'slug'], { unique: true })
export class Menu {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Column({ nullable: true })
  puskesmas_id: string;

  @ApiProperty({ example: 'Beranda' })
  @Column()
  title: string;

  @ApiProperty({ enum: MenuType, example: 'STATIC' })
  @Column({ type: 'enum', enum: MenuType, default: MenuType.STATIC })
  type: MenuType;

  @ApiProperty({ example: 1, description: '1 = aktif, 0 = nonaktif' })
  @Column({ type: 'int', default: 1 })
  status: number;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int', default: 0 })
  order: number;

  @ApiPropertyOptional({ type: () => Menu })
  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Menu | null;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Column({ nullable: true })
  parent_id: string;

  @ApiPropertyOptional({ type: () => [Menu] })
  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @ApiProperty({ example: 'beranda' })
  @Column()
  slug: string;

  @ApiProperty({ example: '2026-03-24T21:19:36Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-03-24T21:19:36Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
