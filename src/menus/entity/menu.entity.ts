import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';
import { MenuType } from '../enums/menu-type.enum';

@Entity('menus')
@Index('idx_menu_puskesmas_created', ['puskesmas_id', 'createdAt'])
@Index('idx_menu_puskesmas_slug', ['puskesmas_id', 'slug'], { unique: true })
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Tenant isolation
  @Column({ nullable: true })
  puskesmas_id: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: MenuType, default: MenuType.STATIC })
  type: MenuType;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Menu | null;

  @Column({ nullable: true })
  parent_id: string;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @Column()
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
