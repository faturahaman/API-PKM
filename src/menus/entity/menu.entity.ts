import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column()
  url_target: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Menu | null;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @Column({ nullable: true })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}