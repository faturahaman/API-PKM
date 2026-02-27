import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { MenuType } from '../enums/menu-type.enum';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}