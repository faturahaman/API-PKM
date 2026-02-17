import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  url_target: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'CASCADE', nullable: true })
  parent: Menu | null;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}